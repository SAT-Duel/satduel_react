import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {CheckCircle2, Clock, MinusCircle, Swords, XCircle} from 'lucide-react';
import {Alert, Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import Question from '../components/Question';
import useOpponentProgress from '../hooks/useOpponentProgress';
import api from '../components/api';

function formatTime(seconds) {
    if (seconds === null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function statusMeta(status) {
    if (status === 'Correct') {
        return {
            icon: CheckCircle2,
            classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
    }
    if (status === 'Incorrect') {
        return {
            icon: XCircle,
            classes: 'bg-rose-50 text-rose-700 border-rose-200',
        };
    }
    return {
        icon: MinusCircle,
        classes: 'bg-slate-50 text-slate-500 border-slate-200',
    };
}

function ProgressRow({status, questionNumber}) {
    const meta = statusMeta(status);
    const Icon = meta.icon;
    return (
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${meta.classes}`}>
            <Icon className="size-4"/>
            <span>Question {questionNumber}</span>
            <span className="ml-auto">{status}</span>
        </div>
    );
}

function DuelBattlePage() {
    const {loading} = useAuth();
    const {roomId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [trackedQuestionMap, setTrackedQuestionMap] = useState({});
    const [opponentProgress, setOpponentProgress] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();

    const endMatch = useCallback(async () => {
        try {
            await api.post('api/match/end_match/', {room_id: roomId});
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not end the match.'});
        }
    }, [roomId]);

    useEffect(() => {
        if (loading || loadingQuestions) return;
        if (
            questions.length > 0 &&
            opponentProgress.length > 0 &&
            questions.every((entry) => entry.status !== 'Blank') &&
            opponentProgress.every((entry) => entry.status !== 'Blank')
        ) {
            endMatch();
            navigate(`/battle_result/${roomId}`);
        }
    }, [endMatch, loading, loadingQuestions, navigate, opponentProgress, questions, roomId]);

    useEffect(() => {
        const fetchEndTime = async () => {
            try {
                const response = await api.post('api/match/get_end_time/', {room_id: roomId});
                setEndTime(new Date(response.data.end_time));
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'Could not load battle timer.'});
            }
        };
        fetchEndTime();
    }, [roomId]);

    useEffect(() => {
        if (!endTime) return undefined;
        const timer = setInterval(() => {
            const difference = endTime - new Date();
            if (difference > 0) {
                setTimeLeft(Math.round(difference / 1000));
            } else {
                clearInterval(timer);
                setTimeLeft(0);
                endMatch();
                navigate(`/battle_result/${roomId}`);
            }
        }, 500);

        return () => clearInterval(timer);
    }, [endMatch, endTime, navigate, roomId]);

    useOpponentProgress(roomId, setOpponentProgress);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.post('api/match/questions/', {room_id: roomId});
                setQuestions(response.data);
                const questionMap = {};
                response.data.forEach((trackedQuestion) => {
                    questionMap[trackedQuestion.question.id] = trackedQuestion.id;
                });
                setTrackedQuestionMap(questionMap);
            } catch (err) {
                setNotice({type: 'error', text: err.response?.data?.error || 'Could not load duel questions.'});
            } finally {
                setLoadingQuestions(false);
            }
        };

        if (!loading) {
            fetchQuestions();
        }
    }, [loading, roomId]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const trackedQuestionId = trackedQuestionMap[id];
            const answerResponse = await api.post('api/check_answer/', {
                question_id: id,
                selected_choice: choice,
            });
            const result = answerResponse.data.result;
            const updateResponse = await api.post('api/match/update/', {
                tracked_question_id: trackedQuestionId,
                result,
            });

            if (updateResponse.data.status === 'success') {
                setQuestions((previousQuestions) =>
                    previousQuestions.map((question) =>
                        question.id === trackedQuestionId
                            ? {...question, status: result === 'correct' ? 'Correct' : 'Incorrect'}
                            : question
                    )
                );
            }
        } catch (err) {
            setNotice({type: 'error', text: err.response?.data?.error || 'Could not save your answer.'});
        }
    };

    const answeredCount = questions.filter((question) => question.status !== 'Blank').length;
    const opponentAnsweredCount = opponentProgress.filter((question) => question.status !== 'Blank').length;
    const userDone = questions.length > 0 && answeredCount === questions.length;

    if (loadingQuestions) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading duel…
                    </div>
                </PageContainer>
            </div>
        );
    }

    if (!endTime) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading battle information…
                    </div>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer>
                {notice && (
                    <div className="mb-6">
                        <Alert type={notice.type === 'success' ? 'success' : 'error'}>{notice.text}</Alert>
                    </div>
                )}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                                <Swords className="size-4"/> Live duel
                            </span>
                            <h1 className="m-0 mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                                Answer quickly. Stay accurate.
                            </h1>
                            <p className="m-0 mt-2 text-slate-600">
                                Your answers save instantly. Results unlock when both players finish or the timer ends.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="m-0 text-sm font-semibold text-slate-500">Time left</p>
                                <p className="m-0 mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
                                    <Clock className="size-5 text-primary-600"/> {formatTime(timeLeft)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="m-0 text-sm font-semibold text-slate-500">You</p>
                                <p className="m-0 mt-1 text-2xl font-bold text-slate-900">
                                    {answeredCount}/{questions.length}
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="m-0 text-sm font-semibold text-slate-500">Opponent</p>
                                <p className="m-0 mt-1 text-2xl font-bold text-slate-900">
                                    {opponentAnsweredCount}/{opponentProgress.length || questions.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <main className="space-y-5">
                        {questions.map((trackedQuestion, index) => (
                            <Question
                                questionData={trackedQuestion.question}
                                key={trackedQuestion.id}
                                onSubmit={handleQuestionSubmit}
                                status={trackedQuestion.status}
                                questionNumber={index + 1}
                            />
                        ))}

                        {userDone && (
                            <Card className="p-5 text-center">
                                <h2 className="m-0 text-xl font-bold text-slate-900">Answers saved</h2>
                                <p className="mx-auto mt-2 max-w-md text-slate-600">
                                    Waiting for your opponent. You can leave safely and find the result later in your profile history.
                                </p>
                            </Card>
                        )}
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <Card className="p-5">
                            <h2 className="m-0 text-xl font-bold text-slate-900">Opponent progress</h2>
                            <div className="mt-4 space-y-2">
                                {opponentProgress.length ? opponentProgress.map((trackedQuestion, index) => (
                                    <ProgressRow
                                        key={trackedQuestion.id}
                                        status={trackedQuestion.status}
                                        questionNumber={index + 1}
                                    />
                                )) : (
                                    <p className="m-0 text-sm text-slate-500">Waiting for progress updates…</p>
                                )}
                            </div>
                        </Card>

                        <Card className="p-5">
                            <h2 className="m-0 text-xl font-bold text-slate-900">Match timer</h2>
                            <div className="mt-4 rounded-2xl bg-primary-50 px-5 py-6 text-center">
                                <p className="m-0 font-display text-4xl font-bold text-primary-700">
                                    {formatTime(timeLeft)}
                                </p>
                                <p className="m-0 mt-1 text-sm font-semibold text-primary-700">remaining</p>
                            </div>
                        </Card>
                    </aside>
                </div>
            </PageContainer>
        </div>
    );
}

export default DuelBattlePage;
