import React, {useEffect, useRef, useState} from 'react';
import {Bookmark, Calculator, CheckCircle2, Flag, Highlighter, Pause, Play, RotateCcw, Timer, XCircle} from 'lucide-react';
import {Button, ModalShell, Spinner, Textarea} from '../ui';
import RenderWithMath from '../RenderWithMath';
import api from '../api';
import {useDesmos} from '../DesmosCalculator';
import {useAuth} from '../../context/AuthContext';
import {notify} from '../../utils/notify';
import '../../styles/landing.css';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const MONO = 'sd-mono font-bold';
const REPORT_REASONS = [
    ['incorrect_statement', 'Incorrect problem statement'],
    ['no_correct_choice', 'No correct answer choice'],
    ['incorrect_answer', 'Incorrect marked answer'],
    ['bad_explanation', 'Bad or unclear explanation'],
    ['other', 'Other issue'],
];

function normalizeStatus(status) {
    const value = String(status || 'Blank').toLowerCase();
    if (value === 'correct') return 'correct';
    if (value === 'incorrect') return 'incorrect';
    return 'blank';
}

function getChoices(question) {
    if (question?.choices?.length) return question.choices;
    return [question?.choice_a, question?.choice_b, question?.choice_c, question?.choice_d].filter(Boolean);
}

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Memoized so timer ticks and choice selection never re-render the prompt —
// user-added <mark> highlights live in this DOM and must survive re-renders.
const Prompt = React.memo(function Prompt({text}) {
    return <RenderWithMath text={text}/>;
});

function PracticeQuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedChoice,
    onSelectChoice,
    onSubmit,
    status = 'Blank',
    disabled = false,
    checking = false,
    submitOnSelect = false,
    submitLabel = 'Submit',
    correctAnswer,
    correctChoiceLabel,
    explanation,
    primaryAction,
    primaryActionLabel,
    timerSeconds = null,
    timerRunning = false,
    onTimerToggle,
    onTimerReset,
    allowReporting = true,
    allowSaving = false,
    className = '',
}) {
    const {user} = useAuth();
    const normalizedStatus = normalizeStatus(status);
    const answered = normalizedStatus !== 'blank';
    const choices = getChoices(question);
    const [highlightOn, setHighlightOn] = useState(false);
    const [eliminatorOn, setEliminatorOn] = useState(false);
    const [eliminated, setEliminated] = useState(() => new Set());
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [reportError, setReportError] = useState('');
    const [reporting, setReporting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savingPending, setSavingPending] = useState(false);
    const promptRef = useRef(null);
    const desmos = useDesmos();
    const isMath = question?.subject === 'math';
    const canSave = allowSaving && user && question?.id;

    useEffect(() => {
        setHighlightOn(false);
        setEliminated(new Set());
        setReportOpen(false);
        setReportReason('');
        setReportDetails('');
        setReportError('');
    }, [question?.id]);

    // The button reflects what the backend actually has, so a question saved
    // earlier still reads as saved when it comes back around (or after reload).
    useEffect(() => {
        if (!canSave) return undefined;
        let cancelled = false;
        setSaved(false);
        api.get('/api/practice/saved/status/', {params: {question_id: question.id}})
            .then((response) => {
                if (!cancelled) setSaved(Boolean(response.data.saved));
            })
            .catch(() => {
                // Unknown saved state reads as unsaved; the toggle still works.
            });
        return () => {
            cancelled = true;
        };
    }, [canSave, question?.id]);

    const toggleSaved = async () => {
        if (!canSave || savingPending) return;
        const next = !saved;
        setSavingPending(true);
        setSaved(next);  // optimistic: the chip should answer the click instantly
        try {
            if (next) {
                await api.post('/api/practice/saved/', {question_id: question.id});
            } else {
                await api.delete(`/api/practice/saved/${question.id}/`);
            }
        } catch {
            setSaved(!next);
            notify.error(next ? 'Could not save this question.' : 'Could not remove this question.');
        } finally {
            setSavingPending(false);
        }
    };

    const applyHighlight = () => {
        if (!highlightOn || answered) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !promptRef.current) return;
        const range = selection.getRangeAt(0);
        if (!promptRef.current.contains(range.commonAncestorContainer)) return;
        const mark = document.createElement('mark');
        mark.style.background = 'rgba(233,188,79,0.45)';
        mark.style.borderRadius = '3px';
        try {
            range.surroundContents(mark);
        } catch {
            // ponytail: selections crossing element boundaries (KaTeX, bold spans)
            // are skipped; plain-text highlighting covers the real use case.
        }
        selection.removeAllRanges();
    };

    const questionTypeLabel = question?.question_type?.toUpperCase() || 'QUESTION';

    const choose = (choice, index) => {
        if (answered || disabled || checking || eliminated.has(index)) return;
        onSelectChoice?.(choice);
        if (submitOnSelect) {
            onSubmit?.(choice);
        }
    };

    // Crossing out the selected choice also clears it: ruling an answer out
    // shouldn't leave it submittable.
    const toggleEliminated = (choice, index) => {
        if (answered || disabled || checking) return;
        const crossingOut = !eliminated.has(index);
        setEliminated((current) => {
            const next = new Set(current);
            if (crossingOut) next.add(index);
            else next.delete(index);
            return next;
        });
        if (crossingOut && selectedChoice === choice) {
            onSelectChoice?.(null);
        }
    };

    const submit = () => {
        if (!selectedChoice || answered || disabled || checking) return;
        onSubmit?.(selectedChoice);
    };

    const submitReport = async () => {
        const details = reportDetails.trim();
        if (!reportReason) {
            setReportError('Choose the issue that best matches.');
            return;
        }
        if (details.length < 20) {
            setReportError('Please provide at least 20 characters of detail.');
            return;
        }

        setReporting(true);
        setReportError('');
        try {
            await api.post('/api/question_reports/', {
                question_id: question.id,
                reason: reportReason,
                details,
            });
            setReportOpen(false);
            setReportReason('');
            setReportDetails('');
            notify.success('Thanks — the question was reported for review.');
        } catch (error) {
            setReportError(error.response?.data?.error || 'Could not submit the report. Please try again.');
        } finally {
            setReporting(false);
        }
    };

    const closeReport = () => {
        setReportOpen(false);
        setReportError('');
    };

    const canReport = answered && allowReporting && user && question?.id;

    return (
        <div className={className}>
            <div className="overflow-hidden rounded-[18px] border border-[#E4E1D6] bg-[#F7F5EF] shadow-[0_18px_44px_rgba(15,23,42,0.18)]">
                <div className="bg-[#131B2C] px-4 py-2.5 sm:px-[22px]">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <span className={`${MONO} min-w-0 flex-1 break-words text-[11px] tracking-[0.08em] text-[#C0B0FA]`} title={question?.question_type || 'Question'}>
                            {questionTypeLabel}
                        </span>
                        <div className={`${MONO} flex shrink-0 items-center gap-2 text-[10px] tracking-[0.08em] text-[#7C8AA5]`}>
                            {totalQuestions && <span>Q {questionNumber || 1}/{totalQuestions}</span>}
                            {question?.difficulty && (
                                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[#AAB4C8]">
                                    LEVEL {question.difficulty}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 border-b border-[#D6DAE3] bg-[#E9ECF2] px-4 py-2 sm:px-[22px]">
                    {canSave && (
                            <button
                                type="button"
                                onClick={toggleSaved}
                                title={saved ? 'Remove from your saved questions' : 'Mark this question for review'}
                                aria-label={saved ? 'Remove from saved questions' : 'Mark question for review'}
                                aria-pressed={saved}
                                className={`${MONO} inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 text-[10.5px] transition-colors ${
                                    saved
                                        ? 'border-orange-300 bg-orange-50 text-orange-600'
                                        : 'border-[#C7CDD8] bg-white/70 text-[#536077] hover:border-[#AEB6C5] hover:bg-white hover:text-[#263247]'
                                }`}
                            >
                                <Bookmark className={`size-3.5 ${saved ? 'fill-current' : ''}`}/>
                                <span className="hidden sm:inline">{saved ? 'SAVED' : 'MARK'}</span>
                            </button>
                    )}
                    <button
                            type="button"
                            onClick={() => setHighlightOn((on) => !on)}
                            title="Highlight: select text in the question to mark it"
                            aria-label={`${highlightOn ? 'Disable' : 'Enable'} question highlighting`}
                            aria-pressed={highlightOn}
                            className={`${MONO} inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 text-[10.5px] transition-colors ${
                                highlightOn
                                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                                    : 'border-[#C7CDD8] bg-white/70 text-[#536077] hover:border-[#AEB6C5] hover:bg-white hover:text-[#263247]'
                            }`}
                        >
                            <Highlighter className="size-3.5"/>
                            <span className="hidden sm:inline">HIGHLIGHT</span>
                    </button>
                    <button
                            type="button"
                            onClick={() => setEliminatorOn((on) => !on)}
                            disabled={answered}
                            title="Cross out answer choices you think are wrong"
                            aria-label={`${eliminatorOn ? 'Hide' : 'Show'} answer eliminator`}
                            aria-pressed={eliminatorOn}
                            className={`${MONO} inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 text-[10.5px] transition-colors disabled:cursor-default disabled:opacity-45 ${
                                eliminatorOn
                                    ? 'border-[#A99AF5] bg-[#EEEAFE] text-[#6345D8]'
                                    : 'border-[#C7CDD8] bg-white/70 text-[#536077] hover:border-[#AEB6C5] hover:bg-white hover:text-[#263247]'
                            }`}
                        >
                            <span className="relative text-[9px] font-black leading-none">
                                ABC<span className="absolute left-0 top-1/2 h-px w-full -rotate-12 bg-current"/>
                            </span>
                            <span className="hidden sm:inline">ELIMINATE</span>
                    </button>
                    {isMath && (
                            <button
                                type="button"
                                onClick={desmos.open}
                                title="Open the Desmos graphing calculator"
                                aria-label="Open Desmos graphing calculator"
                                className={`${MONO} inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 text-[10.5px] transition-colors ${
                                    desmos.isOpen
                                        ? 'border-[#A99AF5] bg-[#EEEAFE] text-[#6345D8]'
                                        : 'border-[#C7CDD8] bg-white/70 text-[#536077] hover:border-[#AEB6C5] hover:bg-white hover:text-[#263247]'
                                }`}
                            >
                                <Calculator className="size-3.5"/>
                                <span className="hidden sm:inline">DESMOS</span>
                            </button>
                    )}
                    {timerSeconds != null && (
                            <div className="flex items-center gap-1 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={onTimerToggle}
                                    title={timerRunning ? 'Pause timer' : timerSeconds ? 'Resume timer' : 'Start timer'}
                                    className={`${MONO} inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-[9px] text-[11px] text-amber-700 transition-colors hover:bg-amber-100`}
                                >
                                    {timerSeconds === 0 && !timerRunning ? (
                                        <><Timer className="size-3.5"/> TIMER</>
                                    ) : (
                                        <>{timerRunning ? <Pause className="size-3.5"/> : <Play className="size-3.5"/>} {fmtTime(timerSeconds)}</>
                                    )}
                                </button>
                                {timerSeconds > 0 && (
                                    <button
                                        type="button"
                                        onClick={onTimerReset}
                                        title="Reset timer"
                                        aria-label="Reset timer"
                                        className="grid size-[30px] cursor-pointer place-items-center rounded-md border border-[#C7CDD8] bg-white/70 text-[#536077] transition-colors hover:bg-white hover:text-[#263247]"
                                    >
                                        <RotateCcw className="size-3.5"/>
                                    </button>
                                )}
                            </div>
                    )}
                </div>

                <div className="p-4 sm:p-6">
                    <div
                        key={question?.id}
                        ref={promptRef}
                        onMouseUp={applyHighlight}
                        className={`text-[16px] leading-relaxed text-[#131B2C] ${highlightOn && !answered ? 'cursor-text selection:bg-[rgba(233,188,79,0.45)]' : ''}`}
                    >
                        <Prompt text={question?.question || ''}/>
                    </div>

                    <div className="mt-5 flex flex-col gap-2.5">
                        {choices.map((choice, index) => {
                            const isSelected = selectedChoice === choice;
                            const isCorrectChoice = correctAnswer && choice === correctAnswer;
                            const isEliminated = eliminated.has(index);
                            const label = CHOICE_LABELS[index] || index + 1;
                            let row = 'border-[#E4E1D6] bg-white hover:border-[#7C5CF0]';
                            let bubble = 'border-2 border-[#B9BFCB] text-[#5A6376]';
                            let bubbleContent = label;

                            if (isEliminated && !answered) {
                                row = 'border-[#E4E1D6] bg-white';
                            }

                            if (answered) {
                                if (isCorrectChoice) {
                                    row = 'border-[#2FBF71] bg-[#EAF9F1]';
                                    bubble = 'bg-[#2FBF71] text-white';
                                    bubbleContent = '✓';
                                } else if (isSelected && normalizedStatus === 'incorrect') {
                                    row = 'border-[#E85D5D] bg-[#FDEDED]';
                                    bubble = 'bg-[#E85D5D] text-white';
                                    bubbleContent = '✕';
                                } else {
                                    row = 'border-[#E4E1D6] bg-white opacity-55';
                                }
                            } else if (isSelected) {
                                row = 'border-[#7C5CF0] bg-[#F1EDFE]';
                                bubble = 'bg-[#7C5CF0] text-white';
                            }

                            return (
                                <div key={`${question?.id || 'question'}-${index}`} className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => choose(choice, index)}
                                        disabled={answered || disabled || checking || isEliminated}
                                        aria-label={isEliminated ? `Choice ${label}, crossed out` : undefined}
                                        className={`relative flex min-h-[3.5rem] flex-1 cursor-pointer items-start gap-3 rounded-xl border-2 px-[15px] py-3 text-left transition-colors disabled:cursor-default ${row}`}
                                    >
                                        <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold ${bubble}`}>
                                            {bubbleContent}
                                        </span>
                                        <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[#131B2C]">
                                            <RenderWithMath text={choice}/>
                                        </span>
                                        {isEliminated && !answered && (
                                            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#5A6376]"/>
                                        )}
                                    </button>

                                    {eliminatorOn && !answered && !disabled && (
                                        <button
                                            type="button"
                                            onClick={() => toggleEliminated(choice, index)}
                                            disabled={checking}
                                            title={isEliminated ? `Undo cross out for choice ${label}` : `Cross out choice ${label}`}
                                            aria-label={isEliminated ? `Undo cross out for choice ${label}` : `Cross out choice ${label}`}
                                            aria-pressed={isEliminated}
                                            className="grid size-10 shrink-0 cursor-pointer place-items-center text-[#5A6376] transition-colors hover:text-[#131B2C] disabled:cursor-default sm:w-14"
                                        >
                                            {isEliminated ? (
                                                <span className="text-[13px] font-bold underline underline-offset-2">Undo</span>
                                            ) : (
                                                <span className="relative grid size-6 place-items-center rounded-full border border-current text-[11px] font-bold">
                                                    {label}
                                                    <span className="absolute inset-x-[-4px] top-1/2 h-px -translate-y-1/2 bg-current"/>
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {answered && (
                        <div
                            className={`mt-5 rounded-xl border px-4 py-3 ${
                                normalizedStatus === 'correct'
                                    ? 'border-[#BFE8D2] bg-[#EAF9F1] text-[#1E9A5A]'
                                    : 'border-[#F3C6C6] bg-[#FDF4F4] text-[#C24040]'
                            }`}
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                {normalizedStatus === 'correct'
                                    ? <CheckCircle2 className="size-5"/>
                                    : <XCircle className="size-5"/>}
                                {normalizedStatus === 'correct'
                                    ? 'Correct!'
                                    : correctChoiceLabel
                                        ? `Not quite. ${correctChoiceLabel} is the correct answer.`
                                        : 'Not quite. Your answer was saved.'}
                            </div>
                        </div>
                    )}

                    {answered && explanation && (
                        <div className="mt-3 rounded-xl border border-[#E4E1D6] bg-white px-4 py-3.5">
                            <div className={`${MONO} mb-2 text-[10.5px] tracking-[0.1em] text-[#7C5CF0]`}>
                                EXPLANATION
                            </div>
                            <div className="text-[15px] leading-relaxed text-[#333B4E]">
                                <RenderWithMath text={explanation}/>
                            </div>
                        </div>
                    )}

                    {((!answered && !submitOnSelect && !disabled) || (answered && (primaryAction || canReport))) && (
                        <div className={`mt-5 flex items-center gap-3 ${canReport ? 'justify-between' : 'justify-end'}`}>
                            {canReport && (
                                <button
                                    type="button"
                                    onClick={() => setReportOpen(true)}
                                    className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[#8A90A0] transition-colors hover:text-[#5A6376]"
                                >
                                    <Flag className="size-3"/> Report issue
                                </button>
                            )}
                            {!answered && !submitOnSelect && !disabled && (
                                <Button onClick={submit} disabled={!selectedChoice || checking}>
                                    {checking && <Spinner className="size-4 border-2"/>}
                                    {submitLabel}
                                </Button>
                            )}
                            {answered && primaryAction && (
                                <Button onClick={primaryAction}>
                                    {primaryActionLabel}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ModalShell
                open={reportOpen}
                title="Report this question"
                onClose={closeReport}
                footer={(
                    <>
                        <Button variant="secondary" onClick={closeReport}>Cancel</Button>
                        <Button loading={reporting} onClick={submitReport}>Submit report</Button>
                    </>
                )}
            >
                <p className="mb-4 text-sm leading-6 text-slate-500">
                    Tell us what looks wrong. An admin will review the question and its explanation.
                </p>
                <div className="grid gap-2" role="radiogroup" aria-label="Report reason">
                    {REPORT_REASONS.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={reportReason === value}
                            onClick={() => {
                                setReportReason(value);
                                setReportError('');
                            }}
                            className={`cursor-pointer rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                                reportReason === value
                                    ? 'border-primary-400 bg-primary-50 text-primary-800'
                                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <label className="mt-5 block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">What should we know?</span>
                    <Textarea
                        value={reportDetails}
                        onChange={(event) => {
                            setReportDetails(event.target.value);
                            setReportError('');
                        }}
                        minLength={20}
                        maxLength={2000}
                        rows={5}
                        placeholder="Describe the issue with enough detail for us to verify it."
                    />
                    <span className={`mt-1 block text-right text-xs ${reportDetails.trim().length < 20 ? 'text-slate-400' : 'text-emerald-600'}`}>
                        {reportDetails.trim().length}/20 minimum
                    </span>
                </label>
                {reportError && (
                    <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                        {reportError}
                    </p>
                )}
            </ModalShell>
        </div>
    );
}

export default PracticeQuestionCard;
