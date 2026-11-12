import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {ArrowRight, Check, Crown, Lock} from 'lucide-react';
import api from '../components/api';
import {Alert, PageContainer} from '../components/ui';
import {Cta, EYEBROW, PANEL} from '../components/ui/landing';
import {DISCORD_INVITE, DiscordIcon} from '../components/Discord';
import {useAuth} from '../context/AuthContext';
import {billingErrorMessage, openBillingPortal, startPremiumCheckout} from '../utils/billing';
import {formatPremiumEnd, isOnFreeWeek} from '../utils/premium';
import SEO, {breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd} from '../components/SEO';
import '../styles/landing.css';

// ponytail: one flag runs the whole promo — the offer band, its FAQ answer and
// the structured data all hang off it. Flip to false when it ends.
const OFFER_ACTIVE = true;
// Optional end date, e.g. 'September 30'. Left empty, the sentence is omitted
// rather than shipping a placeholder to production.
const OFFER_ENDS = '';

// Every row below maps to a real gate in the code. Keep it that way — this is
// the page people pay from.
//   daily cap ......... settings.FREE_DAILY_LIMIT (25)
//   topic selection ... api/views/practice_views.py filters_are_default()
//   math lessons ...... src/pages/StudyGuidePage.jsx isLocked() (free: first 3)
//   premium forms ..... PracticeTest.premium_only
//   party caps ........ api/views/party_views.py CAPS (6/20 vs 50/50)
//   gold rush pool .... api/views/party_views.py GOLD_POOL (30 vs 100)
//   duel reactions .... api/models.py FREE_DUEL_EMOJIS (30) + PREMIUM (10)
//   crown ............. RankingPage / ProfilePage render it off is_premium
const COMPARISON = [
    {
        group: 'Practice',
        rows: [
            {
                label: 'Adaptive practice questions',
                note: 'The core English and Math loop',
                free: '25 / day',
                premium: 'Unlimited',
            },
            {
                label: 'Topic selection',
                note: 'Drill one skill instead of a random mix',
                free: 'Random mix',
                premium: 'Any topic',
            },
            {label: 'Practice Elo and progress tracking', free: true, premium: true},
        ],
    },
    {
        group: 'Study guides',
        rows: [
            {label: 'Reading & Writing lessons', free: 'All', premium: 'All'},
            {label: 'Math lessons', free: 'First 3', premium: 'All'},
        ],
    },
    {
        group: 'Practice tests',
        rows: [
            {label: 'Free full-length forms', free: true, premium: true},
            {
                label: 'Premium-only forms',
                note: 'Extra test forms beyond the free set',
                free: false,
                premium: true,
            },
        ],
    },
    {
        group: 'Party mode (as host)',
        rows: [
            {
                label: 'Players per room',
                note: 'Guests never need Premium to join',
                free: '6',
                premium: '50',
            },
            {label: 'Questions per game', free: '20', premium: '50'},
            {
                label: 'Gold Rush question pool',
                note: 'A bigger pool means far fewer repeats',
                free: '30',
                premium: '100',
            },
        ],
    },
    {
        group: 'Duels & profile',
        rows: [
            {label: 'Ranked duels and tournaments', free: true, premium: true},
            {label: 'Duel reactions', free: '30', premium: '40'},
            {label: 'Crown on your profile and the leaderboard', free: false, premium: 'crown'},
        ],
    },
];

const FREE_FEATURES = [
    '25 adaptive practice questions a day',
    'Ranked duels, tournaments and the diagnostic',
    'Party rooms with up to 6 players',
    'Free full-length practice test forms',
    'The whole Reading & Writing study guide',
];

const PREMIUM_FEATURES = [
    <><strong className="font-bold text-[var(--sd-text)]">Unlimited</strong> practice questions — no daily cap</>,
    <>Pick the <strong className="font-bold text-[var(--sd-text)]">exact topics</strong> you drill</>,
    <>Party rooms for <strong className="font-bold text-[var(--sd-text)]">50 players</strong>, 50 questions a game</>,
    'Premium-only practice test forms',
    'The full Math study guide library and the profile crown',
];

