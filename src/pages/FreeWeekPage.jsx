import React, {useCallback, useEffect, useState} from 'react';
import {Check, Crown, PartyPopper} from 'lucide-react';
import api from '../components/api';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {formatPremiumEnd} from '../utils/premium';

// The claim page for the one free week of Premium each account gets. Linked
// from the marketing email; AppLayout sends logged-out visitors to log in and
// back here. Every row below is a real Premium gate (see PricingPage COMPARISON).
const WEEK_INCLUDES = [
    'Unlimited adaptive practice, with no 25-question daily cap',
    'Choose the exact SAT topics you drill',
    'Every Math study-guide lesson',
];

function Badge({tone, children}) {
    const tones = {
        amber: 'bg-amber-100 text-amber-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        slate: 'bg-slate-100 text-slate-500',
    };
    return (
        <span className={`flex size-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
            {children}
        </span>
    );
}

function Offer({onClaim, claiming}) {
    return (
        <>
            <Badge tone="amber"><Crown className="size-6"/></Badge>
            <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">7 days of Premium, free</h1>
            <p className="mt-2 text-slate-600">
                No card needed. Premium switches itself off after 7 days, so there&rsquo;s nothing to cancel.
            </p>
            <ul className="mt-5 space-y-2.5 p-0">
                {WEEK_INCLUDES.map((item) => (
                    <li key={item} className="flex list-none items-start gap-2.5 text-slate-700">
                        <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" strokeWidth={2.6}/>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
            <Button block className="mt-6" onClick={onClaim} loading={claiming}>
                Start my free week
            </Button>
            <p className="mt-3 text-center text-sm text-slate-400">Your 7 days start when you click.</p>
        </>
    );
}

function Active({until}) {
    return (
        <>
            <Badge tone="emerald"><PartyPopper className="size-6"/></Badge>
            <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">Your free week is on</h1>
            <p className="mt-2 text-slate-600">
                Premium is yours until <strong className="text-slate-900">{formatPremiumEnd(until)}</strong>.
                After that you&rsquo;re back on Free automatically.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button to="/infinite_questions" className="sm:flex-1">Start practicing</Button>
                <Button to="/study_guides" variant="secondary" className="sm:flex-1">Open study guides</Button>
            </div>
        </>
    );
}

function AlreadyPremium() {
    return (
        <>
            <Badge tone="amber"><Crown className="size-6"/></Badge>
            <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">You already have Premium</h1>
            <p className="mt-2 text-slate-600">
                The free week is for accounts on the Free plan, and yours already has everything it unlocks.
            </p>
            <Button to="/infinite_questions" className="mt-6">Start practicing</Button>
        </>
    );
}

function AlreadyUsed() {
    return (
        <>
            <Badge tone="slate"><Crown className="size-6"/></Badge>
            <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">You&rsquo;ve used your free week</h1>
            <p className="mt-2 text-slate-600">
                Each account gets one free week. Premium is $9.99/month, and you can cancel anytime.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button to="/pricing" className="sm:flex-1">See Premium</Button>
                <Button to="/infinite_questions" variant="secondary" className="sm:flex-1">Keep practicing free</Button>
            </div>
        </>
    );
}

function FreeWeekPage() {
    const {updateUser} = useAuth();
    // profile.premium from the API, plus the top-level is_premium flag.
    const [premium, setPremium] = useState(null);
    const [error, setError] = useState('');
    const [claiming, setClaiming] = useState(false);

    const load = useCallback(async () => {
        try {
            const {data} = await api.get('api/profile/');
            setPremium({...data.premium, is_premium: data.is_premium});
        } catch {
            setError('Could not load your account. Refresh the page to try again.');
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleClaim = async () => {
        setClaiming(true);
        setError('');
        try {
            const {data} = await api.post('api/billing/claim_free_week/');
            updateUser({is_premium: true});
            setPremium({is_premium: true, on_free_week: true, free_week_available: false, until: data.premium_until});
        } catch (e) {
            if (e.response?.status === 409) {
                // Claimed in another tab, or Premium arrived some other way:
                // show the real state instead of an error.
                await load();
            } else {
                setError(e.response?.data?.detail || 'Could not start your free week. Please try again.');
            }
        } finally {
            setClaiming(false);
        }
    };

    let content = null;
    if (premium?.on_free_week) content = <Active until={premium.until}/>;
    else if (premium?.free_week_available) content = <Offer onClaim={handleClaim} claiming={claiming}/>;
    else if (premium?.is_premium) content = <AlreadyPremium/>;
    else if (premium) content = <AlreadyUsed/>;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 sm:py-16">
            <PageContainer maxWidth="max-w-lg">
                {error && (
                    <div className="mb-4">
                        <Alert>{error}</Alert>
                    </div>
                )}
                {content ? (
                    <Card className="p-6 sm:p-8">{content}</Card>
                ) : !error && (
                    <div className="flex justify-center py-16"><Spinner/></div>
                )}
            </PageContainer>
        </div>
    );
}

export default FreeWeekPage;
