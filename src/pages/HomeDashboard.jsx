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
        subjects: [
            {value: 'english', label: 'English', get: (d) => d.profile?.sp_elo_rating ?? '—'},
            {value: 'math', label: 'Math', get: (d) => d.profile?.math_elo_rating ?? '—'},
        ],
        earn: 'Answer practice questions — only your first try at each one counts.',
        detail: 'Your skill level on individual questions (everyone starts at 1200). English and Math are rated separately. Get a question right and that rating goes up; miss it and it dips. Harder questions move it more, and your rating settles down as you answer more.',
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
        get: (d) => d.daily?.streak ?? 0,
        earn: 'Answer 10 practice questions a day. Miss a day and it resets.',
        detail: 'Consecutive days you have finished your Daily Focused Practice (10 answered questions before your local midnight). Miss a day and the flame goes out — streaks are the single best predictor of score improvement.',
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
    const [subject, setSubject] = useState(def.subjects ? def.subjects[0].value : null);
    const active = def.subjects?.find((s) => s.value === subject);
    const value = active ? active.get(data) : def.get(data);
    return (
        <Card className="sat-arena-card relative overflow-hidden p-4">
            <div className="sat-score-strip absolute inset-x-0 top-0 h-1 border-0"/>
            <div className="flex items-start justify-between gap-3">
                <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${def.color}`}>
                    <Icon className="size-5"/>
                </div>
                {def.subjects ? (
                    <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
                        {def.subjects.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                onClick={() => setSubject(s.value)}
                                className={[
                                    'rounded-md px-2 py-1 text-[11px] font-black transition-colors',
                                    subject === s.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500',
                                ].join(' ')}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <span className="sat-answer-bubble inline-flex size-8 items-center justify-center rounded-full bg-white text-xs font-black text-slate-500">
                        {def.bubble}
                    </span>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <p className="m-0 font-display text-3xl font-black text-slate-950">{value}</p>
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
    {label: 'Math', icon: Calculator, color: 'bg-sky-100 text-sky-700', to: '/study_guides', status: 'Beta'},
    {label: 'Reading & Writing', icon: BookText, color: 'bg-violet-100 text-violet-700', status: 'Soon'},
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
    const {user, updateUser} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({profile: null, stats: null, quota: null, daily: null});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const [profile, stats, status] = await Promise.all([
                api.get('api/profile/').then((r) => r.data).catch(() => null),
                api.get('api/trainer/infinite_question_stats/').then((r) => r.data).catch(() => null),
                api.get('api/practice/status/').then((r) => r.data).catch(() => null),
            ]);
            if (cancelled) return;
            if (profile) {
                updateUser({
                    id: profile.user?.id,
                    username: profile.user?.username,
                    email: profile.user?.email,
                    first_name: profile.user?.first_name,
                    last_name: profile.user?.last_name,
                    is_premium: profile.is_premium,
                    avatar: profile.avatar,
                    avatar_icon: profile.avatar_icon,
                });
            }
            setData({
                profile,
                stats,
                quota: status?.quota || null,
                daily: status?.daily || null,
            });
            setLoading(false);
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [updateUser]);

    const daily = data.daily;
    const dailyGoal = daily?.goal ?? DAILY_GOAL;
    const doneToday = daily?.count ?? 0;
    const shownDoneToday = Math.min(doneToday, dailyGoal);
    const dailyProgress = Math.min(100, (doneToday / dailyGoal) * 100);
    const dailyComplete = daily?.completed_today ?? doneToday >= dailyGoal;
    const streak = daily?.streak ?? 0;
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
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="m-0 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                        {greeting()}, {user?.username}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span
                            className={[
                                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold',
                                dailyComplete
                                    ? 'border-orange-200 bg-orange-100 text-orange-700'
                                    : 'border-slate-200 bg-white text-slate-500',
                            ].join(' ')}
                            title={dailyComplete
                                ? 'Daily goal complete — streak is safe!'
                                : `Answer ${dailyGoal} questions today to keep your streak`}
                        >
                            <Flame className={`size-4 ${dailyComplete ? 'text-orange-500' : 'text-slate-400'}`}/>
                            {streak} day streak
                        </span>
                        {isPremium && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-sm font-bold text-primary-700">
                                <Crown className="size-4"/> Premium
                            </span>
                        )}
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
                                    {shownDoneToday}/{dailyGoal}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h2 className="m-0 font-display text-2xl font-black text-slate-950">
                                    Daily Focused Practice
                                </h2>
                                <p className="m-0 mt-1 text-[15px] text-slate-600">
                                    {dailyComplete
                                        ? `Day ${streak} in the books — your streak is safe. Keep going if you're on a roll!`
                                        : `Answer ${Math.max(0, dailyGoal - doneToday)} more question${dailyGoal - doneToday === 1 ? '' : 's'} to finish today and keep your streak.`}
                                </p>
                                <ProgressBubbles value={doneToday}/>
                                <div className="mt-4">
                                    <Button onClick={() => navigate('/infinite_questions')}>
                                        {dailyComplete ? 'Keep practicing' : 'Start today’s practice'} <ArrowRight className="size-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Last 7 days */}
                        {daily?.week?.length > 0 && (
                            <div className="relative flex items-center justify-between gap-1 border-t border-slate-100 px-6 py-4">
                                {daily.week.map((day) => (
                                    <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5" title={`${day.date}: ${day.count} answered`}>
                                        <span
                                            className={[
                                                'flex size-8 items-center justify-center rounded-full',
                                                day.completed
                                                    ? 'bg-orange-100'
                                                    : day.is_today
                                                        ? 'border-2 border-dashed border-primary-300 bg-white'
                                                        : 'bg-slate-100',
                                            ].join(' ')}
                                        >
                                            <Flame className={`size-4 ${day.completed ? 'text-orange-500' : 'text-slate-300'}`}/>
                                        </span>
                                        <span className={`text-[11px] font-bold ${day.is_today ? 'text-primary-600' : 'text-slate-400'}`}>
                                            {day.is_today ? 'Today' : day.weekday}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
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

                {/* Study guides */}
                <section className="mt-10">
                    <SectionHeader
                        icon={Brain}
                        title="Study guides"
                        subtitle="Start with the Math guide: focused modules, concise lessons, and worked examples."
                        action={!isPremium && (
                            <Button to="/upgrade" variant="secondary" size="sm">
                                <Crown className="size-4 text-amber-500"/> Premium supports more guides
                            </Button>
                        )}
                    />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {STUDY_GUIDES.map(({label, icon: Icon, color, to, status}) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => to && navigate(to)}
                                disabled={!to}
                                className="sat-arena-card relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all enabled:hover:-translate-y-0.5 enabled:hover:border-primary-300 enabled:hover:shadow-md disabled:cursor-default"
                            >
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                    <Icon className="size-6"/>
                                </div>
                                <div className="flex-1">
                                    <p className="m-0 font-bold text-slate-900">{label} Study Guide</p>
                                    <p className="m-0 mt-0.5 text-sm text-slate-500">
                                        {to ? 'Focused modules + study pages.' : 'Targeted lessons + worked examples.'}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                    {!to && <Lock className="size-3"/>} {status}
                                </span>
                            </button>
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
