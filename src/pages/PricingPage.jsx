import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Link, useSearchParams} from 'react-router-dom';
import {
    ArrowRight,
    Check,
    CircleDot,
    CreditCard,
    Crown,
    FileText,
    Gauge,
    Lock,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';
import api from '../components/api';
import {Alert, Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {billingErrorMessage, openBillingPortal, startPremiumCheckout} from '../utils/billing';

const FREE_FEATURES = [
    '25 adaptive practice questions each day',
    'Random topic mix from the SAT bank',
    'Two-minute diagnostic estimate',
    'Duels, tournaments, and practice tests',
];

const PREMIUM_FEATURES = [
    'Unlimited adaptive practice',
    'Choose exact SAT question topics',
    'Keep diagnostic and progress history',
    'Stripe subscription, invoices, and billing portal',
];

const SCORE_SIGNALS = [
    {label: 'Practice Elo', value: 'Live'},
    {label: 'Daily cap', value: 'None'},
    {label: 'Topics', value: 'Pick'},
];

const FAQS = [
    {
        question: 'Can I keep using SAT Duel for free?',
        answer: 'Yes. Free users still get daily practice, the diagnostic, duels, tournaments, and practice tests.',
    },
    {
        question: 'What does Premium unlock first?',
        answer: 'Premium removes the daily practice cap and unlocks topic selection so students can drill the exact skills they need.',
    },
    {
        question: 'Where are payments handled?',
        answer: 'Checkout, invoices, and subscription management are handled by Stripe.',
    },
];

function FeatureList({items, premium = false}) {
    return (
        <ul className="m-0 space-y-3 p-0">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                    <span
                        className={[
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                            premium ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500',
                        ].join(' ')}
                    >
                        <Check className="size-3.5"/>
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function ScoreSlip() {
    return (
        <Card className="sat-arena-card overflow-hidden rounded-[1.75rem] bg-white/95">
            <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-cyan-200">Premium round</p>
                        <h2 className="m-0 mt-1 font-display text-xl font-black">Unlock the full arena</h2>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                        <Crown className="size-6 text-amber-300"/>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="m-0 text-xs font-black uppercase text-slate-400">Best for</p>
                    <p className="m-0 mt-2 text-[15px] font-semibold leading-relaxed text-slate-800">
                        Students who already know SAT Duel works for them and want longer, more focused practice sessions.
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                    {['A', 'B', 'C', 'D'].map((choice, index) => (
                        <div key={choice} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-3">
                            <span
                                className={[
                                    'flex size-9 items-center justify-center rounded-full text-sm font-black',
                                    index === 2
                                        ? 'sat-answer-bubble-filled text-white'
                                        : 'sat-answer-bubble bg-white text-slate-500',
                                ].join(' ')}
                            >
                                {choice}
                            </span>
                            <span className="text-xs font-black uppercase text-slate-400">
                                {index === 2 ? 'Drill' : 'Mix'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sat-score-strip grid grid-cols-3 divide-x divide-white/70 px-5 py-4 text-center">
                {SCORE_SIGNALS.map((signal) => (
                    <div key={signal.label}>
                        <p className="m-0 text-xs font-black uppercase text-slate-500">{signal.label}</p>
                        <p className="m-0 mt-1 font-display text-xl font-black text-slate-950">{signal.value}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function PricingPage() {
    const {user, loading, updateUser} = useAuth();
    const [searchParams] = useSearchParams();
    const [notice, setNotice] = useState(null);
    const [billingAction, setBillingAction] = useState(null);
    const [profile, setProfile] = useState(null);
    const isPremium = Boolean(profile?.is_premium || user?.is_premium);

    useEffect(() => {
        const checkout = searchParams.get('checkout');
        if (checkout === 'success') {
            setNotice({
                type: 'success',
                text: 'Payment received. Premium access will turn on as soon as Stripe confirms the subscription.',
            });
        } else if (checkout === 'cancelled') {
            setNotice({type: 'error', text: 'Checkout was cancelled. No charge was made.'});
        }
    }, [searchParams]);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            return;
        }
        api.get('api/profile/')
            .then((response) => {
                setProfile(response.data);
                updateUser({
                    id: response.data.user?.id,
                    username: response.data.user?.username,
                    email: response.data.user?.email,
                    first_name: response.data.user?.first_name,
                    last_name: response.data.user?.last_name,
                    is_premium: response.data.is_premium,
                    avatar: response.data.avatar,
                    avatar_icon: response.data.avatar_icon,
                });
            })
            .catch(() => {
                // Non-blocking: the CTA can still start checkout from auth state.
            });
    }, [updateUser, user?.id]);

    const handleUpgrade = async () => {
        setBillingAction('checkout');
        setNotice(null);
        try {
            await startPremiumCheckout();
        } catch (e) {
            setNotice({type: 'error', text: billingErrorMessage(e, 'Could not start checkout.')});
            setBillingAction(null);
        }
    };

    const handleManageBilling = async () => {
        setBillingAction('portal');
        setNotice(null);
        try {
            await openBillingPortal();
        } catch (e) {
            setNotice({type: 'error', text: billingErrorMessage(e, 'Could not open billing settings.')});
            setBillingAction(null);
        }
    };

    return (
        <div className="bg-white text-slate-900">
            <Helmet>
                <title>Pricing - SAT Duel Premium</title>
                <meta
                    name="description"
                    content="Upgrade to SAT Duel Premium for unlimited adaptive SAT practice and topic selection."
                />
            </Helmet>

            <section className="sat-arena-surface overflow-hidden border-b border-slate-200">
                <PageContainer className="py-10 sm:py-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-black text-primary-700 shadow-sm">
                            <Sparkles className="size-4"/> SAT Duel Premium
                        </span>
                        <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                            Choose your practice lane.
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                            Free is for building the habit. Premium is for students who want unlimited reps and exact-topic drills inside the arena.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {['Unlimited reps', 'Topic selection', 'Stripe invoices'].map((label) => (
                                <span key={label} className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-sm font-black text-slate-700 shadow-sm">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {notice && (
                        <div className="mx-auto mt-6 max-w-3xl">
                            <Alert type={notice.type}>{notice.text}</Alert>
                        </div>
                    )}

                    <div className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <Card className="sat-arena-card overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                        <Zap className="size-5"/>
                                    </div>
                                    <div>
                                        <p className="m-0 text-xs font-black uppercase text-slate-400">Starter lane</p>
                                        <h2 className="m-0 mt-1 text-xl font-black text-slate-950">Free</h2>
                                    </div>
                                </div>

                                <div className="mt-7 flex items-end gap-2">
                                    <span className="font-display text-5xl font-black text-slate-950">$0</span>
                                    <span className="pb-1 text-sm font-bold text-slate-500">forever</span>
                                </div>

                                <p className="m-0 mt-3 text-sm leading-relaxed text-slate-500">
                                    Enough to try the loop and build a daily SAT habit.
                                </p>

                                <div className="mt-6">
                                    <FeatureList items={FREE_FEATURES}/>
                                </div>
                            </div>

                            <div className="sat-score-strip px-6 py-5">
                                <Button to={user ? '/trainer' : '/register'} variant="secondary" block>
                                    {user ? 'Continue free practice' : 'Create a free account'}
                                </Button>
                            </div>
                        </Card>

                        <Card className="sat-arena-card overflow-hidden border-primary-300">
                            <div className="border-b border-primary-200 bg-slate-950 p-6 text-white">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                                            <Crown className="size-6"/>
                                        </div>
                                        <div>
                                            <p className="m-0 text-xs font-black uppercase text-cyan-200">Focused lane</p>
                                            <h2 className="m-0 mt-1 text-2xl font-black text-white">Premium</h2>
                                        </div>
                                    </div>
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1 text-xs font-black text-white">
                                        <CircleDot className="size-3.5"/> Most focused
                                    </span>
                                </div>

                                <div className="mt-7 flex items-end gap-2">
                                    <span className="font-display text-5xl font-black text-white">$9.99</span>
                                    <span className="pb-1 text-sm font-bold text-slate-300">USD / month</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <FeatureList items={PREMIUM_FEATURES} premium/>

                                <div className="mt-7">
                                    {loading ? (
                                        <Button block loading>Loading account</Button>
                                    ) : isPremium ? (
                                        <Button block variant="secondary" onClick={handleManageBilling} loading={billingAction === 'portal'}>
                                            <CreditCard className="size-4"/> Manage billing
                                        </Button>
                                    ) : user ? (
                                        <Button block onClick={handleUpgrade} loading={billingAction === 'checkout'}>
                                            Start secure checkout <ArrowRight className="size-4"/>
                                        </Button>
                                    ) : (
                                        <Button to="/register" block>
                                            Create account to upgrade <ArrowRight className="size-4"/>
                                        </Button>
                                    )}
                                </div>

                                <p className="m-0 mt-4 flex items-center gap-2 text-sm text-slate-400">
                                    <Lock className="size-4"/> Secure checkout and invoices are handled by Stripe.
                                </p>
                            </div>
                        </Card>
                    </div>
                </PageContainer>
            </section>

            <PageContainer className="py-12 sm:py-16">
                <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-primary-600">Why upgrade</p>
                        <h2 className="m-0 mt-3 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Premium removes friction after the habit is working.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            This is the calmer part of the page: no sales maze, just the exact reasons the paid plan exists.
                        </p>
                    </div>

                    <div className="hidden lg:block">
                        <ScoreSlip/>
                    </div>
                </div>

                <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
                    <Card className="sat-arena-card p-5">
                        <Gauge className="mb-4 size-7 text-primary-600"/>
                        <h3 className="m-0 font-display text-lg font-black text-slate-950">Cap removed</h3>
                        <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">
                            Keep practicing after your free daily questions when momentum is high.
                        </p>
                    </Card>
                    <Card className="sat-arena-card p-5">
                        <Target className="mb-4 size-7 text-cyan-700"/>
                        <h3 className="m-0 font-display text-lg font-black text-slate-950">Skill targeting</h3>
                        <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">
                            Choose the topics you actually need instead of waiting for random practice to find them.
                        </p>
                    </Card>
                    <Card className="sat-arena-card p-5">
                        <ShieldCheck className="mb-4 size-7 text-emerald-700"/>
                        <h3 className="m-0 font-display text-lg font-black text-slate-950">Clean billing</h3>
                        <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">
                            Stripe handles checkout, invoices, and subscription management.
                        </p>
                    </Card>
                </div>

                <section className="mx-auto mt-12 max-w-5xl">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <FileText className="size-5"/>
                        </div>
                        <div>
                            <p className="m-0 text-xs font-black uppercase text-primary-600">Billing notes</p>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Simple answers before checkout</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {FAQS.map((faq) => (
                            <Card key={faq.question} className="sat-arena-card p-5">
                                <h3 className="m-0 text-base font-black text-slate-950">{faq.question}</h3>
                                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <p className="mx-auto mt-7 max-w-3xl text-center text-sm text-slate-500">
                    Already paid but not seeing Premium yet? Stripe can take a moment to confirm the subscription.
                    You can also check your plan in <Link to="/settings" className="font-black text-primary-600">settings</Link>.
                </p>
            </PageContainer>

            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="sat-duel-lanes absolute inset-0 opacity-20"/>
                <PageContainer className="relative py-12 text-center sm:py-16">
                    <Trophy className="mx-auto mb-5 size-10 text-amber-300"/>
                    <h2 className="m-0 font-display text-3xl font-black leading-tight sm:text-4xl">
                        Start free. Upgrade when the arena is working.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
                        The paid plan should feel like a natural next round, not a wall.
                    </p>
                </PageContainer>
            </section>
        </div>
    );
}

export default PricingPage;
