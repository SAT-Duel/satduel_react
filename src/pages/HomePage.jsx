import React from 'react';
import {Helmet} from 'react-helmet';
import {
    Swords,
    Target,
    LineChart,
    Trophy,
    BookOpenCheck,
    ArrowRight,
    Zap,
} from 'lucide-react';
import {Button, Card, PageContainer} from '../components/ui';
import {DiscordCTA} from '../components/Discord';
import {useAuth} from '../context/AuthContext';

const FEATURES = [
    {
        icon: Target,
        title: 'Adaptive practice',
        text: 'Questions matched to your level with a rating that evolves as you improve — never too easy, never impossible.',
    },
    {
        icon: Swords,
        title: 'Duels & tournaments',
        text: 'Race friends on the same questions or climb the leaderboard in weekly tournaments.',
    },
    {
        icon: LineChart,
        title: 'Progress you can see',
        text: 'Track accuracy, streaks, and skill ratings across every SAT question type.',
    },
    {
        icon: BookOpenCheck,
        title: 'Real test practice',
        text: 'Full practice tests with instant grading and per-question explanations.',
    },
];

const HOW_IT_WORKS = [
    {step: '1', title: 'Take the mini diagnostic', text: 'Three questions. Two minutes. Get a feel for where you stand.'},
    {step: '2', title: 'Practice daily', text: 'Short adaptive sessions focused on the skills that move your score.'},
    {step: '3', title: 'Compete & improve', text: 'Duels and tournaments keep it fun. Your rating shows it working.'},
];

function HomePage() {
    const {user} = useAuth();

    return (
        <div className="bg-white">
            <Helmet>
                <title>SAT Duel — SAT prep that feels like a game</title>
                <meta
                    name="description"
                    content="Adaptive SAT practice, duels with friends, and weekly tournaments. Start with a free 2-minute diagnostic."
                />
            </Helmet>

            {/* Hero */}
            <section className="border-b border-slate-100 bg-gradient-to-b from-primary-50/60 to-white">
                <PageContainer className="py-16 text-center sm:py-24">
                    <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                        <Zap className="size-4"/> Free to practice
                    </span>
                    <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
                        SAT prep that feels like a <span className="text-primary-600">game</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
                        Adaptive questions, duels with friends, and weekly tournaments —
                        so you actually want to come back tomorrow.
                    </p>
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button to="/diagnostic" size="lg">
                            Try the 2-minute diagnostic <ArrowRight className="size-5"/>
                        </Button>
                        <Button to={user ? '/trainer' : '/register'} variant="secondary" size="lg">
                            {user ? 'Continue practicing' : 'Create a free account'}
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">
                        No signup needed for the diagnostic.
                    </p>
                </PageContainer>
            </section>

            {/* Features */}
            <section>
                <PageContainer className="py-16 sm:py-20">
                    <h2 className="text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        Everything you need. Nothing you don't.
                    </h2>
                    <div className="mt-12 grid gap-5 sm:grid-cols-2">
                        {FEATURES.map(({icon: Icon, title, text}) => (
                            <Card key={title} hover className="p-6">
                                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary-100">
                                    <Icon className="size-6 text-primary-700"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{text}</p>
                            </Card>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* How it works */}
            <section className="border-y border-slate-100 bg-slate-50/70">
                <PageContainer className="py-16 sm:py-20">
                    <h2 className="text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        How it works
                    </h2>
                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {HOW_IT_WORKS.map(({step, title, text}) => (
                            <div key={step} className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-600 font-display text-lg font-bold text-white">
                                    {step}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                <p className="mx-auto mt-1.5 max-w-xs text-[15px] leading-relaxed text-slate-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Stats — honest */}
            <section>
                <PageContainer className="py-16 sm:py-20">
                    <div className="grid gap-8 text-center sm:grid-cols-3">
                        <div>
                            <p className="font-display text-4xl font-bold text-primary-600">1,800+</p>
                            <p className="mt-1 font-medium text-slate-600">Real SAT-style questions</p>
                        </div>
                        <div>
                            <p className="font-display text-4xl font-bold text-primary-600">400+</p>
                            <p className="mt-1 font-medium text-slate-600">Students practicing</p>
                        </div>
                        <div>
                            <p className="font-display text-4xl font-bold text-primary-600">100%</p>
                            <p className="mt-1 font-medium text-slate-600">Free to get started</p>
                        </div>
                    </div>
                </PageContainer>
            </section>

            {/* Final CTA */}
            <section className="border-t border-slate-100 bg-gradient-to-b from-white to-primary-50/60">
                <PageContainer className="py-16 text-center sm:py-20">
                    <Trophy className="mx-auto mb-4 size-10 text-primary-600"/>
                    <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        See where you stand in 2 minutes
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-lg text-slate-600">
                        Answer three questions and get an instant estimate of your level.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button to="/diagnostic" size="lg">
                            Start the free diagnostic <ArrowRight className="size-5"/>
                        </Button>
                        <DiscordCTA/>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                        Or join 400+ students in our Discord community.
                    </p>
                </PageContainer>
            </section>
        </div>
    );
}

export default HomePage;
