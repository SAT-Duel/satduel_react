import React, {useEffect, useState} from 'react';
import {Clipboard, Plus, Trophy} from 'lucide-react';
import {Link} from 'react-router-dom';
import api from '../components/api';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';

function MyTournamentsPage() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const fetchMyTournaments = async () => {
            try {
                const response = await api.get('api/tournaments/my_tournaments/');
                setTournaments(response.data);
            } catch (error) {
                setNotice({type: 'error', text: 'Failed to load your tournaments.'});
            } finally {
                setLoading(false);
            }
        };
        fetchMyTournaments();
    }, []);

    const copyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setNotice({type: 'success', text: 'Join code copied.'});
        } catch {
            setNotice({type: 'error', text: 'Could not copy join code.'});
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

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-1.5 text-sm font-black text-white">
                            <Trophy className="size-4 text-amber-300"/> Host console
                        </span>
                        <h1 className="m-0 mt-4 font-display text-4xl font-black text-slate-950">My tournaments</h1>
                        <p className="m-0 mt-2 max-w-2xl text-slate-500">
                            Manage the private and classroom rounds you created.
                        </p>
                    </div>
                    <Button to="/create_tournament">
                        <Plus className="size-4"/> Create tournament
                    </Button>
                </div>

                {loading ? (
                    <Card className="mt-8 flex items-center justify-center gap-3 p-8 text-slate-600">
                        <Spinner/> Loading your tournaments…
                    </Card>
                ) : tournaments.length === 0 ? (
                    <Card className="sat-arena-card mt-8 p-8 text-center">
                        <Trophy className="mx-auto size-10 text-slate-300"/>
                        <h2 className="m-0 mt-4 font-display text-2xl font-black text-slate-950">No tournaments created yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            Create a private round when you want a group of students to compete on one shared set.
                        </p>
                        <Button to="/create_tournament" className="mt-5">Create your first tournament</Button>
                    </Card>
                ) : (
                    <div className="mt-8 grid gap-4">
                        {tournaments.map((tournament) => (
                            <Card key={tournament.id} hover className="sat-arena-card overflow-hidden">
                                <div className="p-5 sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <Link to={`/tournament/${tournament.id}`} className="font-display text-2xl font-black text-slate-950 no-underline hover:text-primary-700">
                                                {tournament.name}
                                            </Link>
                                            <p className="m-0 mt-2 max-w-2xl line-clamp-2 text-sm leading-relaxed text-slate-500">
                                                {tournament.description}
                                            </p>
                                        </div>
                                        <Button to={`/tournament/${tournament.id}`} variant="secondary" size="sm">Open</Button>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="m-0 text-xs font-black uppercase text-slate-400">Start</p>
                                            <p className="m-0 mt-1 font-semibold text-slate-800">{new Date(tournament.start_time).toLocaleString()}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="m-0 text-xs font-black uppercase text-slate-400">End</p>
                                            <p className="m-0 mt-1 font-semibold text-slate-800">{new Date(tournament.end_time).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {tournament.private && tournament.join_code && (
                                        <button
                                            type="button"
                                            onClick={() => copyCode(tournament.join_code)}
                                            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 font-mono text-lg font-black text-primary-700 transition hover:border-primary-300 hover:bg-primary-100"
                                        >
                                            <Clipboard className="size-5"/> {tournament.join_code}
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </PageContainer>
        </div>
    );
}

export default MyTournamentsPage;
