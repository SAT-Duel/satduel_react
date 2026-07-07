import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CheckCircle2, Crown, Flame, Lock, TrendingDown, TrendingUp, XCircle} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Alert, Button, Card, PageContainer, Select, Spinner} from '../../components/ui';
import {billingErrorMessage, startPremiumCheckout} from '../../utils/billing';

function SessionProgress({stats, accuracy}) {
    return (
        <Card className="sat-arena-card p-5">
            <h2 className="m-0 text-lg font-bold text-slate-900">This session</h2>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="m-0 text-sm font-bold text-amber-800">Correct streak</p>
                        <p className="m-0 mt-1 text-3xl font-black text-slate-950">{stats.streak}</p>
                    </div>
                    <Flame className="size-8 text-amber-500"/>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="m-0 font-black text-slate-900">{stats.questionsAnswered}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">Answered</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="m-0 font-black text-slate-900">{accuracy}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">Accuracy</p>
                </div>
            </div>
        </Card>
    );
}

function EloBadge({elo, feedback}) {
    if (elo == null) return null;
    const delta = feedback?.delta;
    const positive = delta >= 0;

    return (
        <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
                {elo} Elo
            </span>
            {delta != null && (
                <span
                    key={feedback.id}
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                        positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                >
                    {positive ? `+${delta}` : delta} Elo
                </span>
            )}
        </div>
    );
}

function playRatingSound(isPositive) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.26);
        gain.connect(context.destination);

        const notes = isPositive ? [660, 880] : [330, 260];
        notes.forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.09);
            oscillator.connect(gain);
            oscillator.start(context.currentTime + index * 0.09);
            oscillator.stop(context.currentTime + index * 0.09 + 0.16);
        });
    } catch {
        // Audio feedback is progressive enhancement.
    }
}

