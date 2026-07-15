import React, {useCallback, useEffect, useState} from 'react';
import {CheckCircle2, ChevronDown, ChevronUp, History, Play, RotateCcw, XCircle} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import MistakePracticeModal from '../../components/practice/MistakePracticeModal';
import {Alert, Button, Card, PageContainer, Select, Spinner} from '../../components/ui';

const SUBJECT_OPTIONS = [
    ['all', 'All subjects'],
    ['english', 'English'],
    ['math', 'Math'],
];

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

function AnswerHistoryItem({attempt, onPractice}) {
    const [open, setOpen] = useState(false);
    const question = attempt.question;
    const Icon = attempt.correct ? CheckCircle2 : XCircle;
    const tone = attempt.correct
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-rose-200 bg-rose-50 text-rose-700';

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${tone}`}>
                            <Icon className="size-3.5"/>
                            {attempt.correct ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {attempt.subject === 'math' ? 'Math' : 'English'} · {question.question_type || 'Practice'}
                        </span>
                    </div>
                    <p className="m-0 mt-2 text-sm font-semibold text-slate-700">
                        {dateFormatter.format(new Date(attempt.created_at))}
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    {!attempt.correct && (
                        <Button type="button" size="sm" variant="secondary" onClick={() => onPractice(attempt)}>
                            <RotateCcw className="size-4"/> Practice again
                        </Button>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                    >
                        {open ? <>Hide <ChevronUp className="size-4"/></> : <>Review <ChevronDown className="size-4"/></>}
                    </Button>
                </div>
            </div>

            {open && (
                <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                    <div className="text-[16px] leading-relaxed text-slate-900">
                        <RenderWithMath text={question.question}/>
                    </div>
                    <div className="mt-5 space-y-2.5">
                        {question.choices.map((choice, index) => {
                            const selected = attempt.selected_choice === choice;
                            const correct = question.correct_answer === choice;
                            const classes = correct
                                ? 'border-emerald-300 bg-emerald-50'
                                : selected
                                    ? 'border-rose-300 bg-rose-50'
                                    : 'border-slate-200 bg-white';
                            return (
                                <div key={`${attempt.id}-${index}`} className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${classes}`}>
                                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-black text-slate-600">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800">
                                        <RenderWithMath text={choice}/>
                                    </div>
                                    {correct && <span className="text-xs font-bold text-emerald-700">Correct</span>}
                                    {selected && !correct && <span className="text-xs font-bold text-rose-700">Your answer</span>}
                                </div>
                            );
                        })}
                    </div>
                    {!attempt.selected_choice && (
                        <p className="m-0 mt-4 text-sm text-slate-500">
                            Your selected answer was not saved for this older attempt.
                        </p>
                    )}
                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="m-0 text-xs font-black tracking-[0.1em] text-primary-600">EXPLANATION</p>
                        <div className="mt-2 text-[15px] leading-relaxed text-slate-700">
                            {question.explanation
                                ? <RenderWithMath text={question.explanation}/>
                                : 'No explanation has been added for this question yet.'}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

