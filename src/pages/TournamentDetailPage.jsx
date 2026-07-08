import React, {useEffect, useState} from 'react';
import {ArrowRight, CalendarClock, Clock3, Clipboard, FileQuestion, Trophy, Users, X} from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import TournamentLeaderboard from '../components/Tournament/TournamentLeaderboard';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import api from '../components/api';
import {tournamentShareUrl} from '../utils/tournamentLinks';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function DetailItem({icon: Icon, label, value}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
                <Icon className="size-4 text-primary-600"/> {label}
            </div>
            <p className="m-0 mt-2 font-bold text-slate-900">{value}</p>
        </div>
    );
}

function ReviewConfirmModal({open, onClose, onReview}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="m-0 font-display text-2xl font-black text-slate-950">Tournament already finished</h2>
                        <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">
                            You can still review the questions and your submitted answers.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close review modal"
                    >
                        <X className="size-5"/>
                    </button>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={onClose}>No thanks</Button>
                    <Button onClick={onReview}>Review questions</Button>
                </div>
            </div>
        </div>
    );
}

function TournamentDetailPage() {
    const {token} = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [notice, setNotice] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const {tournamentId} = useParams();
    const navigate = useNavigate();

    const convertDurationToSeconds = (value) => {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    useEffect(() => {
        const fetchTournamentDetail = async () => {
            try {
                const response = await api.get(`api/tournaments/${tournamentId}/`);
                setTournament(response.data);
            } catch (error) {
                setNotice({type: 'error', text: 'Failed to fetch tournament details.'});
            } finally {
                setLoading(false);
            }
        };

        const fetchLeaderboard = async () => {
            try {
                const response = await api.get(`api/tournaments/${tournamentId}/leaderboard/`);
                setLeaderboardData(response.data);
            } catch (error) {
                setNotice({type: 'error', text: error.response?.data?.error || 'Could not load leaderboard.'});
            }
        };

        fetchTournamentDetail();
        fetchLeaderboard();
    }, [tournamentId]);

    const handleStartTournament = async () => {
        if (!token) {
            setNotice({type: 'error', text: 'You need to be logged in to start the tournament.'});
            return;
        }

        try {
            const response = await api.post(`api/tournaments/${tournamentId}/join/`, {});
            if (response.data.status === 'Active') {
                navigate(`/tournament/${tournamentId}/questions/`);
            } else {
                setReviewModalOpen(true);
            }
        } catch (error) {
            setNotice({type: 'error', text: error.response?.data?.error || 'Failed to start the tournament.'});
        }
    };

    const copyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(tournamentShareUrl(tournament));
            setNotice({type: 'success', text: 'Tournament link copied.'});
        } catch {
            setNotice({type: 'error', text: 'Could not copy tournament link.'});
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading tournament…
                    </div>
                </PageContainer>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="max-w-2xl">
                    <Alert>Tournament not found.</Alert>
                    <Button to="/tournaments" variant="secondary" className="mt-4">Back to tournaments</Button>
                </PageContainer>
            </div>
        );
    }

    const tournamentDuration = tournament.duration
        ? dayjs.duration(convertDurationToSeconds(tournament.duration) * 1000).humanize()
        : 'Timed round';

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <PageContainer>
                {notice && (
                    <div className="mb-6 max-w-3xl">
                        <Alert type={notice.type}>{notice.text}</Alert>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <main className="space-y-5">
                        <Card className="sat-arena-card overflow-hidden">
                            <div className="sat-duel-lanes bg-slate-950 p-6 text-white sm:p-8">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-black text-cyan-200">
                                    <Trophy className="size-4"/> Tournament detail
                                </span>
                                <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
                                    {tournament.name}
                                </h1>
                                <p className="m-0 mt-4 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-slate-300">
                                    {tournament.description || 'Compete on a timed SAT question set and compare your run on the live leaderboard.'}
                                </p>
                            </div>
                            <div className="grid gap-3 p-5 sm:grid-cols-2">
                                <DetailItem icon={CalendarClock} label="Starts" value={dayjs(tournament.start_time).format('MMM D, YYYY h:mm A')}/>
                                <DetailItem icon={CalendarClock} label="Ends" value={dayjs(tournament.end_time).format('MMM D, YYYY h:mm A')}/>
                                <DetailItem icon={Clock3} label="Duration" value={tournamentDuration}/>
                                <DetailItem icon={FileQuestion} label="Questions" value={tournament.questionNumber}/>
                                <DetailItem icon={Users} label="Participants" value={tournament.participantNumber}/>
                            </div>
                            <div className="sat-score-strip px-5 py-5">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button onClick={handleStartTournament} size="lg">
                                        Join tournament <ArrowRight className="size-5"/>
                                    </Button>
                                    <Button type="button" onClick={copyShareLink} variant="secondary" size="lg">
                                        <Clipboard className="size-5"/> Share link
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="sat-arena-card p-5 sm:p-6">
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">What matters in this round</h2>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {[
                                    ['Accuracy first', 'Your score is driven by correct answers, not extra effects.'],
                                    ['Timer pressure', 'Work steadily; the leaderboard reveals progress as time passes.'],
                                    ['Review later', 'Finished rounds can still be reviewed from the tournament screen.'],
                                ].map(([title, copy]) => (
                                    <div key={title} className="rounded-2xl bg-slate-50 p-4">
                                        <p className="m-0 font-black text-slate-900">{title}</p>
                                        <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{copy}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </main>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <TournamentLeaderboard leaderboardData={leaderboardData} tournamentStartTime={tournament.start_time}/>
                    </aside>
                </div>
            </PageContainer>

            <ReviewConfirmModal
                open={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onReview={() => navigate(`/tournament/${tournamentId}/questions?readonly=true`)}
            />
        </div>
    );
}

export default TournamentDetailPage;
