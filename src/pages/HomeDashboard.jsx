import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Flame,
    Zap,
    Swords,
    Trophy,
    Target,
    Coins,
    Star,
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
// The rating / reward systems, described so users know what each is and how to
// earn it. This is the source of truth for the "Your progress" cards and the
// "How it works" explainer.
// ---------------------------------------------------------------------------
const STAT_DEFS = [
    {
        key: 'practice_rating',
        label: 'Practice Rating',
        icon: Target,
        color: 'text-primary-700 bg-primary-100',
        get: (d) => d.profile?.sp_elo_rating ?? '—',
        earn: 'Answer practice questions — only your first try at each one counts.',
        detail: 'Your skill level on individual questions (everyone starts at 1200). Get a question right and your rating goes up; miss it and it dips. Harder questions move it more, and your rating settles down as you answer more.',
    },
    {
        key: 'duel_rating',
        label: 'Duel Rating',
        icon: Swords,
        color: 'text-rose-700 bg-rose-100',
        get: (d) => d.profile?.elo_rating ?? '—',
        earn: 'Win duels against other students.',
        detail: 'Your competitive rank (everyone starts at 1500). Beating a higher-rated opponent earns more; losing to a lower-rated one costs more. This is separate from your Practice Rating.',
    },
    {
        key: 'level',
        label: 'Level',
        icon: Star,
        color: 'text-amber-700 bg-amber-100',
        get: (d) => d.stats?.level ?? 0,
        sub: (d) => `${d.stats?.xp ?? 0} XP`,
        earn: 'Earn 1 XP for every correct practice answer.',
        detail: 'Your overall experience. Each correct practice answer gives XP, and XP fills your level bar. Levels unlock rewards along the way.',
    },
    {
        key: 'streak',
        label: 'Day Streak',
        icon: Flame,
        color: 'text-orange-700 bg-orange-100',
        get: (d) => d.loginStreak ?? 0,
        earn: 'Practice every day. Miss a day and it resets.',
        detail: 'Consecutive days you have practiced. Finish your Daily Focused Practice each day to keep the flame alive — streaks are the single best predictor of score improvement.',
    },
    {
        key: 'coins',
        label: 'Coins',
        icon: Coins,
        color: 'text-yellow-700 bg-yellow-100',
        get: (d) => d.stats?.coins ?? 0,
        earn: 'Earn coins for correct answers; spend them in the Shop.',
        detail: 'Correct answers earn coins. Pets boost how many you get per answer. Spend them in the Shop on pets and cosmetics.',
    },
    {
        key: 'solved',
        label: 'Problems Solved',
        icon: CheckCircle2,
        color: 'text-emerald-700 bg-emerald-100',
        get: (d) => d.profile?.problems_solved ?? 0,
        earn: 'Every question you answer anywhere on SAT Duel counts.',
        detail: 'A lifetime tally of every question you have answered — practice, duels, and tournaments all add to it.',
    },
];

