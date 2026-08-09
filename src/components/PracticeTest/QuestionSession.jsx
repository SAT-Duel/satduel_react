import React, {useCallback, useEffect, useRef, useState} from 'react';
import TestHeader from './TestHeader';
import QuestionContent from './QuestionContent';
import AnswerSection from './AnswerSection';
import ReviewPage from './ReviewPage';
import TestNavigation from './TestNavigation';

const emptyAnswers = (total) => Object.fromEntries(
    Array.from({length: total}, (_, index) => [index + 1, null]),
);

function QuestionSession({
    questions,
    onSubmit,
    initialSeconds = null,
    eyebrow,
    title,
    statusLabel,
    sessionLabel,
    navigationTitle,
    reviewDescription,
    variant = 'test',
    initialAnswers = null,
    initialReviewQuestions = [],
    initialCurrentQuestion = 1,
    onQuit = null,
    paused = false,
}) {
    const [currentQuestion, setCurrentQuestion] = useState(initialCurrentQuestion);
    const [selectedAnswers, setSelectedAnswers] = useState(() => ({
        ...emptyAnswers(questions.length),
        ...(initialAnswers || {}),
    }));
    const [reviewQuestions, setReviewQuestions] = useState(initialReviewQuestions);
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [hideTimer, setHideTimer] = useState(false);
    const autoSubmitted = useRef(false);
    const totalQuestions = questions.length;

    const answeredQuestions = Object.entries(selectedAnswers)
        .filter(([, answer]) => answer !== null && answer !== '')
        .map(([number]) => Number(number));

    const submit = useCallback(() => {
        onSubmit(selectedAnswers, {currentQuestion, reviewQuestions, timeLeft});
    }, [currentQuestion, onSubmit, reviewQuestions, selectedAnswers, timeLeft]);

    useEffect(() => {
        if (initialSeconds == null || paused) return undefined;
        const timerId = window.setInterval(() => {
            setTimeLeft((remaining) => Math.max(0, remaining - 1));
        }, 1000);
        return () => window.clearInterval(timerId);
    }, [initialSeconds, paused]);

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
                onQuit={onQuit ? () => onQuit(selectedAnswers, {currentQuestion, reviewQuestions, timeLeft}) : null}
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
