import React from 'react';
import {Bookmark, BookmarkCheck} from 'lucide-react';
import AnnotatedText from './AnnotatedText';
import {Input} from '../ui';

function CrossOutIcon({letter}) {
    return (
        <span className="relative flex size-7 items-center justify-center rounded-full border-2 border-current text-sm font-black">
            {letter}
            <span className="absolute h-0.5 w-8 -rotate-12 bg-current"/>
        </span>
    );
}

function CrossOutToggle({active, onClick}) {
    return (
        <span className="group relative ml-auto flex shrink-0 items-center">
            <button
                type="button"
                onClick={onClick}
                aria-label={`${active ? 'Hide' : 'Show'} answer eliminator`}
                aria-pressed={active}
                className={`relative flex h-10 cursor-pointer items-center justify-center rounded-lg px-2 ${active ? 'bg-primary-700 text-white' : 'bg-transparent text-slate-800 hover:bg-slate-200'}`}
            >
                <span className="relative text-xs font-black">ABC<span className="absolute left-0 top-1/2 h-0.5 w-full -rotate-12 bg-current"/></span>
            </button>
            <span className="pointer-events-none absolute right-0 top-12 z-20 hidden w-56 rounded-lg bg-slate-700 px-3 py-2 text-left text-sm font-semibold leading-5 text-white shadow-xl group-hover:block">
                Cross out answer choices you think are wrong.
            </span>
        </span>
    );
}

function CrossOutButton({letter, crossed, onClick}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${crossed ? 'Undo cross out for' : 'Cross out'} answer ${letter}`}
            className="flex h-10 w-14 shrink-0 cursor-pointer items-center justify-center bg-transparent text-slate-800"
        >
            {crossed ? <span className="text-sm font-bold underline underline-offset-2">Undo</span> : <CrossOutIcon letter={letter}/>}
        </button>
    );
}

export default function AnswerSection({
    currentQuestion,
    question,
    selectedAnswer,
    setSelectedAnswer,
    reviewQuestions,
    setReviewQuestions,
    tools,
    onToolsChange,
    highlighterActive,
    onCreateMark,
    onOpenMark,
    eliminatorActive,
    onToggleEliminator,
}) {
    const prompt = question.question.split('\n').slice(-1)[0];
    const choices = 'ABCD'.split('').map((letter, index) => ({letter, text: question.choices[index]}));
    const studentProduced = question.response_type === 'student_produced';
    const isMarkedForReview = reviewQuestions.includes(currentQuestion);
    const crossedOut = tools.crossed_out || [];

    const toggleReviewStatus = () => setReviewQuestions((previous) => (
        isMarkedForReview ? previous.filter((number) => number !== currentQuestion) : [...previous, currentQuestion]
    ));

    const toggleCrossOut = (letter) => onToolsChange({
        ...tools,
        crossed_out: crossedOut.includes(letter)
            ? crossedOut.filter((item) => item !== letter)
            : [...crossedOut, letter],
    });

    return (
        <div className="px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
            <div className="mb-5 flex items-center border-b-2 border-slate-900 bg-slate-100">
                <div className="flex items-center">
                    <span className="flex size-10 items-center justify-center bg-slate-950 text-lg font-black text-white">{currentQuestion}</span>
                    <button type="button" onClick={toggleReviewStatus} className="flex cursor-pointer items-center gap-2 bg-transparent px-4 py-2 text-sm font-bold text-slate-800">
                        {isMarkedForReview ? <BookmarkCheck className="size-5 fill-rose-600 text-rose-600"/> : <Bookmark className="size-5"/>}
                        Mark for Review
                    </button>
                </div>
                {!studentProduced && <CrossOutToggle active={eliminatorActive} onClick={onToggleEliminator}/>}
            </div>

            <p className="m-0 mb-5 font-serif text-lg font-semibold leading-8 text-slate-950 sm:text-xl">
                <AnnotatedText text={prompt} field="prompt" marks={tools.marks} highlighterActive={highlighterActive} onCreate={onCreateMark} onOpen={onOpenMark}/>
            </p>

            {!studentProduced && (
                <div className="space-y-3" role="radiogroup" aria-label={`Question ${currentQuestion} choices`}>
                    {choices.map(({letter, text}) => {
                        const selected = selectedAnswer[currentQuestion] === letter;
                        const crossed = crossedOut.includes(letter);
                        return (
                            <div key={letter} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setSelectedAnswer({...selectedAnswer, [currentQuestion]: letter})}
                                    className={`flex min-h-16 flex-1 cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition ${
                                        selected ? 'border-primary-700 bg-primary-50' : 'border-slate-500 bg-white hover:border-primary-600'
                                    } ${crossed ? 'opacity-55' : ''}`}
                                >
                                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${selected ? 'border-primary-700 bg-primary-700 text-white' : 'border-slate-600 text-slate-800'}`}>{letter}</span>
                                    <span className={`font-serif text-base leading-7 text-slate-950 sm:text-lg ${crossed ? 'line-through' : ''}`}>
                                        <AnnotatedText text={text} field={`choice:${letter}`} marks={tools.marks} highlighterActive={highlighterActive} onCreate={onCreateMark} onOpen={onOpenMark}/>
                                    </span>
                                </button>
                                {eliminatorActive && <CrossOutButton letter={letter} crossed={crossed} onClick={() => toggleCrossOut(letter)}/>}
                            </div>
                        );
                    })}
                </div>
            )}

            {studentProduced && (
                <div className="max-w-sm rounded-xl border-2 border-slate-500 bg-white p-5">
                    <label htmlFor={`student-response-${currentQuestion}`} className="mb-2 block text-sm font-black text-slate-700">Enter your answer</label>
                    <Input id={`student-response-${currentQuestion}`} value={selectedAnswer[currentQuestion] || ''} onChange={(event) => setSelectedAnswer({...selectedAnswer, [currentQuestion]: event.target.value})} inputMode="decimal" autoComplete="off"/>
                </div>
            )}
        </div>
    );
}
