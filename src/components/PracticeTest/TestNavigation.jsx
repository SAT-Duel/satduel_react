import React, {useState} from 'react';
import {Check, ChevronDown, ChevronLeft, ChevronRight} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import QuestionNavigation from './QuestionNavigation';

export default function TestNavigation({
    currentQuestion,
    totalQuestions,
    setCurrentQuestion,
    reviewQuestions,
    answeredQuestions,
    onSubmit,
    navigationTitle,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useAuth();

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-[74px] left-1/2 z-[70] w-[calc(100%-2rem)] max-w-[650px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
                    <QuestionNavigation setIsOpen={setIsOpen} currentQuestion={currentQuestion} totalQuestions={totalQuestions} setCurrentQuestion={setCurrentQuestion} reviewQuestions={reviewQuestions} answeredQuestions={answeredQuestions} title={navigationTitle}/>
                    <span className="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white"/>
                </div>
            )}

            <footer className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-slate-900 bg-[#e8f0fb] px-4 py-3 sm:px-7">
                <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <p className="m-0 truncate text-sm font-black text-slate-900 sm:text-base">{user?.username || 'Student'}</p>

                    {currentQuestion <= totalQuestions ? (
                        <button type="button" onClick={() => setIsOpen((open) => !open)} className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm">
                            Question {currentQuestion} of {totalQuestions} <ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`}/>
                        </button>
                    ) : <span className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white">Review</span>}

                    <div className="flex justify-end gap-2">
                        {currentQuestion > 1 && (
                            <button type="button" onClick={() => setCurrentQuestion(currentQuestion - 1)} className="flex cursor-pointer items-center rounded-full bg-primary-700 px-3 py-2 text-sm font-black text-white hover:bg-primary-800 sm:px-6">
                                <ChevronLeft className="size-4 sm:hidden"/><span className="hidden sm:inline">Back</span>
                            </button>
                        )}
                        {currentQuestion <= totalQuestions ? (
                            <button type="button" onClick={() => setCurrentQuestion(currentQuestion + 1)} className="flex cursor-pointer items-center rounded-full bg-primary-700 px-3 py-2 text-sm font-black text-white hover:bg-primary-800 sm:px-6">
                                <span className="hidden sm:inline">Next</span><ChevronRight className="size-4 sm:hidden"/>
                            </button>
                        ) : (
                            <button type="button" onClick={onSubmit} className="flex cursor-pointer items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-black text-white hover:bg-primary-800">
                                Submit <Check className="size-4"/>
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}