function StatCard({def, data}) {
    const Icon = def.icon;
    return (
        <Card className="p-4">
            <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${def.color}`}>
                <Icon className="size-5"/>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="m-0 text-2xl font-bold text-slate-900">{def.get(data)}</p>
                {def.sub && <span className="text-sm font-semibold text-slate-400">{def.sub(data)}</span>}
            </div>
            <p className="m-0 mt-0.5 text-sm font-semibold text-slate-700">{def.label}</p>
            <p className="m-0 mt-2 text-xs leading-relaxed text-slate-500">{def.earn}</p>
        </Card>
    );
}

function HowItWorks() {
    const [open, setOpen] = useState(false);
    return (
        <Card className="mt-4 overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
            >
                <span className="flex items-center gap-2.5 font-bold text-slate-900">
                    <Sparkles className="size-5 text-primary-600"/>
                    How ratings &amp; rewards work
                </span>
                <ChevronDown className={`size-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>
            {open && (
                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="m-0 mb-4 text-sm text-slate-500">
                        SAT Duel tracks a few different things. Here's what each one means and the fastest way to grow it.
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
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <PageContainer>
                {/* Greeting */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="m-0 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                            {greeting()}, {user?.username}
                        </h1>
                        <p className="m-0 mt-1 text-slate-500">Here's your prep at a glance.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3.5 py-1.5 text-sm font-bold text-orange-700">
                            <Flame className="size-4"/> {data.loginStreak} day streak
                        </span>
                        {isPremium && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-sm font-bold text-primary-700">
                                <Crown className="size-4"/> Premium
                            </span>
                        )}
                    </div>
                </div>

                {/* Daily focused practice + quick actions */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2 overflow-hidden">
                        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
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
                                    {doneToday}/{DAILY_GOAL}
                                </span>
                            </div>

                            <div className="flex-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                                    <Target className="size-3.5"/> Free · every day
                                </span>
                                <h2 className="m-0 mt-2 font-display text-xl font-bold text-slate-900">
                                    Daily Focused Practice
                                </h2>
                                <p className="m-0 mt-1 text-[15px] text-slate-600">
                                    {dailyComplete
                                        ? "Nice — you've hit today's goal. Keep going to stretch your streak!"
                                        : `Answer ${DAILY_GOAL - doneToday} more question${DAILY_GOAL - doneToday === 1 ? '' : 's'} to finish today and keep your streak.`}
                                </p>
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
                        <button
                            onClick={() => navigate('/match')}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md"
                        >
                            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                                <Swords className="size-5"/>
                            </div>
                            <div>
                                <p className="m-0 font-bold text-slate-900">Duel</p>
                                <p className="m-0 text-xs text-slate-500">Race another student</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/tournaments')}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md"
                        >
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <Trophy className="size-5"/>
                            </div>
                            <div>
                                <p className="m-0 font-bold text-slate-900">Tournaments</p>
                                <p className="m-0 text-xs text-slate-500">Compete for the top</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Your progress */}
                <section className="mt-10">
                    <h2 className="m-0 font-display text-xl font-bold text-slate-900">Your progress</h2>
                    <p className="m-0 mt-1 text-sm text-slate-500">
                        What each number means — and the fastest way to grow it.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {STAT_DEFS.map((def) => (
                            <StatCard key={def.key} def={def} data={data}/>
                        ))}
                    </div>
                    <HowItWorks/>
                </section>

                {/* Study guides — premium */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="m-0 flex items-center gap-2 font-display text-xl font-bold text-slate-900">
                                <Brain className="size-5 text-primary-600"/> AI Study Guides
                            </h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">
                                Personalized guides for every SAT skill. {isPremium ? 'Coming soon.' : 'A premium feature.'}
                            </p>
                        </div>
                        {!isPremium && (
                            <Button to="/upgrade" variant="secondary" size="sm">
                                <Crown className="size-4 text-amber-500"/> Unlock
                            </Button>
                        )}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {STUDY_GUIDES.map(({label, icon: Icon, color}) => (
                            <div key={label} className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                <div className={`flex size-12 items-center justify-center rounded-xl ${color}`}>
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
                    <h2 className="m-0 flex items-center gap-2 font-display text-xl font-bold text-slate-900">
                        <Gamepad2 className="size-5 text-slate-400"/> Mini games
                    </h2>
                    <p className="m-0 mt-1 text-sm text-slate-500">Quick, fun ways to sharpen up between sessions.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {MINI_GAMES.map(({label, icon: Icon, to, blurb}) => (
                            <button
                                key={to}
                                onClick={() => navigate(to)}
                                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Icon className="size-5"/>
                                </div>
                                <div>
                                    <p className="m-0 font-semibold text-slate-900">{label}</p>
                                    <p className="m-0 text-xs text-slate-500">{blurb}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </PageContainer>
        </div>
    );
}

export default withAuth(HomeDashboard);
