import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {
    ArrowRight,
    BookOpenCheck,
    Check,
    CheckCircle2,
    Crown,
    Flame,
    LineChart,
    Swords,
    Target,
    Trophy,
    Users,
    X,
    Zap,
} from 'lucide-react';
import {Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';

// A real, curated SAT-style question. Visitors answer it right in the hero and
// see it graded with an explanation — a genuine taste of the product, not a
// mockup.
const SAMPLE_QUESTION = {
    skill: 'Words in Context',
    prompt:
        'Marie Tharp’s detailed maps of the ocean floor were initially ______ by many of her colleagues, but they later became central to the theory of plate tectonics.',
    choices: [
        {key: 'A', text: 'celebrated'},
        {key: 'B', text: 'dismissed'},
        {key: 'C', text: 'duplicated'},
        {key: 'D', text: 'funded'},
    ],
    answer: 'B',
    explanation:
        'The word “but” sets up a contrast with “later became central,” so her maps were first rejected. “Dismissed” captures that reversal.',
};

const FEATURES = [
    {
        icon: Target,
        title: 'Adaptive practice',
        text: 'Questions are matched to your level. Get one right and your Practice Rating goes up; the questions get harder as you improve.',
    },
    {
        icon: Swords,
        title: 'Duel a friend',
        text: 'Challenge someone to the same set of questions and see who scores higher. Your Duel Rating moves with every match.',
    },
    {
        icon: LineChart,
        title: 'See real progress',
        text: 'A small, honest scoreboard — rating, streak, and questions answered — shows exactly what’s improving.',
    },
];

const STEPS = [
    {icon: BookOpenCheck, title: 'Answer a question', text: 'One SAT question at a time, Reading & Writing or Math.'},
    {icon: CheckCircle2, title: 'Learn what changed', text: 'The explanation and your new rating arrive together, so each answer teaches you something.'},
    {icon: Flame, title: 'Come back tomorrow', text: 'A daily streak and a rising rating give you a reason to keep going.'},
];

const STATS = [
    {icon: BookOpenCheck, value: '1,800+', label: 'Real SAT-style questions', color: 'bg-primary-100 text-primary-700'},
    {icon: Users, value: '400+', label: 'Students practicing', color: 'bg-sky-100 text-sky-700'},
    {icon: Zap, value: 'Free', label: 'No credit card to start', color: 'bg-emerald-100 text-emerald-700'},
];

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        note: 'forever',
        highlighted: false,
        features: ['25 questions a day', 'Duels and practice tests', 'Diagnostic score estimate'],
    },
    {
        name: 'Premium',
        price: '$9.99',
        note: 'per month',
        highlighted: true,
        features: ['Unlimited practice', 'Choose the exact topics you drill', 'Everything in Free'],
    },
];

