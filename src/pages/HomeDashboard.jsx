import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Flame,
    Zap,
    Swords,
    Trophy,
    Target,
    ArrowRight,
    Crown,
    ChevronDown,
    Sparkles,
    Brain,
    Timer,
    Gamepad2,
    Calculator,
    BookText,
    Lock,
    CheckCircle2,
    CircleDot,
    BookOpenCheck,
} from 'lucide-react';
import withAuth from '../hoc/withAuth';
import api from '../components/api';
import {useAuth} from '../context/AuthContext';
import {Button, Card, PageContainer, Spinner} from '../components/ui';

const DAILY_GOAL = 10;

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
}

// ---------------------------------------------------------------------------
// The core progress systems, described so users know what each is and how to
// earn it. This is the source of truth for the "Your progress" cards and the
// "How it works" explainer.
// ---------------------------------------------------------------------------
const STAT_DEFS = [
    {
        key: 'practice_rating',
        label: 'Practice Elo',
        icon: Target,
        bubble: 'A',
        color: 'text-primary-700 bg-primary-100',
        get: (d) => d.profile?.sp_elo_rating ?? '—',
        earn: 'Answer practice questions — only your first try at each one counts.',
        detail: 'Your skill level on individual questions (everyone starts at 1200). Get a question right and your rating goes up; miss it and it dips. Harder questions move it more, and your rating settles down as you answer more.',
    },
    {
        key: 'duel_rating',
        label: 'Duel Elo',
        icon: Swords,
        bubble: 'B',
        color: 'text-rose-700 bg-rose-100',
        get: (d) => d.profile?.elo_rating ?? '—',
        earn: 'Win duels against other students.',
        detail: 'Your competitive rank (everyone starts at 1500). Beating a higher-rated opponent earns more; losing to a lower-rated one costs more. This is separate from your Practice Rating.',
    },
    {
        key: 'streak',
        label: 'Day Streak',
        icon: Flame,
        bubble: 'C',
        color: 'text-orange-700 bg-orange-100',
        get: (d) => d.loginStreak ?? 0,
        earn: 'Practice every day. Miss a day and it resets.',
        detail: 'Consecutive days you have practiced. Finish your Daily Focused Practice each day to keep the flame alive — streaks are the single best predictor of score improvement.',
    },
    {
        key: 'solved',
        label: 'Questions Answered',
        icon: CheckCircle2,
        bubble: 'D',
        color: 'text-emerald-700 bg-emerald-100',
        get: (d) => (d.stats?.correct_number ?? 0) + (d.stats?.incorrect_number ?? 0),
        earn: 'Every practice answer you submit counts here.',
        detail: 'A direct count from your practice history. This replaces the old inflated solved counter and keeps the homepage honest.',
    },
];

