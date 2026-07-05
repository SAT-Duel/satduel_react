import React, {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Menu, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import logo from '../assets/logo192.png';

// Marketing top nav (logged-out visitors). The learning experience lives in
// the sidebar app shell, so those links are intentionally not here.
const NAV_LINKS = [
    {label: 'Pricing', to: '/pricing'},
    {label: 'About', to: '/about'},
];

const navLinkClass = ({isActive}) =>
    [
        'rounded-xl px-3.5 py-2 text-[15px] font-semibold no-underline transition-colors',
        isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

const Navbar = () => {
    const {user, loading} = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <img src={logo} alt="SAT Duel logo" className="size-9"/>
                    <span className="font-display text-lg font-bold text-slate-900">
                        SAT<span className="text-primary-600">Duel</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((l) => (
                        <NavLink key={l.to} to={l.to} className={navLinkClass}>
                            {l.label}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop auth area */}
                <div className="hidden items-center gap-2 md:flex">
                    {!loading && user ? (
                        <Link
                            to="/trainer"
                            className="rounded-xl bg-primary-600 px-4 py-2 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-primary-500"
                        >
                            Go to app
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2 text-[15px] font-semibold text-slate-600 no-underline transition-colors hover:bg-slate-100"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-xl bg-primary-600 px-4 py-2 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-primary-500"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="size-6"/> : <Menu className="size-6"/>}
                </button>
            </nav>

            {/* Mobile panel */}
            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                className={navLinkClass}
                                onClick={() => setMobileOpen(false)}
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                        {!loading && user ? (
                            <Link
                                to="/trainer"
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl bg-primary-600 px-4 py-2.5 text-center text-[15px] font-semibold text-white no-underline"
                            >
                                Go to app
                            </Link>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-center text-[15px] font-semibold text-slate-700 no-underline"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-center text-[15px] font-semibold text-white no-underline"
                                >
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
