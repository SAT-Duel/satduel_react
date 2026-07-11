import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ChevronRight, Clock, Swords} from 'lucide-react';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import Question from '../components/Question';
import UserAvatar from '../components/UserAvatar';
import useOpponentProgress from '../hooks/useOpponentProgress';
import api from '../components/api';
import '../styles/landing.css';

const EMOJIS = ['👍', '🔥', '😂', '😮'];

function formatTime(seconds) {
    if (seconds === null) return '--:--';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function Duelist({player, label, score, answered, total, emote}) {
    return (
        <div className="relative min-w-0 flex-1 text-center">
            <div className="relative mx-auto w-fit">
                <UserAvatar profile={player || {username: label}} size="md" rounded="xl"/>
                {emote && (
                    <span key={emote.id} className="sd-duel-emote absolute -top-10 left-1/2 z-10 text-4xl drop-shadow-lg">
                        {emote.emoji}
                    </span>
                )}
            </div>
            <p className="m-0 mt-2 truncate font-bold text-slate-900">{player?.username || label}</p>
            <p className="m-0 mt-0.5 text-xs font-bold text-primary-600">
                {player?.elo_rating != null ? `${player.elo_rating} Elo` : '— Elo'}
            </p>
            <p className="m-0 mt-0.5 text-2xl font-black text-slate-950">{score}</p>
            <p className="m-0 text-xs font-semibold text-slate-400">{answered}/{total} answered</p>
        </div>
    );
}

function ProgressDots({questions, activeIndex}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {questions.map((entry, index) => {
                const color = entry.status === 'Correct'
                    ? 'bg-emerald-500'
                    : entry.status === 'Incorrect'
                        ? 'bg-rose-500'
                        : index === activeIndex ? 'bg-primary-500 ring-4 ring-primary-100' : 'bg-slate-200';
                return <span key={entry.id} className={`size-2.5 rounded-full ${color}`} title={`Question ${index + 1}: ${entry.status}`}/>;
            })}
        </div>
    );
}