function SampleQuestion() {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;
    const isRight = picked === SAMPLE_QUESTION.answer;

    return (
        <Card className="mx-auto w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <span className="text-sm font-bold text-slate-500">{SAMPLE_QUESTION.skill}</span>
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                    Try a real question
                </span>
            </div>

            <div className="p-5">
                <p className="m-0 text-[15px] leading-relaxed text-slate-800">{SAMPLE_QUESTION.prompt}</p>

                <div className="mt-4 flex flex-col gap-2.5">
                    {SAMPLE_QUESTION.choices.map(({key, text}) => {
                        const isAnswer = key === SAMPLE_QUESTION.answer;
                        const isPicked = key === picked;
                        let style = 'border-slate-200 bg-white hover:border-primary-400';
                        if (answered && isAnswer) style = 'border-emerald-400 bg-emerald-50';
                        else if (answered && isPicked) style = 'border-rose-400 bg-rose-50';
                        else if (answered) style = 'border-slate-200 bg-white opacity-60';
                        return (
                            <button
                                key={key}
                                onClick={() => !answered && setPicked(key)}
                                disabled={answered}
                                className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${style} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                    {answered && isAnswer ? <Check className="size-4 text-emerald-600"/>
                                        : answered && isPicked ? <X className="size-4 text-rose-600"/>
                                            : key}
                                </span>
                                <span className="text-[15px] text-slate-800">{text}</span>
                            </button>
                        );
                    })}
                </div>

                {answered && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className={`m-0 text-sm font-bold ${isRight ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isRight ? 'Correct!' : 'Not quite.'}
                        </p>
                        <p className="m-0 mt-1.5 text-sm leading-relaxed text-slate-600">{SAMPLE_QUESTION.explanation}</p>
                        <Button to="/register" className="mt-4" size="sm">
                            Keep practicing — it&rsquo;s free <ArrowRight className="size-4"/>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}

function HomePage() {
    const {user} = useAuth();

    return (
        <div className="bg-white text-slate-900">
            <Helmet>
                <title>SAT Duel — Practice for the SAT, one question at a time</title>
                <meta
                    name="description"
                    content="Practice real SAT questions, watch your rating climb, and duel friends. Free to start — no credit card."
                />
            </Helmet>

            {/* Hero — real interactive question */}
            <section className="border-b border-slate-100 bg-gradient-to-b from-primary-50/50 to-white">
                <PageContainer className="grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:items-center">
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white px-3.5 py-1 text-sm font-semibold text-primary-700">
                            <Zap className="size-4"/> Free to start
                        </span>
                        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                            Practice for the SAT, one question at a time.
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                            Answer real SAT questions, watch your rating climb, and challenge a friend to a duel.
                            No credit card, no fluff — just practice that keeps you coming back.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                            <Button to="/diagnostic" size="lg">
                                Try the 2-minute diagnostic <ArrowRight className="size-5"/>
                            </Button>
                            <Button to={user ? '/trainer' : '/register'} variant="secondary" size="lg">
                                {user ? 'Continue practicing' : 'Create a free account'}
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">Or just answer the question on the right →</p>
                    </div>

                    <div>
                        <SampleQuestion/>
                    </div>
                </PageContainer>
            </section>

            {/* What you get */}
            <section>
                <PageContainer className="py-16 sm:py-20">
                    <h2 className="text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        Everything you need to raise your score.
                    </h2>
                    <div className="mt-12 grid gap-5 md:grid-cols-3">
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
                        {STEPS.map(({icon: Icon, title, text}, i) => (
                            <div key={title} className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-600 font-display text-lg font-bold text-white">
                                    {i + 1}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                <p className="mx-auto mt-1.5 max-w-xs text-[15px] leading-relaxed text-slate-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Honest stats */}
            <section>
                <PageContainer className="py-16 sm:py-20">
                    <div className="grid gap-8 text-center sm:grid-cols-3">
                        {STATS.map(({icon: Icon, value, label, color}) => (
                            <div key={label}>
                                <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl ${color}`}>
                                    <Icon className="size-6"/>
                                </div>
                                <p className="m-0 font-display text-4xl font-bold text-slate-900">{value}</p>
                                <p className="m-0 mt-1 font-medium text-slate-600">{label}</p>
                            </div>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Pricing */}
            <section className="border-t border-slate-100 bg-slate-50/70">
                <PageContainer className="py-16 sm:py-20">
                    <div className="mx-auto max-w-xl text-center">
                        <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                            Start free. Upgrade only if you want more.
                        </h2>
                        <p className="mt-3 text-lg text-slate-600">
                            Free covers daily practice, duels, and tests. Premium unlocks unlimited questions and topic choice.
                        </p>
                    </div>
                    <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-2xl border-2 p-6 ${plan.highlighted ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="m-0 text-lg font-bold text-slate-900">{plan.name}</h3>
                                    {plan.highlighted && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                                            <Crown className="size-3.5"/> Most popular
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 flex items-end gap-1.5">
                                    <span className="font-display text-4xl font-bold text-slate-900">{plan.price}</span>
                                    <span className="pb-1 text-sm font-medium text-slate-500">{plan.note}</span>
                                </div>
                                <ul className="mt-5 space-y-2.5">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-[15px] text-slate-700">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600"/> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    to={plan.highlighted ? '/pricing' : '/register'}
                                    variant={plan.highlighted ? 'primary' : 'secondary'}
                                    block
                                    className="mt-6"
                                >
                                    {plan.highlighted ? 'See Premium' : 'Start free'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Final CTA */}
            <section className="border-t border-slate-100 bg-gradient-to-b from-white to-primary-50/50">
                <PageContainer className="py-16 text-center sm:py-20">
                    <Trophy className="mx-auto mb-4 size-10 text-primary-600"/>
                    <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        See where you stand in 2 minutes.
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-lg text-slate-600">
                        Answer three questions and get an instant estimate of your SAT level — no signup required.
                    </p>
                    <div className="mt-8">
                        <Button to="/diagnostic" size="lg">
                            Start the free diagnostic <ArrowRight className="size-5"/>
                        </Button>
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}

export default HomePage;
