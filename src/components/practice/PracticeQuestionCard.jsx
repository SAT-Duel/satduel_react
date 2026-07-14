import React, {useEffect, useRef, useState} from 'react';
import {CheckCircle2, Flag, Pause, Play, RotateCcw, Timer, XCircle} from 'lucide-react';
import {Button, ModalShell, Spinner, Textarea} from '../ui';
import RenderWithMath from '../RenderWithMath';
import api from '../api';
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
    className = '',
}) {
    const {user} = useAuth();
    const normalizedStatus = normalizeStatus(status);
    const answered = normalizedStatus !== 'blank';
    const choices = getChoices(question);
    const [highlightOn, setHighlightOn] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [reportError, setReportError] = useState('');
    const [reporting, setReporting] = useState(false);
    const promptRef = useRef(null);

    useEffect(() => {
        setHighlightOn(false);
        setReportOpen(false);
        setReportReason('');
        setReportDetails('');
        setReportError('');
    }, [question?.id]);

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

    const headerLabel = [
        question?.question_type?.toUpperCase(),
        question?.difficulty ? `LEVEL ${question.difficulty}` : null,
    ].filter(Boolean).join(' · ') || 'QUESTION';

    const choose = (choice) => {
        if (answered || disabled || checking) return;
        onSelectChoice?.(choice);
        if (submitOnSelect) {
            onSubmit?.(choice);
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
                <div className="flex flex-wrap items-center justify-between gap-2 bg-[#131B2C] px-4 py-3 sm:px-[22px]">
                    <span className={`${MONO} text-[11px] tracking-[0.08em] text-[#C0B0FA]`}>{headerLabel}</span>
                    <div className="flex items-center gap-2">
                        {totalQuestions && (
                            <span className={`${MONO} text-[11px] text-[#7C8AA5]`}>
                                Q {questionNumber || 1}/{totalQuestions}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setHighlightOn((on) => !on)}
                            title="Highlight: select text in the question to mark it"
                            className={`${MONO} cursor-pointer rounded-md border px-2 py-[3px] text-[10.5px] transition-colors ${
                                highlightOn
                                    ? 'border-[rgba(233,188,79,0.5)] bg-[rgba(233,188,79,0.15)] text-[#E9BC4F]'
                                    : 'border-[rgba(148,163,184,0.35)] bg-transparent text-[#B9C2D8]'
                            }`}
                        >
                            HIGHLIGHT
                        </button>
                        {timerSeconds != null && (
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={onTimerToggle}
                                    title={timerRunning ? 'Pause timer' : timerSeconds ? 'Resume timer' : 'Start timer'}
                                    className={`${MONO} inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[rgba(233,188,79,0.4)] px-[9px] py-[3px] text-[11px] text-[#E9BC4F] transition-colors hover:bg-[rgba(233,188,79,0.12)]`}
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
                                        className="grid size-7 cursor-pointer place-items-center rounded-md border border-[rgba(148,163,184,0.35)] text-[#B9C2D8] transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <RotateCcw className="size-3.5"/>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
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
                            let row = 'border-[#E4E1D6] bg-white hover:border-[#7C5CF0]';
                            let bubble = 'border-2 border-[#B9BFCB] text-[#5A6376]';
                            let bubbleContent = CHOICE_LABELS[index] || index + 1;

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
                                <button
                                    key={`${question?.id || 'question'}-${index}`}
                                    type="button"
                                    onClick={() => choose(choice)}
                                    disabled={answered || disabled || checking}
                                    className={`flex min-h-[3.5rem] w-full cursor-pointer items-start gap-3 rounded-xl border-2 px-[15px] py-3 text-left transition-colors disabled:cursor-default ${row}`}
                                >
                                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold ${bubble}`}>
                                        {bubbleContent}
                                    </span>
                                    <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[#131B2C]">
                                        <RenderWithMath text={choice}/>
                                    </span>
                                </button>
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
