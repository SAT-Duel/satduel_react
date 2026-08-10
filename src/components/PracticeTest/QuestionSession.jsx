import React, {useCallback, useEffect, useRef, useState} from 'react';
import TestHeader from './TestHeader';
import QuestionContent from './QuestionContent';
import AnswerSection from './AnswerSection';
import ReviewPage from './ReviewPage';
import TestNavigation from './TestNavigation';

const emptyAnswers = (total) => Object.fromEntries(
    Array.from({length: total}, (_, index) => [index + 1, null]),
);

const secondsUntil = (deadlineAt) => Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));

function QuestionSession({
    questions,
    onSubmit,
    initialSeconds = null,
    deadlineAt = null,
    initialProgress = null,
    onProgressChange,
    eyebrow,
    title,
    statusLabel,
    sessionLabel,
    navigationTitle,
    reviewDescription,
    variant = 'test',
    onQuit = null,
    showDesmos = false,
}) {
    const totalQuestions = questions.length;
    const [currentQuestion, setCurrentQuestion] = useState(() => Math.min(
        Math.max(Number(initialProgress?.currentQuestion) || 1, 1),
        totalQuestions + 1,
    ));
    const [selectedAnswers, setSelectedAnswers] = useState(() => ({
        ...emptyAnswers(totalQuestions),
        ...(initialProgress?.answers || initialProgress?.selectedAnswers || {}),
    }));
    const [reviewQuestions, setReviewQuestions] = useState(() => (
        Array.isArray(initialProgress?.reviewQuestions) ? initialProgress.reviewQuestions : []
    ));
    const [timeLeft, setTimeLeft] = useState(() => (
        deadlineAt == null ? initialSeconds : secondsUntil(deadlineAt)
    ));
    const [hideTimer, setHideTimer] = useState(Boolean(initialProgress?.hideTimer));
    const autoSubmitted = useRef(false);

    const answeredQuestions = Object.entries(selectedAnswers)
        .filter(([, answer]) => answer !== null && answer !== '')
        .map(([number]) => Number(number));

    const currentState = useCallback(() => ({
        currentQuestion,
        reviewQuestions,
        timeLeft: deadlineAt == null ? timeLeft : secondsUntil(deadlineAt),
        hideTimer,
    }), [currentQuestion, deadlineAt, hideTimer, reviewQuestions, timeLeft]);

    const submit = useCallback(() => {
        onSubmit(selectedAnswers, currentState());
    }, [currentState, onSubmit, selectedAnswers]);

    useEffect(() => {
        if (deadlineAt == null) return undefined;
        const updateTimer = () => setTimeLeft(secondsUntil(deadlineAt));
        updateTimer();
        const timerId = window.setInterval(updateTimer, 250);
        document.addEventListener('visibilitychange', updateTimer);
        window.addEventListener('focus', updateTimer);
        return () => {
            window.clearInterval(timerId);
            document.removeEventListener('visibilitychange', updateTimer);
            window.removeEventListener('focus', updateTimer);
        };
    }, [deadlineAt]);

    useEffect(() => {
        onProgressChange?.(selectedAnswers, {currentQuestion, reviewQuestions, timeLeft, hideTimer});
        // The absolute deadline owns timer persistence, so ticks do not need storage writes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion, hideTimer, onProgressChange, reviewQuestions, selectedAnswers]);

    useEffect(() => {
        if (initialSeconds != null && timeLeft === 0 && !autoSubmitted.current) {
            autoSubmitted.current = true;
            submit();
        }
    }, [initialSeconds, submit, timeLeft]);

    const activeQuestion = questions[currentQuestion - 1];
    const mistakeMode = variant === 'mistakes';
    const hasSeparateContext = activeQuestion?.question?.includes('\n');

    return (
        <div className={`min-h-screen pb-24 ${mistakeMode ? 'bg-primary-50/60' : 'bg-slate-50'}`}>
            <TestHeader
                timeLeft={initialSeconds == null ? null : timeLeft}
                hideTimer={hideTimer}
                onToggleHide={() => setHideTimer((hidden) => !hidden)}
                eyebrow={eyebrow}
                title={title}
                statusLabel={statusLabel}
                showDesmos={showDesmos}
                onQuit={onQuit ? () => onQuit(selectedAnswers, currentState()) : null}
            />

            {currentQuestion <= totalQuestions && activeQuestion && (
                <main className={`mx-auto grid gap-0 ${hasSeparateContext ? 'max-w-7xl lg:grid-cols-2' : 'max-w-3xl'}`}>
                    {hasSeparateContext && (
                        <section className={`border-b border-slate-200 lg:min-h-[calc(100vh-9rem)] lg:border-b-0 lg:border-r ${mistakeMode ? 'bg-primary-50/40' : 'bg-slate-50'}`}>
                            <QuestionContent question={activeQuestion}/>
                        </section>
                    )}
                    <section className="bg-white lg:min-h-[calc(100vh-9rem)]">
                        <AnswerSection
                            question={activeQuestion}
                            currentQuestion={currentQuestion}
                            selectedAnswer={selectedAnswers}
                            setSelectedAnswer={setSelectedAnswers}
                            reviewQuestions={reviewQuestions}
                            setReviewQuestions={setReviewQuestions}
                        />
                    </section>
                </main>
            )}

            {currentQuestion > totalQuestions && (
                <ReviewPage
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    setCurrentQuestion={setCurrentQuestion}
                    reviewQuestions={reviewQuestions}
                    answeredQuestions={answeredQuestions}
                    description={reviewDescription}
                    navigationTitle={navigationTitle}
                />
            )}

            <TestNavigation
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                setCurrentQuestion={setCurrentQuestion}
                reviewQuestions={reviewQuestions}
                answeredQuestions={answeredQuestions}
                onSubmit={submit}
                sessionLabel={sessionLabel}
                navigationTitle={navigationTitle}
            />
        </div>
    );
}

export default QuestionSession;
