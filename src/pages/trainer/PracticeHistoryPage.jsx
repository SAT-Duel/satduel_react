import React, {useCallback, useEffect, useState} from 'react';
import {CheckCircle2, ChevronDown, ChevronUp, History, XCircle} from 'lucide-react';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import {Alert, Button, Card, PageContainer, Spinner} from '../../components/ui';

const SUBJECT_OPTIONS = [
    ['all', 'All subjects'],
    ['english', 'English'],
    ['math', 'Math'],
];

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

function AnswerHistoryItem({attempt}) {
    const [open, setOpen] = useState(false);
    const question = attempt.question;
    const Icon = attempt.correct ? CheckCircle2 : XCircle;
    const tone = attempt.correct
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-rose-200 bg-rose-50 text-rose-700';

    return (
        <Card className="overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
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
    const [subject, setSubject] = useState('all');
    const [attempts, setAttempts] = useState([]);
    const [nextOffset, setNextOffset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const loadHistory = useCallback(async (offset = 0) => {
        const loadingInitial = offset === 0;
        loadingInitial ? setLoading(true) : setLoadingMore(true);
        setError(null);
        try {
            const response = await api.get('api/practice/history/', {
                params: {subject, offset, limit: 20},
            });
            setAttempts((current) => loadingInitial
                ? response.data.attempts
                : [...current, ...response.data.attempts]);
            setNextOffset(response.data.next_offset);
        } catch {
            setError('Could not load your practice history.');
        } finally {
            loadingInitial ? setLoading(false) : setLoadingMore(false);
        }
    }, [subject]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer className="max-w-4xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="m-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                            <History className="size-4"/> Review your work
                        </p>
                        <h1 className="m-0 mt-1 font-display text-3xl font-bold text-slate-900">Practice history</h1>
                        <p className="m-0 mt-2 text-slate-600">See what you chose, the correct answer, and the explanation.</p>
                    </div>
                    <Button to="/infinite_questions" size="sm">Practice now</Button>
                </div>

                <div className="mt-6 flex gap-2 border-b border-slate-200">
                    {SUBJECT_OPTIONS.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setSubject(value)}
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
                        {attempts.map((attempt) => <AnswerHistoryItem key={attempt.id} attempt={attempt}/>) }
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
                        <h2 className="m-0 mt-4 text-xl font-bold text-slate-900">No practice answers yet</h2>
                        <p className="m-0 mt-2 text-slate-600">
                            {subject === 'all'
                                ? 'Answer a practice question to start your review history.'
                                : `No ${subject === 'math' ? 'Math' : 'English'} answers yet.`}
                        </p>
                        <Button to={`/infinite_questions${subject === 'math' ? '?subject=math' : ''}`} className="mt-6">
                            Start practicing
                        </Button>
                    </Card>
                )}
            </PageContainer>
        </div>
    );
}

export default withAuth(PracticeHistoryPage);