function DuelBattlePage() {
    const {loading} = useAuth();
    const {roomId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [trackedQuestionMap, setTrackedQuestionMap] = useState({});
    const [opponentProgress, setOpponentProgress] = useState([]);
    const [players, setPlayers] = useState({currentUser: null, opponent: null});
    const [emotes, setEmotes] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [notice, setNotice] = useState(null);
    const finishing = useRef(false);
    const navigate = useNavigate();

    const finishMatch = useCallback(async () => {
        if (finishing.current) return;
        finishing.current = true;
        try {
            await api.post('api/match/end_match/', {room_id: roomId});
            navigate(`/battle_result/${roomId}`);
        } catch (err) {
            finishing.current = false;
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not end the match.'});
        }
    }, [navigate, roomId]);

    useEffect(() => {
        if (loading || loadingQuestions) return;
        if (questions.length && opponentProgress.length
            && questions.every((entry) => entry.status !== 'Blank')
            && opponentProgress.every((entry) => entry.status !== 'Blank')) {
            finishMatch();
        }
    }, [finishMatch, loading, loadingQuestions, opponentProgress, questions]);

    useEffect(() => {
        const loadBattle = async () => {
            try {
                const [timeResponse, infoResponse] = await Promise.all([
                    api.post('api/match/get_end_time/', {room_id: roomId}),
                    api.post('api/match/info/', {room_id: roomId}),
                ]);
                setEndTime(new Date(timeResponse.data.end_time));
                setPlayers(infoResponse.data);
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'Could not load battle information.'});
            }
        };
        if (!loading) loadBattle();
    }, [loading, roomId]);

    useEffect(() => {
        if (!endTime) return undefined;
        const tick = () => {
            const remaining = Math.max(0, Math.round((endTime - new Date()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) finishMatch();
        };
        tick();
        const timer = setInterval(tick, 500);
        return () => clearInterval(timer);
    }, [endTime, finishMatch]);

    useOpponentProgress(roomId, setOpponentProgress);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.post('api/match/questions/', {room_id: roomId});
                setQuestions(response.data);
                const firstBlank = response.data.findIndex((entry) => entry.status === 'Blank');
                setActiveIndex(firstBlank === -1 ? response.data.length : firstBlank);
                setTrackedQuestionMap(Object.fromEntries(
                    response.data.map((entry) => [entry.question.id, entry.id]),
                ));
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'Could not load duel questions.'});
            } finally {
                setLoadingQuestions(false);
            }
        };
        if (!loading) fetchQuestions();
    }, [loading, roomId]);

    useEffect(() => {
        const fetchEmotes = async () => {
            try {
                const response = await api.get('api/match/emotes/', {params: {room_id: roomId}});
                setEmotes(response.data.emotes || []);
            } catch {
                // Reactions are optional; the duel continues if polling misses.
            }
        };
        if (loading) return undefined;
        fetchEmotes();
        const interval = setInterval(fetchEmotes, 1200);
        return () => clearInterval(interval);
    }, [loading, roomId]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const response = await api.post('api/match/update/', {
                tracked_question_id: trackedQuestionMap[id],
                selected_choice: choice,
            });
            const result = response.data.result;
            setQuestions((previous) => previous.map((entry) =>
                entry.id === trackedQuestionMap[id]
                    ? {...entry, status: result === 'correct' ? 'Correct' : 'Incorrect'}
                    : entry));
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not save your answer.'});
        }
    };

    const sendEmote = async (emoji) => {
        try {
            const response = await api.post('api/match/emotes/', {room_id: roomId, emoji});
            setEmotes(response.data.emotes || []);
        } catch (err) {
            if (err.response?.status !== 429) {
                setNotice({type: 'error', text: 'Could not send that reaction.'});
            }
        }
    };

    const recentEmote = (userId) => [...emotes].reverse().find((emote) =>
        emote.sender_id === userId && Date.now() - new Date(emote.visible_at).getTime() < 3000);
    const answeredCount = questions.filter((entry) => entry.status !== 'Blank').length;
    const opponentAnsweredCount = opponentProgress.filter((entry) => entry.status !== 'Blank').length;
    const myScore = questions.filter((entry) => entry.status === 'Correct').length;
    const opponentScore = opponentProgress.filter((entry) => entry.status === 'Correct').length;
    const activeQuestion = questions[activeIndex];

    if (loadingQuestions || !endTime) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading duel…
                    </div>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="sat-bubble-field min-h-screen py-6 sm:py-8">
            <PageContainer>
                {notice && <div className="mb-4"><Alert>{notice.text}</Alert></div>}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#131B2C] px-5 py-4 text-white shadow-lg">
                    <span className="inline-flex items-center gap-2 font-display text-lg font-bold">
                        <Swords className="size-5 text-primary-300"/> Live duel
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                        Question {Math.min(activeIndex + 1, questions.length)} of {questions.length}
                    </span>
                    <span className="inline-flex items-center gap-2 font-display text-xl font-bold text-amber-300">
                        <Clock className="size-5"/> {formatTime(timeLeft)}
                    </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <main className="space-y-4">
                        <Card className="flex items-center justify-between gap-4 p-4">
                            <ProgressDots questions={questions} activeIndex={activeIndex}/>
                            <span className="shrink-0 text-sm font-bold text-slate-500">{answeredCount}/{questions.length}</span>
                        </Card>

                        {activeQuestion ? (
                            <>
                                <Question
                                    questionData={activeQuestion.question}
                                    key={activeQuestion.id}
                                    onSubmit={handleQuestionSubmit}
                                    status={activeQuestion.status}
                                    questionNumber={activeIndex + 1}
                                    totalQuestions={questions.length}
                                />
                                {activeQuestion.status !== 'Blank' && (
                                    <div className="flex justify-end">
                                        <Button onClick={() => setActiveIndex((index) => index + 1)}>
                                            {activeIndex + 1 === questions.length ? 'Finish' : 'Next question'}
                                            <ChevronRight className="size-4"/>
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Card className="p-8 text-center">
                                <h2 className="m-0 text-xl font-bold text-slate-900">All answers saved</h2>
                                <p className="m-0 mt-2 text-slate-500">Your rival is finishing up. The result opens automatically.</p>
                            </Card>
                        )}
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <Card className="sat-arena-card p-5">
                            <div className="flex items-start gap-3">
                                <Duelist
                                    player={players.currentUser}
                                    label="You"
                                    score={myScore}
                                    answered={answeredCount}
                                    total={questions.length}
                                    emote={recentEmote(players.currentUser?.id)}
                                />
                                <span className="pt-8 font-display text-xl font-black text-slate-300">VS</span>
                                <Duelist
                                    player={players.opponent}
                                    label="Opponent"
                                    score={opponentScore}
                                    answered={opponentAnsweredCount}
                                    total={opponentProgress.length || questions.length}
                                    emote={recentEmote(players.opponent?.id)}
                                />
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <p className="m-0 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Send a reaction</p>
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => sendEmote(emoji)}
                                            aria-label={`Send ${emoji}`}
                                            className="cursor-pointer rounded-xl border border-slate-200 bg-white py-2 text-2xl transition-transform hover:-translate-y-0.5 hover:bg-slate-50"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-base font-bold text-slate-900">Rival progress</h2>
                                <span className="text-sm font-bold text-primary-600">{opponentAnsweredCount}/{opponentProgress.length || questions.length}</span>
                            </div>
                            <div className="mt-4">
                                <ProgressDots questions={opponentProgress} activeIndex={opponentAnsweredCount}/>
                            </div>
                        </Card>
                    </aside>
                </div>
            </PageContainer>
        </div>
    );
}

export default DuelBattlePage;
