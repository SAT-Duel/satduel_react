import React, {useEffect, useState} from 'react';
import {ArrowRight, DoorOpen, Info, X} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import api from '../components/api';
import TournamentCard from '../components/Tournament/TournamentCard';
import {Alert, Button, Card, Input, PageContainer, Spinner} from '../components/ui';

function JoinCodeModal({open, value, onChange, onClose, onSubmit}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
            <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="m-0 font-display text-2xl font-black text-slate-950">Join private tournament</h2>
                        <p className="m-0 mt-1 text-sm text-slate-500">Enter the code from your instructor or tournament host.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close join code modal"
                    >
                        <X className="size-5"/>
                    </button>
                </div>
                <Input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Tournament code"
                    autoFocus
                />
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Join tournament</Button>
                </div>
            </form>
        </div>
    );
}

function TournamentListPage() {
    const [tournaments, setTournaments] = useState([]);
    const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await api.get('api/tournaments/');
                setTournaments(response.data);
            } catch (error) {
                setNotice({type: 'error', text: error.response?.data?.error || 'Failed to load tournaments.'});
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleJoinCodeSubmit = async (event) => {
        event.preventDefault();
        if (!joinCode.trim()) {
            setNotice({type: 'error', text: 'Please enter a join code.'});
            return;
        }

        try {
            const response = await api.post('api/tournaments/join_from_code/', {
                join_code: joinCode.trim(),
            });
            setNotice({type: 'success', text: 'Tournament joined. Opening the arena now.'});
            setJoinCodeModalVisible(false);
            setJoinCode('');
            navigate(`/tournament/${response.data.id}`);
        } catch (error) {
            setNotice({
                type: 'error',
                text: error.response?.data?.error || 'Invalid join code. Please try again.',
            });
        }
    };

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <PageContainer>
                {notice && (
                    <div className="mb-6 max-w-3xl">
                        <Alert type={notice.type}>{notice.text}</Alert>
                    </div>
                )}

                <section>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <h1 className="m-0 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                            Tournaments
                        </h1>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button variant="secondary" onClick={() => setJoinCodeModalVisible(true)}>
                                <DoorOpen className="size-4"/> Join with a code
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <Card className="mt-5 flex items-center justify-center gap-3 p-8 text-slate-600">
                            <Spinner/> Loading tournaments…
                        </Card>
                    ) : tournaments.length ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {tournaments.map((tournament) => (
                                <TournamentCard key={tournament.id} tournament={tournament}/>
                            ))}
                        </div>
                    ) : (
                        <Card className="sat-arena-card mt-5 p-8 text-center">
                            <Info className="mx-auto size-9 text-slate-300"/>
                            <h3 className="m-0 mt-3 font-display text-2xl font-black text-slate-950">No public tournaments right now</h3>
                            <p className="mx-auto mt-2 max-w-md text-slate-500">
                                Got a code from a teacher or friend? Join their private one.
                            </p>
                            <Button className="mt-5" variant="secondary" onClick={() => setJoinCodeModalVisible(true)}>
                                Join with a code
                            </Button>
                        </Card>
                    )}
                </section>

                <section className="mt-10 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Host your own</h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">
                                Make a public or private tournament and share the invite link with your class or friends.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:shrink-0 xl:flex-nowrap">
                            <Button to="/my_tournaments" variant="secondary">
                                My tournaments
                            </Button>
                            <Button to="/tournaments/info" variant="secondary">
                                How tournaments work <ArrowRight className="size-4"/>
                            </Button>
                            <Button to="/create_tournament">Create tournament</Button>
                        </div>
                    </div>
                </section>
            </PageContainer>

            <JoinCodeModal
                open={joinCodeModalVisible}
                value={joinCode}
                onChange={setJoinCode}
                onClose={() => {
                    setJoinCodeModalVisible(false);
                    setJoinCode('');
                }}
                onSubmit={handleJoinCodeSubmit}
            />
        </div>
    );
}

export default TournamentListPage;
