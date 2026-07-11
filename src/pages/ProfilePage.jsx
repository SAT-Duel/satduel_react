import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
    Award,
    CalendarDays,
    Check,
    Clock3,
    Edit3,
    Flame,
    History,
    LineChart,
    Search,
    Swords,
    Target,
    Trophy,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import {Alert, Button, Card, Field, Input, PageContainer, Select, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import UserAvatar from '../components/UserAvatar';
import ResetCountdown from '../components/ResetCountdown';
import {AVATAR_BACKGROUNDS, PIXEL_AVATARS} from '../components/avatarCatalog';

const GRADE_OPTIONS = [
    {value: '<1', label: 'Below Grade 1'},
    ...Array.from({length: 12}, (_, i) => ({value: String(i + 1), label: `Grade ${i + 1}`})),
    {value: '>12', label: 'Above Grade 12'},
];

const TABS = [
    {id: 'overview', label: 'Overview', icon: LineChart},
    {id: 'history', label: 'History', icon: History},
    {id: 'friends', label: 'Friends', icon: Users},
];

function gradeLabel(value) {
    return GRADE_OPTIONS.find((option) => option.value === value)?.label || 'Grade not set';
}

function formatDateTime(value) {
    if (!value) return 'Unknown';
    return new Date(value).toLocaleString();
}

function ProfileStat({icon: Icon, label, value, tone = 'text-primary-700 bg-primary-50'}) {
    return (
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-4"/>
            </div>
            <div>
                <p className="m-0 font-display text-2xl font-black text-slate-950">{value ?? '—'}</p>
                <p className="m-0 text-xs font-bold text-slate-500">{label}</p>
            </div>
        </div>
    );
}

function SubjectAnalysis({label, elo, answered, accuracy, tone}) {
    return (
        <div className="border-t border-slate-100 py-5 first:border-0 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className={`sat-answer-bubble grid size-9 place-items-center rounded-full text-sm font-black ${tone}`}>
                        {label === 'English' ? 'A' : 'B'}
                    </span>
                    <div>
                        <p className="m-0 font-black text-slate-900">{label}</p>
                        <p className="m-0 text-xs font-semibold text-slate-400">Practice performance</p>
                    </div>
                </div>
                <p className="m-0 font-display text-2xl font-black text-slate-950">{elo ?? '—'} <span className="text-xs text-slate-400">Elo</span></p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                    <p className="m-0 text-lg font-black text-slate-900">{answered}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">Questions answered</p>
                </div>
                <div>
                    <p className="m-0 text-lg font-black text-slate-900">{accuracy}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">{label} accuracy</p>
                </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary-500" style={{width: accuracy === '—' ? 0 : accuracy}}/>
            </div>
        </div>
    );
}

function ActivityGrid({activity = []}) {
    if (!activity.length) return <EmptyState title="No practice activity yet" text="Answered practice questions will appear here."/>;
    const firstDay = new Date(`${activity[0].date}T00:00:00`).getDay();
    const total = activity.reduce((sum, day) => sum + day.count, 0);
    const intensity = (count) => {
        if (!count) return 'bg-slate-100';
        if (count <= 2) return 'bg-primary-200';
        if (count <= 5) return 'bg-primary-400';
        if (count <= 10) return 'bg-primary-600';
        return 'bg-primary-800';
    };

    return (
        <>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h2 className="m-0 flex items-center gap-2 text-lg font-black text-slate-900">
                        <CalendarDays className="size-5 text-primary-600"/> Practice activity
                    </h2>
                    <p className="m-0 mt-1 text-sm text-slate-500">{total} questions answered in the last 365 days</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    Less
                    {['bg-slate-100', 'bg-primary-200', 'bg-primary-400', 'bg-primary-600', 'bg-primary-800'].map((color) => (
                        <span key={color} className={`size-3 rounded-[3px] ${color}`}/>
                    ))}
                    More
                </div>
            </div>
            <div className="overflow-x-auto pb-2">
                <div
                    className="grid min-w-[780px] gap-[3px]"
                    style={{gridTemplateRows: 'repeat(7, 0.75rem)', gridAutoColumns: '0.75rem', gridAutoFlow: 'column'}}
                    aria-label="Practice questions answered each day for the last year"
                >
                    {Array.from({length: firstDay}).map((_, index) => <span key={`blank-${index}`}/>) }
                    {activity.map((day) => (
                        <span
                            key={day.date}
                            className={`rounded-[3px] ${intensity(day.count)}`}
                            title={`${day.date}: ${day.count} answered (${day.english} English, ${day.math} Math)`}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function EmptyState({title, text}) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="m-0 font-semibold text-slate-700">{title}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>
        </div>
    );
}

function ProfilePage() {
    const {userId} = useParams();
    const {user: currentUser, token, loading, updateUser} = useAuth();
    const navigate = useNavigate();
    const isOwnProfile = !userId || currentUser?.id?.toString() === userId?.toString();

    const [activeTab, setActiveTab] = useState('overview');
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [practiceStatus, setPracticeStatus] = useState(null);
    const [battleHistory, setBattleHistory] = useState([]);
    const [tournamentHistory, setTournamentHistory] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [formState, setFormState] = useState({
        first_name: '',
        last_name: '',
        biography: '',
        grade: '11',
        country: 'US',
        avatar: 'violet',
        avatar_icon: 'initial',
    });

    const viewerUser = isOwnProfile ? currentUser : profile?.user;
    const totalAnswered = stats?.practice_answered ?? 0;
    const accuracy = stats?.practice_accuracy != null ? `${stats.practice_accuracy}%` : '—';
    const englishAccuracy = stats?.english_accuracy != null ? `${stats.english_accuracy}%` : '—';
    const mathAccuracy = stats?.math_accuracy != null ? `${stats.math_accuracy}%` : '—';
    const daily = practiceStatus?.daily;
    const quota = practiceStatus?.quota;

    const loadFriends = useCallback(async () => {
        if (!isOwnProfile || !token) return;
        const response = await api.get('api/profile/friends/');
        setFriends(response.data);
    }, [isOwnProfile, token]);

    const loadFriendRequests = useCallback(async () => {
        if (!isOwnProfile || !token) return;
        const response = await api.get('api/profile/friend_requests/');
        setFriendRequests(response.data);
    }, [isOwnProfile, token]);

    useEffect(() => {
        if (!loading && !token) {
            navigate('/login');
        }
    }, [loading, navigate, token]);

    useEffect(() => {
        const loadProfile = async () => {
            if (loading || !token) return;
            setPageLoading(true);
            setError('');
            setNotice(null);
            setActiveTab('overview');

            try {
                if (isOwnProfile) {
                    const [profileResponse, statsResponse, statusResponse] = await Promise.all([
                        api.get('api/profile/'),
                        api.get('api/infinite_questions_profile/').catch(() => ({data: null})),
                        api.get('api/practice/status/').catch(() => ({data: null})),
                    ]);
                    setProfile(profileResponse.data);
                    setStats(statsResponse.data);
                    setPracticeStatus(statusResponse.data);
                } else {
                    const response = await api.get(`api/profile/view_profile/${userId}/`);
                    setProfile(response.data.profile);
                    setStats(response.data.statistics);
                    setPracticeStatus(null);
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load this profile.');
            } finally {
                setPageLoading(false);
            }
        };

        loadProfile();
    }, [isOwnProfile, loading, token, userId]);

    useEffect(() => {
        const loadActivity = async () => {
            if (loading || !token) return;
            const matchUrl = isOwnProfile
                ? 'api/match/get_match_history/'
                : `api/match/get_match_history/${userId}/`;
            const tournamentUrl = isOwnProfile
                ? 'api/tournaments/get_history/'
                : `api/tournaments/get_history/${userId}/`;

            const [matches, tournaments] = await Promise.all([
                api.get(matchUrl).catch(() => ({data: []})),
                api.get(tournamentUrl).catch(() => ({data: []})),
            ]);
            setBattleHistory(matches.data);
            setTournamentHistory(tournaments.data);
        };

        loadActivity();
    }, [isOwnProfile, loading, token, userId]);

    useEffect(() => {
        if (!isOwnProfile || loading || !token) return;
        loadFriends().catch(() => setFriends([]));
        loadFriendRequests().catch(() => setFriendRequests([]));
    }, [isOwnProfile, loadFriendRequests, loadFriends, loading, token]);

    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await api.get('api/profile/search/', {params: {q: searchQuery.trim()}});
                setSearchResults(response.data.slice(0, 6));
            } catch {
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const matchRows = useMemo(() => {
        const viewerId = viewerUser?.id?.toString();
        return battleHistory.map((match) => {
            const isUser1 = match.user1?.id?.toString() === viewerId;
            const opponent = isUser1 ? match.user2 : match.user1;
            const ownScore = isUser1 ? match.user1_score : match.user2_score;
            const opponentScore = isUser1 ? match.user2_score : match.user1_score;
            const eloBefore = isUser1 ? match.user1_elo_before : match.user2_elo_before;
            const eloAfter = isUser1 ? match.user1_elo_after : match.user2_elo_after;
            const eloChange = eloBefore == null || eloAfter == null ? null : eloAfter - eloBefore;
            const result = match.winner === null
                ? 'Draw'
                : match.winner?.toString() === (isUser1 ? match.user1?.id : match.user2?.id)?.toString()
                    ? 'Win'
                    : 'Loss';
            return {...match, opponent, ownScore, opponentScore, result, eloAfter, eloChange};
        });
    }, [battleHistory, viewerUser]);

    const openEdit = () => {
        setFormState({
            first_name: profile?.user?.first_name || '',
            last_name: profile?.user?.last_name || '',
            biography: profile?.biography || '',
            grade: profile?.grade || '11',
            country: profile?.country || 'US',
            avatar: profile?.avatar || 'violet',
            avatar_icon: profile?.avatar_icon || 'initial',
        });
        setNotice(null);
        setEditOpen(true);
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await api.patch('api/profile/', {
                biography: formState.biography,
                grade: formState.grade,
                country: formState.country.toUpperCase(),
                avatar: formState.avatar,
                avatar_icon: formState.avatar_icon,
                user: {
                    first_name: formState.first_name,
                    last_name: formState.last_name,
                },
            });
            setProfile(response.data);
            updateUser({
                avatar: response.data.avatar,
                avatar_icon: response.data.avatar_icon,
                is_premium: response.data.is_premium,
                username: response.data.user?.username,
                email: response.data.user?.email,
            });
            setEditOpen(false);
            setNotice({type: 'success', text: 'Profile updated.'});
        } catch (err) {
            setNotice({
                type: 'error',
                text: err.response?.data?.avatar?.[0] || 'Could not update profile.',
            });
        } finally {
            setSaving(false);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await api.post('api/profile/send_friend_request/', {to_user_id: userId});
            setNotice({type: 'success', text: 'Friend request sent.'});
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.detail || 'Could not send friend request.'});
        }
    };

    const respondToFriendRequest = async (requestId, status) => {
        try {
            await api.post(`api/profile/respond_friend_request/${requestId}/`, {status});
            setFriendRequests((requests) => requests.filter((request) => request.id !== requestId));
            await loadFriends();
        } catch {
            setNotice({type: 'error', text: 'Could not update friend request.'});
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading profile…
                    </div>
                </PageContainer>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="max-w-2xl">
                    <Alert>{error}</Alert>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-6 sm:py-8">
            <PageContainer>
                {notice && (
                    <div className="mb-5">
                        <Alert type={notice.type === 'success' ? 'success' : 'error'}>{notice.text}</Alert>
                    </div>
                )}

                <section className="sat-arena-card overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="sat-score-strip h-1 border-0"/>
                    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <UserAvatar profile={profile} size="xl" rounded="xl" className="ring-slate-100"/>
                            <div>
                                <p className="m-0 text-xs font-black uppercase tracking-[0.12em] text-primary-600">
                                    {isOwnProfile ? 'My profile' : 'Student profile'}
                                </p>
                                <h1 className="m-0 mt-1 font-display text-3xl font-black text-slate-950 sm:text-4xl">
                                    {profile?.user?.username}
                                </h1>
                                <p className="m-0 mt-2 text-slate-500">
                                    {[profile?.user?.first_name, profile?.user?.last_name].filter(Boolean).join(' ') || 'Name not set'}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600">
                                        {gradeLabel(profile?.grade)}
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600">
                                        {profile?.country || 'US'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {isOwnProfile ? (
                                <>
                                    <Button to="/practice-history" variant="secondary">
                                        <History className="size-4"/> Practice history
                                    </Button>
                                    <Button to="/my_tournaments" variant="secondary">
                                        <Trophy className="size-4"/> My tournaments
                                    </Button>
                                    <Button onClick={openEdit}>
                                        <Edit3 className="size-4"/> Edit profile
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={sendFriendRequest}>
                                    <UserPlus className="size-4"/> Add friend
                                </Button>
                            )}
                            {currentUser?.is_admin && isOwnProfile && (
                                <Button to="/admin" variant="secondary">
                                    Admin
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="grid divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                        <ProfileStat icon={Swords} label="Duel Elo" value={profile?.elo_rating} tone="bg-rose-50 text-rose-700"/>
                        <ProfileStat icon={LineChart} label="English Practice Elo" value={profile?.sp_elo_rating}/>
                        <ProfileStat icon={LineChart} label="Math Practice Elo" value={profile?.math_elo_rating} tone="bg-sky-50 text-sky-700"/>
                        <ProfileStat icon={Award} label="Overall practice accuracy" value={accuracy} tone="bg-emerald-50 text-emerald-700"/>
                    </div>
                </section>

                <div className="mt-5 overflow-x-auto">
                    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
                        {TABS.map(({id, label, icon: Icon}) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                                    activeTab === id
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <Icon className="size-4"/> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.75fr)]">
                        <Card className="p-6">
                            <h2 className="m-0 flex items-center gap-2 text-lg font-black text-slate-900">
                                <Target className="size-5 text-primary-600"/> Practice analysis
                            </h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">Ratings, volume, and accuracy are separated by SAT section.</p>
                            <div className="mt-5">
                                <SubjectAnalysis
                                    label="English"
                                    elo={profile?.sp_elo_rating}
                                    answered={stats?.english_answered ?? 0}
                                    accuracy={englishAccuracy}
                                    tone="bg-primary-100 text-primary-700"
                                />
                                <SubjectAnalysis
                                    label="Math"
                                    elo={profile?.math_elo_rating}
                                    answered={stats?.math_answered ?? 0}
                                    accuracy={mathAccuracy}
                                    tone="bg-sky-100 text-sky-700"
                                />
                            </div>
                        </Card>

                        <div className="space-y-5">
                            <Card className="p-6">
                                <h2 className="m-0 flex items-center gap-2 text-lg font-black text-slate-900">
                                    <Flame className="size-5 text-amber-500"/> Consistency
                                </h2>
                                <div className="mt-5 flex items-end justify-between border-b border-slate-100 pb-5">
                                    <div>
                                        <p className="m-0 font-display text-4xl font-black text-slate-950">{profile?.max_streak ?? 0}</p>
                                        <p className="m-0 mt-1 text-sm font-bold text-slate-500">Best correct-answer streak</p>
                                    </div>
                                    <Award className="size-8 text-amber-400"/>
                                </div>
                                {isOwnProfile && daily && (
                                    <div className="mt-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="m-0 text-sm font-black text-slate-900">{daily.streak} day practice streak</p>
                                                <p className="m-0 mt-0.5 text-xs font-semibold text-slate-500">
                                                    {daily.completed_today
                                                        ? 'Today’s goal is complete.'
                                                        : `${Math.max(0, daily.goal - daily.count)} more to protect it today.`}
                                                </p>
                                            </div>
                                            <span className="font-display text-xl font-black text-orange-600">{Math.min(daily.count, daily.goal)}/{daily.goal}</span>
                                        </div>
                                        <p className="m-0 mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <Clock3 className="size-3.5"/>
                                            <ResetCountdown target={daily.day_ends_at} label={daily.completed_today ? 'Next day starts' : 'Streak deadline'}/>
                                        </p>
                                        {quota?.limit != null && (
                                            <p className="m-0 mt-2 text-xs font-semibold text-slate-400">
                                                {quota.remaining} free questions left · <ResetCountdown target={quota.reset_at} label="Renews"/>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Card>
                            <Card className="p-6">
                                <h2 className="m-0 text-lg font-black text-slate-900">About</h2>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                                    {profile?.biography || 'This user has not written a bio yet.'}
                                </p>
                            </Card>
                        </div>

                        <Card className="p-6 lg:col-span-2">
                            <ActivityGrid activity={stats?.activity}/>
                            {!totalAnswered && (
                                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    Answer a practice question to start building this activity history.
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <Card className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Swords className="size-5 text-primary-600"/>
                                <h2 className="m-0 text-xl font-bold text-slate-900">Duel history</h2>
                            </div>
                            {matchRows.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px] text-left text-sm">
                                        <thead className="text-xs uppercase text-slate-400">
                                            <tr>
                                                <th className="pb-3">Date</th>
                                                <th className="pb-3">Opponent</th>
                                                <th className="pb-3">Result</th>
                                                <th className="pb-3">Score</th>
                                                <th className="pb-3">Elo change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {matchRows.map((match) => (
                                                <tr key={match.id}>
                                                    <td className="py-3">
                                                        <Link to={`/battle_result/${match.id}`} className="font-semibold text-primary-600 no-underline hover:text-primary-700">
                                                            {formatDateTime(match.created_at)}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 text-slate-700">
                                                        <span className="flex items-center gap-2">
                                                            <UserAvatar profile={match.opponent} size="xs" className="ring-0"/>
                                                            <span>
                                                                <span className="block">{match.opponent?.username || 'Opponent'}</span>
                                                                <span className="block text-xs text-slate-400">
                                                                    {match.opponent?.elo_rating != null ? `${match.opponent.elo_rating} Elo` : '— Elo'}
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                                            match.result === 'Win'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : match.result === 'Loss'
                                                                    ? 'bg-rose-50 text-rose-700'
                                                                    : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {match.result}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 font-semibold text-slate-700">
                                                        {match.ownScore} - {match.opponentScore}
                                                    </td>
                                                    <td className={`py-3 font-black ${
                                                        match.eloChange == null ? 'text-slate-400' : match.eloChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {match.eloChange == null
                                                            ? '—'
                                                            : `${match.eloChange >= 0 ? '+' : ''}${match.eloChange} → ${match.eloAfter}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState title="No duels yet" text="Start a duel to build a match history."/>
                            )}
                        </Card>

                        <Card className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Trophy className="size-5 text-primary-600"/>
                                <h2 className="m-0 text-xl font-bold text-slate-900">Tournament history</h2>
                            </div>
                            {tournamentHistory.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[480px] text-left text-sm">
                                        <thead className="text-xs uppercase text-slate-400">
                                            <tr>
                                                <th className="pb-3">Tournament</th>
                                                <th className="pb-3">Started</th>
                                                <th className="pb-3">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {tournamentHistory.map((entry) => (
                                                <tr key={entry.id}>
                                                    <td className="py-3">
                                                        <Link to={`/tournament/${entry.tournament.id}`} className="font-semibold text-primary-600 no-underline hover:text-primary-700">
                                                            {entry.tournament.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 text-slate-600">{formatDateTime(entry.start_time)}</td>
                                                    <td className="py-3 font-semibold text-slate-700">
                                                        {entry.score} / {entry.tournament.questionNumber}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState title="No tournaments yet" text="Join a weekly tournament to compare your pace and accuracy."/>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                        {isOwnProfile ? (
                            <Card className="p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Search className="size-5 text-primary-600"/>
                                    <h2 className="m-0 text-xl font-bold text-slate-900">Find students</h2>
                                </div>
                                <Input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search by username"
                                />
                                <div className="mt-4 space-y-2">
                                    {searching && <p className="text-sm text-slate-500">Searching…</p>}
                                    {searchResults.map((result) => (
                                        <Link
                                            key={result.id}
                                            to={`/profile/${result.id}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 no-underline transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                                        >
                                            <UserAvatar profile={result} size="sm"/>
                                            <div>
                                                <p className="m-0 font-semibold text-slate-900">{result.username}</p>
                                                <p className="m-0 text-sm text-slate-500">
                                                    {result.elo_rating} Duel Elo{result.is_premium ? ' · Premium' : ''}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-6 border-t border-slate-100 pt-5">
                                    <h3 className="m-0 text-base font-bold text-slate-900">Friend requests</h3>
                                    <div className="mt-3 space-y-2">
                                        {friendRequests.length ? friendRequests.map((request) => (
                                            <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="m-0 font-semibold text-slate-900">{request.from_user.username}</p>
                                                    <p className="m-0 text-sm text-slate-500">wants to connect</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => respondToFriendRequest(request.id, 'accepted')}
                                                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        aria-label="Accept friend request"
                                                    >
                                                        <Check className="size-5"/>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => respondToFriendRequest(request.id, 'rejected')}
                                                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                                                        aria-label="Reject friend request"
                                                    >
                                                        <X className="size-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="m-0 text-sm text-slate-500">No pending requests.</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-6">
                                <h2 className="m-0 text-xl font-bold text-slate-900">Friends</h2>
                                <EmptyState title="Private for now" text="Public friend lists are not exposed by the current API."/>
                            </Card>
                        )}

                        <Card className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Users className="size-5 text-primary-600"/>
                                <h2 className="m-0 text-xl font-bold text-slate-900">Friends list</h2>
                            </div>
                            {isOwnProfile && friends.length ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {friends.map((friend) => (
                                        <Link
                                            key={friend.id}
                                            to={`/profile/${friend.user.id}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 no-underline transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                                        >
                                            <UserAvatar profile={friend} size="sm"/>
                                            <div className="min-w-0">
                                                <p className="m-0 truncate font-semibold text-slate-900">{friend.user.username}</p>
                                                <p className="m-0 text-sm text-slate-500">{gradeLabel(friend.grade)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No friends yet" text={isOwnProfile ? 'Search for classmates and send a friend request.' : 'Friend list is private for now.'}/>
                            )}
                        </Card>
                    </div>
                )}
            </PageContainer>

            {editOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
                    <form onSubmit={saveProfile} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="m-0 text-2xl font-bold text-slate-900">Edit profile</h2>
                                <p className="m-0 mt-1 text-sm text-slate-500">Update your public profile and avatar.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditOpen(false)}
                                className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                                aria-label="Close edit profile"
                            >
                                <X className="size-5"/>
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="First name">
                                <Input
                                    value={formState.first_name}
                                    onChange={(event) => setFormState({...formState, first_name: event.target.value})}
                                />
                            </Field>
                            <Field label="Last name">
                                <Input
                                    value={formState.last_name}
                                    onChange={(event) => setFormState({...formState, last_name: event.target.value})}
                                />
                            </Field>
                            <Field label="Grade">
                                <Select
                                    value={formState.grade}
                                    onChange={(event) => setFormState({...formState, grade: event.target.value})}
                                >
                                    {GRADE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Country">
                                <Input
                                    value={formState.country}
                                    maxLength={2}
                                    onChange={(event) => setFormState({...formState, country: event.target.value.toUpperCase()})}
                                />
                            </Field>
                        </div>

                        <div className="mt-5">
                            <p className="mb-2 text-sm font-semibold text-slate-700">Profile picture</p>
                            <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="m-0 font-bold text-slate-800">Preview</p>
                                    <p className="m-0 mt-1 text-sm text-slate-500">
                                        Pick a background color and an optional illustrated character.
                                    </p>
                                </div>
                                <UserAvatar
                                    profile={profile}
                                    backgroundId={formState.avatar}
                                    iconId={formState.avatar_icon}
                                    size="lg"
                                    className="mx-auto ring-white sm:mx-0"
                                />
                            </div>
                            <p className="mb-2 text-sm font-semibold text-slate-700">Background color</p>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                                {AVATAR_BACKGROUNDS.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setFormState({...formState, avatar: avatar.id})}
                                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-colors ${
                                            formState.avatar === avatar.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-slate-200 hover:border-primary-300'
                                        }`}
                                    >
                                        <UserAvatar profile={profile} backgroundId={avatar.id} iconId={formState.avatar_icon} size="md" className="ring-0"/>
                                        <span className="text-xs font-semibold text-slate-600">{avatar.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="mb-2 text-sm font-semibold text-slate-700">Character</p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {PIXEL_AVATARS.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setFormState({...formState, avatar_icon: avatar.id})}
                                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
                                            formState.avatar_icon === avatar.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <UserAvatar
                                            profile={profile}
                                            backgroundId={formState.avatar}
                                            iconId={avatar.id}
                                            size="md"
                                            className="ring-0"
                                        />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-bold text-slate-800">{avatar.label}</span>
                                            <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">{avatar.tagline}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Field label="Biography">
                            <textarea
                                value={formState.biography}
                                maxLength={500}
                                rows={5}
                                onChange={(event) => setFormState({...formState, biography: event.target.value})}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500"
                                placeholder="Tell classmates what you are working on..."
                            />
                        </Field>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={saving}>
                                Save changes
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
