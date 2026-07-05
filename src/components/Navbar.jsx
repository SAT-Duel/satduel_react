import React, {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {Menu, X, ChevronDown, User, LogOut, Settings} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import logo from '../assets/logo192.png';

const NAV_LINKS = [
    {label: 'Practice', to: '/trainer'},
    {label: 'Duel', to: '/match'},
    {label: 'Tournaments', to: '/tournaments'},
    {label: 'Practice Test', to: '/practice_test'},
    {label: 'Pricing', to: '/pricing'},
];

const navLinkClass = ({isActive}) =>
    [
        'rounded-xl px-3.5 py-2 text-[15px] font-semibold no-underline transition-colors',
        isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

const Navbar = () => {
    const {user, logout, loading} = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const close = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const handleLogout = async () => {
        setUserMenuOpen(false);
        setMobileOpen(false);
        await logout();
        navigate('/login');
    };

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
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen((o) => !o)}
                                className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2 text-[15px] font-semibold text-slate-700 transition-colors hover:border-primary-300"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                                    {user.username?.[0]?.toUpperCase() || <User className="size-3.5"/>}
                                </span>
                                {user.username}
                                <ChevronDown className="size-4 text-slate-400"/>
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                    <Link
                                        to="/profile"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
                                    >
                                        <User className="size-4"/> Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
                                    >
                                        <Settings className="size-4"/> Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="size-4"/> Log out
                                    </button>
                                </div>
                            )}
                        </div>
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
                            <div className="flex flex-col gap-1">
                                <NavLink to="/profile" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                                    Profile ({user.username})
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer rounded-xl px-3.5 py-2 text-left text-[15px] font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                    Log out
                                </button>
                            </div>
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
