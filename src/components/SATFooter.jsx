import React from 'react';
import {Link} from 'react-router-dom';
import {PageContainer} from './ui';
import {DiscordCTA} from './Discord';
import logo from '../assets/logo192.png';

const LINKS = [
    {label: 'Digital SAT Practice', to: '/digital-sat-practice'},
    {label: 'SAT Math', to: '/sat-math-practice'},
    {label: 'Reading & Writing', to: '/sat-reading-and-writing-practice'},
    {label: 'Score Guide', to: '/digital-sat-score-guide'},
    {label: 'Pricing', to: '/pricing'},
    {label: 'About', to: '/about'},
    {label: 'Terms', to: '/terms'},
    {label: 'Privacy', to: '/privacy'},
    {label: 'Refunds', to: '/refund-policy'},
];

const SATFooter = () => (
    <footer className="border-t border-slate-200 bg-white">
        <PageContainer className="flex flex-col items-center gap-5 py-6 md:flex-row md:justify-between md:gap-4">
            <div className="flex items-center gap-2">
                <img src={logo} alt="SAT Duel logo" className="size-7"/>
                <span className="font-display text-base font-bold text-slate-900">
                    SAT<span className="text-primary-600">Duel</span>
                </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {LINKS.map((l) => (
                    <Link
                        key={l.to}
                        to={l.to}
                        className="text-sm font-medium text-slate-500 no-underline transition-colors hover:text-primary-600"
                    >
                        {l.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <DiscordCTA className="!py-1.5 !text-sm"/>
                <p className="m-0 hidden text-sm text-slate-400 lg:block">
                    © {new Date().getFullYear()} SAT Duel
                </p>
            </div>
        </PageContainer>
    </footer>
);

export default SATFooter;
