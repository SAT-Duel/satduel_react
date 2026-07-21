import React, {useEffect, useState} from 'react';
import {ArrowRight, ChevronRight, Info, Minus, TrendingDown, TrendingUp} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import api from '../../components/api';
import {useAuth} from '../../context/AuthContext';
import {Alert, Button, Card, PageContainer} from '../../components/ui';

const TESTS = [
    {
        id: 1,
        title: 'SAT Diagnostic Test',
        description: '10 questions in 25 minutes. Get a starting score to measure against.',
        time: '25 minutes',
        questions: 10,
        difficulty: 'Adaptive',
        recommended: true,
        link: '/full_length_test/',
        tag: 'Recommended',
        comingSoon: false,
        time_seconds: 25 * 60,
    },
    {
        id: 2,
        title: 'Practice Test #1',
        description: 'March 2024 SAT Official Practice Test.',
        time: '3 hours',
        questions: 98,
        difficulty: 'Official SAT Level',
        link: '/full_length_test/1',
        tag: 'Soon',
        comingSoon: true,
        time_seconds: 3 * 60 * 60,
    },
];

function TestCard({test, onStart}) {
    return (
        <Card className={`sat-arena-card relative flex h-full flex-col overflow-hidden ${test.recommended ? 'border-primary-300' : ''}`}>
            <div className={test.recommended ? 'sat-score-strip h-1 border-0' : 'h-1 bg-slate-100'}/>
            {test.tag && (
                <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                    test.recommended ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                    {test.tag}
                </span>
            )}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="m-0 pr-20 font-display text-2xl font-black text-slate-950">{test.title}</h3>
                <p className="m-0 mt-3 text-sm leading-relaxed text-slate-500">{test.description}</p>

                <div className="mt-5 grid gap-2">
                    {[
                        ['Duration', test.time],
                        ['Questions', test.questions],
                        ['Difficulty', test.difficulty],
                    ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                            <span className="font-black text-slate-500">{label}</span>
                            <span className="font-bold text-slate-900">{value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6">
                    <Button
                        block
                        variant={test.recommended ? 'primary' : 'secondary'}
                        disabled={test.comingSoon}
                        onClick={() => onStart(test)}
                    >
                        {test.comingSoon ? 'Coming soon' : 'Start test'} {!test.comingSoon && <ArrowRight className="size-4"/>}
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
                    {' · '}{result.correct}/{result.total} correct
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
    if (!history || !history.tests_taken) return null;
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
    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (!user) return;
        api.get('api/practice_test/history/')
            .then((response) => setHistory(response.data))
            .catch((error) => console.error('Error loading test history:', error));
    }, [user]);

    useEffect(() => {
        setShowFirstRunBanner(
            !user ||
            location.state?.isNewUser ||
            user?.is_first_login
        );
    }, [location, user]);

    const closeFirstRunBanner = () => {
        setShowFirstRunBanner(false);
        // Server-side the flag is derived from last_login, which login already
        // bumped — dismissing it locally is all that's left to do.
        if (user?.is_first_login) setFirstLogin();
    };

    const startTest = (test) => {
        navigate(test.link, {
            state: {
                testId: test.id,
                testName: test.title,
                initialSeconds: test.time_seconds,
            },
        });
    };

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)]">
            <PageContainer className="py-8 sm:py-12">
                <h1 className="mb-6 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                    Practice Tests
                </h1>
                {showFirstRunBanner && (
                    <div className="mb-6">
                        <Alert type="success">
                            New here? The 25-minute diagnostic gives you a starting score.
                            <button
                                type="button"
                                onClick={closeFirstRunBanner}
                                className="ml-3 cursor-pointer border-0 bg-transparent font-black text-emerald-800 underline"
                            >
                                Got it
                            </button>
                        </Alert>
                    </div>
                )}

                <section>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {TESTS.map((test) => (
                            <TestCard key={test.id} test={test} onStart={startTest}/>
                        ))}
                    </div>
                </section>

                <TestHistory
                    history={history}
                    onOpen={(result) => navigate('/test_result', {state: {savedResult: result}})}
                />

                <Card className="sat-arena-card mt-12 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                            <Info className="size-5"/>
                        </div>
                        <div>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Before you begin</h2>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {[
                                    ['No pausing', 'The timer runs like the real test — set aside the full time before you start.'],
                                    ["Guess, don't skip", "There's no penalty for wrong answers, so answer everything."],
                                    ["Read your misses", "After scoring, open the explanations for what you got wrong — that's where the points are."],
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
