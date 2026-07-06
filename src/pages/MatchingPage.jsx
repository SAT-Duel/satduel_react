import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {History, Swords, Trophy, Users} from 'lucide-react';
import {Alert, Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import MatchingModal from '../components/Match/MatchingModal';
import UserAvatar from '../components/UserAvatar';

function MatchingPage() {
    const {token, loading, user} = useAuth();
    const [matching, setMatching] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notice, setNotice] = useState(null);
    const [profile, setProfile] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading || !token) return;
        api.get('api/profile/').then((r) => setProfile(r.data)).catch(() => {});
        api.get('api/match/get_match_history/')
            .then((r) => setRecentMatches((r.data || []).slice(0, 5)))
            .catch(() => {});
    }, [loading, token]);

    const handleCancel = useCallback(async () => {
        if (!roomId) return;

        try {
            await api.post('/api/match/cancel_match/', {room_id: roomId});
            setNotice({type: 'success', text: 'Duel search canceled.'});
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not cancel the duel search.'});
        } finally {
            setMatching(false);
            setRoomId(null);
        }
    }, [roomId]);

    const handleMatch = async () => {
        setNotice(null);
        if (!token) {
            setNotice({type: 'error', text: 'Log in to start a live duel.'});
            return;
        }

        try {
            const response = await api.get('/api/match/');
            setRoomId(response.data.id);
            if (response.data.full === 'true') {
                setMatching(false);
                navigate(`/match-loading/${response.data.id}`);
                return;
            }
            setMatching(true);
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not start a duel.'});
            setMatching(false);
        }
    };

    useEffect(() => {
        if (!matching || !roomId) return undefined;
        const timeout = setTimeout(async () => {
            await handleCancel();
            setNotice({
                type: 'error',
                text: 'We could not find an opponent this time. Try again, or practice while more students come online.',
            });
        }, 60000);
        return () => clearTimeout(timeout);
    }, [handleCancel, matching, roomId]);

    useEffect(() => {
        const getStatus = async () => {
            try {
                const response = await api.get('/api/match/status/', {params: {room_id: roomId}});
                if (response.data.status === 'full') {
                    navigate(`/match-loading/${roomId}`);
                }
            } catch {
                // Polling failures are non-blocking; the next tick may recover.
            }
        };

        if (!roomId) return undefined;
        const interval = setInterval(getStatus, 1000);
        return () => clearInterval(interval);
    }, [navigate, roomId]);

    useEffect(() => {
        const rejoinRoom = async () => {
            try {
                const response = await api.get('/api/match/rejoin/');
                if (response.data.battle_room_id) {
                    navigate(`/duel_battle/${response.data.battle_room_id}`);
                } else if (response.data.searching_room_id) {
                    setMatching(true);
                    setRoomId(response.data.searching_room_id);
                }
            } catch {
                // No active duel to rejoin.
            }
        };

        if (!loading && token) {
            rejoinRoom();
        }
    }, [loading, navigate, token]);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const response = await api.get('api/online_users/');
                setOnlineUsers(response.data.users || []);
            } catch {
                setOnlineUsers([]);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const sendHeartbeat = async () => {
            try {
                await api.post('api/update_online_status/');
            } catch {
                // Heartbeat is best-effort.
            }
        };

        if (!token) return undefined;
        sendHeartbeat();
        const interval = setInterval(sendHeartbeat, 8000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const removeOnlineStatus = async () => {
            if (!token) return;
            try {
                await api.post('api/remove_online_user/');
            } catch {
                // Best-effort cleanup.
            }
        };

        window.addEventListener('beforeunload', removeOnlineStatus);
        return () => {
            window.removeEventListener('beforeunload', removeOnlineStatus);
            removeOnlineStatus();
        };
    }, [token]);

    const myElo = profile?.elo_rating;
    const wins = recentMatches.filter((m) => m.winner === user?.id).length;

    const opponentOf = (m) => (m.user1?.id === user?.id ? m.user2 : m.user1);
    const myScore = (m) => (m.user1?.id === user?.id ? m.user1_score : m.user2_score);
    const theirScore = (m) => (m.user1?.id === user?.id ? m.user2_score : m.user1_score);
    const resultOf = (m) => {
        if (m.winner == null) return 'Draw';
        return m.winner === user?.id ? 'Win' : 'Loss';
    };

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-10 sm:py-14">
            <PageContainer>
                {notice && (
                    <div className="mb-6 max-w-2xl">
                        <Alert type={notice.type === 'success' ? 'success' : 'error'}>{notice.text}</Alert>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Arena */}
                    <div className="space-y-6">
                        <Card className="sat-arena-card overflow-hidden">
                            <div className="sat-duel-lanes bg-gradient-to-b from-primary-50/80 to-white px-6 pb-10 pt-8 text-center sm:px-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-1.5 text-sm font-black text-white">
                                    <Swords className="size-4"/> Duel arena
                                </span>

                                <div className="mt-8 flex items-center justify-center gap-5 sm:gap-10">
                                    {/* You */}
                                    <div className="w-28 sm:w-36">
                                        <UserAvatar
                                            profile={profile || {user, avatar: 'violet', avatar_icon: 'initial'}}
                                            size="md"
                                            rounded="xl"
                                            className="mx-auto text-2xl ring-0 sm:size-20"
                                        />
                                        <p className="m-0 mt-3 truncate font-bold text-slate-900">{user?.username || 'You'}</p>
                                        <p className="m-0 mt-0.5 text-sm font-semibold text-primary-600">
                                            {myElo != null ? `${myElo} rating` : '—'}
                                        </p>
                                    </div>

                                    <div className="font-display text-3xl font-bold text-slate-300 sm:text-5xl">VS</div>

                                    {/* Mystery opponent */}
                                    <div className="w-28 sm:w-36">
                                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-2xl font-bold text-slate-300 sm:size-20">
                                            ?
                                        </div>
                                        <p className="m-0 mt-3 font-bold text-slate-400">Opponent</p>
                                        <p className="m-0 mt-0.5 text-sm font-semibold text-slate-300">waiting…</p>
                                    </div>
                                </div>

                                <div className="mt-9">
                                    <Button onClick={handleMatch} size="lg" loading={matching} className="min-w-56">
                                        {matching ? 'Searching…' : 'Find an opponent'}
                                    </Button>
                                    <p className="mt-3 text-sm text-slate-400">
                                        10 questions · 5 minutes · rating on the line
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
                                <div className="px-2 py-4">
                                    <p className="m-0 text-xl font-bold text-slate-900">{recentMatches.length}</p>
                                    <p className="m-0 mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent duels</p>
                                </div>
                                <div className="px-2 py-4">
                                    <p className="m-0 text-xl font-bold text-emerald-600">{wins}</p>
                                    <p className="m-0 mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Wins</p>
                                </div>
                                <div className="px-2 py-4">
                                    <p className="m-0 text-xl font-bold text-primary-600">{onlineUsers.length}</p>
                                    <p className="m-0 mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Online now</p>
                                </div>
                            </div>
                        </Card>

                        {/* Recent duels */}
                        <Card className="sat-arena-card p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <History className="size-5 text-slate-400"/> Recent duels
                                </h2>
                                <Button to="/profile" variant="ghost" size="sm">View all</Button>
                            </div>
                            <div className="mt-4 space-y-2">
                                {recentMatches.length ? recentMatches.map((m) => {
                                    const opp = opponentOf(m);
                                    const result = resultOf(m);
                                    const resultStyle = result === 'Win'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : result === 'Loss'
                                            ? 'bg-rose-50 text-rose-600'
                                            : 'bg-slate-100 text-slate-600';
                                    return (
                                        <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                    {opp?.username?.[0]?.toUpperCase() || '?'}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="m-0 truncate font-semibold text-slate-800">
                                                        vs {opp?.username || 'unknown'}
                                                    </p>
                                                    <p className="m-0 text-xs text-slate-400">
                                                        {new Date(m.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-700">
                                                    {myScore(m)}–{theirScore(m)}
                                                </span>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${resultStyle}`}>
                                                    {result}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                        <Trophy className="mx-auto size-8 text-slate-300"/>
                                        <p className="m-0 mt-2 font-semibold text-slate-700">No duels yet</p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">
                                            Your match history will show up here after your first duel.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Online players */}
                    <aside>
                        <Card className="sat-arena-card p-5 lg:sticky lg:top-24">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <Users className="size-5 text-emerald-600"/> Online
                                </h2>
                                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500"/>
                                    {onlineUsers.length}
                                </span>
                            </div>
                            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
                                {onlineUsers.length ? onlineUsers.map((onlineUser) => (
                                    <div key={onlineUser.id || onlineUser.username} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
                                        <span className="flex size-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                                            {onlineUser.username?.[0]?.toUpperCase() || '?'}
                                        </span>
                                        <span className="truncate font-semibold text-slate-800">{onlineUser.username}</span>
                                    </div>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                                        <p className="m-0 text-sm font-semibold text-slate-600">Quiet right now</p>
                                        <p className="m-0 mt-1 text-xs text-slate-400">
                                            Try a tournament or practice while you wait.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <Button to="/tournaments" variant="secondary" block size="sm">
                                    Weekly tournaments
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>
            </PageContainer>

            <MatchingModal visible={matching} onCancel={handleCancel}/>
        </div>
    );
}

export default MatchingPage;
