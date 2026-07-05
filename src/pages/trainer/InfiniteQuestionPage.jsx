import React, {useCallback, useEffect, useRef, useState} from 'react';
import Lottie from 'react-lottie';
import {useNavigate} from 'react-router-dom';
import {Award, CheckCircle2, Coins, Flame, LineChart, RotateCcw, Trophy, X} from 'lucide-react';
import animationData from '../../animations/lootbox.json';
import {useAuth} from '../../context/AuthContext';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Alert, Button, Card, PageContainer, Spinner} from '../../components/ui';

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

    const [isLootboxOpened, setIsLootboxOpened] = useState(false);
    const [isLootboxVisible, setIsLootboxVisible] = useState(false);
    const [animationStopped, setAnimationStopped] = useState(true);
    const [lootboxMessage, setLootboxMessage] = useState('');
    const [levelUpMessage, setLevelUpMessage] = useState('');
    const [showReward, setShowReward] = useState(false);
    const [canCloseLootbox, setCanCloseLootbox] = useState(false);

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

    const fetchNextQuestion = useCallback(async () => {
        if (isFinished) return;
        try {
            setLoadingQuestions(true);
            setError(null);
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: 'any',
                page: 1,
                page_size: 1,
                random: true,
            }).toString();
            const response = await api.get(`api/filter_questions/?${queryParams}`);
            setCurrentQuestion(response.data.questions?.[0] || null);
            setQuestionStatus('Blank');
        } catch (fetchError) {
            setError(fetchError.response?.data?.error || 'Could not load a question.');
        } finally {
            setLoadingQuestions(false);
        }
    }, [isFinished]);

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
            hasFetchedData.current = true;
        }
    }, [fetchNextQuestion, fetchStats, loading]);

    const handleQuestionSubmit = async (id, choice) => {
        if (isFinished || questionStatus !== 'Blank') return;
        try {
            const response = await api.post('api/check_answer/', {
                question_id: id,
                selected_choice: choice,
            });
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
                    coins: isCorrect
                        ? previousStats.coins + Math.floor(Math.random() * 3 * previousStats.multiplier)
                        : previousStats.coins,
                    multiplier: previousStats.multiplier,
                };

                if (newStats.level > previousStats.level) {
                    setLevelUpMessage('Level up');

                    const coinRewards = [
                        10 * newStats.level,
                        20 * newStats.level,
                        30 * newStats.level,
                        40 * newStats.level,
                        50 * newStats.level,
                        66 * newStats.level,
                        newStats.level ** 2,
                        newStats.level ** 3,
                        newStats.level ** 5,
                        666 * newStats.level,
                    ];
                    const multiplierRewards = [
                        1.01 * newStats.level,
                        1.02 * newStats.level,
                        1.05 * newStats.level,
                        1.06 * newStats.level,
                        1.1 * newStats.level,
                        1.2 * newStats.level,
                        1.25 * newStats.level,
                    ].map((value) => parseFloat(value.toFixed(2)));

                    if (Math.random() < 0.33) {
                        const reward = multiplierRewards[Math.floor(Math.random() * multiplierRewards.length)];
                        setLootboxMessage(`${reward}x permanent coin multiplier`);
                        newStats.multiplier *= reward;
                    } else {
                        const reward = Math.round(
                            coinRewards[Math.floor(Math.random() * coinRewards.length)] * newStats.multiplier
                        );
                        setLootboxMessage(`${reward} coins`);
                        newStats.coins += reward;
                    }

                    setIsLootboxVisible(true);
                    setIsLootboxOpened(false);
                    setAnimationStopped(true);
                    setShowReward(false);
                    setCanCloseLootbox(false);
                }

                saveStats(newStats);
                return newStats;
            });
        } catch (submitError) {
            setError(submitError.response?.data?.error || 'Could not check your answer.');
        }
    };

    const handleLootboxClick = () => {
        if (!isLootboxOpened) {
            setAnimationStopped(false);
            setIsLootboxOpened(true);
        } else if (canCloseLootbox) {
            setIsLootboxVisible(false);
            setIsLootboxOpened(false);
            setLevelUpMessage('');
        }
    };

    const handleAnimationComplete = () => {
        setShowReward(true);
        setCanCloseLootbox(true);
        setLevelUpMessage('');
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

    const defaultOptions = {
        loop: false,
        autoplay: !animationStopped,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

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
                                    <Button onClick={fetchNextQuestion} disabled={loadingQuestions}>
                                        Next question
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <Card className="p-5">
                            <h2 className="m-0 text-xl font-bold text-slate-900">Session stats</h2>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <StatTile icon={CheckCircle2} label="Answered" value={stats.questionsAnswered}/>
                                <StatTile icon={Award} label="Correct" value={stats.correctAnswers}/>
                                <StatTile icon={Flame} label="Streak" value={stats.streak}/>
                                <StatTile icon={LineChart} label="Accuracy" value={accuracy}/>
                            </div>
                        </Card>

                        <Card className="p-5">
                            <h2 className="m-0 text-xl font-bold text-slate-900">Rewards</h2>
                            <div className="mt-5 space-y-3">
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 font-semibold text-slate-600">
                                        <Coins className="size-4 text-amber-600"/> Coins
                                    </span>
                                    <span className="font-bold text-slate-900">{stats.coins}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span className="font-semibold text-slate-600">Multiplier</span>
                                    <span className="font-bold text-slate-900">{Number(stats.multiplier || 1).toFixed(2)}x</span>
                                </div>
                            </div>
                        </Card>
                    </aside>
                </div>
            </PageContainer>

            {isLootboxVisible && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4">
                    <button
                        type="button"
                        onClick={handleLootboxClick}
                        className="relative w-full max-w-md cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
                    >
                        <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400">
                            <X className="size-5"/>
                        </span>
                        {levelUpMessage && (
                            <p className="m-0 font-display text-3xl font-bold text-primary-600">{levelUpMessage}</p>
                        )}
                        <Lottie
                            options={defaultOptions}
                            height={280}
                            width={280}
                            isStopped={animationStopped}
                            eventListeners={[
                                {
                                    eventName: 'complete',
                                    callback: handleAnimationComplete,
                                },
                            ]}
                        />
                        {showReward ? (
                            <>
                                <p className="m-0 text-2xl font-bold text-slate-900">{lootboxMessage}</p>
                                <p className="m-0 mt-2 text-sm text-slate-500">Click to close.</p>
                            </>
                        ) : (
                            <p className="m-0 text-sm font-semibold text-slate-500">Click the box to open your reward.</p>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default withAuth(InfiniteQuestionsPage);
