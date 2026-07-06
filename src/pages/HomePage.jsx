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
import prismPage from '../assets/avatars/pixel/prism-page.png';
import novaQuill from '../assets/avatars/pixel/nova-quill.png';
import emberAbacus from '../assets/avatars/pixel/ember-abacus.png';

// A real, curated SAT-style question. Visitors answer it right in the hero and
// see it graded with an explanation — a genuine taste of the product.
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

const HERO_METRICS = [
    {label: 'Question bank', value: '1,800+'},
    {label: 'Students', value: '400+'},
    {label: 'Diagnostic', value: '2 min'},
];

const FEATURES = [
    {
        icon: Target,
        title: 'Adaptive practice',
        text: 'Questions are matched to your level. Get one right and your Practice Rating goes up; the questions get harder as you improve.',
        stat: 'Elo-rated',
        accent: 'text-primary-700 bg-primary-100',
    },
    {
        icon: Swords,
        title: 'Duel a friend',
        text: 'Challenge someone to the same set of questions and see who scores higher. Your Duel Rating moves with every match.',
        stat: 'Live matches',
        accent: 'text-cyan-700 bg-cyan-100',
    },
    {
        icon: LineChart,
        title: 'See real progress',
        text: 'A small, honest scoreboard — rating, streak, and questions answered — shows exactly what’s improving.',
        stat: 'Daily streaks',
        accent: 'text-emerald-700 bg-emerald-100',
    },
];

const STEPS = [
    {icon: BookOpenCheck, title: 'Answer a question', text: 'One SAT question at a time, Reading & Writing or Math.'},
    {icon: CheckCircle2, title: 'Learn what changed', text: 'The explanation and your new rating arrive together, so each answer teaches you something.'},
    {icon: Flame, title: 'Come back tomorrow', text: 'A daily streak and a rising rating give you a reason to keep going.'},
];

