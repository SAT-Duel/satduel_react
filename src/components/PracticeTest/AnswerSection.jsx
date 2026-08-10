import React from 'react';
import {Bookmark, BookmarkCheck} from 'lucide-react';
import RenderWithMath from '../RenderWithMath';
import {Input} from '../ui';

function AnswerSection({currentQuestion, question, selectedAnswer, setSelectedAnswer, reviewQuestions, setReviewQuestions}) {
    const prompt = question.question.split('\n').slice(-1)[0];
    const choices = [
        {letter: 'A', text: question.choices[0]},
        {letter: 'B', text: question.choices[1]},
        {letter: 'C', text: question.choices[2]},
        {letter: 'D', text: question.choices[3]},
    ];
    const studentProduced = question.response_type === 'student_produced';

    const isMarkedForReview = reviewQuestions.includes(currentQuestion);

    const toggleReviewStatus = () => {
        setReviewQuestions((previous) => (
            isMarkedForReview
                ? previous.filter((q) => q !== currentQuestion)
                : [...previous, currentQuestion]
        ));
    };

    return (
        <div className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="sat-answer-bubble-filled inline-flex size-10 items-center justify-center rounded-full font-black text-white">
                        {currentQuestion}
                    </span>
                    <button
                        type="button"
                        onClick={toggleReviewStatus}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-black ${
                            isMarkedForReview
                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-primary-200 hover:text-primary-700'
                        }`}
                    >
                        {isMarkedForReview ? <BookmarkCheck className="size-4"/> : <Bookmark className="size-4"/>}
                        {isMarkedForReview ? 'Marked' : 'Mark for review'}
                    </button>
                </div>
            </div>

            <div className="mb-5 text-base font-bold leading-relaxed text-slate-900"><RenderWithMath text={prompt}/></div>

            {!studentProduced && <div className="space-y-3" role="radiogroup" aria-label={`Question ${currentQuestion} choices`}>
                {choices.map(({letter, text}) => {
                    const selected = selectedAnswer[currentQuestion] === letter;
                    return (
                        <button
                            key={letter}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setSelectedAnswer({...selectedAnswer, [currentQuestion]: letter})}
                            className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition ${
                                selected
                                    ? 'border-primary-500 bg-primary-50 text-slate-950 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                            }`}
                        >
                            <span className={`sat-answer-bubble inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                                selected ? 'sat-answer-bubble-filled text-white' : 'bg-white text-slate-500'
                            }`}>
                                {letter}
                            </span>
                            <span className="pt-1 text-sm leading-relaxed sm:text-base"><RenderWithMath text={text}/></span>
                        </button>
                    );
                })}
            </div>}
            {studentProduced && (
                <div className="max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <label htmlFor={`student-response-${currentQuestion}`} className="mb-2 block text-sm font-black text-slate-700">
                        Enter your answer
                    </label>
                    <Input
                        id={`student-response-${currentQuestion}`}
                        value={selectedAnswer[currentQuestion] || ''}
                        onChange={(event) => setSelectedAnswer({...selectedAnswer, [currentQuestion]: event.target.value})}
                        placeholder="Integer, decimal, or fraction"
                        inputMode="decimal"
                        autoComplete="off"
                    />
                    <p className="m-0 mt-2 text-xs leading-5 text-slate-500">Equivalent fractions and decimals are accepted.</p>
                </div>
            )}
        </div>
    );
}

export default AnswerSection;
