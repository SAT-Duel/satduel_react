import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Link, useSearchParams} from 'react-router-dom';
import {ArrowRight, Check, CreditCard, Crown, Lock, Sparkles, Zap} from 'lucide-react';
import api from '../components/api';
import {Alert, Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {billingErrorMessage, openBillingPortal, startPremiumCheckout} from '../utils/billing';

const PREMIUM_FEATURES = [
    'Unlimited adaptive practice',
    'Choose exact SAT question topics',
    'Keep your free diagnostic and progress history',
    'Manage subscription and invoices through Stripe',
];

const FREE_FEATURES = [
    '25 practice questions per day',
    'Random topic mix',
    'Diagnostic estimate',
    'Duels, tournaments, and practice tests',
];

function FeatureList({items}) {
    return (
        <ul className="m-0 space-y-3 p-0">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500"/>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function PricingPage() {
    const {user, loading} = useAuth();
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
            .then((response) => setProfile(response.data))
            .catch(() => {
                // Non-blocking: the CTA can still start checkout from auth state.
            });
    }, [user]);

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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            <Helmet>
                <title>Pricing — SAT Duel Premium</title>
                <meta
                    name="description"
                    content="Upgrade to SAT Duel Premium for unlimited adaptive SAT practice and topic selection."
                />
            </Helmet>

            <PageContainer className="py-10 sm:py-14">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                        <Sparkles className="size-4"/> SAT Duel Premium
                    </span>
                    <h1 className="m-0 mt-5 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                        Practice without the daily cap.
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Keep the free plan for daily reps, or upgrade when you want unlimited questions and focused topic practice.
                    </p>
                </div>

                {notice && (
                    <div className="mx-auto mt-6 max-w-3xl">
                        <Alert type={notice.type}>{notice.text}</Alert>
                    </div>
                )}

                <div className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <Zap className="size-5"/>
                            </div>
                            <div>
                                <h2 className="m-0 text-xl font-bold text-slate-900">Free</h2>
                                <p className="m-0 text-sm text-slate-500">Start building the habit.</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <span className="font-display text-4xl font-bold text-slate-900">$0</span>
                        </div>
                        <div className="mt-6">
                            <FeatureList items={FREE_FEATURES}/>
                        </div>
                        <Button to={user ? '/trainer' : '/register'} variant="secondary" block className="mt-7">
                            {user ? 'Continue free practice' : 'Create a free account'}
                        </Button>
                    </Card>

                    <Card className="border-primary-300 p-6 shadow-[0_10px_30px_rgba(124,58,237,0.10)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                                    <Crown className="size-5"/>
                                </div>
                                <div>
                                    <h2 className="m-0 text-xl font-bold text-slate-900">Premium</h2>
                                    <p className="m-0 text-sm text-slate-500">For focused SAT score growth.</p>
                                </div>
                            </div>
                            <span className="inline-flex w-fit items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                                Most focused
                            </span>
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                            <span className="font-display text-5xl font-bold text-slate-900">$9.99</span>
                            <span className="pb-1 text-sm font-semibold text-slate-500">USD / month</span>
                        </div>

                        <div className="mt-6">
                            <FeatureList items={PREMIUM_FEATURES}/>
                        </div>

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

                        <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                            <Lock className="size-4"/> Secure checkout and invoices are handled by Stripe.
                        </p>
                    </Card>
                </div>

                <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-500">
                    Already paid but not seeing Premium yet? Stripe can take a moment to confirm the subscription.
                    You can also check your plan on <Link to="/settings" className="font-semibold text-primary-600">settings</Link>.
                </p>
            </PageContainer>
        </div>
    );
}

export default PricingPage;