const STATS = [
    {icon: BookOpenCheck, value: '1,800+', label: 'Real SAT-style questions.', color: 'bg-primary-100 text-primary-700'},
    {icon: Users, value: '400+', label: 'Students already practicing.', color: 'bg-cyan-100 text-cyan-700'},
    {icon: Zap, value: 'Free', label: 'No credit card to start.', color: 'bg-emerald-100 text-emerald-700'},
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

const FLOATING_AVATARS = [
    {src: prismPage, alt: 'Prism Page avatar', className: '-left-5 top-8 rotate-[-8deg]'},
    {src: novaQuill, alt: 'Nova Quill avatar', className: '-right-4 top-20 rotate-[7deg]'},
    {src: emberAbacus, alt: 'Ember Abacus avatar', className: 'bottom-5 left-10 rotate-[5deg]'},
];

function SampleQuestion() {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;
    const isRight = picked === SAMPLE_QUESTION.answer;

    return (
        <div className="relative mx-auto w-full max-w-lg">
            <div className="sat-duel-lanes absolute inset-x-7 top-8 h-[88%] rounded-[2rem] opacity-70"/>
            <Card className="sat-arena-card relative overflow-hidden rounded-[1.75rem] bg-white/95 p-0">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-3 text-white">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-cyan-200">{SAMPLE_QUESTION.skill}</p>
                        <p className="m-0 mt-1 font-display text-lg font-bold">Try a real question</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right">
                        <p className="m-0 text-xs font-bold text-slate-300">Practice Rating</p>
                        <p className={`m-0 font-display text-xl font-black ${answered ? (isRight ? 'text-emerald-300' : 'text-rose-300') : 'text-slate-200'}`}>
                            {answered ? (isRight ? '+12' : '−8') : '—'}
                        </p>
                    </div>
                </div>

                <div className="p-5">
                    <p className="m-0 text-[15px] font-semibold leading-relaxed text-slate-800">
                        {SAMPLE_QUESTION.prompt}
                    </p>

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
                                    className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-all ${style} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    <span className={[
                                        'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black',
                                        answered && isAnswer
                                            ? 'sat-answer-bubble-filled text-white'
                                            : 'sat-answer-bubble bg-white text-slate-500',
                                    ].join(' ')}>
                                        {answered && isAnswer ? <Check className="size-4"/>
                                            : answered && isPicked ? <X className="size-4 text-rose-500"/>
                                                : key}
                                    </span>
                                    <span className="text-sm font-semibold leading-snug text-slate-700">{text}</span>
                                </button>
                            );
                        })}
                    </div>

                    {answered && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className={`m-0 text-sm font-black ${isRight ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {isRight ? 'Correct!' : 'Not quite.'}
                            </p>
                            <p className="m-0 mt-1.5 text-sm leading-relaxed text-slate-600">{SAMPLE_QUESTION.explanation}</p>
                            <Button to="/register" className="mt-4" size="sm">
                                Keep practicing — it&rsquo;s free <ArrowRight className="size-4"/>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="sat-score-strip grid grid-cols-3 divide-x divide-white/70 px-5 py-3 text-center">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">Bank</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-primary-700">1,800+</p>
                    </div>
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">Students</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-cyan-700">400+</p>
                    </div>
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">To start</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-emerald-600">Free</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function FeatureCard({feature}) {
    const Icon = feature.icon;
    return (
        <Card hover className="sat-arena-card overflow-hidden">
            <div className="p-6">
                <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${feature.accent}`}>
                    <Icon className="size-6"/>
                </div>
                <h3 className="m-0 font-display text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="m-0 mt-3 text-[15px] leading-relaxed text-slate-600">{feature.text}</p>
            </div>
            <div className="sat-score-strip flex items-center justify-end px-6 py-3">
                <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-black text-slate-800">
                    {feature.stat}
                </span>
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
            <section className="sat-arena-surface overflow-hidden border-b border-slate-200">
                <PageContainer className="relative grid gap-10 py-12 sm:py-14 lg:grid-cols-2 lg:items-center">
                    <div className="relative z-10 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-black text-primary-700 shadow-sm">
                            <Zap className="size-4"/> Free to start
                        </span>
                        <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                            Practice for the SAT, one question at a time.
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                            Answer real SAT questions, watch your rating climb, and challenge a friend to a duel.
                            No credit card, no fluff — just practice that keeps you coming back.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                            <Button to="/diagnostic" size="lg" className="whitespace-nowrap">
                                Try the 2-minute diagnostic <ArrowRight className="size-5"/>
                            </Button>
                            <Button to={user ? '/trainer' : '/register'} variant="secondary" size="lg" className="whitespace-nowrap">
                                {user ? 'Continue practicing' : 'Create a free account'}
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Or just answer the question on the right →</p>

                        <dl className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2 text-left lg:mx-0">
                            {HERO_METRICS.map((metric) => (
                                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm">
                                    <dt className="text-xs font-black uppercase text-slate-400">{metric.label}</dt>
                                    <dd className="m-0 mt-1 font-display text-xl font-black text-slate-950 sm:text-2xl">
                                        {metric.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="relative z-10">
                        <SampleQuestion/>
                    </div>
                </PageContainer>
            </section>

            {/* What you get */}
            <section className="bg-white">
                <PageContainer className="pb-14 pt-10 sm:pb-20 sm:pt-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="m-0 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Everything you need to raise your score.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            Practice, compete, and track progress — the three things that actually move an SAT score.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* How it works */}
            <section className="sat-bubble-field border-y border-slate-200">
                <PageContainer className="py-14 sm:py-20">
                    <h2 className="m-0 text-center font-display text-3xl font-black text-slate-950 sm:text-4xl">
                        How it works
                    </h2>
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {STEPS.map(({icon: Icon, title, text}, i) => (
                            <div key={title} className="sat-arena-card flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <Icon className="size-5"/>
                                </div>
                                <div>
                                    <p className="m-0 text-xs font-black uppercase text-primary-600">Step {i + 1}</p>
                                    <h3 className="m-0 mt-1 text-lg font-bold text-slate-950">{title}</h3>
                                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Honest stats */}
            <section className="bg-white">
                <PageContainer className="py-14 sm:py-20">
                    <div className="grid gap-5 md:grid-cols-3">
                        {STATS.map(({icon: Icon, value, label, color}) => (
                            <Card key={label} className="sat-arena-card p-6">
                                <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${color}`}>
                                    <Icon className="size-6"/>
                                </div>
                                <p className="m-0 text-3xl font-black text-slate-950">{value}</p>
                                <p className="m-0 mt-2 font-semibold text-slate-600">{label}</p>
                            </Card>
                        ))}
                    </div>
                </PageContainer>
            </section>

            {/* Pricing */}
            <section className="sat-bubble-field relative overflow-hidden border-t border-slate-200">
                <PageContainer className="relative py-14 sm:py-20">
                    {FLOATING_AVATARS.map((avatar) => (
                        <div
                            key={avatar.alt}
                            className={`absolute hidden rounded-[1.5rem] border border-slate-200 bg-white/90 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)] md:block ${avatar.className}`}
                            aria-hidden="true"
                        >
                            <img src={avatar.src} alt="" className="image-render-pixel size-16"/>
                        </div>
                    ))}

                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="m-0 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Start free. Upgrade only if you want more.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            Free covers daily practice, duels, and tests. Premium unlocks unlimited questions and topic choice.
                        </p>
                    </div>

                    <div className="mx-auto mt-9 grid max-w-4xl gap-4 md:grid-cols-2">
                        {PLANS.map((plan) => {
                            const isPremium = plan.highlighted;
                            return (
                                <div
                                    key={plan.name}
                                    className={`sat-arena-card overflow-hidden rounded-[1.5rem] border ${
                                        isPremium ? 'border-primary-300 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'
                                    }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex size-10 items-center justify-center rounded-2xl ${
                                                    isPremium ? 'bg-white/10 text-amber-300' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {isPremium ? <Crown className="size-5"/> : <Zap className="size-5"/>}
                                                </div>
                                                <h3 className="m-0 text-xl font-black">{plan.name}</h3>
                                            </div>
                                            {isPremium && (
                                                <span className="rounded-full bg-primary-500 px-2.5 py-1 text-xs font-black text-white">
                                                    Most popular
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 flex items-end gap-2">
                                            <span className="font-display text-4xl font-black">{plan.price}</span>
                                            <span className={`pb-1 text-sm font-bold ${isPremium ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {plan.note}
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-2">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-2 text-sm font-semibold">
                                                    <CheckCircle2 className={`size-4 ${isPremium ? 'text-emerald-300' : 'text-emerald-600'}`}/>
                                                    <span className={isPremium ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={isPremium ? 'border-t border-white/10 bg-white/5 px-5 py-4' : 'sat-score-strip px-5 py-4'}>
                                        <Button to={isPremium ? '/pricing' : '/register'} variant={isPremium ? 'primary' : 'secondary'} block>
                                            {isPremium ? 'See Premium' : 'Start free'} <ArrowRight className="size-4"/>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </PageContainer>
            </section>

            {/* Final CTA */}
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="sat-duel-lanes absolute inset-0 opacity-20"/>
                <PageContainer className="relative py-14 text-center sm:py-20">
                    <Trophy className="mx-auto mb-5 size-11 text-amber-300"/>
                    <h2 className="m-0 font-display text-3xl font-black leading-tight sm:text-4xl">
                        See where you stand in 2 minutes.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
                        Answer three questions and get an instant estimate of your SAT level — no signup required.
                    </p>
                    <div className="mt-8">
                        <Button to="/diagnostic" size="lg" className="whitespace-nowrap border-primary-300">
                            Start the free diagnostic <ArrowRight className="size-5"/>
                        </Button>
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}

export default HomePage;