function RatingPulse({feedback}) {
    if (!feedback) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="m-0 text-sm font-bold text-slate-700">Your rating moves with each answer</p>
                <p className="m-0 mt-1 text-sm text-slate-500">
                    First try counts — repeats are just review.
                </p>
            </div>
        );
    }

    const positive = feedback.delta >= 0;
    const Icon = positive ? TrendingUp : TrendingDown;
    return (
        <div
            key={feedback.id}
            className={`rounded-2xl border p-4 transition-all ${
                positive
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="m-0 text-sm font-black">{positive ? 'Rating up' : 'Rating adjusted'}</p>
                    <p className="m-0 mt-1 text-sm font-semibold">
                        {feedback.previous} → {feedback.next}
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 font-black">
                    <Icon className="size-5"/>
                    {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta}
                </div>
            </div>
        </div>
    );
}

function AnswerFeedback({status, ratingFeedback, onNext, loadingQuestions}) {
    const answered = status === 'Correct' || status === 'Incorrect';
    if (!answered) {
        return (
            <Card className="sat-arena-card p-5">
                <p className="m-0 text-sm font-bold text-slate-500">Ready</p>
                <p className="m-0 mt-1 text-lg font-black text-slate-900">Pick an answer</p>
            </Card>
        );
    }

    const correct = status === 'Correct';
    const Icon = correct ? CheckCircle2 : XCircle;

    return (
        <Card className={`sat-arena-card p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className="flex items-start gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <Icon className="size-5"/>
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`m-0 text-sm font-bold ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {correct ? 'Correct' : 'Not quite'}
                    </p>
                    <p className="m-0 mt-1 text-lg font-black text-slate-950">
                        {correct ? 'Nice work.' : 'Review it, then keep going.'}
                    </p>
                </div>
            </div>
            {ratingFeedback && (
                <div className="mt-4">
                    <RatingPulse feedback={ratingFeedback}/>
                </div>
            )}
            <Button onClick={onNext} disabled={loadingQuestions} className="mt-4" block>
                Next question
            </Button>
        </Card>
    );
}

function InfiniteQuestionsPage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [error, setError] = useState(null);
    const [quota, setQuota] = useState(null);
    const [spElo, setSpElo] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('any');
    const [limitReached, setLimitReached] = useState(false);
    const [billingLoading, setBillingLoading] = useState(false);
    const [ratingFeedback, setRatingFeedback] = useState(null);
    const [daily, setDaily] = useState(null);
    const [streakCelebration, setStreakCelebration] = useState(null);
    const [stats, setStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
    });
    const {loading} = useAuth();
    const hasFetchedData = useRef(false);

    const fetchNextQuestion = useCallback(async (topic) => {
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
            setRatingFeedback(null);
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
                setRatingFeedback(null);
            } else {
                setError(data?.error || 'Could not load a question.');
            }
        } finally {
            setLoadingQuestions(false);
        }
    }, [selectedTopic]);

    const fetchPracticeStatus = useCallback(async () => {
        try {
            const response = await api.get('api/practice/status/');
            setQuota(response.data.quota || null);
            setSpElo(response.data.sp_elo_rating ?? null);
            setTopics(response.data.topics || []);
            setDaily(response.data.daily || null);
            if (response.data.quota?.remaining === 0) {
                setLimitReached(true);
            }
        } catch {
            // Non-blocking; the page works without the status panel.
        }
    }, []);

    useEffect(() => {
        if (!loading && !hasFetchedData.current) {
            fetchNextQuestion();
            fetchPracticeStatus();
            hasFetchedData.current = true;
        }
    }, [fetchNextQuestion, fetchPracticeStatus, loading]);

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
        fetchNextQuestion(topic);
    };

    const handleQuestionSubmit = async (id, choice) => {
        if (questionStatus !== 'Blank') return;
        try {
            const response = await api.post('api/check_answer/', {
                question_id: id,
                selected_choice: choice,
                mode: 'practice',
            });
            if (response.data.quota) setQuota(response.data.quota);
            if (response.data.sp_elo_rating != null) setSpElo(response.data.sp_elo_rating);
            if (response.data.daily) {
                setDaily(response.data.daily);
                if (response.data.daily.streak_extended) {
                    setStreakCelebration(response.data.daily.streak);
                }
            }

            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');
            setStats((previousStats) => ({
                questionsAnswered: previousStats.questionsAnswered + 1,
                correctAnswers: isCorrect ? previousStats.correctAnswers + 1 : previousStats.correctAnswers,
                streak: isCorrect ? previousStats.streak + 1 : 0,
            }));
            playRatingSound(isCorrect);

            if (response.data.sp_elo_rating_delta != null) {
                const feedback = {
                    id: Date.now(),
                    previous: response.data.sp_elo_rating_previous,
                    next: response.data.sp_elo_rating,
                    delta: response.data.sp_elo_rating_delta,
                };
                setRatingFeedback(feedback);
            }
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

    const handleGetPremium = async () => {
        setBillingLoading(true);
        try {
            await startPremiumCheckout();
        } catch (e) {
            setError(billingErrorMessage(e, 'Could not start checkout.'));
            setBillingLoading(false);
        }
    };

    const accuracy = stats.questionsAnswered > 0
        ? `${Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)}%`
        : '—';

    if (loadingQuestions && !currentQuestion) {
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

    if (limitReached) {
        return (
            <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-12 sm:py-16">
                <PageContainer className="max-w-2xl">
                    <Card className="sat-arena-card p-8 text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50">
                            <Lock className="size-7 text-amber-600"/>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-slate-900">
                            That's your free practice for today
                        </h1>
                        <p className="mx-auto mt-3 max-w-md text-slate-600">
                            You answered {quota?.used ?? quota?.limit ?? ''} questions today. Come back tomorrow
                            for {quota?.limit ?? 25} more, or go premium for unlimited practice and topic selection.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button size="lg" onClick={handleGetPremium} loading={billingLoading}>
                                <Crown className="size-5"/> Get premium
                            </Button>
                            <Button to="/trainer" variant="secondary" size="lg">
                                Back to home
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            Secure checkout is handled by Stripe.
                        </p>
                    </Card>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <PageContainer>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                    <h1 className="m-0 font-display text-2xl font-bold text-slate-900">Practice</h1>
                    <span className="text-sm font-medium text-slate-400">
                        Question {stats.questionsAnswered + 1}
                    </span>
                </div>

                <div className="mb-5 lg:hidden">
                    <AnswerFeedback
                        status={questionStatus}
                        ratingFeedback={ratingFeedback}
                        onNext={() => fetchNextQuestion()}
                        loadingQuestions={loadingQuestions}
                    />
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
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <div className="hidden lg:block">
                            <AnswerFeedback
                                status={questionStatus}
                                ratingFeedback={ratingFeedback}
                                onNext={() => fetchNextQuestion()}
                                loadingQuestions={loadingQuestions}
                            />
                        </div>

                        <SessionProgress stats={stats} accuracy={accuracy}/>

                        <Card className="sat-arena-card p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-lg font-bold text-slate-900">Today</h2>
                                <EloBadge elo={spElo} feedback={ratingFeedback}/>
                            </div>
                            {daily && (
                                <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50/70 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Flame className={`size-4 ${daily.completed_today ? 'text-orange-500' : 'text-slate-300'}`}/>
                                        {daily.completed_today
                                            ? `Daily streak safe: day ${daily.streak}`
                                            : `Daily goal: ${Math.min(daily.count, daily.goal)}/${daily.goal}`}
                                    </span>
                                    {!daily.completed_today && (
                                        <span className="text-xs font-semibold text-slate-400">
                                            {daily.goal - daily.count} to go
                                        </span>
                                    )}
                                </div>
                            )}
                            {quota && (
                                <div className="mt-4">
                                    {quota.limit == null ? (
                                        <p className="m-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                            <Crown className="size-4"/> Unlimited practice · {quota.used} answered today
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

                        <Card className="sat-arena-card p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-lg font-bold text-slate-900">Topic</h2>
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
                    </aside>
                </div>
            </PageContainer>

            {/* Streak-extended celebration (the 10th answer of the day) */}
            {streakCelebration != null && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4"
                    onClick={() => setStreakCelebration(null)}
                >
                    <div className="sat-arena-card w-full max-w-sm rounded-[1.75rem] border border-orange-200 bg-white p-8 text-center shadow-2xl">
                        <div className="mx-auto flex size-20 animate-bounce items-center justify-center rounded-full bg-orange-100">
                            <Flame className="size-10 text-orange-500"/>
                        </div>
                        <p className="m-0 mt-5 font-display text-3xl font-black text-slate-950">
                            Day {streakCelebration}!
                        </p>
                        <p className="m-0 mt-2 text-[15px] text-slate-600">
                            Daily goal complete — your streak is safe. Come back tomorrow to keep the flame alive.
                        </p>
                        <Button className="mt-6" block onClick={() => setStreakCelebration(null)}>
                            Keep practicing
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(InfiniteQuestionsPage);
