import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {Crown, Swords, Users} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import {Button, Card, PageContainer, Spinner} from '../../components/ui';
import {notify} from '../../utils/notify';

function WaitingRoomPage() {
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const {user, token, loading} = useAuth();
    const navigate = useNavigate();

    const goToBattle = useCallback((payload = {}) => {
        navigate(`/duel_battle/${payload.battle_room_id || payload.room_id || gameId}`);
    }, [gameId, navigate]);

    const fetchGameInfo = useCallback(() => {
        const baseUrl = import.meta.env.VITE_API_URL;
        axios.get(`${baseUrl}/api/games/${gameId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setGame(response.data);
                setIsHost(response.data.host.id === user.id);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    notify.error('Game not found.');
                    navigate('/duels');
                } else {
                    notify.error('Failed to fetch game info.');
                }
            });
    }, [gameId, token, user, navigate]);

    const waitForGameStart = useCallback(() => {
        const baseUrl = import.meta.env.VITE_API_URL;
        axios.get(`${baseUrl}/api/games/${gameId}/wait_for_start/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            timeout: 35000,
        })
            .then((response) => {
                if (response.data.status === 'Battling') {
                    notify.success('Game has started!');
                    goToBattle(response.data);
                } else {
                    waitForGameStart();
                }
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    return;
                }
                if (error.code === 'ECONNABORTED') {
                    waitForGameStart();
                } else if (error.response && error.response.status === 404) {
                    notify.error('Game not found.');
                    navigate('/duels');
                } else {
                    notify.error('Connection error. Retrying...');
                    setTimeout(waitForGameStart, 5000);
                }
            });
    }, [gameId, token, navigate, goToBattle]);

    useEffect(() => {
        if (loading || !user) return;

        fetchGameInfo();
    }, [fetchGameInfo, loading, user]);

    useEffect(() => {
        if (loading || !user || !game || isHost) return;
        waitForGameStart();
    }, [game, isHost, loading, user, waitForGameStart]);

    const handleStartGame = () => {
        const baseUrl = import.meta.env.VITE_API_URL;
        axios.post(`${baseUrl}/api/games/${gameId}/start/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                notify.success('Game started!');
                goToBattle(response.data);
            })
            .catch((error) => notify.error(`Failed to start game. ${error}`));
    };

    if (!game) {
        return (
            <PageContainer className="flex min-h-screen items-center justify-center">
                <Spinner/>
            </PageContainer>
        );
    }

    const players = [game.host, ...(game.players || [])];

    return (
        <div className="sat-bubble-field min-h-screen py-8 sm:py-12">
            <PageContainer className="max-w-3xl">
                <Card className="p-6 sm:p-8">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                            <Swords size={26}/>
                        </div>
                        <h1 className="text-3xl font-black text-slate-950">
                            Waiting Room
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {game.host.username}'s duel room
                        </p>
                    </div>

                    <div className="mb-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Host</p>
                            <p className="mt-1 font-black text-slate-900">{game.host.username}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Players</p>
                            <p className="mt-1 font-black text-slate-900">{players.length}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 font-black text-slate-900">
                            <Users size={18}/> Players Joined
                        </div>
                        <div className="divide-y divide-slate-100">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                    <span className="font-semibold text-slate-700">{player.username}</span>
                                    {player.id === game.host.id && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                                            <Crown size={13}/> Host
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isHost && (
                        <Button className="mt-6" onClick={handleStartGame} size="lg" block>
                            Start Game
                        </Button>
                    )}
                </Card>
            </PageContainer>
        </div>
    );
}

export default WaitingRoomPage;
