import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CheckCircle2, Crown, Flame, Lock, LogOut, Timer, XCircle, Zap} from 'lucide-react';
import '../../styles/landing.css';
import {useAuth} from '../../context/AuthContext';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Alert, Button, Card, PageContainer, Select, Spinner} from '../../components/ui';
import {billingErrorMessage, startPremiumCheckout} from '../../utils/billing';

function TopicControl({quota, topics, selectedTopic, onChange, compact = false}) {
    const isPremium = quota?.is_premium;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase text-slate-400">Topic</span>
                {!isPremium && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                        <Lock className="size-3"/> Premium
                    </span>
                )}
            </div>
            {isPremium ? (
                <Select value={selectedTopic} onChange={(e) => onChange(e.target.value)}>
                    <option value="any">All topics (random)</option>
                    {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </Select>
            ) : (
                <button
                    type="button"
                    disabled
                    className={[
                        'w-full rounded-xl border-2 border-dashed border-slate-200 bg-white text-left font-semibold text-slate-500',
                        compact ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-[15px]',
                    ].join(' ')}
                >
                    All topics (random)
                </button>
            )}
        </div>
    );
}

function PracticeProgress({subject, stats}) {
    const label = subject === 'math' ? 'Math' : 'English';
    const answered = stats[`${subject}_answered`] || 0;
    const accuracy = stats[`${subject}_accuracy`];
    return (
        <Card className="sat-arena-card p-5">
            <h2 className="m-0 text-lg font-bold text-slate-900">{label} progress</h2>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="m-0 text-sm font-bold text-amber-800">Correct streak</p>
                        <p className="m-0 mt-1 text-3xl font-black text-slate-950">{stats.current_streak || 0}</p>
                    </div>
                    <Flame className="size-8 text-amber-500"/>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="m-0 font-black text-slate-900">{answered}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">{label} answered</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="m-0 font-black text-slate-900">{accuracy != null ? `${accuracy}%` : '—'}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">{label} accuracy</p>
                </div>
            </div>
        </Card>
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

function RatingChange({feedback}) {
    if (!feedback) return null;
    const positive = feedback.delta >= 0;

    return (
        <div className={`mt-4 rounded-2xl border p-4 ${
            positive ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'
        }`}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="m-0 text-sm font-black">{positive ? 'Rating up' : 'Rating adjusted'}</p>
                    <p className="m-0 mt-1 text-sm font-semibold">
                        {feedback.previous}{' -> '}{feedback.next}
                    </p>
                </div>
                <div className="rounded-xl bg-white/70 px-3 py-2 font-black">
                    {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta} Elo
                </div>
            </div>
            {feedback.speedBonus > 0 && (
                <span className="sd-mono mt-3 inline-block rounded-md border border-[#EDDCAE] bg-[#FBF3DF] px-2 py-1 text-[11px] font-bold text-[#B4771E]">
                    +{feedback.speedBonus} SPEED BONUS
                </span>
            )}
        </div>
    );
}

function SubjectSwitch({subject, onChange}) {
    return (
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {[['english', 'English'], ['math', 'Math']].map(([value, label]) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => onChange(value)}
                    className={[
                        'rounded-lg px-3 py-1.5 text-sm font-bold transition-colors',
                        subject === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500',
                    ].join(' ')}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function readPracticeStats(data = {}) {
    return {
        current_streak: data.current_streak || 0,
        practice_answered: data.practice_answered || 0,
        practice_correct: data.practice_correct || 0,
        practice_accuracy: data.practice_accuracy ?? null,
        english_answered: data.english_answered || 0,
        english_correct: data.english_correct || 0,
        english_accuracy: data.english_accuracy ?? null,
        math_answered: data.math_answered || 0,
        math_correct: data.math_correct || 0,
        math_accuracy: data.math_accuracy ?? null,
    };
}

function AnswerFeedback({status, ratingFeedback, elo, subject, onSubjectChange, quota, topics, selectedTopic, onTopicChange, onNext, onQuit, loadingQuestions}) {
    const answered = status === 'Correct' || status === 'Incorrect';
    const correct = status === 'Correct';
    const Icon = correct ? CheckCircle2 : XCircle;
    const tone = answered
        ? correct
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-rose-200 bg-rose-50'
        : '';

    return (
        <Card className={`sat-arena-card p-5 ${tone}`}>
            <SubjectSwitch subject={subject} onChange={onSubjectChange}/>
            <div>
                <p className="m-0 text-sm font-bold text-slate-500">{subject === 'math' ? 'Math' : 'English'} Elo</p>
                <p className="m-0 mt-1 font-display text-4xl font-black text-slate-950">{elo ?? '—'}</p>
            </div>

            <RatingChange feedback={ratingFeedback}/>

            <div className="my-4 h-px bg-slate-100"/>

            <TopicControl
                quota={quota}
                topics={topics}
                selectedTopic={selectedTopic}
                onChange={onTopicChange}
                compact
            />

            {answered && (
                <>
                    <div className="mt-4 flex items-start gap-3">
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
                    <Button onClick={onNext} disabled={loadingQuestions} className="mt-4" block>
                        Next question
                    </Button>
                    <Button onClick={onQuit} variant="secondary" className="mt-2" block>
                        <LogOut className="size-4"/> Quit session
                    </Button>
                </>
            )}
        </Card>
    );
}

function InfiniteQuestionsPage() {
    // 'start' gates the first fetch behind an explicit button, and Quit returns
    // here — so no question clock runs while the user is done for the day.
    const [phase, setPhase] = useState('start');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);
    const [quota, setQuota] = useState(null);
    const [subject, setSubject] = useState(() =>
        new URLSearchParams(window.location.search).get('subject') === 'math' ? 'math' : 'english');
    const [elos, setElos] = useState({english: null, math: null});
    const [topicsBySubject, setTopicsBySubject] = useState({english: [], math: []});
    const [selectedTopic, setSelectedTopic] = useState('any');
    const [limitReached, setLimitReached] = useState(false);
    const [billingLoading, setBillingLoading] = useState(false);
    const [ratingFeedback, setRatingFeedback] = useState(null);
    const [daily, setDaily] = useState(null);
    const [streakCelebration, setStreakCelebration] = useState(null);
    const [stats, setStats] = useState(readPracticeStats());
    const [timerSeconds, setTimerSeconds] = useState(0);
    const {loading} = useAuth();
    const hasFetchedData = useRef(false);
    // Epoch ms the current question's clock started; the server reports elapsed
    // time on re-serves, so reloading the page resumes rather than resets.
    const timerStartRef = useRef(Date.now());

    const timerRunning = questionStatus === 'Blank' && !!currentQuestion;
    useEffect(() => {
        if (!timerRunning) return undefined;
        const id = setInterval(
            () => setTimerSeconds(Math.max(0, Math.floor((Date.now() - timerStartRef.current) / 1000))),
            1000,
        );
        return () => clearInterval(id);
    }, [timerRunning, currentQuestion?.id]);

    const fetchNextQuestion = useCallback(async (topic, subj) => {
        try {
            setLoadingQuestions(true);
            setError(null);
            const effectiveSubject = typeof subj === 'string' ? subj : subject;
            const params = {subject: effectiveSubject};
            const effectiveTopic = typeof topic === 'string' ? topic : selectedTopic;
            if (effectiveTopic && effectiveTopic !== 'any') params.type = effectiveTopic;
            const response = await api.get('api/practice/next/', {params});
            setCurrentQuestion(response.data.question || null);
            setQuota(response.data.quota || null);
            setQuestionStatus('Blank');
            setRatingFeedback(null);
            const elapsed = response.data.elapsed_seconds || 0;
            timerStartRef.current = Date.now() - elapsed * 1000;
            setTimerSeconds(elapsed);
        } catch (fetchError) {
            const data = fetchError.response?.data;
            if (data?.error === 'daily_limit') {
                setQuota(data.quota || null);
                setLimitReached(true);
            } else if (data?.error === 'premium_required') {
                setSelectedTopic('any');
                const response = await api.get('api/practice/next/', {params: {subject: subj || subject}});
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
    }, [selectedTopic, subject]);

    const fetchPracticeStatus = useCallback(async () => {
        try {
            const statusResponse = await api.get('api/practice/status/');
            setQuota(statusResponse.data.quota || null);
            setElos({
                english: statusResponse.data.sp_elo_rating ?? null,
                math: statusResponse.data.math_elo_rating ?? null,
            });
            setTopicsBySubject(statusResponse.data.topics || {english: [], math: []});
            setDaily(statusResponse.data.daily || null);
            if (statusResponse.data.stats) {
                setStats(readPracticeStats(statusResponse.data.stats));
            }
            if (statusResponse.data.quota?.remaining === 0) {
                setLimitReached(true);
            }
        } catch {
            // Non-blocking; the page works without the status panel.
        }
    }, []);

    useEffect(() => {
        if (!loading && !hasFetchedData.current) {
            fetchPracticeStatus();
            hasFetchedData.current = true;
        }
    }, [fetchPracticeStatus, loading]);

    const handleStart = () => {
        setPhase('playing');
        fetchNextQuestion();
    };

    const handleQuit = () => {
        setPhase('start');
        setCurrentQuestion(null);
        setQuestionStatus('Blank');
        setRatingFeedback(null);
    };

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
        fetchNextQuestion(topic);
    };

    const handleSubjectChange = (subj) => {
        if (subj === subject) return;
        setSubject(subj);
        setSelectedTopic('any');  // topic lists differ per subject
        fetchNextQuestion('any', subj);
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
            if (response.data.sp_elo_rating != null) {
                const answeredSubject = response.data.subject || subject;
                setElos((prev) => ({...prev, [answeredSubject]: response.data.sp_elo_rating}));
            }
            if (response.data.daily) {
                setDaily(response.data.daily);
                if (response.data.daily.streak_extended) {
                    setStreakCelebration(response.data.daily.streak);
                }
            }

            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');
            // Freeze the display on the server's authoritative measurement.
            if (response.data.time_taken != null) setTimerSeconds(response.data.time_taken);
            if (response.data.practice_stats) {
                setStats(readPracticeStats(response.data.practice_stats));
            }
            playRatingSound(isCorrect);

            if (response.data.sp_elo_rating_delta != null) {
                const feedback = {
                    id: Date.now(),
                    previous: response.data.sp_elo_rating_previous,
                    next: response.data.sp_elo_rating,
                    delta: response.data.sp_elo_rating_delta,
                    speedBonus: response.data.speed_bonus || 0,
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

    if (phase === 'start') {
        return (
            <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-12 sm:py-20">
                <PageContainer className="max-w-xl">
                    <Card className="sat-arena-card p-8 text-center sm:p-10">
                        <h1 className="m-0 font-display text-3xl font-bold text-slate-900">Ready to practice?</h1>
                        <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 text-left">
                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <Timer className="mt-0.5 size-5 shrink-0 text-primary-600"/>
                                <p className="m-0 text-sm leading-relaxed text-slate-700">
                                    Every question is timed. Aim for real Digital SAT pace — under 2 minutes each.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3">
                                <Zap className="mt-0.5 size-5 shrink-0 text-amber-500"/>
                                <p className="m-0 text-sm leading-relaxed text-slate-700">
                                    <strong>Speed bonus:</strong> answer correctly within 25s (English) or 45s (Math) and earn +3 extra rating.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <LogOut className="mt-0.5 size-5 shrink-0 text-slate-500"/>
                                <p className="m-0 text-sm leading-relaxed text-slate-700">
                                    Done for now? Hit <strong>Quit</strong> after a question so idle time never counts against your average.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleStart}
                            className="sd-start-btn mx-auto mt-8 block w-full max-w-sm cursor-pointer rounded-2xl border-0 bg-primary-600 px-12 py-5 font-display text-xl font-bold text-white transition-colors hover:bg-primary-500"
                        >
                            Start practicing
                        </button>
                        <p className="m-0 mt-4 text-xs text-slate-400">
                            {quota?.limit != null ? `${quota.remaining ?? quota.limit} free questions left today` : 'Unlimited practice'}
                        </p>
                    </Card>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <PageContainer>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className="m-0 font-display text-2xl font-bold text-slate-900">Practice</h1>
                </div>

                <div className="mb-5 lg:hidden">
                    <AnswerFeedback
                        status={questionStatus}
                        ratingFeedback={ratingFeedback}
                        elo={elos[subject]}
                        subject={subject}
                        onSubjectChange={handleSubjectChange}
                        quota={quota}
                        topics={topicsBySubject[subject] || []}
                        selectedTopic={selectedTopic}
                        onTopicChange={handleTopicChange}
                        onNext={() => fetchNextQuestion()}
                                onQuit={handleQuit}
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
                                showQuestionNumber={false}
                                timerSeconds={timerSeconds}
                            />
                        )}
                    </main>

                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <div className="hidden lg:block">
                            <AnswerFeedback
                                status={questionStatus}
                                ratingFeedback={ratingFeedback}
                                elo={elos[subject]}
                                subject={subject}
                                onSubjectChange={handleSubjectChange}
                                quota={quota}
                                topics={topicsBySubject[subject] || []}
                                selectedTopic={selectedTopic}
                                onTopicChange={handleTopicChange}
                                onNext={() => fetchNextQuestion()}
                                onQuit={handleQuit}
                                loadingQuestions={loadingQuestions}
                            />
                        </div>

                        <PracticeProgress subject={subject} stats={stats}/>

                        <Card className="sat-arena-card p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="m-0 text-lg font-bold text-slate-900">Today</h2>
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
