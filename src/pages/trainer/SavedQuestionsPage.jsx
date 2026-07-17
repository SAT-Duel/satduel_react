import React, {useCallback, useEffect, useState} from 'react';
import {Bookmark, BookmarkX, ChevronDown, ChevronUp, Play} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import {notify} from '../../utils/notify';
import {Alert, Button, Card, PageContainer, Select, Spinner} from '../../components/ui';

const SUBJECT_OPTIONS = [
    ['all', 'All subjects'],
    ['english', 'English'],
    ['math', 'Math'],
];

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

function SavedQuestionItem({entry, onUnsave}) {
    const [open, setOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const question = entry.question;

    const unsave = async () => {
        setRemoving(true);
        try {
            await onUnsave(entry);
        } finally {
            setRemoving(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
                            <Bookmark className="size-3.5 fill-current"/>
                            Saved
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {entry.subject === 'math' ? 'Math' : 'English'} · {question.question_type || 'Practice'}
                        </span>
                    </div>
                    <p className="m-0 mt-2 text-sm font-semibold text-slate-700">
                        {dateFormatter.format(new Date(entry.created_at))}
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={unsave} loading={removing}>
                        <BookmarkX className="size-4"/> Unsave
                    </Button>
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
                            const correct = question.correct_answer === choice;
                            return (
                                <div
                                    key={`${entry.id}-${index}`}
                                    className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${
                                        correct ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-black text-slate-600">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800">
                                        <RenderWithMath text={choice}/>
                                    </div>
                                    {correct && <span className="text-xs font-bold text-emerald-700">Correct</span>}
                                </div>
                            );
                        })}
                    </div>
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

function SavedQuestionsPage() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('all');
    const [questionType, setQuestionType] = useState('all');
    const [questionTypes, setQuestionTypes] = useState([]);
    const [savedCount, setSavedCount] = useState(0);
    const [entries, setEntries] = useState([]);
    const [nextOffset, setNextOffset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [startingReview, setStartingReview] = useState(false);
    const [error, setError] = useState(null);

    const loadSaved = useCallback(async (offset = 0) => {
        const loadingInitial = offset === 0;
        loadingInitial ? setLoading(true) : setLoadingMore(true);
        setError(null);
        try {
            const response = await api.get('api/practice/saved/', {
                params: {
                    subject,
                    question_type: questionType,
                    offset,
                    limit: 20,
                },
            });
            setEntries((current) => loadingInitial
                ? response.data.saved
                : [...current, ...response.data.saved]);
            setQuestionTypes(response.data.question_types || []);
            setSavedCount(response.data.saved_count || 0);
            setNextOffset(response.data.next_offset);
        } catch {
            setError('Could not load your saved questions.');
        } finally {
            loadingInitial ? setLoading(false) : setLoadingMore(false);
        }
    }, [questionType, subject]);

    useEffect(() => {
        loadSaved();
    }, [loadSaved]);

    const changeSubject = (value) => {
        setSubject(value);
        setQuestionType('all');
    };

    const unsave = async (entry) => {
        try {
            await api.delete(`api/practice/saved/${entry.question.id}/`);
            setEntries((current) => current.filter((row) => row.id !== entry.id));
            setSavedCount((count) => Math.max(0, count - 1));
            notify.success('Removed from your saved questions.');
        } catch {
            notify.error('Could not remove this question. Please try again.');
        }
    };

    const selectionLabel = questionType !== 'all'
        ? questionType
        : subject === 'math'
            ? 'Saved math questions'
            : subject === 'english'
                ? 'Saved English questions'
                : 'Saved questions';

    const startSavedReview = async () => {
        setStartingReview(true);
        setError(null);
        try {
            const questionsById = new Map();
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
                const response = await api.get('api/practice/saved/', {
                    params: {
                        subject,
                        question_type: questionType,
                        offset,
                        limit: 50,
                    },
                });
                response.data.saved.forEach((row) => {
                    if (!questionsById.has(row.question.id)) {
                        questionsById.set(row.question.id, {
                            ...row.question,
                            subject: row.subject,
                        });
                    }
                });
                hasMore = response.data.has_more;
                offset = response.data.next_offset;
            }

            const questions = Array.from(questionsById.values());
            if (!questions.length) {
                setError('There are no saved questions to practice with these filters.');
                return;
            }
            navigate('/mistake-review', {
                state: {questions, label: selectionLabel, returnTo: '/saved-questions'},
            });
        } catch {
            setError('Could not start your review. Please try again.');
        } finally {
            setStartingReview(false);
        }
    };

    const hasFilters = questionType !== 'all';

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer maxWidth="max-w-4xl">
                <div>
                    <p className="m-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                        <Bookmark className="size-4"/> Marked for review
                    </p>
                    <h1 className="m-0 mt-1 font-display text-3xl font-bold text-slate-900">Saved questions</h1>
                    <p className="m-0 mt-2 text-slate-600">Every question you marked while practicing, ready to revisit.</p>
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
                        <label>
                            <span className="mb-1.5 block text-sm font-bold text-slate-700">Question type</span>
                            <Select value={questionType} onChange={(event) => setQuestionType(event.target.value)}>
                                <option value="all">All question types</option>
                                {questionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                            </Select>
                        </label>
                        <Button
                            type="button"
                            onClick={startSavedReview}
                            loading={startingReview}
                            disabled={savedCount === 0}
                            className="md:min-h-[46px]"
                        >
                            <Play className="size-4"/>
                            Practice {savedCount} saved
                        </Button>
                    </div>
                    <p className="m-0 mt-3 text-xs font-semibold text-primary-700">
                        Practicing saved questions is private. It won&apos;t change your rating, streak, or history.
                    </p>
                </Card>

                {loading ? (
                    <div className="flex justify-center py-16"><Spinner/></div>
                ) : error ? (
                    <div className="mt-5">
                        <Alert>{error}</Alert>
                        <Button variant="secondary" className="mt-4" onClick={() => loadSaved()}>
                            Try again
                        </Button>
                    </div>
                ) : entries.length ? (
                    <div className="mt-5 space-y-3">
                        {entries.map((entry) => (
                            <SavedQuestionItem key={entry.id} entry={entry} onUnsave={unsave}/>
                        ))}
                        {nextOffset != null && (
                            <div className="pt-3 text-center">
                                <Button variant="secondary" onClick={() => loadSaved(nextOffset)} loading={loadingMore}>
                                    Load more
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Card className="mt-5 px-6 py-12 text-center">
                        <Bookmark className="mx-auto size-8 text-slate-300"/>
                        <h2 className="m-0 mt-4 text-xl font-bold text-slate-900">
                            {hasFilters ? 'No saved questions match these filters' : 'No saved questions yet'}
                        </h2>
                        <p className="m-0 mt-2 text-slate-600">
                            {hasFilters
                                ? 'Try another question type.'
                                : subject === 'all'
                                    ? 'Use the Mark button on a practice question to save it for later.'
                                    : `No saved ${subject === 'math' ? 'Math' : 'English'} questions yet.`}
                        </p>
                        {hasFilters ? (
                            <Button variant="secondary" className="mt-6" onClick={() => setQuestionType('all')}>
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
        </div>
    );
}

export default withAuth(SavedQuestionsPage);
