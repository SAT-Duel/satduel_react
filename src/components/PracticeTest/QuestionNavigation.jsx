import React from 'react';
import {Bookmark, MapPin, X} from 'lucide-react';

export default function QuestionNavigation({
    setIsOpen = null,
    currentQuestion,
    totalQuestions,
    answeredQuestions,
    reviewQuestions,
    setCurrentQuestion,
    title = 'Section 1, Module 1: Reading and Writing Questions',
}) {
    const handleQuestionClick = (questionNumber) => {
        setCurrentQuestion(questionNumber);
        setIsOpen?.(false);
    };

    return (
        <div>
            <div className="relative border-b border-slate-300 pb-5 text-center">
                <h2 className="m-0 px-8 text-xl font-black leading-7 text-slate-950">{title}</h2>
                {setIsOpen && (
                    <button type="button" onClick={() => setIsOpen(false)} className="absolute right-0 top-0 flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label="Close question navigation">
                        <X className="size-5"/>
                    </button>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 border-b border-slate-300 py-4 text-sm font-semibold text-slate-800">
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-5"/> Current</span>
                <span className="inline-flex items-center gap-1.5"><i className="size-5 border border-dashed border-slate-800"/> Unanswered</span>
                <span className="inline-flex items-center gap-1.5"><Bookmark className="size-5 fill-rose-600 text-rose-600"/> For Review</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 py-8">
                {Array.from({length: totalQuestions}, (_, index) => index + 1).map((number) => {
                    const answered = answeredQuestions.includes(number);
                    const review = reviewQuestions.includes(number);
                    const current = number === currentQuestion;
                    return (
                        <button
                            key={number}
                            type="button"
                            onClick={() => handleQuestionClick(number)}
                            className={`relative flex size-10 cursor-pointer items-center justify-center text-lg font-black ${
                                answered ? 'border-2 border-primary-700 bg-primary-700 text-white' : 'border-2 border-dashed border-slate-700 bg-white text-primary-700'
                            }`}
                        >
                            {current && <MapPin className="absolute -top-6 left-1/2 size-5 -translate-x-1/2 fill-white text-slate-900"/>}
                            {review && <Bookmark className="absolute -right-2 -top-2 size-4 fill-rose-600 text-rose-600"/>}
                            {number}
                        </button>
                    );
                })}
            </div>

            {setIsOpen && (
                <div className="flex justify-center pb-2">
                    <button type="button" onClick={() => handleQuestionClick(totalQuestions + 1)} className="cursor-pointer rounded-full border-2 border-primary-700 bg-white px-6 py-2 text-sm font-black text-primary-700 hover:bg-primary-50">
                        Go to Review Page
                    </button>
                </div>
            )}
        </div>
    );
}
