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
    onSaveAndQuit,
    eyebrow,
    title,
    statusLabel,
    sessionLabel,
    navigationTitle,
    reviewDescription,
    variant = 'test',
}) {
    const totalQuestions = questions.length;
    const [currentQuestion, setCurrentQuestion] = useState(() => Math.min(
        Math.max(Number(initialProgress?.currentQuestion) || 1, 1),
        totalQuestions + 1,
    ));
    const [selectedAnswers, setSelectedAnswers] = useState(() => ({
        ...emptyAnswers(totalQuestions),
        ...(initialProgress?.selectedAnswers || {}),
    }));
    const [reviewQuestions, setReviewQuestions] = useState(() => (
        Array.isArray(initialProgress?.reviewQuestions) ? initialProgress.reviewQuestions : []
    ));
    const [timeLeft, setTimeLeft] = useState(() => (
        deadlineAt == null ? initialSeconds : secondsUntil(deadlineAt)
    ));
    const [hideTimer, setHideTimer] = useState(Boolean(initialProgress?.hideTimer));
    const submittedForDeadline = useRef(false);

    const answeredQuestions = Object.entries(selectedAnswers)
        .filter(([, answer]) => answer !== null)
        .map(([number]) => Number(number));

    const submit = useCallback(() => {
        onSubmit(selectedAnswers);
    }, [onSubmit, selectedAnswers]);

    useEffect(() => {
        if (deadlineAt == null) return undefined;
        const updateTimer = () => {
            const remaining = secondsUntil(deadlineAt);
            setTimeLeft(remaining);
            if (remaining === 0 && !submittedForDeadline.current) {
                submittedForDeadline.current = true;
                submit();
            }
        };
        updateTimer();
        const timerId = window.setInterval(() => {
            updateTimer();
        }, 1000);
        return () => window.clearInterval(timerId);
    }, [deadlineAt, submit]);

    useEffect(() => {
        onProgressChange?.({currentQuestion, selectedAnswers, reviewQuestions, hideTimer});
    }, [currentQuestion, hideTimer, onProgressChange, reviewQuestions, selectedAnswers]);

    const saveAndQuit = () => {
        onSaveAndQuit?.({currentQuestion, selectedAnswers, reviewQuestions, hideTimer});
    };

    const activeQuestion = questions[currentQuestion - 1];
    const mistakeMode = variant === 'mistakes';

    return (
        <div className={`min-h-screen pb-24 ${mistakeMode ? 'bg-primary-50/60' : 'bg-slate-50'}`}>
            <TestHeader
                timeLeft={initialSeconds == null ? null : timeLeft}
                hideTimer={hideTimer}
                onToggleHide={() => setHideTimer((hidden) => !hidden)}
                eyebrow={eyebrow}
                title={title}
                statusLabel={statusLabel}
                onSaveAndQuit={onSaveAndQuit ? saveAndQuit : null}
            />

            {currentQuestion <= totalQuestions && activeQuestion && (
                <main className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
                    <section className={`border-b border-slate-200 lg:min-h-[calc(100vh-9rem)] lg:border-b-0 lg:border-r ${mistakeMode ? 'bg-primary-50/40' : 'bg-slate-50'}`}>
                        <QuestionContent question={activeQuestion}/>
                    </section>
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
