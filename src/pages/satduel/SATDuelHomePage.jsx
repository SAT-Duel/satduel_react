import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {DoorOpen, Lock, Plus, RefreshCw, Swords, Users, X} from 'lucide-react';
import CreateGameModal from '../../components/CreateGameModal';
import withAuth from '../../hoc/withAuth';
import {Alert, Button, Card, Input, PageContainer, Spinner} from '../../components/ui';
import api from '../../components/api';
import {useAuth} from '../../context/AuthContext';

function SATDuelHomePage() {
    const [games, setGames] = useState([]);
    const [createGameVisible, setCreateGameVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [password, setPassword] = useState('');
    const [loadingGames, setLoadingGames] = useState(true);
    const [notice, setNotice] = useState(null);
    const {loading} = useAuth();
    const navigate = useNavigate();

    const fetchGames = useCallback(async () => {
        try {
            setLoadingGames(true);
            const response = await api.get('/api/games/waiting/');
            setGames(response.data);
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Failed to fetch rooms.'});
        } finally {
            setLoadingGames(false);
        }
    }, []);

    useEffect(() => {
        if (loading) return undefined;
        fetchGames();
        const interval = setInterval(fetchGames, 10000);
        return () => clearInterval(interval);
    }, [fetchGames, loading]);

    const joinGame = async (gameId, roomPassword = '') => {
        setNotice(null);
        try {
            await api.post(`/api/games/${gameId}/join/`, {password: roomPassword});
            navigate(`/waiting-room/${gameId}`);
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Failed to join the room.'});
        }
    };

    const handleJoinGame = (game) => {
        if (game.has_password) {
            setSelectedGame(game);
            setPassword('');
            setPasswordModalVisible(true);
            return;
        }
        joinGame(game.id);
    };

    const submitPassword = (event) => {
        event.preventDefault();
        if (!selectedGame) return;
        setPasswordModalVisible(false);
        joinGame(selectedGame.id, password);
    };

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-10 sm:py-14">
            <PageContainer>
                {notice && (
                    <div className="mb-6 max-w-2xl">
                        <Alert type={notice.type === 'success' ? 'success' : 'error'}>{notice.text}</Alert>
                    </div>
                )}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                            <DoorOpen className="size-4"/> Duel rooms
                        </span>
                        <h1 className="m-0 mt-4 font-display text-4xl font-bold text-slate-900">
                            Join or create a SAT duel room.
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-slate-600">
                            Private rooms are best for challenging classmates on the same question set.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={fetchGames} variant="secondary">
                            <RefreshCw className="size-4"/> Refresh
                        </Button>
                        <Button onClick={() => setCreateGameVisible(true)}>
                            <Plus className="size-4"/> Create room
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    {loadingGames ? (
                        <Card className="flex items-center justify-center gap-3 p-8 text-slate-600">
                            <Spinner/> Loading rooms…
                        </Card>
                    ) : games.length ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {games.map((game) => (
                                <Card key={game.id} className="sat-arena-card p-5" hover>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                                                <Swords className="size-5"/>
                                            </div>
                                            <div>
                                                <h2 className="m-0 text-lg font-bold text-slate-900">Room #{game.id}</h2>
                                                <p className="m-0 mt-1 text-sm text-slate-500">
                                                    {(game.players?.length || 0) + 1} / {game.max_players} players
                                                </p>
                                            </div>
                                        </div>
                                        {game.has_password && (
                                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                                <Lock className="size-3.5"/> Locked
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                        <span className="inline-flex items-center gap-2 font-semibold">
                                            <Users className="size-4"/> Waiting for players
                                        </span>
                                        <Button onClick={() => handleJoinGame(game)} size="sm">
                                            Join
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="sat-arena-card p-8 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                                <Swords className="size-6"/>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-900">No rooms waiting</h2>
                            <p className="mx-auto mt-2 max-w-md text-slate-600">
                                Create a room and invite someone to join, or use live matching from the main Duel page.
                            </p>
                            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                                <Button onClick={() => setCreateGameVisible(true)}>
                                    Create room
                                </Button>
                                <Button to="/match" variant="secondary">
                                    Try live matching
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </PageContainer>

            <CreateGameModal
                visible={createGameVisible}
                onClose={() => setCreateGameVisible(false)}
                onGameCreated={(gameId) => navigate(`/waiting-room/${gameId}`)}
            />

            {passwordModalVisible && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
                    <form onSubmit={submitPassword} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="m-0 text-2xl font-bold text-slate-900">Room password</h2>
                                <p className="m-0 mt-1 text-sm text-slate-500">Enter the password for room #{selectedGame?.id}.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPasswordModalVisible(false)}
                                className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                                aria-label="Close password modal"
                            >
                                <X className="size-5"/>
                            </button>
                        </div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                        />
                        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setPasswordModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Join room
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default withAuth(SATDuelHomePage);