const PROMO_FAQ = {
    question: 'How do I use the Discord promo code?',
    answer: 'Copy the code from #announcements in the Discord, click Start Premium, then paste it into the promo code field on the Stripe checkout page. Your first month is free and billing starts after that.',
};

const FAQS = [
    ...(OFFER_ACTIVE ? [PROMO_FAQ] : []),
    {
        question: 'Can I keep using SAT Duel for free?',
        answer: 'Yes, and free is genuinely usable: 25 questions a day, the diagnostic, duels, tournaments, free practice-test forms, party rooms up to six players, and the whole Reading & Writing study guide.',
    },
    {
        question: 'Do my friends need Premium to play with me?',
        answer: 'No. Only the host plan sets the room size and question count. Guests join a 50-player room on a free account.',
    },
    {
        question: 'How do I cancel?',
        answer: 'From the billing portal in your settings, any time. Checkout, invoices and cancellation are all handled by Stripe.',
    },
];

function FeatureRow({children, premium = false}) {
    return (
        <li className="flex items-start gap-3 text-[14.5px] leading-normal text-[var(--sd-body)]">
            <span
                className={[
                    'mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full',
                    premium
                        ? 'bg-[rgba(124,92,240,0.18)] text-[var(--sd-violet-lbl)]'
                        : 'bg-[var(--sd-line)] text-[var(--sd-mut2)]',
                ].join(' ')}
            >
                <Check className="size-3" strokeWidth={3.4}/>
            </span>
            <span>{children}</span>
        </li>
    );
}

// The temporary promo. Delete this component and OFFER_ACTIVE together when the
// offer is retired for good.
function OfferBand() {
    return (
        <div className="mt-9 flex flex-col gap-5 rounded-[18px] border border-[rgba(88,101,242,0.38)] bg-[var(--sd-blurple-wash)] p-6 sm:flex-row sm:items-center sm:gap-7 sm:px-7">
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[var(--sd-blurple)] text-white">
                <DiscordIcon className="size-7"/>
            </span>

            <div className="min-w-0 grow">
                <p className={`${EYEBROW} text-[var(--sd-blurple-lbl)]`}>LIMITED TIME OFFER</p>
                <p className="sd-display m-0 mt-2 text-[21px] font-bold tracking-[-0.01em] text-[var(--sd-text)]">
                    Your first month of Premium, free.
                </p>
                <p className="m-0 mt-1.5 text-[14.5px] leading-relaxed text-[var(--sd-mut)] text-pretty">
                    Join the SAT Duel Discord, grab this month&rsquo;s promo code from #announcements, and paste it
                    into the promo field at checkout.{OFFER_ENDS ? ` Ends ${OFFER_ENDS}.` : ''}
                </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5">
                <span className="sd-mono flex items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-dashed border-[var(--sd-line3)] px-4 py-2.5 text-[13px] font-bold tracking-[0.14em] text-[var(--sd-dim)]">
                    <Lock className="size-3.5"/> SATDUEL-&bull;&bull;&bull;&bull;
                </span>
                <Cta solid href={DISCORD_INVITE} className="whitespace-nowrap !bg-[var(--sd-blurple)] px-5 py-3 text-[15px] !shadow-none hover:!bg-[#4752C4]">
                    Join the Discord <ArrowRight className="size-4"/>
                </Cta>
            </div>
        </div>
    );
}

const GRID_COLS = 'grid grid-cols-[minmax(0,1fr)_88px_88px] sm:grid-cols-[minmax(0,1fr)_190px_190px]';
const CELL = 'flex items-center justify-center border-l border-[var(--sd-line)] px-2 py-4 sm:px-3';
const CELL_VALUE = 'sd-mono text-center text-xs font-bold sm:text-[13.5px]';

