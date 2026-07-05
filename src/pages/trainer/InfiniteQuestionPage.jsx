import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Award, CheckCircle2, Crown, Flame, LineChart, Lock, RotateCcw, Trophy} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Alert, Button, Card, PageContainer, Select, Spinner} from '../../components/ui';

const LEVEL_THRESHOLDS = [1, 5, 10, 20, 50, 100, 200];

function getLevel(xp) {
    if (xp < 1) return 0;
    if (xp < 5) return 1;
    if (xp < 10) return 2;
    if (xp < 20) return 3;
    if (xp < 50) return 4;
    if (xp < 100) return 5;
    if (xp < 200) return 6;
    return 7;
}

function getXPForNextLevel(level) {
    return LEVEL_THRESHOLDS[level] ?? Infinity;
}

function calculateProgressPercentage(stats) {
    const previousThreshold = stats.level <= 0 ? 0 : getXPForNextLevel(stats.level - 1);
    const nextThreshold = getXPForNextLevel(stats.level);
    if (!Number.isFinite(nextThreshold)) return 100;
    const progress = ((stats.xp - previousThreshold) / (nextThreshold - previousThreshold)) * 100;
    return Math.max(0, Math.min(progress, 100));
}

function StatTile({icon: Icon, label, value}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Icon className="size-5"/>
            </div>
            <p className="m-0 text-2xl font-bold text-slate-900">{value}</p>
            <p className="m-0 mt-1 text-sm font-medium text-slate-500">{label}</p>
        </div>
    );
}

