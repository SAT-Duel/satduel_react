import React, {useEffect, useState} from 'react';
import {ArrowRight, BookOpenCheck, Clock3, Info, Sparkles, Trophy} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import api from '../../components/api';
import {Alert, Button, Card, PageContainer} from '../../components/ui';

const TESTS = [
    {
        id: 1,
        title: 'SAT Diagnostic Test',
        description: 'Start here to get a quick baseline score and a cleaner next-step signal.',
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

const FEATURES = [
    {
        title: 'Realistic rhythm',
        description: 'A focused test shell with timer, review marking, and section navigation.',
        icon: Clock3,
    },
    {
        title: 'Official-style questions',
        description: 'Practice on SAT question formats without the extra game-mode clutter.',
        icon: BookOpenCheck,
    },
    {
        title: 'Result review',
        description: 'Score first, then inspect missed questions and explanations.',
        icon: Trophy,
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

function PracticeTestPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, setFirstLogin} = useAuth();
    const [showFirstRunBanner, setShowFirstRunBanner] = useState(false);

    useEffect(() => {
        setShowFirstRunBanner(
            !user ||
            location.state?.fromGoalSetting ||
            location.state?.isNewUser ||
            user?.is_first_login
        );
    }, [location, user]);

    const closeFirstRunBanner = async () => {
        setShowFirstRunBanner(false);
        if (user?.is_first_login) {
            try {
                await api.post('api/profile/update_first_login/');
                localStorage.setItem('is_first_login', 'false');
                setFirstLogin();
            } catch (error) {
                console.error('Failed to update first login status:', error);
            }
        }
    };

    const startTest = (test) => {
        navigate(test.link, {
            state: {
                testId: test.id,
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
                            Welcome to SAT practice. Start with the diagnostic if you want the fastest baseline.
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

                <div className="grid gap-4 md:grid-cols-3">
                    {FEATURES.map(({title, description, icon: Icon}) => (
                        <Card key={title} className="sat-arena-card p-5">
                            <Icon className="size-6 text-primary-600"/>
                            <h2 className="m-0 mt-4 text-lg font-black text-slate-950">{title}</h2>
                            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
                        </Card>
                    ))}
                </div>

                <section className="mt-12">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="m-0 flex items-center gap-2 text-xs font-black uppercase text-primary-600">
                                <Sparkles className="size-4"/> Choose your checkpoint
                            </p>
                            <h2 className="m-0 mt-2 font-display text-3xl font-black text-slate-950">Available practice tests</h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">Start with the shortest useful signal, then grow into full-length tests.</p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {TESTS.map((test) => (
                            <TestCard key={test.id} test={test} onStart={startTest}/>
                        ))}
                    </div>
                </section>

                <Card className="sat-arena-card mt-12 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                            <Info className="size-5"/>
                        </div>
                        <div>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Before you begin</h2>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {[
                                    ['Choose your test', 'Use the diagnostic for a fast baseline or wait for full-length releases.'],
                                    ['Clear your space', 'Practice tests work best when you can focus for the full timer.'],
                                    ['Review afterward', 'The score matters less than the pattern behind your misses.'],
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
