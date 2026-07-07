import React, {useEffect, useState} from 'react';
import {Navigate, NavLink, Outlet, useNavigate} from 'react-router-dom';
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
    Menu,
    X,
} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import {DISCORD_INVITE, DiscordIcon} from '../components/Discord';
import {Spinner} from '../components/ui';
import logo from '../assets/logo192.png';

// The learning experience lives behind these. Order = importance.
const NAV_ITEMS = [
    {label: 'Home', to: '/trainer', icon: Home},
    {label: 'Practice', to: '/infinite_questions', icon: Zap},
    {label: 'Study Guide', to: '/study_guides', icon: BookOpenCheck},
    {label: 'Duel', to: '/match', icon: Swords},
    {label: 'Tournaments', to: '/tournaments', icon: Trophy},
    {label: 'Practice Test', to: '/practice_test', icon: ClipboardList},
    {label: 'Leaderboard', to: '/ranking', icon: Medal},
];

// Items shown in the mobile bottom bar (a focused subset).
const MOBILE_ITEMS = [
    {label: 'Home', to: '/trainer', icon: Home},
    {label: 'Practice', to: '/infinite_questions', icon: Zap},
    {label: 'Duel', to: '/match', icon: Swords},
    {label: 'Tournaments', to: '/tournaments', icon: Trophy},
];

const sidebarLinkClass = ({isActive}) =>
    [
        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-semibold no-underline transition-colors',
        isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

function ProfileFooter({user, onLogout, onNavigate}) {
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

            <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex items-center gap-2.5 rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/5 px-3 py-2.5 text-sm font-bold text-slate-800 no-underline transition-colors hover:bg-[#5865F2]/10"
            >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5865F2] text-white">
                    <DiscordIcon className="size-4"/>
                </span>
                <span className="min-w-0">
                    <span className="block truncate">Join the community</span>
                    <span className="block truncate text-xs font-semibold text-slate-500">Find help and duel partners</span>
                </span>
            </a>

            <NavLink
                to="/profile"
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-xl px-2 py-2 no-underline transition-colors hover:bg-slate-100"
            >
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
    const [drawerOpen, setDrawerOpen] = useState(false);

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
        return <Navigate to="/login" replace/>;
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
                        <Icon className="size-5"/> {label}
                    </NavLink>
                ))}
            </nav>

            <ProfileFooter user={user} onLogout={handleLogout} onNavigate={closeDrawer}/>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-slate-200 bg-white lg:block">
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
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="size-6"/>
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
            <div className="lg:pl-60">
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
                            'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold no-underline transition-colors',
                            isActive ? 'text-primary-600' : 'text-slate-400',
                        ].join(' ')
                    }
                >
                    <UserAvatar
                        backgroundId={user?.avatar}
                        iconId={user?.avatar_icon}
                        profile={{username: user?.username}}
                        size="xs"
                        className="ring-0 !size-5"
                    />
                    Profile
                </NavLink>
            </nav>
        </div>
    );
};

export default AppLayout;
