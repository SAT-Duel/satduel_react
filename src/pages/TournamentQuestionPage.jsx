import React, {useCallback, useEffect, useState} from 'react';
import {AlertTriangle, ArrowLeft, Menu, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {useNavigate, useParams} from 'react-router-dom';
import Question from '../components/Question';
import Leaderboard from '../components/Tournament/TournamentLeaderboard';
import TournamentInfo from '../components/Tournament/TournamentInfo';
import {Alert, Button, PageContainer, Spinner} from '../components/ui';
import api from '../components/api';

function ConfirmFinishModal({open, readOnly, onClose, onConfirm}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <AlertTriangle className="size-5"/>
                        </div>
                        <div>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">
                                {readOnly ? 'Leave review?' : 'Finish tournament?'}
                            </h2>
                            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">
                                {readOnly
                                    ? 'This will return you to the tournament detail page.'
                                    : 'This action submits your tournament run and returns you to the leaderboard.'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close finish modal"
                    >
                        <X className="size-5"/>
                    </button>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={readOnly ? 'primary' : 'danger'} onClick={onConfirm}>
                        {readOnly ? 'Go back' : 'Finish round'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function MobilePanel({open, onClose, children}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-slate-950/50 lg:hidden">
            <div className="ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-slate-50 p-4 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="m-0 font-display text-xl font-black text-slate-950">Tournament panel</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close round panel"
                    >
                        <X className="size-5"/>
                    </button>
                </div>
                <div className="space-y-4">{children}</div>
            </div>
        </div>
    );
}

function TournamentQuestionPage() {
    const {token, loading} = useAuth();
    const {tournamentId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [tournamentQuestionMap, setTournamentQuestionMap] = useState({});
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [participantInfo, setParticipantInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();

    const finishTournament = useCallback(async () => {
        try {
            await api.post(`api/tournaments/${tournamentId}/finish/`, {});
            navigate(`/tournament/${tournamentId}`);
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'An error occurred while finishing the tournament.'});
        }
    }, [tournamentId, navigate]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const response = await api.get(`api/tournaments/${tournamentId}/leaderboard/`);
            setLeaderboardData(response.data);
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'An error occurred while fetching leaderboard.'});
        }
    }, [tournamentId]);

    useEffect(() => {
        const fetchTournamentQuestions = async () => {
            try {
                const response = await api.post(`api/tournaments/${tournamentId}/questions/`, {});
                setQuestions(response.data);
                const questionMap = {};
                response.data.forEach((tournamentQuestion) => {
                    questionMap[tournamentQuestion.question.id] = tournamentQuestion.id;
                });
                setTournamentQuestionMap(questionMap);
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'An error occurred while fetching tournament questions.'});
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipantInfo = async () => {
            try {
                const response = await api.get(`api/tournaments/${tournamentId}/get_participation_info/`);
                setParticipantInfo(response.data);
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'An error occurred while fetching tournament information.'});
            }
        };

        if (!loading && token) {
            fetchTournamentQuestions();
            fetchParticipantInfo();
            fetchLeaderboard();
        }
    }, [tournamentId, token, loading, fetchLeaderboard]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setIsReadOnly(searchParams.get('readonly') === 'true');
    }, []);

    useEffect(() => {
        if (!participantInfo || isReadOnly) return undefined;
        const timer = setInterval(() => {
            const now = new Date();
            const endTime = new Date(participantInfo.end_time);
            const difference = endTime - now;

            if (difference > 0) {
                setTimeLeft(Math.round(difference / 1000));
            } else {
                clearInterval(timer);
                setTimeLeft(0);
                finishTournament();
            }
        }, 500);

        return () => clearInterval(timer);
    }, [participantInfo, finishTournament, isReadOnly]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--:--';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleQuestionSubmit = async (id, choice) => {
        if (isReadOnly) return;

        try {
            const response = await api.post(`api/tournaments/${tournamentId}/submit-answer/`, {
                question_id: id,
                selected_choice: choice,
                tournament_question_id: tournamentQuestionMap[id],
            });
            const tournamentQuestionId = tournamentQuestionMap[id];
            const status = response.data.status;
            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === tournamentQuestionId ? {...q, status} : q
                )
            );
            fetchLeaderboard();
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'An error occurred while submitting the answer.'});
        }
    };

    const confirmFinish = () => {
        if (isReadOnly) {
            navigate(`/tournament/${tournamentId}`);
            return;
        }
        finishTournament();
    };

    const answeredCount = questions.filter((question) => question.status !== 'Blank').length;
    const sidePanel = (
        <>
            <TournamentInfo participantInfo={participantInfo} timeLeft={formatTime(timeLeft)}/>
            <Leaderboard
                leaderboardData={leaderboardData}
                tournamentStartTime={participantInfo?.start_time}
            />
        </>
    );

    if (loadingQuestions) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading tournament questions…
                    </div>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-4 sm:py-6">
            <PageContainer className="max-w-[1180px]">
                {notice && (
                    <div className="mb-5">
                        <Alert type={notice.type}>{notice.text}</Alert>
                    </div>
                )}

                <header className="mb-5 border-b border-slate-200 pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="m-0 font-display text-2xl font-black text-slate-950 sm:text-3xl">
                                {isReadOnly ? 'Review tournament' : participantInfo?.tournament?.name || 'Tournament'}
                            </h1>
                            <p className="m-0 mt-1 text-sm text-slate-500">
                                {answeredCount}/{questions.length} answered. Leaderboard updates after each answer.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button variant="secondary" onClick={() => setPanelOpen(true)} className="lg:hidden">
                                <Menu className="size-4"/> Panel
                            </Button>
                            <Button variant={isReadOnly ? 'secondary' : 'danger'} onClick={() => setConfirmOpen(true)}>
                                <ArrowLeft className="size-4"/> {isReadOnly ? 'Go back' : 'Finish tournament'}
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-primary-600 transition-all"
                            style={{width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`}}
                        />
                    </div>
                </header>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_330px]">
                    <main className="space-y-5">
                        {questions.map((question, i) => (
                            <Question
                                questionData={question.question}
                                key={question.id}
                                onSubmit={handleQuestionSubmit}
                                status={question.status}
                                questionNumber={i + 1}
                                disabled={isReadOnly}
                            />
                        ))}
                    </main>

                    <aside className="hidden space-y-3 lg:sticky lg:top-5 lg:block lg:max-h-[calc(100vh-2.5rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
                        {sidePanel}
                    </aside>
                </div>
            </PageContainer>

            <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="fixed bottom-5 right-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-lg lg:hidden"
                aria-label="Open tournament panel"
            >
                <Menu className="size-6"/>
            </button>

            <MobilePanel open={panelOpen} onClose={() => setPanelOpen(false)}>
                {sidePanel}
            </MobilePanel>

            <ConfirmFinishModal
                open={confirmOpen}
                readOnly={isReadOnly}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmFinish}
            />
        </div>
    );
}

export default TournamentQuestionPage;
