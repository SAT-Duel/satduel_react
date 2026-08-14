import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Navigate, NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {
    Home,
    Zap,
    Swords,
    Trophy,
    ClipboardList,
    BookOpenCheck,
    Medal,
    Settings,
    LogOut,
    Crown,
    Gift,
    Menu,
    PartyPopper,
    X,
} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import {DISCORD_INVITE, DiscordIcon} from '../components/Discord';
import {Spinner} from '../components/ui';
import useUnreadMessages from '../hooks/useUnreadMessages';
import logo from '../assets/logo192.png';
import {loginPathFor} from '../utils/authRedirect';
import AnnouncementBanner from '../components/AnnouncementBanner';
import {DISCORD_PROMO_EVENT, dismissDiscordPromo, shouldShowDiscordPromo} from '../utils/discordPromo';

// Routes where the sidebar may be collapsed for a wider question. Scoped on
// purpose: with the sidebar hidden the toggle is the only way back to the nav,
// so pages that opt in must render <NavCollapseButton/>.
const NAV_COLLAPSIBLE_ROUTES = ['/infinite_questions'];

const NAV_HIDDEN_KEY = 'sd:nav-hidden';

const NavCollapseContext = createContext(null);

function readNavHidden() {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(NAV_HIDDEN_KEY) === 'true';
    } catch {
        // Private-mode Safari and friends: fall back to the nav being shown.
        return false;
    }
}

/**
 * Sidebar collapse state, shared between AppLayout and the page that owns the
 * toggle. `canCollapse` is false off a collapsible route, so `hidden` there is
 * remembered but not applied.
 */
export function useNavCollapse() {
    return useContext(NavCollapseContext) ?? {hidden: false, canCollapse: false, toggle: () => {}};
}

// The learning experience lives behind these. Order = importance.
const NAV_ITEMS = [
    {label: 'Home', to: '/trainer', icon: Home},
    {label: 'Practice', to: '/infinite_questions', icon: Zap},
    {label: 'Study Guide', to: '/study_guides', icon: BookOpenCheck},
    {label: 'Duel', to: '/match', icon: Swords},
    {label: 'Party', to: '/party', icon: PartyPopper},
    {label: 'Tournaments', to: '/tournaments', icon: Trophy},
    {label: 'Practice Test', to: '/practice_test', icon: ClipboardList},
    {label: 'Leaderboard', to: '/ranking', icon: Medal},
];

// Items shown in the mobile bottom bar (a focused subset).
const MOBILE_ITEMS = [
    {label: 'Home', to: '/trainer', icon: Home},
    {label: 'Practice', to: '/infinite_questions', icon: Zap},
    {label: 'Duel', to: '/match', icon: Swords},
    {label: 'Party', to: '/party', icon: PartyPopper},
    {label: 'Tournaments', to: '/tournaments', icon: Trophy},
];

const sidebarLinkClass = ({isActive}) =>
    [
        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-semibold no-underline transition-colors',
        isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

function ProfileFooter({user, onLogout, onNavigate, onDiscordJoin, hasNotifications}) {
    return (
        <div className="border-t border-slate-100 p-3">
            {!user?.is_premium ? (
                <NavLink
                    to="/upgrade"
                    onClick={onNavigate}
                    className="mb-3 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 px-3.5 py-2.5 no-underline transition-colors hover:from-amber-100 hover:to-amber-100"
                >
                    <Crown className="size-5 text-amber-500"/>
                    <span className="text-sm font-bold text-amber-900">Upgrade to Premium</span>
                </NavLink>
            ) : (
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 px-3.5 py-2.5">
                    <Crown className="size-5 text-primary-600"/>
                    <span className="text-sm font-bold text-primary-800">Premium member</span>
                </div>
            )}

            <div>
                <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onDiscordJoin}
                    className="mb-2 flex items-center gap-2.5 rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/5 px-3 py-2.5 text-sm font-bold text-slate-800 no-underline transition-colors hover:bg-[#5865F2]/10"
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5865F2] text-white">
                        <DiscordIcon className="size-4"/>
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate">Join the community</span>
                        <span className="block truncate text-xs font-semibold text-slate-500">
                            {user?.is_premium ? 'Find help and duel partners' : '1 month Premium free'}
                        </span>
                    </span>
                </a>
            </div>

            <NavLink
                to="/profile"
                onClick={onNavigate}
                className="relative flex items-center gap-3 rounded-xl px-2 py-2 no-underline transition-colors hover:bg-slate-100"
            >
                {hasNotifications && (
                    <span className="absolute right-2 top-2 size-2.5 rounded-full bg-rose-500 ring-2 ring-white" aria-label="New friend activity"/>
                )}
                <UserAvatar
                    backgroundId={user?.avatar}
                    iconId={user?.avatar_icon}
                    profile={{username: user?.username}}
                    size="sm"
                    className="ring-2"
                />
                <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-bold text-slate-900">{user?.username}</p>
                    <p className="m-0 text-xs text-slate-400">View profile</p>
                </div>
            </NavLink>

            <div className="mt-1 flex gap-1">
                <NavLink
                    to="/settings"
                    onClick={onNavigate}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 no-underline transition-colors hover:bg-slate-100 hover:text-slate-800"
                >
                    <Settings className="size-4"/> Settings
                </NavLink>
                <button
                    onClick={onLogout}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
                >
                    <LogOut className="size-4"/> Log out
                </button>
            </div>
        </div>
    );
}

