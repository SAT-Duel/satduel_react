import React from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {FileText, ShieldCheck} from 'lucide-react';
import {PageContainer} from '../components/ui';
import SEO, {breadcrumbJsonLd, organizationJsonLd} from '../components/SEO';

const UPDATED = 'July 10, 2026';
const CONTACT = 'satduel@gmail.com';

const DOCS = {
    terms: {
        title: 'Terms of Service',
        description: 'The rules for using SAT Duel.',
        path: '/terms',
        sections: [
            {
                title: '1. Agreement',
                body: [
                    'These Terms of Service govern your access to and use of SAT Duel, including our website, practice questions, games, tournaments, accounts, subscriptions, and related services.',
                    'By creating an account, using SAT Duel, or buying a subscription, you agree to these Terms. If you do not agree, do not use SAT Duel.',
                ],
            },
            {
                title: '2. SAT Duel is an educational service',
                body: [
                    'SAT Duel provides Digital SAT practice, study tools, ratings, progress tracking, duels, tournaments, and related educational content.',
                    'SAT Duel does not guarantee any test score, admission result, scholarship, or academic outcome. Your results depend on many factors outside our control.',
                    'SAT Duel is not affiliated with, endorsed by, or sponsored by College Board. SAT is a trademark of College Board.',
                ],
            },
            {
                title: '3. Accounts',
                body: [
                    'You are responsible for the accuracy of your account information and for keeping your login credentials secure.',
                    'You may not share, sell, transfer, or let another person use your account.',
                    'If you believe your account has been accessed without permission, contact us promptly.',
                ],
            },
            {
                title: '4. Students and parents',
                body: [
                    'SAT Duel is intended for students preparing for the SAT, parents, educators, and other users who are at least 13 years old.',
                    'Users under 13 may not create an account or provide personal information unless SAT Duel has received any parental consent required by law.',
                    'Parents or guardians may contact us to review, update, or request deletion of a child account.',
                ],
            },
            {
                title: '5. Subscriptions and payments',
                body: [
                    'Some features may require a paid subscription. Prices, billing periods, and included features are shown before checkout.',
                    'Payments, invoices, card processing, and subscription management may be handled by Stripe or another payment processor. We do not store full payment card numbers.',
                    'Unless cancelled before renewal, subscriptions may renew automatically. You can manage cancellation through the billing portal or by contacting us.',
                ],
            },
            {
                title: '6. Acceptable use',
                body: [
                    'You may not use SAT Duel to cheat, harass others, disrupt the service, scrape content, reverse engineer the platform, upload malicious code, or violate any law.',
                    'You may not copy, sell, publish, or redistribute SAT Duel questions, explanations, software, designs, or data except as allowed by us in writing.',
                    'You may not attempt to manipulate ratings, leaderboards, tournaments, payments, account limits, or access controls.',
                ],
            },
            {
                title: '7. User content',
                body: [
                    'You may be able to submit profile text, tournament information, messages, or other content. You keep ownership of content you submit, but you give SAT Duel permission to host, display, process, and use it to operate the service.',
                    'Do not submit content that is illegal, harmful, abusive, misleading, infringing, or private to someone else.',
                    'We may remove content or restrict accounts if we believe these Terms are being violated.',
                ],
            },
            {
                title: '8. Intellectual property',
                body: [
                    'SAT Duel and its software, design, question bank, scoring systems, logos, text, and other materials are owned by SAT Duel or its licensors.',
                    'These Terms do not transfer ownership of SAT Duel materials to you. We grant you a limited, revocable, non-transferable right to use the service for personal educational use.',
                ],
            },
            {
                title: '9. Service changes and availability',
                body: [
                    'We may change, suspend, or discontinue features at any time. We try to keep SAT Duel reliable, but we do not promise uninterrupted or error-free service.',
                    'We may update these Terms from time to time. If changes are material, we will take reasonable steps to notify users.',
                ],
            },
            {
                title: '10. Disclaimers and limits',
                body: [
                    'SAT Duel is provided "as is" and "as available" to the fullest extent allowed by law.',
                    'To the fullest extent allowed by law, SAT Duel will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, data loss, lost academic opportunities, or score outcomes.',
                    'Nothing in these Terms limits rights that cannot be limited under applicable law.',
                ],
            },
            {
                title: '11. Contact',
                body: [`Questions about these Terms can be sent to ${CONTACT}.`],
            },
        ],
    },
    privacy: {
        title: 'Privacy Policy',
        description: 'How SAT Duel collects, uses, and protects information.',
        path: '/privacy',
        sections: [
            {
                title: '1. Overview',
                body: [
                    'This Privacy Policy explains how SAT Duel collects, uses, shares, and protects information when you use our website and services.',
                    'We collect information to run an educational practice platform, manage accounts, provide progress tracking, process subscriptions, improve the service, and keep users safe.',
                ],
            },
            {
                title: '2. Information we collect',
                body: [
                    'Account information: username, email address, name, grade, country, timezone, avatar choices, profile text, and login-related information.',
                    'Learning information: questions viewed, answers submitted, correctness, practice attempts, Elo ratings, streaks, tournament results, duel results, progress history, and similar educational activity.',
                    'Payment information: subscription status, Stripe customer identifiers, billing events, price identifiers, and invoice or checkout status. Full card details are handled by the payment processor.',
                    'Device and usage information: pages visited, browser or device information, IP address, approximate location, logs, cookies, local storage, and analytics or security signals.',
                    'Communications: support requests, feedback, forms, emails, and messages you send to us.',
                ],
            },
            {
                title: '3. How we use information',
                body: [
                    'To create and secure accounts, provide practice questions, score answers, show leaderboards, run tournaments, manage subscriptions, personalize practice, respond to support requests, prevent abuse, debug errors, and improve SAT Duel.',
                    'We may use aggregated or de-identified information to understand product performance and educational usage patterns.',
                ],
            },
            {
                title: '4. Sharing',
                body: [
                    'We do not sell personal information.',
                    'We share information with service providers that help us operate SAT Duel, such as hosting, authentication, email, analytics, customer support, and payment processing providers.',
                    'We may share information if required by law, to protect rights and safety, to prevent fraud or abuse, or as part of a merger, acquisition, financing, or sale of assets.',
                    'Some profile, tournament, duel, leaderboard, avatar, username, grade, country, rating, streak, and progress information may be visible to other SAT Duel users as part of the service.',
                ],
            },
            {
                title: '5. Cookies and local storage',
                body: [
                    'SAT Duel may use cookies, local storage, and similar technologies to keep you logged in, remember preferences, protect accounts, measure usage, and improve the service.',
                    'You can control cookies through your browser settings, but some features may not work correctly if cookies or local storage are disabled.',
                ],
            },
            {
                title: '6. Children and students',
                body: [
                    'SAT Duel is not intended for children under 13 without required parental consent.',
                    'If we learn that we collected personal information from a child under 13 without required consent, we will take reasonable steps to delete it or obtain appropriate consent.',
                    'Parents and guardians may contact us to review, update, or request deletion of a child account.',
                ],
            },
            {
                title: '7. Your choices and rights',
                body: [
                    'You may update some account information in your profile or settings.',
                    'You may request access, correction, deletion, or export of personal information by contacting us.',
                    'California residents may have rights to know, delete, correct, and opt out of certain sharing of personal information. Because SAT Duel is online-only, requests can be sent by email.',
                    'We may need to verify your identity before completing a privacy request. We may keep certain information where required or allowed by law, including for security, fraud prevention, billing records, legal compliance, or legitimate educational records.',
                ],
            },
            {
                title: '8. Retention and security',
                body: [
                    'We keep personal information for as long as needed to provide SAT Duel, comply with legal obligations, resolve disputes, enforce agreements, maintain security, and support legitimate business needs.',
                    'We use reasonable administrative, technical, and organizational safeguards to protect information. No online service can guarantee perfect security.',
                ],
            },
            {
                title: '9. International users',
                body: [
                    'SAT Duel is operated from the United States. If you use SAT Duel from another country, your information may be processed in the United States or other countries where our service providers operate.',
                ],
            },
            {
                title: '10. Changes',
                body: [
                    'We may update this Privacy Policy. If changes are material, we will take reasonable steps to notify users or post an updated notice.',
                ],
            },
            {
                title: '11. Contact',
                body: [`Privacy requests and questions can be sent to ${CONTACT}.`],
            },
        ],
    },
    refunds: {
        title: 'Refund and Cancellation Policy',
        description: 'How SAT Duel handles Premium cancellations and refund requests.',
        path: '/refund-policy',
        sections: [
            {
                title: '1. Free plan',
                body: [
                    'SAT Duel may offer a free plan with limited features. No payment is required to use free features.',
                ],
            },
            {
                title: '2. Premium subscriptions',
                body: [
                    'Premium subscriptions unlock paid features such as unlimited practice or topic selection, depending on the plan shown at checkout.',
                    'Subscriptions may renew automatically unless cancelled before the renewal date.',
                ],
            },
            {
                title: '3. Cancellation',
                body: [
                    'You can cancel a subscription through the billing portal when available, or by contacting us.',
                    'Cancellation stops future renewal charges. Unless required by law or stated otherwise at checkout, cancellation does not automatically refund the current billing period.',
                ],
            },
            {
                title: '4. Refunds',
                body: [
                    'Refund requests are reviewed case by case.',
                    'We generally do not provide partial-month or unused-time refunds after a subscription period begins, except where required by law or where we determine that a billing error, duplicate charge, or service access issue occurred.',
                    'If you believe there was a billing mistake, contact us promptly with the account email and a description of the issue.',
                ],
            },
            {
                title: '5. Promotions',
                body: [
                    'Promotional prices, free trials, coupons, or special access offers may have additional terms shown at checkout or in the offer.',
                ],
            },
            {
                title: '6. Contact',
                body: [`Billing and refund questions can be sent to ${CONTACT}.`],
            },
        ],
    },
};

