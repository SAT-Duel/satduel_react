import React from 'react';
import QuestionNavigation from './QuestionNavigation';

export default function ReviewPage({currentQuestion, totalQuestions, setCurrentQuestion, reviewQuestions, answeredQuestions, description, navigationTitle}) {
    return (
        <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-white p-5">
            <div className="w-full max-w-2xl">
                <div className="mb-7 text-center">
                    <h1 className="m-0 text-3xl font-black text-slate-950">Check Your Work</h1>
                    <p className="m-0 mt-2 text-slate-600">{description || 'Review unanswered or marked questions before submitting this module.'}</p>
                </div>
                <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
                    <QuestionNavigation currentQuestion={currentQuestion} totalQuestions={totalQuestions} setCurrentQuestion={setCurrentQuestion} reviewQuestions={reviewQuestions} answeredQuestions={answeredQuestions} title={navigationTitle}/>
                </div>
            </div>
        </div>
    );
}
