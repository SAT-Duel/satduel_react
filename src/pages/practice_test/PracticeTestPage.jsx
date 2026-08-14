import React, {useEffect, useState} from 'react';
import {ArrowRight, ChevronRight, Clock3, Crown, Info, PlayCircle, Users} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import api from '../../components/api';
import {useAuth} from '../../context/AuthContext';
import {Alert, Button, Card, PageContainer, Spinner} from '../../components/ui';

const testTypeMeta = {
    full: {
        label: 'Full SAT',
        description: 'Four adaptive modules covering both Reading & Writing and Math.',
        tone: 'bg-primary-50 text-primary-700',
    },
    english: {
        label: 'Reading & Writing only',
        description: 'Two adaptive Reading & Writing modules, scored independently out of 800.',
        tone: 'bg-amber-50 text-amber-700',
    },
    math: {
        label: 'Math only',
        description: 'Two adaptive Math modules, scored independently out of 800.',
        tone: 'bg-cyan-50 text-cyan-700',
    },
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return hours ? `${hours} hr${remainder ? ` ${remainder} min` : ''}` : `${remainder} min`;
};

function TestCard({test, onStart}) {
    const resume = test.status === 'in_progress';
    const retake = test.status === 'completed';
    const locked = test.locked;
    const type = testTypeMeta[test.test_type] || testTypeMeta.full;
    return (
        <Card className={`sat-arena-card relative flex h-full flex-col overflow-hidden ${resume || test.premium_only ? 'border-amber-300' : 'border-primary-300'}`}>
            <div className={resume || test.premium_only ? 'h-1 bg-amber-400' : 'sat-score-strip h-1 border-0'}/>
            <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                resume ? 'bg-amber-50 text-amber-700' : retake ? 'bg-slate-100 text-slate-600' : 'bg-primary-600 text-white'
            }`}>
                {resume ? 'In progress' : retake ? 'Completed' : 'Available'}
            </span>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="m-0 pr-24 font-display text-2xl font-black text-slate-950">{test.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-black ${type.tone}`}>{type.label}</span>
                    {test.premium_only && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                            <Crown className="size-3.5 fill-amber-400"/> Premium
                        </span>
                    )}
                </div>
                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">{type.description}</p>
                <div className="mt-5 grid gap-2">
                    {[
                        ['Duration', formatDuration(test.duration_minutes)],
                        ['Questions', test.question_count],
                        ['Score', `Up to ${test.maximum_score}`],
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
                    <Button block variant={locked || resume ? 'secondary' : 'primary'} onClick={() => onStart(test)}>
                        {locked ? <Crown className="size-4"/> : resume ? <PlayCircle className="size-4"/> : null}
                        {locked ? 'Unlock with Premium' : resume ? 'Resume test' : retake ? 'Take again' : 'Start test'}
                        {!locked && !resume && <ArrowRight className="size-4"/>}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function HistoryRow({result, onOpen}) {
    const takenAt = new Date(result.created_at);
    const type = testTypeMeta[result.test_type] || testTypeMeta.full;
    return (
        <button
            type="button"
            onClick={onOpen}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-primary-300 hover:bg-slate-50"
        >
            <div className="min-w-0">
                <p className="m-0 truncate font-black text-slate-900">{result.test_name}</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black ${type.tone}`}>{type.label}</span>
                <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">
                    {takenAt.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    {' · '}{result.correct}/{result.total} scored questions correct
                </p>
                <p className="m-0 mt-1 text-xs font-black text-slate-500">
                    {result.reading_writing_score != null && `Reading & Writing ${result.reading_writing_score}`}
                    {result.reading_writing_score != null && result.math_score != null && ' · '}
                    {result.math_score != null && `Math ${result.math_score}`}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <div className="text-right">
                    <span className="font-display text-2xl font-black text-slate-950">{result.score}</span>
                    <span className="text-xs font-black text-slate-400"> / {result.maximum_score}</span>
                </div>
                <ChevronRight className="size-5 text-slate-300"/>
            </div>
        </button>
    );
}

function TestHistory({history, onOpen}) {
    if (!history?.results?.length) return null;
    return (
        <section className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <h2 className="m-0 font-display text-2xl font-black text-slate-950">Your test history</h2>
                    <p className="m-0 mt-1 text-sm text-slate-500">Open any completed attempt for its full score report and question review.</p>
                </div>
                <span className="shrink-0 text-xs font-black uppercase tracking-wide text-slate-400">{history.results.length} completed</span>
            </div>
            <div className="space-y-2">
                {history.results.map((result) => (
                    <HistoryRow
                        key={result.id}
                        result={result}
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
                    Take a full adaptive SAT or focus on one subject. Save between sessions and receive a difficulty-adjusted score out of 800 or 1600.
                </p>
                {showFirstRunBanner && (
                    <div className="mb-6">
                        <Alert type="success">
                            Ready for a baseline? Choose a full test or one subject below. Your unfinished work can be saved.
                            <button type="button" onClick={closeFirstRunBanner} className="ml-3 cursor-pointer border-0 bg-transparent font-black text-emerald-800 underline">Got it</button>
                        </Alert>
                    </div>
                )}

                {loading ? (
                    <Card className="flex items-center justify-center gap-3 p-10 text-sm font-bold text-slate-500"><Spinner/> Loading available tests…</Card>
                ) : tests.length ? (
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tests.map((test) => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onStart={(selected) => navigate(selected.locked ? '/pricing' : `/full_length_test/${selected.id}`)}
                            />
                        ))}
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
                                    ['Real test timing', 'Refreshes and tab switches do not pause the clock. Use Save & quit when you need to stop safely.'],
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
