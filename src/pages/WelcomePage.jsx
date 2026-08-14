import React, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowRight, BookOpen, Calculator, Swords, Trophy} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import useSdTheme from '../hooks/useSdTheme';
import {consumePostLoginRedirect} from '../utils/authRedirect';
import '../styles/landing.css';

// First-login onboarding: one screen, three concrete starting points.
// Replaces the old goal-setting flow (target scores / daily quotas), which
// the rest of the product no longer used.
const OTHER_STARTS = [
    {
        icon: Swords,
        title: 'Duel',
        text: 'Compete with another student in real time and put your Duel Elo to the test.',
        actions: [{label: 'Find an opponent', to: '/match'}],
    },
    {
        icon: Trophy,
        title: 'Tournament',
        text: 'Join an asynchronous tournament, compete with students around the world, and see your ranking on a live leaderboard.',
        actions: [{label: 'Browse tournaments', to: '/tournaments'}],
    },
];

const PRACTICE_SUBJECTS = [
    {
        icon: BookOpen,
        title: 'English',
        text: 'Reading & Writing',
        to: '/infinite_questions',
        tone: 'border-cyan-400/35 bg-cyan-400/10 text-[var(--sd-cyan-lbl)] hover:border-cyan-300',
    },
    {
        icon: Calculator,
        title: 'Math',
        text: 'Algebra, data & geometry',
        to: '/infinite_questions?subject=math',
        tone: 'border-amber-400/35 bg-amber-400/10 text-[var(--sd-gold-lbl)] hover:border-amber-300',
    },
];

const WelcomePage = () => {
    const [theme] = useSdTheme();
    const {user, setFirstLogin} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the user signed up from an invite link (e.g. a tournament),
        // honor it instead of showing the picker.
        const redirectTo = consumePostLoginRedirect();
        if (redirectTo) {
            navigate(redirectTo, {replace: true});
            return;
        }
        // This screen only shows once. The server derives is_first_login from
        // last_login, which login already bumped, so clearing it locally is enough.
        setFirstLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="sd-landing flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:py-14" data-theme={theme}>
            <Helmet>
                <title>Welcome | SAT Duel</title>
            </Helmet>
            <div className="w-full max-w-5xl">
                <div className="text-center">
                    <h1 className="sd-display m-0 text-3xl font-bold tracking-[-0.025em] text-[var(--sd-text)] sm:text-[42px]">
                        Start with one real question{user?.first_name ? `, ${user.first_name}` : ''}.
                    </h1>
                    <p className="mx-auto mb-0 mt-3 max-w-2xl text-base leading-6 text-[var(--sd-mut)]">
                        Practice is the fastest way to establish your level. Pick a subject now—you can switch anytime.
                    </p>
                </div>

                <div className="mt-9 grid gap-5 lg:grid-cols-[1.55fr_0.85fr]">
                    <section className="overflow-hidden rounded-2xl border border-[#7C5CF0]/55 bg-[rgba(124,92,240,0.11)] shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
                        <div className="sat-score-strip flex items-center justify-between gap-3 px-5 py-3 sm:px-7">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--sd-text)]">
                                <BookOpen className="size-4 text-[var(--sd-violet-lbl)]"/> Focused practice
                            </span>
                            <span className="rounded-full bg-[#7C5CF0] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-white">
                                Recommended
                            </span>
                        </div>

                        <div className="p-5 sm:p-7">
                            <h2 className="sd-display m-0 text-2xl font-bold tracking-[-0.02em] text-[var(--sd-text)] sm:text-3xl">
                                Choose your first subject
                            </h2>
                            <p className="m-0 mt-2 max-w-xl text-sm leading-6 text-[var(--sd-mut)]">
                                Answer adaptive SAT questions, see explanations, and build a separate Practice Elo for each subject.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {PRACTICE_SUBJECTS.map(({icon: Icon, title, text, to, tone}) => (
                                    <Link
                                        key={title}
                                        to={to}
                                        className={`group flex min-h-28 items-center gap-4 rounded-2xl border p-4 no-underline transition-[border-color,background-color,transform] hover:-translate-y-0.5 ${tone}`}
                                    >
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-black/10">
                                            <Icon className="size-6"/>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-lg font-bold text-[var(--sd-text)]">{title}</span>
                                            <span className="mt-0.5 block text-sm text-[var(--sd-mut)]">{text}</span>
                                            <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold">
                                                Start practice <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5"/>
                                            </span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[var(--sd-line2)] bg-[var(--sd-panel)] p-5 sm:p-6">
                        <h2 className="sd-display m-0 text-xl font-bold text-[var(--sd-text)]">Other ways to train</h2>
                        <div className="mt-4 divide-y divide-[var(--sd-line)]">
                            {OTHER_STARTS.map(({icon: Icon, title, text, actions}) => (
                                <div key={title} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(124,92,240,0.12)] text-[var(--sd-violet-lbl)]">
                                            <Icon className="size-5"/>
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="m-0 text-base font-bold text-[var(--sd-text)]">{title}</h3>
                                            <p className="m-0 mt-1 text-sm leading-5 text-[var(--sd-mut)]">{text}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={actions[0].to}
                                        className="group mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--sd-line2)] bg-transparent px-3 py-2 text-sm font-bold text-[var(--sd-text)] no-underline transition-colors hover:border-[#7C5CF0] hover:text-[var(--sd-violet-lbl)]"
                                    >
                                        {actions[0].label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5"/>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-7 text-center">
                    <Link to="/trainer" className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-[var(--sd-dim)] no-underline hover:text-[var(--sd-text)]">
                        I’ll explore on my own <ArrowRight className="size-4"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
