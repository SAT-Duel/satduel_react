import React, {useEffect, useState} from 'react';
import {ArrowRight, ChevronRight, Clock3, Info, Minus, PlayCircle, TrendingDown, TrendingUp, Users} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import api from '../../components/api';
import {useAuth} from '../../context/AuthContext';
import {Alert, Button, Card, PageContainer, Spinner} from '../../components/ui';

function TestCard({test, onStart}) {
    const resume = test.status === 'in_progress';
    const retake = test.status === 'completed';
    return (
        <Card className={`sat-arena-card relative flex h-full flex-col overflow-hidden ${resume ? 'border-amber-300' : 'border-primary-300'}`}>
            <div className={resume ? 'h-1 bg-amber-400' : 'sat-score-strip h-1 border-0'}/>
            <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                resume ? 'bg-amber-50 text-amber-700' : retake ? 'bg-slate-100 text-slate-600' : 'bg-primary-600 text-white'
            }`}>
                {resume ? 'In progress' : retake ? 'Completed' : 'Full test'}
            </span>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="m-0 pr-24 font-display text-2xl font-black text-slate-950">{test.name}</h3>
                <p className="m-0 mt-3 text-sm leading-relaxed text-slate-500">
                    A complete four-module digital SAT simulation with adaptive Reading & Writing and Math routes.
                </p>
                <div className="mt-5 grid gap-2">
                    {[
                        ['Duration', '2 hr 14 min'],
                        ['Questions', test.question_count],
                        ['Difficulty', 'Adaptive'],
                    ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                            <span className="font-black text-slate-500">{label}</span>
                            <span className="font-bold text-slate-900">{value}</span>
                        </div>
                    ))}
                </div>
                <p className="m-0 mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Users className="size-4"/> {test.completion_count} {test.completion_count === 1 ? 'student has' : 'students have'} completed this test
                </p>
                <div className="mt-auto pt-6">
                    <Button block variant={resume ? 'secondary' : 'primary'} onClick={() => onStart(test)}>
                        {resume ? <PlayCircle className="size-4"/> : null}
                        {resume ? 'Resume test' : retake ? 'Take again' : 'Start test'}
                        {!resume && <ArrowRight className="size-4"/>}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function HistoryRow({result, previousScore, onOpen}) {
    const delta = previousScore == null ? null : result.score - previousScore;
    const takenAt = new Date(result.created_at);
    return (
        <button
            type="button"
            onClick={onOpen}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-primary-300 hover:bg-slate-50"
        >
            <div className="min-w-0">
                <p className="m-0 truncate font-black text-slate-900">{result.test_name}</p>
                <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">
                    {takenAt.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    {' · '}{result.correct}/{result.total} scored questions correct
                </p>
                <p className="m-0 mt-1 text-xs font-black text-slate-500">
                    Reading & Writing {result.reading_writing_score} · Math {result.math_score}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                {delta != null && (
                    <span className={`flex items-center gap-1 text-xs font-black ${
                        delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-slate-400'
                    }`}>
                        {delta > 0 ? <TrendingUp className="size-4"/> : delta < 0 ? <TrendingDown className="size-4"/> : <Minus className="size-4"/>}
                        {delta > 0 ? `+${delta}` : delta}
                    </span>
                )}
                <span className="font-display text-2xl font-black text-slate-950">{result.score}</span>
                <ChevronRight className="size-5 text-slate-300"/>
            </div>
        </button>
    );
}

function TestHistory({history, onOpen}) {
    if (!history?.tests_taken) return null;
    return (
        <section className="mt-12">
            <h2 className="mb-4 font-display text-2xl font-black text-slate-950">Your progress</h2>
            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                    ['Tests taken', history.tests_taken, 'text-slate-950'],
                    ['Best score', history.best_score, 'text-primary-600'],
                    ['Average', history.average_score, 'text-slate-950'],
                    ['Latest', history.latest_score, 'text-slate-950'],
                ].map(([label, value, color]) => (
                    <Card key={label} className="sat-arena-card p-4 text-center">
                        <p className={`m-0 font-display text-3xl font-black ${color}`}>{value}</p>
                        <p className="m-0 mt-1 text-xs font-black uppercase text-slate-400">{label}</p>
                    </Card>
                ))}
            </div>
            <div className="space-y-2">
                {history.results.map((result, index) => (
                    <HistoryRow
                        key={result.id}
                        result={result}
                        previousScore={history.results[index + 1]?.score ?? null}
                        onOpen={() => onOpen(result)}
                    />
                ))}
            </div>
        </section>
    );
}

function PracticeTestPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, setFirstLogin} = useAuth();
    const [showFirstRunBanner, setShowFirstRunBanner] = useState(false);
    const [tests, setTests] = useState([]);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        api.get('/api/practice-tests/')
            .then((response) => {
                setTests(response.data.tests || []);
                setHistory(response.data.history || null);
            })
            .catch((error) => console.error('Error loading practice tests:', error))
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        setShowFirstRunBanner(!user || location.state?.isNewUser || user?.is_first_login);
    }, [location, user]);

    const closeFirstRunBanner = () => {
        setShowFirstRunBanner(false);
        if (user?.is_first_login) setFirstLogin();
    };

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)]">
            <PageContainer className="py-8 sm:py-12">
                <h1 className="mb-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">Practice Tests</h1>
                <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-500">
                    Take a complete adaptive SAT, save between sessions, and receive a difficulty-adjusted 400–1600 score.
                </p>
                {showFirstRunBanner && (
                    <div className="mb-6">
                        <Alert type="success">
                            Ready for a baseline? Choose any full practice test below. Your unfinished work can be saved.
                            <button type="button" onClick={closeFirstRunBanner} className="ml-3 cursor-pointer border-0 bg-transparent font-black text-emerald-800 underline">Got it</button>
                        </Alert>
                    </div>
                )}

                {loading ? (
                    <Card className="flex items-center justify-center gap-3 p-10 text-sm font-bold text-slate-500"><Spinner/> Loading available tests…</Card>
                ) : tests.length ? (
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tests.map((test) => <TestCard key={test.id} test={test} onStart={() => navigate(`/full_length_test/${test.id}`)}/>) }
                    </section>
                ) : (
                    <Card className="p-10 text-center">
                        <Clock3 className="mx-auto size-8 text-primary-500"/>
                        <p className="m-0 mt-3 font-black text-slate-900">The next practice test is being assembled.</p>
                        <p className="m-0 mt-1 text-sm text-slate-500">Check back soon—your test history will remain here.</p>
                    </Card>
                )}

                <TestHistory history={history} onOpen={(result) => navigate(`/practice_test/result/${result.id}`)}/>

                <Card className="sat-arena-card mt-12 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><Info className="size-5"/></div>
                        <div>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Before you begin</h2>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {[
                                    ['Saving is allowed', 'Exit between questions and return with the same answers, position, and time remaining.'],
                                    ["Guess, don't skip", "There's no penalty for wrong answers, so answer everything."],
                                    ['Your route adapts', 'Performance in each first module determines whether your second module is easier or harder.'],
                                ].map(([title, copy]) => (
                                    <div key={title} className="rounded-2xl bg-slate-50 p-4">
                                        <p className="m-0 font-black text-slate-900">{title}</p>
                                        <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{copy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </PageContainer>
        </div>
    );
}

export default PracticeTestPage;