const AppLayout = () => {
    const {user, loading, logout, refreshUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(readNavHidden);
    const [showDiscordPromo, setShowDiscordPromo] = useState(false);
    const discordDialogRef = useRef(null);
    const discordCloseRef = useRef(null);
    const previousFocusRef = useRef(null);
    const {unreadCount, friendRequestCount} = useUnreadMessages(Boolean(user));
    const hasNotifications = unreadCount + friendRequestCount > 0;

    const canCollapse = NAV_COLLAPSIBLE_ROUTES.includes(location.pathname);
    const navCollapsed = navHidden && canCollapse;

    const toggleNav = useCallback(() => {
        setNavHidden((hidden) => {
            const next = !hidden;
            try {
                window.localStorage.setItem(NAV_HIDDEN_KEY, String(next));
            } catch {
                // Preference just won't survive the session; not worth failing the click.
            }
            return next;
        });
    }, []);

    const navCollapse = useMemo(
        () => ({hidden: navCollapsed, canCollapse, toggle: toggleNav}),
        [navCollapsed, canCollapse, toggleNav]
    );

    const handleDismissDiscordPromo = useCallback(() => {
        dismissDiscordPromo(user?.id);
        setShowDiscordPromo(false);
        window.setTimeout(() => previousFocusRef.current?.focus?.(), 0);
    }, [user?.id]);

    useEffect(() => {
        const handleEligibility = () => {
            if (!user || user.is_premium || !shouldShowDiscordPromo(user.id)) return;
            previousFocusRef.current = document.activeElement;
            setShowDiscordPromo(true);
        };

        window.addEventListener(DISCORD_PROMO_EVENT, handleEligibility);
        return () => window.removeEventListener(DISCORD_PROMO_EVENT, handleEligibility);
    }, [user?.id, user?.is_premium]);

    useEffect(() => {
        if (!showDiscordPromo) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        discordCloseRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleDismissDiscordPromo();
                return;
            }
            if (event.key !== 'Tab') return;

            const focusable = [...(discordDialogRef.current?.querySelectorAll('a[href], button:not([disabled])') || [])];
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleDismissDiscordPromo, showDiscordPromo]);

    useEffect(() => {
        if (!user) return undefined;

        let active = true;
        const syncUser = () => {
            if (!active) return;
            refreshUser().catch(() => {
                // Keep navigation usable if a background entitlement refresh fails.
            });
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncUser();
            }
        };

        syncUser();
        window.addEventListener('focus', syncUser);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            active = false;
            window.removeEventListener('focus', syncUser);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refreshUser, user?.id]);

    // Auth gate for the whole learning experience.
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Spinner/>
            </div>
        );
    }
    if (!user) {
        return <Navigate to={loginPathFor(`${location.pathname}${location.search}${location.hash}`)} replace/>;
    }

    const handleLogout = async () => {
        setDrawerOpen(false);
        await logout();
        navigate('/login');
    };

    const closeDrawer = () => setDrawerOpen(false);

    const SidebarContent = (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-5">
                <NavLink to="/trainer" onClick={closeDrawer} className="flex items-center gap-2 no-underline">
                    <img src={logo} alt="SAT Duel" className="size-8"/>
                    <span className="font-display text-lg font-bold text-slate-900">
                        SAT<span className="text-primary-600">Duel</span>
                    </span>
                </NavLink>
                <button
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                    onClick={closeDrawer}
                    aria-label="Close menu"
                >
                    <X className="size-5"/>
                </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                {NAV_ITEMS.map(({label, to, icon: Icon}) => (
                    <NavLink key={to} to={to} onClick={closeDrawer} className={sidebarLinkClass} end={to === '/trainer'}>
                        <Icon className="size-5"/>
                        <span className="flex-1">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <ProfileFooter
                user={user}
                onLogout={handleLogout}
                onNavigate={closeDrawer}
                onDiscordJoin={handleDismissDiscordPromo}
                hasNotifications={hasNotifications}
            />
        </div>
    );

    return (
        <NavCollapseContext.Provider value={navCollapse}>
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>SAT Duel</title>
            </Helmet>
            {/* Desktop sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-slate-200 bg-white ${
                    navCollapsed ? '' : 'lg:block'
                }`}
            >
                {SidebarContent}
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
                <NavLink to="/trainer" className="flex items-center gap-2 no-underline">
                    <img src={logo} alt="SAT Duel" className="size-7"/>
                    <span className="font-display text-base font-bold text-slate-900">
                        SAT<span className="text-primary-600">Duel</span>
                    </span>
                </NavLink>
                <button
                    className="relative rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
                    onClick={() => setDrawerOpen(true)}
                    aria-label={hasNotifications ? 'Open menu, new friend activity' : 'Open menu'}
                >
                    <Menu className="size-6"/>
                    {hasNotifications && (
                        <span className="absolute right-1 top-1 size-2.5 rounded-full bg-rose-500 ring-2 ring-white"/>
                    )}
                </button>
            </header>

            {/* Mobile drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={closeDrawer}/>
                    <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
                        {SidebarContent}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className={navCollapsed ? '' : 'lg:pl-60'}>
                <AnnouncementBanner userId={user.id}/>
                <main className="pb-20 lg:pb-0">
                    <Outlet/>
                </main>
            </div>

            {/* Mobile bottom tab bar */}
            <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white lg:hidden">
                {MOBILE_ITEMS.map(({label, to, icon: Icon}) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/trainer'}
                        className={({isActive}) =>
                            [
                                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold no-underline transition-colors',
                                isActive ? 'text-primary-600' : 'text-slate-400',
                            ].join(' ')
                        }
                    >
                        <Icon className="size-5"/> {label}
                    </NavLink>
                ))}
                <NavLink
                    to="/profile"
                    className={({isActive}) =>
                        [
                            'relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold no-underline transition-colors',
                            isActive ? 'text-primary-600' : 'text-slate-400',
                        ].join(' ')
                    }
                >
                    <span className="relative">
                        <UserAvatar
                            backgroundId={user?.avatar}
                            iconId={user?.avatar_icon}
                            profile={{username: user?.username}}
                            size="xs"
                            className="ring-0 !size-5"
                        />
                        {hasNotifications && (
                            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-rose-500 ring-2 ring-white" aria-label="New friend activity"/>
                        )}
                    </span>
                    Profile
                </NavLink>
            </nav>

            {showDiscordPromo && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-[2px]"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) handleDismissDiscordPromo();
                    }}
                >
                    <section
                        ref={discordDialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="discord-promo-title"
                        aria-describedby="discord-promo-description"
                        className="sd-up w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.34)]"
                    >
                        <div className="sat-score-strip flex items-center justify-between gap-3 px-5 py-3">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-800">
                                <Gift className="size-4"/> 3 practice questions complete
                            </span>
                            <button
                                ref={discordCloseRef}
                                type="button"
                                onClick={handleDismissDiscordPromo}
                                aria-label="Dismiss Discord offer"
                                className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/70 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                <X className="size-5"/>
                            </button>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="flex items-start gap-4">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#5865F2] text-white shadow-[0_10px_24px_rgba(88,101,242,0.28)]">
                                    <DiscordIcon className="size-6"/>
                                </span>
                                <div>
                                    <h2 id="discord-promo-title" className="m-0 font-display text-[2rem] font-black leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-4xl">
                                        One month of Premium, free
                                    </h2>
                                    <p id="discord-promo-description" className="m-0 mt-3 text-sm leading-5 text-slate-600">
                                        Join the SAT Duel Discord and claim the promotion code posted in the community.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={handleDismissDiscordPromo}
                                    className="min-h-11 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                >
                                    Maybe later
                                </button>
                                <a
                                    href={DISCORD_INVITE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleDismissDiscordPromo}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2.5 text-sm font-bold text-white no-underline shadow-[0_10px_24px_rgba(88,101,242,0.24)] transition-colors hover:bg-[#4f5bd5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5865F2]"
                                >
                                    <DiscordIcon className="size-4"/> Join Discord &amp; claim it
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
        </NavCollapseContext.Provider>
    );
};

export default AppLayout;
