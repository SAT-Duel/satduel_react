import React, {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Menu, Moon, Sun, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import logo from '../assets/logo192.png';

// Public top nav, shared by the landing page and all marketing pages.
// Hash links point at landing sections; plain <a> so they work from any page.
const NAV_LINKS = [
    {label: 'Practice', href: '/#journey'},
    {label: 'Duel Mode', href: '/#multiplayer'},
    {label: 'Study Guides', href: '/#guides'},
    {label: 'Pricing', to: '/pricing'},
    {label: 'About', to: '/about'},
];

const linkCls = 'text-[14.5px] font-semibold text-[var(--sd-mut2)] no-underline transition-colors hover:text-[var(--sd-text)]';
const activeLinkCls = ({isActive}) => `${linkCls} ${isActive ? 'text-[var(--sd-text)]' : ''}`;

function NavItems({className, onClick}) {
    return NAV_LINKS.map((l) => l.to ? (
        <NavLink key={l.label} to={l.to} className={({isActive}) => `${activeLinkCls({isActive})} ${className}`} onClick={onClick}>
            {l.label}
        </NavLink>
    ) : (
        <a key={l.label} href={l.href} className={`${linkCls} ${className}`} onClick={onClick}>
            {l.label}
        </a>
    ));
}

const Navbar = ({theme, onToggleTheme}) => {
    const {user, loading} = useAuth();
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--sd-line)] bg-[var(--sd-nav)] backdrop-blur-xl">
            <nav className="mx-auto flex h-16 max-w-[1260px] items-center justify-between gap-6 px-5 sm:px-10">
                <Link to="/" className="flex items-center gap-2.5 no-underline">
                    <img src={logo} alt="SAT Duel logo" className="size-9"/>
                    <span className="sd-display text-[19px] font-bold tracking-[-0.02em] text-[var(--sd-text)]">SAT Duel</span>
                </Link>

                <div className="hidden items-center gap-7 lg:flex">
                    <NavItems className=""/>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleTheme}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--sd-line2)] bg-transparent text-[var(--sd-mut2)] transition-colors hover:text-[var(--sd-text)]"
                    >
                        {theme === 'dark' ? <Sun className="size-4"/> : <Moon className="size-4"/>}
                    </button>
                    {!loading && user ? (
                        <Link
                            to="/trainer"
                            className="hidden rounded-[10px] bg-[#7C5CF0] px-5 py-2.5 text-[14.5px] font-bold text-white no-underline shadow-[0_4px_14px_rgba(124,92,240,0.35)] transition-colors hover:bg-[#9678FF] sm:block"
                        >
                            Go to app
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="hidden px-3.5 py-2 text-[14.5px] font-semibold text-[var(--sd-body)] no-underline sm:block">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="hidden rounded-[10px] bg-[#7C5CF0] px-5 py-2.5 text-[14.5px] font-bold text-white no-underline shadow-[0_4px_14px_rgba(124,92,240,0.35)] transition-colors hover:bg-[#9678FF] sm:block"
                            >
                                Start Free
                            </Link>
                        </>
                    )}
                    <button
                        className="flex cursor-pointer items-center justify-center rounded-xl border border-[var(--sd-line2)] bg-transparent p-2 text-[var(--sd-mut2)] lg:hidden"
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="size-5"/> : <Menu className="size-5"/>}
                    </button>
                </div>
            </nav>

            {open && (
                <div className="border-t border-[var(--sd-line)] px-5 pb-4 pt-2 lg:hidden">
                    <div className="flex flex-col gap-1">
                        <NavItems className="rounded-lg px-2 py-2 text-[15px]" onClick={close}/>
                    </div>
                    <div className="mt-3 flex gap-2 border-t border-[var(--sd-line)] pt-3">
                        {!loading && user ? (
                            <Link to="/trainer" onClick={close} className="flex-1 rounded-xl bg-[#7C5CF0] px-4 py-2.5 text-center text-[15px] font-bold text-white no-underline">
                                Go to app
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={close} className="flex-1 rounded-xl border border-[var(--sd-line2)] px-4 py-2.5 text-center text-[15px] font-semibold text-[var(--sd-body)] no-underline">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={close} className="flex-1 rounded-xl bg-[#7C5CF0] px-4 py-2.5 text-center text-[15px] font-bold text-white no-underline">
                                    Start Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