function InfiniteQuestionsPage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [error, setError] = useState(null);
    const [quota, setQuota] = useState(null); // {used, limit, remaining, is_premium}
    const [spElo, setSpElo] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('any');
    const [limitReached, setLimitReached] = useState(false);
    const [stats, setStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
        xp: 0,
        level: 0,
        coins: 0,
        multiplier: 1,
    });
    const [isFinished, setIsFinished] = useState(false);
    const {loading} = useAuth();

    const hasFetchedData = useRef(false);
    const navigate = useNavigate();

    const saveStats = useCallback(async (statsToSave) => {
        try {
            await api.post('/api/trainer/set_infinite_question_stats/', {
                correct_number: statsToSave.correctAnswers,
                incorrect: statsToSave.questionsAnswered - statsToSave.correctAnswers,
                current_streak: statsToSave.streak,
                xp: statsToSave.xp,
                level: statsToSave.level,
                coins: statsToSave.coins,
                multiplier: statsToSave.multiplier,
            });
        } catch (saveError) {
            console.error('Error saving stats:', saveError.response ? saveError.response.data : saveError);
        }
    }, []);

    const fetchNextQuestion = useCallback(async (topic) => {
        if (isFinished) return;
        try {
            setLoadingQuestions(true);
            setError(null);
            const params = {};
            const effectiveTopic = typeof topic === 'string' ? topic : selectedTopic;
            if (effectiveTopic && effectiveTopic !== 'any') params.type = effectiveTopic;
            const response = await api.get('api/practice/next/', {params});
            setCurrentQuestion(response.data.question || null);
            setQuota(response.data.quota || null);
            setQuestionStatus('Blank');
        } catch (fetchError) {
            const data = fetchError.response?.data;
            if (data?.error === 'daily_limit') {
                setQuota(data.quota || null);
                setLimitReached(true);
            } else if (data?.error === 'premium_required') {
                setSelectedTopic('any');
                const response = await api.get('api/practice/next/');
                setCurrentQuestion(response.data.question || null);
                setQuota(response.data.quota || null);
                setQuestionStatus('Blank');
            } else {
                setError(data?.error || 'Could not load a question.');
            }
        } finally {
            setLoadingQuestions(false);
        }
    }, [isFinished, selectedTopic]);

    const fetchPracticeStatus = useCallback(async () => {
        try {
            const response = await api.get('api/practice/status/');
            setQuota(response.data.quota || null);
            setSpElo(response.data.sp_elo_rating ?? null);
            setTopics(response.data.topics || []);
            if (response.data.quota?.remaining === 0) {
                setLimitReached(true);
            }
        } catch {
            // Non-blocking; the page works without the status panel.
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get('/api/trainer/infinite_question_stats/');
            const statsData = response.data;
            setStats({
                questionsAnswered: statsData.correct_number + statsData.incorrect_number,
                correctAnswers: statsData.correct_number,
                streak: statsData.current_streak,
                xp: statsData.xp,
                level: statsData.level,
                coins: statsData.coins,
                multiplier: statsData.total_multiplier || statsData.multiplier || 1,
            });
        } catch (fetchError) {
            setError(fetchError.response?.data?.error || 'Could not load your practice stats.');
        }
    }, []);

    useEffect(() => {
        if (!loading && !hasFetchedData.current) {
            fetchNextQuestion();
            fetchStats();
            fetchPracticeStatus();
            hasFetchedData.current = true;
        }
    }, [fetchNextQuestion, fetchPracticeStatus, fetchStats, loading]);

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
        fetchNextQuestion(topic);
    };

    const handleQuestionSubmit = async (id, choice) => {
        if (isFinished || questionStatus !== 'Blank') return;
        try {
            const response = await api.post('api/check_answer/', {
                question_id: id,
                selected_choice: choice,
                mode: 'practice',
            });
            if (response.data.quota) setQuota(response.data.quota);
            if (response.data.sp_elo_rating != null) setSpElo(response.data.sp_elo_rating);
            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');

            setStats((previousStats) => {
                const nextXp = isCorrect ? previousStats.xp + 1 : previousStats.xp;
                const newStats = {
                    questionsAnswered: previousStats.questionsAnswered + 1,
                    correctAnswers: isCorrect ? previousStats.correctAnswers + 1 : previousStats.correctAnswers,
                    streak: isCorrect ? previousStats.streak + 1 : 0,
                    xp: nextXp,
                    level: getLevel(nextXp),
                    coins: previousStats.coins,
                    multiplier: previousStats.multiplier,
                };

                saveStats(newStats);
                return newStats;
            });
        } catch (submitError) {
            const data = submitError.response?.data;
            if (data?.error === 'daily_limit') {
                setQuota(data.quota || null);
                setLimitReached(true);
            } else {
                setError(data?.error || 'Could not check your answer.');
            }
        }
    };

    const handleEndSession = () => {
        setIsFinished(true);
        saveStats(stats);
    };

    const nextLevelXP = getXPForNextLevel(stats.level);
    const xpRemaining = Number.isFinite(nextLevelXP) ? Math.max(nextLevelXP - stats.xp, 0) : 0;
    const accuracy = stats.questionsAnswered > 0
        ? `${((stats.correctAnswers / stats.questionsAnswered) * 100).toFixed(1)}%`
        : '—';

    if (loadingQuestions && !currentQuestion && !isFinished) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading question…
                    </div>
                </PageContainer>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="max-w-2xl">
                    <Alert>{error}</Alert>
                    <Button onClick={() => setError(null)} variant="secondary" className="mt-4">
                        Dismiss
                    </Button>
                </PageContainer>
            </div>
        );
    }

    if (limitReached && !isFinished) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
                <PageContainer className="max-w-2xl">
                    <Card className="p-8 text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50">
                            <Lock className="size-7 text-amber-600"/>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-slate-900">
                            That's your free practice for today
                        </h1>
                        <p className="mx-auto mt-3 max-w-md text-slate-600">
                            You answered {quota?.used ?? quota?.limit ?? ''} questions today — nice work.
                            Come back tomorrow for {quota?.limit ?? 25} more, or go premium for
                            unlimited practice and topic selection.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button size="lg">
                                <Crown className="size-5"/> Get premium
                            </Button>
                            <Button to="/trainer" variant="secondary" size="lg">
                                Back to trainer
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            Premium is coming soon — pricing will be announced shortly.
                        </p>
                    </Card>
                </PageContainer>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
                <PageContainer className="max-w-3xl">
                    <Card className="p-6 text-center sm:p-8">
                        <Trophy className="mx-auto size-12 text-primary-600"/>
                        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">Practice session complete</h1>
                        <p className="mx-auto mt-2 max-w-md text-slate-600">
                            Your stats were saved. Come back tomorrow to keep the streak moving.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-4">
                            <StatTile icon={CheckCircle2} label="Answered" value={stats.questionsAnswered}/>
                            <StatTile icon={Award} label="Correct" value={stats.correctAnswers}/>
                            <StatTile icon={Flame} label="Streak" value={stats.streak}/>
                            <StatTile icon={LineChart} label="Accuracy" value={accuracy}/>
                        </div>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={() => navigate('/trainer')}>
                                Return to trainer
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsFinished(false);
                                    fetchNextQuestion();
                                }}
                            >
                                <RotateCcw className="size-4"/> Keep practicing
                            </Button>
                        </div>
                    </Card>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                            <LineChart className="size-4"/> Adaptive practice
                        </span>
                        <h1 className="m-0 mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                            Daily SAT question practice
                        </h1>
                        <p className="mt-2 max-w-2xl text-slate-600">
                            Answer one question at a time. Your streak, XP, and practice rating update as you go.
                        </p>
                    </div>
                    <Button onClick={handleEndSession} variant="secondary">
                        End session
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <main>
                        {currentQuestion && (
                            <Question
                                questionData={currentQuestion}
                                onSubmit={handleQuestionSubmit}
                                status={questionStatus}
                                questionNumber={stats.questionsAnswered + 1}
                            />
                        )}

                        <Card className="mt-5 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="m-0 font-semibold text-slate-700">
                                            {Number.isFinite(nextLevelXP)
                                                ? `${xpRemaining} XP until level ${stats.level + 1}`
                                                : 'Max level reached'}
                                        </p>
                                        <p className="m-0 text-sm font-bold text-primary-600">
                                            Level {stats.level}
                                        </p>
                                    </div>
                                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-primary-600 transition-all"
                                            style={{width: `${calculateProgressPercentage(stats)}%`}}
                                        />
                                    </div>
                                </div>

                                {questionStatus !== 'Blank' && (
                                    <Button onClick={() => fetchNextQuestion()} disabled={loadingQuestions}>
                                        Next question
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-xl font-bold text-slate-900">Topic</h2>
                                {!quota?.is_premium && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                        <Lock className="size-3"/> Premium
                                    </span>
                                )}
                            </div>
                            {quota?.is_premium ? (
                                <div className="mt-4">
                                    <Select
                                        value={selectedTopic}
                                        onChange={(e) => handleTopicChange(e.target.value)}
                                    >
                                        <option value="any">All topics (random)</option>
                                        {topics.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </Select>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <p className="m-0 text-sm text-slate-600">
                                        Free practice serves a random mix of topics, up to
                                        {quota?.limit ? ` ${quota.limit}` : ' 25'} questions per day.
                                    </p>
                                </div>
                            )}
                        </Card>

                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-xl font-bold text-slate-900">Today</h2>
                                {spElo != null && (
                                    <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
                                        {spElo} rating
                                    </span>
                                )}
                            </div>
                            {quota && (
                                <div className="mt-4">
                                    {quota.limit == null ? (
                                        <p className="m-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                            <Crown className="size-4"/> Unlimited practice — {quota.used} answered today
                                        </p>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                                                <span>{quota.used} of {quota.limit} free questions</span>
                                                <span>{quota.remaining} left</span>
                                            </div>
                                            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        quota.remaining <= 5 ? 'bg-amber-500' : 'bg-primary-600'
                                                    }`}
                                                    style={{width: `${Math.min(100, (quota.used / quota.limit) * 100)}%`}}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </Card>

                        <Card className="p-5">
                            <h2 className="m-0 text-xl font-bold text-slate-900">Session stats</h2>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <StatTile icon={CheckCircle2} label="Answered" value={stats.questionsAnswered}/>
                                <StatTile icon={Award} label="Correct" value={stats.correctAnswers}/>
                                <StatTile icon={Flame} label="Streak" value={stats.streak}/>
                                <StatTile icon={LineChart} label="Accuracy" value={accuracy}/>
                            </div>
                        </Card>

                    </aside>
                </div>
            </PageContainer>
        </div>
    );
}

export default withAuth(InfiniteQuestionsPage);
