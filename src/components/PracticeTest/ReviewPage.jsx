import React from 'react';
import QuestionNavigation from './QuestionNavigation';

function ReviewPage({
    currentQuestion,
    totalQuestions,
    setCurrentQuestion,
    reviewQuestions,
    answeredQuestions,
    description = 'Review unanswered or marked questions before submitting this practice test.',
    navigationTitle,
}) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-5">
            <div className="w-full max-w-2xl">
                <div className="mb-6 text-center">
                    <h1 className="m-0 font-display text-3xl font-black text-slate-950">Check your work</h1>
                    <p className="m-0 mt-2 text-slate-500">{description}</p>
                </div>
                <div className="sat-arena-card rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <QuestionNavigation
                        currentQuestion={currentQuestion}
                        totalQuestions={totalQuestions}
                        setCurrentQuestion={setCurrentQuestion}
                        reviewQuestions={reviewQuestions}
                        answeredQuestions={answeredQuestions}
                        title={navigationTitle}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