function ComparisonCell({value, premium = false}) {
    const tint = premium ? 'bg-[rgba(124,92,240,0.08)]' : '';

    if (value === 'crown') {
        return <div className={`${CELL} ${tint} text-[var(--sd-gold-lbl)]`}><Crown className="size-[18px]" strokeWidth={1.9}/></div>;
    }
    if (value === true) {
        return <div className={`${CELL} ${tint} text-[var(--sd-green-lbl)]`}><Check className="size-[17px]" strokeWidth={3}/></div>;
    }
    if (value === false) {
        return <div className={`${CELL} ${tint} text-[17px] font-bold text-[var(--sd-dim)]`}>&mdash;</div>;
    }
    return (
        <div className={`${CELL} ${tint}`}>
            <span className={`${CELL_VALUE} ${premium ? 'text-[var(--sd-violet-lbl)]' : 'text-[var(--sd-mut)]'}`}>{value}</span>
        </div>
    );
}

function ComparisonTable() {
    return (
        <div className={`mt-7 overflow-hidden ${PANEL}`}>
            <div className={`${GRID_COLS} bg-[var(--sd-head)]`}>
                <div className="px-4 py-4 sm:px-6"/>
                <div className="border-l border-white/10 px-2 py-4 text-center sm:px-5">
                    <p className={`${EYEBROW} text-[#8595AE]`}>FREE</p>
                    <p className="sd-display m-0 mt-1.5 text-base font-bold text-white sm:text-[19px]">$0</p>
                </div>
                <div className="border-l border-white/10 bg-[rgba(124,92,240,0.16)] px-2 py-4 text-center sm:px-5">
                    <p className={`${EYEBROW} text-[#C0B0FA]`}>PREMIUM</p>
                    <p className="sd-display m-0 mt-1.5 text-base font-bold text-white sm:text-[19px]">
                        $9.99<span className="text-xs font-medium text-[#AEB7CC]"> /mo</span>
                    </p>
                </div>
            </div>

            {COMPARISON.map((section) => (
                <React.Fragment key={section.group}>
                    <div className={`${GRID_COLS} border-t border-[var(--sd-line)] bg-[var(--sd-bg2)]`}>
                        <div className="px-4 py-3 sm:px-6">
                            <span className={`${EYEBROW} text-[var(--sd-dim)]`}>{section.group.toUpperCase()}</span>
                        </div>
                        <div className="border-l border-[var(--sd-line)]"/>
                        <div className="border-l border-[var(--sd-line)]"/>
                    </div>

                    {section.rows.map((row) => (
                        <div key={row.label} className={`${GRID_COLS} border-t border-[var(--sd-line)]`}>
                            <div className="px-4 py-4 sm:px-6">
                                <span className="text-sm font-semibold text-[var(--sd-text)] sm:text-[15px]">{row.label}</span>
                                {row.note && (
                                    <span className="mt-0.5 hidden text-[13px] text-[var(--sd-dim)] sm:block">{row.note}</span>
                                )}
                            </div>
                            <ComparisonCell value={row.free}/>
                            <ComparisonCell value={row.premium} premium/>
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}

function PricingPage() {
    const {user, loading, updateUser} = useAuth();
    const [searchParams] = useSearchParams();
    const [notice, setNotice] = useState(null);
    const [billingAction, setBillingAction] = useState(null);
    const [profile, setProfile] = useState(null);
    const isPremium = Boolean(profile?.is_premium || user?.is_premium);
    // Free-week Premium has no subscription behind it, so it gets the
    // checkout button (to keep Premium), not the billing portal.
    const onFreeWeek = isOnFreeWeek(profile);

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

    const premiumCta = () => {
        if (loading) return <Cta solid loading className="px-5 py-3.5 text-[15px]">Loading account</Cta>;
        if (isPremium && !onFreeWeek) {
            return (
                <Cta onClick={handleManageBilling} loading={billingAction === 'portal'} className="px-5 py-3.5 text-[15px]">
                    Manage billing
                </Cta>
            );
        }
        if (user) {
            return (
                <Cta solid onClick={handleUpgrade} loading={billingAction === 'checkout'} className="px-5 py-3.5 text-[15px]">
                    {onFreeWeek ? 'Keep Premium' : 'Start Premium'} <ArrowRight className="size-[17px]"/>
                </Cta>
            );
        }
        return (
            <Cta solid to="/register" className="px-5 py-3.5 text-[15px]">
                Start Premium <ArrowRight className="size-[17px]"/>
            </Cta>
        );
    };

    return (
        <div>
            <SEO
                seoKey="pricing"
                structuredData={[
                    softwareAppJsonLd(),
                    faqJsonLd(FAQS),
                    breadcrumbJsonLd([
                        {name: 'Home', path: '/'},
                        {name: 'Pricing', path: '/pricing'},
                    ]),
                ]}
            />

            {/* hero */}
            <section className="sd-hero-bg border-b border-[var(--sd-line)]">
                <PageContainer className="pb-14 pt-12 sm:pt-[76px]">
                    <div className="max-w-3xl">
                        <p className={`${EYEBROW} text-[var(--sd-violet-lbl)]`}>PRICING</p>
                        <h1 className="sd-display m-0 mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-[var(--sd-text)] sm:text-[54px]">
                            Free forever.<br className="hidden sm:block"/> Premium when you outgrow it.
                        </h1>
                        <p className="m-0 mt-5 max-w-[620px] text-[17px] leading-relaxed text-[var(--sd-mut)] text-pretty">
                            Free gives you 25 adaptive questions a day, duels, tournaments and party rooms. Premium
                            removes the daily cap, lets you drill the exact topics you are weak on, and scales
                            everything else up.
                        </p>
                    </div>

                    {notice && <div className="mt-6 max-w-3xl"><Alert type={notice.type}>{notice.text}</Alert></div>}
                </PageContainer>
            </section>

            <PageContainer>
                {OFFER_ACTIVE && <OfferBand/>}

                {/* plans */}
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <div className={`flex flex-col p-7 sm:p-[30px] ${PANEL}`}>
                        <p className={`${EYEBROW} text-[var(--sd-dim)]`}>FREE</p>
                        <div className="mt-4 flex items-end gap-2">
                            <span className="sd-display text-[46px] font-bold leading-none tracking-[-0.02em] text-[var(--sd-text)]">$0</span>
                            <span className="pb-1.5 text-sm font-semibold text-[var(--sd-dim)]">forever</span>
                        </div>
                        <p className="m-0 mt-3.5 text-[14.5px] leading-relaxed text-[var(--sd-mut)]">
                            Everything you need to build a daily SAT habit.
                        </p>

                        <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-[var(--sd-line)] p-0 pt-6">
                            {FREE_FEATURES.map((item) => <FeatureRow key={item}>{item}</FeatureRow>)}
                        </ul>

                        <div className="grow"/>
                        <Cta to={user ? '/trainer' : '/register'} className="mt-7 px-5 py-3.5 text-[15px]">
                            {user ? 'Continue free practice' : 'Create a free account'}
                        </Cta>
                    </div>

                    <div className={`flex flex-col border-[1.5px] border-[#7C5CF0] p-7 shadow-[0_18px_50px_rgba(124,92,240,0.18)] sm:p-[30px] ${PANEL}`}>
                        <div className="flex items-center justify-between gap-4">
                            <p className={`${EYEBROW} flex items-center gap-2 text-[var(--sd-violet-lbl)]`}>
                                <Crown className="size-[15px] text-[var(--sd-gold-lbl)]" strokeWidth={1.9}/> PREMIUM
                            </p>
                            <span className="rounded-full bg-[#7C5CF0] px-2.5 py-1 text-[11.5px] font-bold text-white">
                                Full access
                            </span>
                        </div>

                        <div className="mt-4 flex items-end gap-2">
                            <span className="sd-display text-[46px] font-bold leading-none tracking-[-0.02em] text-[var(--sd-text)]">$9.99</span>
                            <span className="pb-1.5 text-sm font-semibold text-[var(--sd-dim)]">per month, USD</span>
                        </div>
                        <p className="m-0 mt-3.5 text-[14.5px] leading-relaxed text-[var(--sd-mut)]">
                            For the days when 25 questions are not enough.
                        </p>

                        <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-[var(--sd-line)] p-0 pt-6">
                            {PREMIUM_FEATURES.map((item, index) => (
                                <FeatureRow key={index} premium>{item}</FeatureRow>
                            ))}
                        </ul>

                        <div className="grow"/>
                        {onFreeWeek && (
                            <p className="m-0 mt-7 text-center text-[13.5px] text-[var(--sd-mut)]">
                                Your free week ends {formatPremiumEnd(profile.premium.until)}.
                            </p>
                        )}
                        <div className={onFreeWeek ? 'mt-3' : 'mt-7'}>{premiumCta()}</div>
                        <p className="m-0 mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-[var(--sd-dim)]">
                            <Lock className="size-3.5"/> Secure checkout by Stripe &middot; Cancel anytime
                        </p>
                        <p className="m-0 mt-2 text-center text-[12.5px] text-[var(--sd-dim)]">
                            <Link to="/terms" className="font-semibold text-[var(--sd-dim)] hover:text-[var(--sd-violet-lbl)]">Terms</Link>
                            {' '}&middot;{' '}
                            <Link to="/refund-policy" className="font-semibold text-[var(--sd-dim)] hover:text-[var(--sd-violet-lbl)]">Refund policy</Link>
                        </p>
                    </div>
                </div>

                {/* what's included */}
                <section className="pt-18">
                    <p className={`${EYEBROW} text-[var(--sd-violet-lbl)]`}>WHAT&rsquo;S INCLUDED</p>
                    <h2 className="sd-display m-0 mt-3.5 text-3xl font-bold leading-tight tracking-[-0.02em] text-[var(--sd-text)] sm:text-4xl">
                        Free and Premium, line by line.
                    </h2>
                    <p className="m-0 mt-3 max-w-[640px] text-base leading-relaxed text-[var(--sd-mut)]">
                        Every row below is a real limit in the product — not a marketing bullet.
                    </p>

                    <ComparisonTable/>
                </section>

                {/* faq */}
                <section className="pt-18">
                    <p className={`${EYEBROW} text-[var(--sd-violet-lbl)]`}>BEFORE YOU PAY</p>
                    <h2 className="sd-display m-0 mt-3.5 text-[32px] font-bold tracking-[-0.02em] text-[var(--sd-text)]">
                        Common questions
                    </h2>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-x-12">
                        {FAQS.map((faq) => (
                            <div key={faq.question}>
                                <p className="m-0 text-[15.5px] font-bold text-[var(--sd-text)]">{faq.question}</p>
                                <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-[var(--sd-mut)]">{faq.answer}</p>
                            </div>
                        ))}
                    </div>

                    <p className="m-0 mt-7 text-[13px] text-[var(--sd-dim)]">
                        Already paid but not seeing Premium yet? Stripe can take a moment to confirm the subscription.
                        You can also check your plan in{' '}
                        <Link to="/settings" className="font-bold text-[var(--sd-violet-lbl)]">settings</Link>.
                    </p>
                </section>
            </PageContainer>

            {/* closing */}
            <section className="mt-18 border-t border-[var(--sd-line)] bg-[var(--sd-bg2)]">
                <PageContainer className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <div>
                        <p className="sd-display m-0 text-[22px] font-bold tracking-[-0.01em] text-[var(--sd-text)]">
                            Still deciding? Start free — it never expires.
                        </p>
                        <p className="m-0 mt-1.5 text-[14.5px] text-[var(--sd-mut)]">
                            Upgrade the day you hit the 25-question cap, not before.
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                        <Cta to={user ? '/trainer' : '/register'} className="px-[22px] py-3.5 text-[15px]">Practice free</Cta>
                        {(!isPremium || onFreeWeek) && (user ? (
                            <Cta solid onClick={handleUpgrade} loading={billingAction === 'checkout'} className="px-[22px] py-3.5 text-[15px]">
                                {onFreeWeek ? 'Keep Premium' : 'Start Premium'}
                            </Cta>
                        ) : (
                            <Cta solid to="/register" className="px-[22px] py-3.5 text-[15px]">
                                Start Premium
                            </Cta>
                        ))}
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}

export default PricingPage;