function StatCard({def, data}) {
    const Icon = def.icon;
    return (
        <Card className="sat-arena-card relative overflow-hidden p-4">
            <div className="sat-score-strip absolute inset-x-0 top-0 h-1 border-0"/>
            <div className="flex items-start justify-between gap-3">
                <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${def.color}`}>
                    <Icon className="size-5"/>
                </div>
                <span className="sat-answer-bubble inline-flex size-8 items-center justify-center rounded-full bg-white text-xs font-black text-slate-500">
                    {def.bubble}
                </span>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="m-0 font-display text-3xl font-black text-slate-950">{def.get(data)}</p>
                {def.sub && <span className="text-sm font-semibold text-slate-400">{def.sub(data)}</span>}
            </div>
            <p className="m-0 mt-0.5 text-sm font-black text-slate-800">{def.label}</p>
            <p className="m-0 mt-2 text-xs leading-relaxed text-slate-500">{def.earn}</p>
        </Card>
    );
}

function SectionHeader({icon: Icon, title, subtitle, action, quiet = false}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className={`m-0 flex items-center gap-2 font-display text-xl font-black ${quiet ? 'text-slate-800' : 'text-slate-950'}`}>
                    {Icon && <Icon className={`size-5 ${quiet ? 'text-slate-400' : 'text-primary-600'}`}/>}
                    {title}
                </h2>
                {subtitle && <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

function ProgressBubbles({value, total = DAILY_GOAL}) {
    const filled = Math.min(total, Math.max(0, Math.round(value)));
    return (
        <div className="mt-4 grid grid-cols-10 gap-1.5" aria-hidden="true">
            {Array.from({length: total}).map((_, index) => (
                <span
                    key={index}
                    className={[
                        'h-2.5 rounded-full transition-colors',
                        index < filled ? 'bg-primary-600 shadow-[0_2px_0_rgba(90,33,182,0.25)]' : 'bg-slate-200',
                    ].join(' ')}
                />
            ))}
        </div>
    );
}

function HowItWorks() {
    const [open, setOpen] = useState(false);
    return (
        <Card className="sat-arena-card mt-4 overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
            >
                <span className="flex items-center gap-2.5 font-bold text-slate-900">
                    <Sparkles className="size-5 text-primary-600"/>
                    How progress works
                </span>
                <ChevronDown className={`size-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>
            {open && (
                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="m-0 mb-4 text-sm text-slate-500">
                        SAT Duel now keeps the main loop focused: ratings, streak, and real answered questions.
                    </p>
                    <div className="space-y-4">
                        {STAT_DEFS.map((def) => {
                            const Icon = def.icon;
                            return (
                                <div key={def.key} className="flex gap-3">
                                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${def.color}`}>
                                        <Icon className="size-4"/>
                                    </div>
                                    <div>
                                        <p className="m-0 font-bold text-slate-900">{def.label}</p>
                                        <p className="m-0 mt-0.5 text-sm leading-relaxed text-slate-600">{def.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );
}

const MINI_GAMES = [
    {label: 'Power Sprint', icon: Zap, to: '/power_sprint_home', blurb: 'Answer as many as you can, fast.'},
    {label: 'SAT Survival', icon: Flame, to: '/sat_survival_home', blurb: 'One wrong answer ends the run.'},
    {label: 'Timed Challenges', icon: Timer, to: '/timed_challenges', blurb: 'Beat the clock.'},
];

const STUDY_GUIDES = [
    {label: 'Math', icon: Calculator, color: 'bg-sky-100 text-sky-700'},
    {label: 'Reading & Writing', icon: BookText, color: 'bg-violet-100 text-violet-700'},
];

function QuickActionCard({label, icon: Icon, to, blurb, tone, navigate}) {
    return (
        <button
            onClick={() => navigate(to)}
            className="sat-arena-card group flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
        >
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-5"/>
            </div>
            <div className="min-w-0 flex-1">
                <p className="m-0 font-black text-slate-950">{label}</p>
                <p className="m-0 truncate text-xs text-slate-500">{blurb}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"/>
        </button>
    );
}

function SecondaryTile({label, icon: Icon, to, blurb, navigate}) {
    return (
        <button
            onClick={() => navigate(to)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md"
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Icon className="size-5"/>
            </div>
            <div className="min-w-0">
                <p className="m-0 font-semibold text-slate-900">{label}</p>
                <p className="m-0 text-xs text-slate-500">{blurb}</p>
            </div>
        </button>
    );
}

function HomeDashboard() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({profile: null, stats: null, quota: null, loginStreak: 0});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const [profile, stats, status, streak] = await Promise.all([
                api.get('api/profile/').then((r) => r.data).catch(() => null),
                api.get('api/trainer/infinite_question_stats/').then((r) => r.data).catch(() => null),
                api.get('api/practice/status/').then((r) => r.data).catch(() => null),
                api.get('api/user_streak/').then((r) => r.data).catch(() => null),
            ]);
            if (cancelled) return;
            setData({
                profile,
                stats,
                quota: status?.quota || null,
                loginStreak: streak?.login_streak ?? 0,
            });
            setLoading(false);
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const doneToday = data.quota?.used ?? 0;
    const shownDoneToday = Math.min(doneToday, DAILY_GOAL);
    const dailyProgress = Math.min(100, (doneToday / DAILY_GOAL) * 100);
    const dailyComplete = doneToday >= DAILY_GOAL;
    const isPremium = data.profile?.is_premium ?? user?.is_premium;

    const dailyRing = useMemo(() => {
        const r = 34;
        const c = 2 * Math.PI * r;
        return {r, c, offset: c - (dailyProgress / 100) * c};
    }, [dailyProgress]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="sat-bubble-field min-h-screen py-6 sm:py-8">
            <PageContainer>
                {/* Greeting */}
                <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
                            <CircleDot className="size-3.5 text-cyan-300"/> Arena dashboard
                        </span>
                        <h1 className="m-0 mt-4 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                            {greeting()}, {user?.username}
                        </h1>
                        <p className="m-0 mt-1 text-slate-500">Start with today’s reps, then watch your Elo move.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-sm font-bold text-orange-700">
                            <Flame className="size-4"/> {data.loginStreak} day streak
                        </span>
                        {isPremium && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-sm font-bold text-primary-700">
                                <Crown className="size-4"/> Premium
                            </span>
                        )}
                    </div>
                    </div>
                </div>

                {/* Daily focused practice + quick actions */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="sat-arena-card relative overflow-hidden lg:col-span-2">
                        <div className="sat-duel-lanes absolute inset-0 opacity-[0.16]"/>
                        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                            {/* Progress ring */}
                            <div className="relative flex size-24 shrink-0 items-center justify-center">
                                <svg className="size-24 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r={dailyRing.r} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                                    <circle
                                        cx="40" cy="40" r={dailyRing.r} fill="none"
                                        stroke={dailyComplete ? '#10b981' : '#7c3aed'} strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={dailyRing.c} strokeDashoffset={dailyRing.offset}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <span className="absolute text-sm font-bold text-slate-700">
                                    {shownDoneToday}/{DAILY_GOAL}
                                </span>
                            </div>

                            <div className="flex-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-black text-primary-700 shadow-sm">
                                    <BookOpenCheck className="size-3.5"/> Today’s lane
                                </span>
                                <h2 className="m-0 mt-2 font-display text-2xl font-black text-slate-950">
                                    Daily Focused Practice
                                </h2>
                                <p className="m-0 mt-1 text-[15px] text-slate-600">
                                    {dailyComplete
                                        ? "Nice — you've hit today's goal. Keep going to stretch your streak!"
                                        : `Answer ${DAILY_GOAL - doneToday} more question${DAILY_GOAL - doneToday === 1 ? '' : 's'} to finish today and keep your streak.`}
                                </p>
                                <ProgressBubbles value={doneToday}/>
                                <div className="mt-4">
                                    <Button onClick={() => navigate('/infinite_questions')}>
                                        {dailyComplete ? 'Keep practicing' : 'Start today’s practice'} <ArrowRight className="size-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                        <QuickActionCard
                            label="Duel"
                            icon={Swords}
                            to="/match"
                            blurb="Race another student"
                            tone="bg-rose-100 text-rose-700"
                            navigate={navigate}
                        />
                        <QuickActionCard
                            label="Tournaments"
                            icon={Trophy}
                            to="/tournaments"
                            blurb="Compete for the top"
                            tone="bg-amber-100 text-amber-700"
                            navigate={navigate}
                        />
                    </div>
                </div>

                {/* Your progress */}
                <section className="mt-10">
                    <SectionHeader
                        icon={Target}
                        title="Your progress"
                        subtitle="The four numbers that matter: practice skill, duel skill, streak, and honest reps."
                    />
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {STAT_DEFS.map((def) => (
                            <StatCard key={def.key} def={def} data={data}/>
                        ))}
                    </div>
                    <HowItWorks/>
                </section>

                {/* Study guides — premium */}
                <section className="mt-10">
                    <SectionHeader
                        icon={Brain}
                        title="AI Study Guides"
                        subtitle={`Personalized guides for every SAT skill. ${isPremium ? 'Coming soon.' : 'A premium feature.'}`}
                        action={!isPremium && (
                            <Button to="/upgrade" variant="secondary" size="sm">
                                <Crown className="size-4 text-amber-500"/> Unlock
                            </Button>
                        )}
                    />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {STUDY_GUIDES.map(({label, icon: Icon, color}) => (
                            <div key={label} className="sat-arena-card relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                    <Icon className="size-6"/>
                                </div>
                                <div className="flex-1">
                                    <p className="m-0 font-bold text-slate-900">{label} Study Guide</p>
                                    <p className="m-0 mt-0.5 text-sm text-slate-500">Targeted lessons + worked examples.</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                    <Lock className="size-3"/> Soon
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mini games — the fun, secondary stuff */}
                <section className="mt-10">
                    <SectionHeader
                        icon={Gamepad2}
                        title="Mini games"
                        subtitle="Quick, fun ways to sharpen up between focused sessions."
                        quiet
                    />
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {MINI_GAMES.map(({label, icon: Icon, to, blurb}) => (
                            <SecondaryTile
                                key={to}
                                label={label}
                                icon={Icon}
                                to={to}
                                blurb={blurb}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </section>
            </PageContainer>
        </div>
    );
}

export default withAuth(HomeDashboard);
