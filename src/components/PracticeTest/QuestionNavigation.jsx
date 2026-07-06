import React from 'react';
import {X} from 'lucide-react';
import {Button} from '../ui';

function questionClasses(questionNum, currentQuestion, answeredQuestions, reviewQuestions) {
    const current = questionNum === currentQuestion;
    const answered = answeredQuestions.includes(questionNum);
    const review = reviewQuestions.includes(questionNum);

    if (current && answered) return 'border-primary-700 bg-primary-600 text-white shadow-[0_3px_0_rgba(90,33,182,0.35)]';
    if (current) return 'border-primary-500 bg-primary-50 text-primary-700';
    if (answered && review) return 'border-amber-500 bg-primary-600 text-white';
    if (answered) return 'border-primary-500 bg-primary-600 text-white';
    if (review) return 'border-amber-500 bg-amber-50 text-amber-700';
    return 'border-slate-300 bg-white text-slate-600 hover:border-primary-300';
}

function QuestionNavigation({
    setIsOpen = null,
    currentQuestion,
    totalQuestions,
    answeredQuestions,
    reviewQuestions,
    setCurrentQuestion,
}) {
    const questions = Array.from({length: totalQuestions}, (_, i) => i + 1);

    const handleQuestionClick = (questionNum) => {
        setCurrentQuestion(questionNum);
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="m-0 font-display text-xl font-black text-slate-950">Section 1 questions</h2>
                {setIsOpen && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close question navigation"
                    >
                        <X className="size-5"/>
                    </button>
                )}
            </div>

            <div className="mb-5 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-primary-600"/> Answered</span>
                <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-amber-400"/> Review</span>
                <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-slate-200"/> Unanswered</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {questions.map((num) => (
                    <button
                        key={num}
                        type="button"
                        className={`flex size-10 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-black transition ${questionClasses(num, currentQuestion, answeredQuestions, reviewQuestions)}`}
                        onClick={() => handleQuestionClick(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {setIsOpen && (
                <div className="mt-6 flex justify-center">
                    <Button variant="secondary" onClick={() => handleQuestionClick(totalQuestions + 1)}>
                        Go to review page
                    </Button>
                </div>
            )}
        </div>
    );
}

export default QuestionNavigation;