const NAV = [
    {slug: 'terms', label: 'Terms'},
    {slug: 'privacy', label: 'Privacy'},
    {slug: 'refunds', label: 'Refunds'},
];

function LegalPage({kind}) {
    const params = useParams();
    const slug = kind || params.kind;
    const doc = DOCS[slug];

    if (!doc) return <Navigate to="/terms" replace/>;

    return (
        <div className="py-10 sm:py-14">
            <SEO
                title={doc.title}
                description={doc.description}
                path={doc.path}
                structuredData={[
                    organizationJsonLd(),
                    breadcrumbJsonLd([
                        {name: 'Home', path: '/'},
                        {name: doc.title, path: doc.path},
                    ]),
                ]}
            />
            <PageContainer className="max-w-5xl">
                <div className="mb-8">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        {slug === 'privacy' ? <ShieldCheck className="size-5"/> : <FileText className="size-5"/>}
                    </div>
                    <p className="m-0 text-xs font-black uppercase text-[var(--sd-dim)]">Legal</p>
                    <h1 className="m-0 mt-2 font-display text-3xl font-black text-[var(--sd-text)] sm:text-4xl">
                        {doc.title}
                    </h1>
                    <p className="m-0 mt-2 text-sm font-semibold text-[var(--sd-dim)]">Last updated: {UPDATED}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
                    <nav className="h-fit rounded-2xl border border-slate-200 bg-white p-2">
                        {NAV.map((item) => (
                            <Link
                                key={item.slug}
                                to={DOCS[item.slug].path}
                                className={[
                                    'block rounded-xl px-3 py-2 text-sm font-bold no-underline transition-colors',
                                    item.slug === slug
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                                ].join(' ')}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                        <p className="m-0 border-b border-slate-100 pb-5 text-[15px] leading-7 text-slate-600">
                            This page is a practical website policy for SAT Duel. It is not legal advice.
                        </p>
                        <div className="mt-6 space-y-7">
                            {doc.sections.map((section) => (
                                <section key={section.title}>
                                    <h2 className="m-0 text-lg font-black text-slate-950">{section.title}</h2>
                                    <div className="mt-3 space-y-3">
                                        {section.body.map((paragraph) => (
                                            <p key={paragraph} className="m-0 text-[15px] leading-7 text-slate-600">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </article>
                </div>
            </PageContainer>
        </div>
    );
}

export default LegalPage;
