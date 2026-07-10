import React, {useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowRight, BookOpen, Calculator, Gauge} from 'lucide-react';
import api from '../components/api';
import {useAuth} from '../context/AuthContext';
import useSdTheme from '../hooks/useSdTheme';
import {consumePostLoginRedirect} from '../utils/authRedirect';
import '../styles/landing.css';

// First-login onboarding: one screen, three concrete starting points.
// Replaces the old goal-setting flow (target scores / daily quotas), which
// the rest of the product no longer used.
const STARTS = [
    {
        icon: Gauge,
        title: '2-minute diagnostic',
        text: 'Three real questions. Get a rough score range before you start grinding.',
        to: '/diagnostic',
        recommended: true,
    },
    {
        icon: BookOpen,
        title: 'Reading & Writing',
        text: 'Adaptive practice, one question at a time. Your English rating moves with every answer.',
        to: '/infinite_questions',
    },
    {
        icon: Calculator,
        title: 'Math',
        text: 'Same loop for Math — the questions adjust to your level as you answer.',
        to: '/infinite_questions?subject=math',
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
        // Fire-and-forget: this screen only shows once.
        api.post('api/profile/update_first_login/').then(setFirstLogin).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="sd-landing flex min-h-screen flex-col items-center justify-center px-5 py-12" data-theme={theme}>
            <Helmet>
                <title>Welcome | SAT Duel</title>
            </Helmet>
            <div className="w-full max-w-[840px] text-center">
                <span className="sd-mono text-xs font-bold tracking-[0.12em] text-[#7C5CF0]">WELCOME TO THE ARENA</span>
                <h1 className="sd-display m-0 mt-3 text-3xl font-bold tracking-[-0.02em] text-[var(--sd-text)] sm:text-[40px]">
                    Where do you want to start{user?.first_name ? `, ${user.first_name}` : ''}?
                </h1>
                <p className="m-0 mt-3 text-base text-[var(--sd-mut)]">
                    Pick one — you can switch anytime from the dashboard.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {STARTS.map(({icon: Icon, title, text, to, recommended}) => (
                        <Link
                            key={title}
                            to={to}
                            className={`relative flex flex-col items-start gap-2 rounded-2xl border-[1.5px] p-5 text-left no-underline transition-all hover:-translate-y-0.5 ${
                                recommended
                                    ? 'border-[#7C5CF0] bg-[rgba(124,92,240,0.14)] shadow-[0_0_0_4px_rgba(124,92,240,0.08)]'
                                    : 'border-[var(--sd-line2)] bg-[var(--sd-panel)] hover:border-[rgba(124,92,240,0.6)]'
                            }`}
                        >
                            {recommended && (
                                <span className="sd-mono absolute -top-2.5 right-4 rounded-md bg-[#7C5CF0] px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-white">
                                    RECOMMENDED
                                </span>
                            )}
                            <Icon className="size-6 text-[var(--sd-violet-lbl)]"/>
                            <span className="sd-display text-lg font-bold text-[var(--sd-text)]">{title}</span>
                            <span className="text-sm leading-relaxed text-[var(--sd-mut)]">{text}</span>
                        </Link>
                    ))}
                </div>

                <Link to="/trainer" className="mt-9 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-dim)] no-underline hover:text-[var(--sd-text)]">
                    Skip — take me to the dashboard <ArrowRight className="size-4"/>
                </Link>
            </div>
        </div>
    );
};

export default WelcomePage;
