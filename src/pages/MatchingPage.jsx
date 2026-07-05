import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight, Clock, Radio, ShieldCheck, Swords, Users, Zap} from 'lucide-react';
import {Alert, Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import MatchingModal from '../components/Match/MatchingModal';

const DUEL_POINTS = [
    {
        icon: Radio,
        title: 'Live matching',
        text: 'Find another active student and start a timed SAT question race.',
    },
    {
        icon: ShieldCheck,
        title: 'Same questions',
        text: 'Both players answer the same set, so the result is about accuracy and pace.',
    },
    {
        icon: Zap,
        title: 'Rating updates',
        text: 'Duel performance feeds your competitive rating after each match.',
    },
];

function MatchingPage() {
    const {token, loading} = useAuth();
    const [matching, setMatching] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();

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

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            <section className="border-b border-slate-200 bg-white">
                <PageContainer className="py-12 sm:py-16">
                    {notice && (
                        <div className="mb-6 max-w-2xl">
                            <Alert type={notice.type === 'success' ? 'success' : 'error'}>{notice.text}</Alert>
                        </div>
                    )}

                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                                <Swords className="size-4"/> Live SAT duels
                            </span>
                            <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                                Race another student on the same SAT questions.
                            </h1>
                            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                                A duel is a short real-time match: same questions, same clock, instant results.
                                If no one is online, jump into practice and come back later.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button onClick={handleMatch} size="lg" loading={matching}>
                                    Start a duel <ArrowRight className="size-5"/>
                                </Button>
                                <Button to="/trainer" variant="secondary" size="lg">
                                    Practice instead
                                </Button>
                            </div>
                        </div>

                        <Card className="p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="m-0 text-xl font-bold text-slate-900">Online now</h2>
                                    <p className="m-0 mt-1 text-sm text-slate-500">
                                        Students recently active on SAT Duel.
                                    </p>
                                </div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <Users className="size-6"/>
                                </div>
                            </div>

                            <div className="mt-5 max-h-80 space-y-2 overflow-y-auto">
                                {onlineUsers.length ? onlineUsers.map((onlineUser) => (
                                    <div key={onlineUser.id || onlineUser.username} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                                                {onlineUser.username?.[0]?.toUpperCase() || '?'}
                                            </span>
                                            <span className="font-semibold text-slate-800">{onlineUser.username}</span>
                                        </div>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                            {onlineUser.status || 'online'}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                        <p className="m-0 font-semibold text-slate-700">Quiet right now</p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">
                                            Live duels work best when more students are online.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </PageContainer>
            </section>

            <PageContainer className="py-12 sm:py-16">
                <div className="grid gap-4 md:grid-cols-3">
                    {DUEL_POINTS.map(({icon: Icon, title, text}) => (
                        <Card key={title} className="p-5" hover>
                            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                                <Icon className="size-5"/>
                            </div>
                            <h2 className="m-0 text-lg font-bold text-slate-900">{title}</h2>
                            <p className="m-0 mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                            <Clock className="size-5"/>
                        </div>
                        <div>
                            <h2 className="m-0 text-lg font-bold text-slate-900">Low traffic fallback</h2>
                            <p className="m-0 mt-1 text-[15px] text-slate-600">
                                If matching is slow, tournaments and daily practice are always available.
                            </p>
                        </div>
                    </div>
                    <Button to="/tournaments" variant="secondary" className="mt-4 sm:mt-0">
                        View tournaments
                    </Button>
                </div>
            </PageContainer>

            <MatchingModal visible={matching} onCancel={handleCancel}/>
        </div>
    );
}

export default MatchingPage;
