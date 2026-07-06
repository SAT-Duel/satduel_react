import React from 'react';
import {Helmet} from 'react-helmet';
import {
    ArrowRight,
    BookOpenCheck,
    CheckCircle2,
    CircleDot,
    ClipboardCheck,
    Clock3,
    Crown,
    Flame,
    LineChart,
    Lock,
    ShieldCheck,
    Sparkles,
    Swords,
    Target,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import {Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import prismPage from '../assets/avatars/pixel/prism-page.png';
import novaQuill from '../assets/avatars/pixel/nova-quill.png';
import emberAbacus from '../assets/avatars/pixel/ember-abacus.png';

const HERO_METRICS = [
    {label: 'Question bank', value: '1,800+'},
    {label: 'Students', value: '400+'},
    {label: 'Diagnostic', value: '2 min'},
];

const ARENA_OPTIONS = [
    {choice: 'A', text: 'Keep the sentence as written.'},
    {choice: 'B', text: 'Add a sharper contrast between the ideas.'},
    {choice: 'C', text: 'Move the example to the previous paragraph.', active: true},
    {choice: 'D', text: 'Delete the transition completely.'},
];

const FEATURES = [
    {
        icon: Target,
        label: 'Bubble practice',
        title: 'A question-first practice loop',
        text: 'Short rounds keep attention on the SAT skill in front of you, then your Practice Rating moves with the result.',
        stat: 'Adaptive',
        accent: 'text-primary-700 bg-primary-100',
    },
    {
        icon: Swords,
        label: 'Duel lanes',
        title: 'Competition without the clutter',
        text: 'Duels make practice social, but the page stays calm: same questions, clear pace, honest rating changes.',
        stat: 'Live Elo',
        accent: 'text-cyan-700 bg-cyan-100',
    },
    {
        icon: LineChart,
        label: 'Score slips',
        title: 'Progress that feels concrete',
        text: 'Ratings, streaks, and answered questions give students a simple reason to return tomorrow.',
        stat: 'Clear reps',
        accent: 'text-emerald-700 bg-emerald-100',
    },
];

const LOOP_STEPS = [
    {
        icon: ClipboardCheck,
        title: 'Start with one focused round',
        text: 'A single Reading & Writing or Math question, presented like a clean answer sheet.',
    },
    {
        icon: CheckCircle2,
        title: 'Get immediate feedback',
        text: 'Correctness, explanation, and rating change arrive together so the session feels complete.',
    },
    {
        icon: Flame,
        title: 'Build a repeatable habit',
        text: 'Daily progress is built around streak, Practice Rating, and real answered questions.',
    },
];

const HOME_PRICING_PLANS = [
    {
        name: 'Free',
        price: '$0',
        note: '25 questions daily',
        tone: 'bg-white text-slate-950 border-slate-200',
        icon: Zap,
        iconClass: 'bg-slate-100 text-slate-600',
        features: ['Daily practice', 'Diagnostic estimate', 'Duels and tests'],
    },
    {
        name: 'Premium',
        price: '$9.99',
        note: 'per month',
        tone: 'bg-slate-950 text-white border-primary-300',
        icon: Crown,
        iconClass: 'bg-white/10 text-amber-300',
        features: ['Unlimited practice', 'Pick exact topics', 'Stripe invoices'],
    },
];

const FLOATING_AVATARS = [
    {src: prismPage, alt: 'Prism Page avatar', className: '-left-5 top-8 rotate-[-8deg]'},
    {src: novaQuill, alt: 'Nova Quill avatar', className: '-right-4 top-20 rotate-[7deg]'},
    {src: emberAbacus, alt: 'Ember Abacus avatar', className: 'bottom-5 left-10 rotate-[5deg]'},
];

function BubbleMark({choice, active = false}) {
    return (
        <span
            className={[
                'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black',
                active
                    ? 'sat-answer-bubble-filled text-white'
                    : 'sat-answer-bubble bg-white text-slate-500',
            ].join(' ')}
        >
            {choice}
        </span>
    );
}

function ArenaPreview() {
    return (
        <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
            <div className="sat-duel-lanes absolute inset-x-7 top-8 h-[88%] rounded-[2rem] opacity-70"/>
            <Card className="sat-arena-card relative overflow-hidden rounded-[1.75rem] bg-white/95 p-0">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-3 text-white">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-cyan-200">Math round 04</p>
                        <p className="m-0 mt-1 font-display text-lg font-bold">Practice Arena</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right">
                        <p className="m-0 text-xs font-bold text-slate-300">Practice Elo</p>
                        <p className="m-0 font-display text-xl font-black text-emerald-300">+12</p>
                    </div>
                </div>

                <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
                            <CircleDot className="size-3.5"/> Question card
                        </span>
                        <span className="text-xs font-bold text-slate-400">03 / 10</span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p className="m-0 text-xs font-black uppercase text-slate-400">Transition</p>
                        <p className="m-0 mt-2 text-[15px] font-semibold leading-relaxed text-slate-800">
                            The second sentence needs to show how the evidence changes the argument.
                        </p>
                    </div>

                    <div className="mt-3 space-y-2">
                        {ARENA_OPTIONS.map(({choice, text, active}) => (
                            <div
                                key={choice}
                                className={[
                                    'flex items-center gap-3 rounded-2xl border px-3 py-2',
                                    active
                                        ? 'border-primary-300 bg-primary-50'
                                        : 'border-slate-200 bg-white',
                                ].join(' ')}
                            >
                                <BubbleMark choice={choice} active={active}/>
                                <p className="m-0 text-sm font-semibold leading-snug text-slate-700">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sat-score-strip grid grid-cols-3 divide-x divide-white/70 px-5 py-3 text-center">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">Streak</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-amber-600">7</p>
                    </div>
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">Pace</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-cyan-700">1:18</p>
                    </div>
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">Elo</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-primary-700">1284</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function MiniPlanCard({plan}) {
    const Icon = plan.icon;
    const isPremium = plan.name === 'Premium';

    return (
        <div className={`sat-arena-card overflow-hidden rounded-[1.5rem] border ${plan.tone}`}>
            <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-2xl ${plan.iconClass}`}>
                            <Icon className="size-5"/>
                        </div>
                        <div>
                            <p className={`m-0 text-xs font-black uppercase ${isPremium ? 'text-cyan-200' : 'text-slate-400'}`}>
                                {isPremium ? 'Focused lane' : 'Starter lane'}
                            </p>
                            <h3 className="m-0 mt-1 text-xl font-black">{plan.name}</h3>
                        </div>
                    </div>
                    {isPremium && (
                        <span className="rounded-full bg-primary-500 px-2.5 py-1 text-xs font-black text-white">
                            Popular
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
                <Button to="/pricing" variant={isPremium ? 'primary' : 'secondary'} block>
                    Compare plans <ArrowRight className="size-4"/>
                </Button>
            </div>
        </div>
    );
}

function HomePricingSection() {
    return (
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
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                        <Lock className="size-4 text-cyan-300"/> Start free, upgrade later
                    </span>
                    <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                        Keep practicing when momentum hits.
                    </h2>
                    <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                        Try the arena first. Premium is there when you want unlimited rounds and exact-topic drills.
                    </p>
                </div>

                <div className="mx-auto mt-9 grid max-w-4xl gap-4 md:grid-cols-2">
                    {HOME_PRICING_PLANS.map((plan) => (
                        <MiniPlanCard key={plan.name} plan={plan}/>
                    ))}
                </div>
            </PageContainer>
        </section>
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
                <p className="m-0 text-xs font-black uppercase text-slate-400">{feature.label}</p>
                <h3 className="m-0 mt-2 font-display text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="m-0 mt-3 text-[15px] leading-relaxed text-slate-600">{feature.text}</p>
            </div>
            <div className="sat-score-strip flex items-center justify-between px-6 py-3">
                <span className="text-xs font-black uppercase text-slate-500">SAT Duel signal</span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-black text-slate-800">
                    {feature.stat}
                </span>
            </div>
        </Card>
    );
}

function LoopStep({step, index}) {
    const Icon = step.icon;
    return (
        <div className="sat-arena-card flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="size-5"/>
            </div>
            <div>
                <p className="m-0 text-xs font-black uppercase text-primary-600">Round {index + 1}</p>
                <h3 className="m-0 mt-1 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
        </div>
    );
}

function HomePage() {
    const {user} = useAuth();

    return (
        <div className="bg-white text-slate-900">
            <Helmet>
                <title>SAT Duel - SAT prep in a focused practice arena</title>
                <meta
                    name="description"
                    content="Adaptive SAT practice, duels with friends, and weekly tournaments. Start with a free 2-minute diagnostic."
                />
            </Helmet>

            <section className="sat-arena-surface overflow-hidden border-b border-slate-200">
                <PageContainer className="relative grid gap-10 py-10 sm:py-12 lg:grid-cols-2 lg:items-center lg:py-8">
                    <div className="relative z-10 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-black text-primary-700 shadow-sm">
                            <Zap className="size-4"/> Free SAT practice arena
                        </span>
                        <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
                            SAT Duel
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                            A cleaner way to train for the Digital SAT: answer focused questions,
                            watch your rating move, and duel when you want the pressure.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                            <Button to="/diagnostic" size="lg" className="whitespace-nowrap">
                                Try the 2-minute diagnostic <ArrowRight className="size-5"/>
                            </Button>
                            <Button to={user ? '/trainer' : '/register'} variant="secondary" size="lg" className="whitespace-nowrap">
                                {user ? 'Continue practicing' : 'Create a free account'}
                            </Button>
                        </div>

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

                    <div className="relative z-10 hidden lg:block">
                        <ArenaPreview/>
                    </div>
                </PageContainer>
            </section>

            <section className="bg-white">
                <PageContainer className="pb-14 pt-10 sm:pb-20 sm:pt-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                            <Sparkles className="size-4 text-cyan-300"/> The SAT Duel loop
                        </span>
                        <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Answer bubbles, rating movement, real momentum.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            Show up, answer, learn what changed, and come back stronger.
                            Practice should feel like a scored round, not a pile of worksheets.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="sat-bubble-field border-y border-slate-200">
                <PageContainer className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
                            <Clock3 className="size-4"/> Daily focus
                        </span>
                        <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            One session should always tell you what changed.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            SAT Duel's core loop keeps the scoreboard small: Practice Rating,
                            Duel Rating, streak, and answered questions. That is enough signal to
                            make progress feel visible without burying the student in noise.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-2">
                            {['Practice Elo', 'Duel Elo', 'Streak', 'Answered'].map((label) => (
                                <span key={label} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-black text-slate-700">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {LOOP_STEPS.map((step, index) => (
                            <LoopStep key={step.title} step={step} index={index}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="bg-white">
                <PageContainer className="py-14 sm:py-20">
                    <div className="grid gap-5 md:grid-cols-3">
                        <Card className="sat-arena-card p-6">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                                <BookOpenCheck className="size-6"/>
                            </div>
                            <p className="m-0 text-3xl font-black text-slate-950">1,800+</p>
                            <p className="m-0 mt-2 font-semibold text-slate-600">SAT-style questions ready for practice.</p>
                        </Card>
                        <Card className="sat-arena-card p-6">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                                <Users className="size-6"/>
                            </div>
                            <p className="m-0 text-3xl font-black text-slate-950">400+</p>
                            <p className="m-0 mt-2 font-semibold text-slate-600">Students already in the arena.</p>
                        </Card>
                        <Card className="sat-arena-card p-6">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <ShieldCheck className="size-6"/>
                            </div>
                            <p className="m-0 text-3xl font-black text-slate-950">Free</p>
                            <p className="m-0 mt-2 font-semibold text-slate-600">Start with a diagnostic before signup.</p>
                        </Card>
                    </div>
                </PageContainer>
            </section>

            <HomePricingSection/>

            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="sat-duel-lanes absolute inset-0 opacity-20"/>
                <PageContainer className="relative py-14 text-center sm:py-20">
                    <Trophy className="mx-auto mb-5 size-11 text-amber-300"/>
                    <h2 className="m-0 font-display text-3xl font-black leading-tight sm:text-4xl">
                        See where you stand in 2 minutes.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
                        Answer three questions, get an instant estimate, then choose whether to keep practicing.
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
