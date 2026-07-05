import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, BookOpenCheck, LineChart, Swords} from 'lucide-react';
import {Button, PageContainer} from './ui';
import logo from '../assets/logo192.png';

const FOOTER_GROUPS = [
    {
        title: 'Practice',
        links: [
            {label: 'Daily practice', to: '/trainer'},
            {label: 'Mini diagnostic', to: '/diagnostic'},
            {label: 'Practice tests', to: '/practice_test'},
        ],
    },
    {
        title: 'Compete',
        links: [
            {label: 'Duels', to: '/match'},
            {label: 'Tournaments', to: '/tournaments'},
            {label: 'Rankings', to: '/ranking'},
        ],
    },
    {
        title: 'Account',
        links: [
            {label: 'Profile', to: '/profile'},
            {label: 'Classes', to: '/classes'},
            {label: 'About', to: '/about'},
        ],
    },
];

const FooterLink = ({to, children}) => (
    <Link to={to} className="text-sm font-medium text-slate-500 no-underline transition-colors hover:text-primary-600">
        {children}
    </Link>
);

const SATFooter = () => (
    <footer className="border-t border-slate-200 bg-white">
        <PageContainer className="py-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 no-underline">
                        <img src={logo} alt="SAT Duel logo" className="size-9"/>
                        <span className="font-display text-lg font-bold text-slate-900">
                            SAT<span className="text-primary-600">Duel</span>
                        </span>
                    </Link>
                    <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-600">
                        Short adaptive SAT practice, live competition, and progress tracking built around real questions.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                            <BookOpenCheck className="size-3.5"/> 1,800+ questions
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                            <Swords className="size-3.5"/> Duels
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                            <LineChart className="size-3.5"/> Progress
                        </span>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-3">
                    {FOOTER_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h2 className="m-0 text-sm font-bold text-slate-900">{group.title}</h2>
                            <div className="mt-3 flex flex-col gap-2.5">
                                {group.links.map((link) => (
                                    <FooterLink key={link.to} to={link.to}>
                                        {link.label}
                                    </FooterLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 text-sm text-slate-400">
                    © {new Date().getFullYear()} SAT Duel. Built for focused SAT practice.
                </p>
                <Button to="/diagnostic" variant="secondary" size="sm">
                    Start diagnostic <ArrowRight className="size-4"/>
                </Button>
            </div>
        </PageContainer>
    </footer>
);

export default SATFooter;
