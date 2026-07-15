import React, {useCallback, useEffect, useState} from 'react';
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
}) {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedAnswers, setSelectedAnswers] = useState(() => emptyAnswers(questions.length));
    const [reviewQuestions, setReviewQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [hideTimer, setHideTimer] = useState(false);
    const totalQuestions = questions.length;

    const answeredQuestions = Object.entries(selectedAnswers)
        .filter(([, answer]) => answer !== null)
        .map(([number]) => Number(number));

    const submit = useCallback(() => {
        onSubmit(selectedAnswers);
    }, [onSubmit, selectedAnswers]);

    useEffect(() => {
        if (initialSeconds == null) return undefined;
        const timerId = window.setInterval(() => {
            setTimeLeft((remaining) => {
                if (remaining <= 1) {
                    window.clearInterval(timerId);
                    submit();
                    return 0;
                }
                return remaining - 1;
            });
        }, 1000);
        return () => window.clearInterval(timerId);
    }, [initialSeconds, submit]);

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