function PracticeHistoryPage() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('all');
    const [questionType, setQuestionType] = useState('all');
    const [incorrectOnly, setIncorrectOnly] = useState(false);
    const [questionTypes, setQuestionTypes] = useState([]);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [attempts, setAttempts] = useState([]);
    const [nextOffset, setNextOffset] = useState(null);
    const [practiceAttempt, setPracticeAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [startingReview, setStartingReview] = useState(false);
    const [error, setError] = useState(null);

    const loadHistory = useCallback(async (offset = 0) => {
        const loadingInitial = offset === 0;
        loadingInitial ? setLoading(true) : setLoadingMore(true);
        setError(null);
        try {
            const response = await api.get('api/practice/history/', {
                params: {
                    subject,
                    question_type: questionType,
                    incorrect_only: incorrectOnly,
                    offset,
                    limit: 20,
                },
            });
            setAttempts((current) => loadingInitial
                ? response.data.attempts
                : [...current, ...response.data.attempts]);
            setQuestionTypes(response.data.question_types || []);
            setMistakeCount(response.data.mistake_count || 0);
            setNextOffset(response.data.next_offset);
        } catch {
            setError('Could not load your practice history.');
        } finally {
            loadingInitial ? setLoading(false) : setLoadingMore(false);
        }
    }, [incorrectOnly, questionType, subject]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const changeSubject = (value) => {
        setSubject(value);
        setQuestionType('all');
    };

    const selectionLabel = questionType !== 'all'
        ? questionType
        : subject === 'math'
            ? 'Math mistakes'
            : subject === 'english'
                ? 'English mistakes'
                : 'All mistakes';

    const startMistakeReview = async () => {
        setStartingReview(true);
        setError(null);
        try {
            const questionsById = new Map();
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
                const response = await api.get('api/practice/history/', {
                    params: {
                        subject,
                        question_type: questionType,
                        incorrect_only: true,
                        offset,
                        limit: 50,
                    },
                });
                response.data.attempts.forEach((attempt) => {
                    if (!questionsById.has(attempt.question.id)) {
                        questionsById.set(attempt.question.id, {
                            ...attempt.question,
                            subject: attempt.subject,
                        });
                    }
                });
                hasMore = response.data.has_more;
                offset = response.data.next_offset;
            }

            const questions = Array.from(questionsById.values());
            if (!questions.length) {
                setError('There are no mistakes to review with these filters.');
                return;
            }
            navigate('/mistake-review', {state: {questions, label: selectionLabel}});
        } catch {
            setError('Could not start your mistake review. Please try again.');
        } finally {
            setStartingReview(false);
        }
    };

    const hasFilters = questionType !== 'all' || incorrectOnly;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer maxWidth="max-w-4xl">
                <div>
                    <p className="m-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                        <History className="size-4"/> Review your work
                    </p>
                    <h1 className="m-0 mt-1 font-display text-3xl font-bold text-slate-900">Practice history</h1>
                    <p className="m-0 mt-2 text-slate-600">Filter past answers, inspect explanations, and retry your mistakes.</p>
                </div>

                <div className="mt-6 flex gap-2 border-b border-slate-200">
                    {SUBJECT_OPTIONS.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => changeSubject(value)}
                            className={`border-b-2 px-3 py-2 text-sm font-bold transition-colors ${
                                subject === value
                                    ? 'border-primary-600 text-primary-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <Card className="mt-5 border-primary-100 !bg-primary-50/40 p-4 sm:p-5">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                            <label>
                                <span className="mb-1.5 block text-sm font-bold text-slate-700">Question type</span>
                                <Select value={questionType} onChange={(event) => setQuestionType(event.target.value)}>
                                    <option value="all">All question types</option>
                                    {questionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                </Select>
                            </label>
                            <label className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={incorrectOnly}
                                    onChange={(event) => setIncorrectOnly(event.target.checked)}
                                    className="size-4 accent-primary-600"
                                />
                                Only show incorrect answers
                            </label>
                        </div>
                        <Button
                            type="button"
                            onClick={startMistakeReview}
                            loading={startingReview}
                            disabled={mistakeCount === 0}
                            className="md:min-h-[46px]"
                        >
                            <Play className="size-4"/>
                            Review {mistakeCount} {mistakeCount === 1 ? 'mistake' : 'mistakes'}
                        </Button>
                    </div>
                    <p className="m-0 mt-3 text-xs font-semibold text-primary-700">
                        Mistake review is private practice. It won&apos;t change your rating, streak, or history.
                    </p>
                </Card>

                {loading ? (
                    <div className="flex justify-center py-16"><Spinner/></div>
                ) : error ? (
                    <div className="mt-5">
                        <Alert>{error}</Alert>
                        <Button variant="secondary" className="mt-4" onClick={() => loadHistory()}>
                            Try again
                        </Button>
                    </div>
                ) : attempts.length ? (
                    <div className="mt-5 space-y-3">
                        {attempts.map((attempt) => (
                            <AnswerHistoryItem key={attempt.id} attempt={attempt} onPractice={setPracticeAttempt}/>
                        ))}
                        {nextOffset != null && (
                            <div className="pt-3 text-center">
                                <Button variant="secondary" onClick={() => loadHistory(nextOffset)} loading={loadingMore}>
                                    Load more
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Card className="mt-5 px-6 py-12 text-center">
                        <History className="mx-auto size-8 text-slate-300"/>
                        <h2 className="m-0 mt-4 text-xl font-bold text-slate-900">
                            {hasFilters ? 'No answers match these filters' : 'No practice answers yet'}
                        </h2>
                        <p className="m-0 mt-2 text-slate-600">
                            {hasFilters
                                ? 'Try another question type or include correct answers.'
                                : subject === 'all'
                                    ? 'Answer a practice question to start your review history.'
                                    : `No ${subject === 'math' ? 'Math' : 'English'} answers yet.`}
                        </p>
                        {hasFilters ? (
                            <Button
                                variant="secondary"
                                className="mt-6"
                                onClick={() => {
                                    setQuestionType('all');
                                    setIncorrectOnly(false);
                                }}
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <Button to={`/infinite_questions${subject === 'math' ? '?subject=math' : ''}`} className="mt-6">
                                Start practicing
                            </Button>
                        )}
                    </Card>
                )}
            </PageContainer>

            <MistakePracticeModal attempt={practiceAttempt} onClose={() => setPracticeAttempt(null)}/>
        </div>
    );
}

export default withAuth(PracticeHistoryPage);
