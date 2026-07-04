import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo192.png';

const FooterLink = ({to, children}) => (
    <Link to={to} className="text-sm text-slate-500 no-underline transition-colors hover:text-primary-600">
        {children}
    </Link>
);

const SATFooter = () => (
    <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row">
            <div className="flex items-center gap-2">
                <img src={logo} alt="SAT Duel logo" className="size-7"/>
                <span className="font-display text-base font-bold text-slate-900">
                    SAT<span className="text-primary-600">Duel</span>
                </span>
            </div>
            <div className="flex items-center gap-6">
                <FooterLink to="/about">About</FooterLink>
                <FooterLink to="/trainer">Practice</FooterLink>
                <FooterLink to="/tournaments">Tournaments</FooterLink>
            </div>
            <p className="m-0 text-sm text-slate-400">
                © {new Date().getFullYear()} SAT Duel
            </p>
        </div>
    </footer>
);

export default SATFooter;
