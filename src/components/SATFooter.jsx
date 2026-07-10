import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo192.png';
import {DISCORD_INVITE} from './Discord';

// Shared public footer (landing + marketing pages). Lives inside the
// .sd-landing theme scope, so it follows the dark/light toggle.
const COLUMNS = [
    {
        title: 'Product',
        links: [
            {label: 'Practice', href: '/#journey'},
            {label: 'Duel Mode', href: '/#multiplayer'},
            {label: 'Tournaments', href: '/#tournaments'},
            {label: 'Study Guides', href: '/#guides'},
            {label: 'Pricing', to: '/pricing'},
        ],
    },
    {
        title: 'Free tools',
        links: [
            {label: '2-Minute Diagnostic', to: '/diagnostic'},
            {label: 'Digital SAT Practice', to: '/digital-sat-practice'},
            {label: 'SAT Math', to: '/sat-math-practice'},
            {label: 'Reading & Writing', to: '/sat-reading-and-writing-practice'},
            {label: 'Words in Context', to: '/sat-vocabulary-words-in-context'},
            {label: 'Score Guide', to: '/digital-sat-score-guide'},
        ],
    },
    {
        title: 'Company',
        links: [
            {label: 'About', to: '/about'},
            {label: 'Contact', to: '/about#contact-us'},
            {label: 'Discord', href: DISCORD_INVITE, external: true},
        ],
    },
    {
        title: 'Legal',
        links: [
            {label: 'Terms', to: '/terms'},
            {label: 'Privacy', to: '/privacy'},
            {label: 'Refund Policy', to: '/refund-policy'},
        ],
    },
];

const linkCls = 'text-[13px] text-[var(--sd-dim)] no-underline transition-colors hover:text-[#A78BFA]';

function FooterLink({link}) {
    if (link.to) return <Link to={link.to} className={linkCls}>{link.label}</Link>;
    return (
        <a
            href={link.href}
            className={linkCls}
            {...(link.external ? {target: '_blank', rel: 'noreferrer'} : {})}
        >
            {link.label}
        </a>
    );
}

const SATFooter = () => (
    <footer className="border-t border-[var(--sd-line)] bg-[var(--sd-bg)]">
        <div className="mx-auto max-w-[1260px] px-5 pb-8 pt-12 sm:px-10">
            <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
                <div>
                    <div className="flex items-center gap-2.5">
                        <img src={logo} alt="" className="size-8"/>
                        <span className="sd-display text-base font-bold text-[var(--sd-text)]">SAT Duel</span>
                    </div>
                    <p className="m-0 mt-3 max-w-[220px] text-[13px] leading-relaxed text-[var(--sd-dim)]">
                        Digital SAT practice with duels, tournaments, and a rating that moves every round.
                    </p>
                </div>
                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <span className="sd-mono text-[10.5px] font-bold tracking-[0.1em] text-[var(--sd-mut2)]">
                            {col.title.toUpperCase()}
                        </span>
                        <div className="mt-3 flex flex-col gap-2">
                            {col.links.map((l) => <FooterLink key={l.label} link={l}/>)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[var(--sd-line)] pt-5 sm:flex-row">
                <span className="sd-mono text-[11.5px] font-medium text-[var(--sd-dim)]">
                    © {new Date().getFullYear()} SAT Duel
                </span>
                <span className="sd-mono text-[11.5px] font-medium text-[var(--sd-dim)]">
                    Built for Digital SAT students who hate boring practice.
                </span>
            </div>
        </div>
    </footer>
);

export default SATFooter;
