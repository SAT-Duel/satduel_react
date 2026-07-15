import React, {useState} from 'react';
import {Check, ChevronDown, ChevronLeft, ChevronRight} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import QuestionNavigation from './QuestionNavigation';
import {Button} from '../ui';

function TestNavigation({
    currentQuestion,
    totalQuestions,
    setCurrentQuestion,
    reviewQuestions,
    answeredQuestions,
    onSubmit,
    sessionLabel,
    navigationTitle,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {user} = useAuth();

    return (
        <>
            {isModalVisible && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <QuestionNavigation
                            setIsOpen={setIsModalVisible}
                            currentQuestion={currentQuestion}
                            totalQuestions={totalQuestions}
                            setCurrentQuestion={setCurrentQuestion}
                            reviewQuestions={reviewQuestions}
                            answeredQuestions={answeredQuestions}
                            title={navigationTitle}
                        />
                    </div>
                </div>
            )}

            <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <p className="m-0 truncate text-sm font-black text-slate-700">
                        {sessionLabel || (user ? user.username : 'Anonymous User')}
                    </p>

                    {currentQuestion <= totalQuestions ? (
                        <Button variant="secondary" size="sm" onClick={() => setIsModalVisible(true)}>
                            Question {currentQuestion} of {totalQuestions} <ChevronDown className="size-4"/>
                        </Button>
                    ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black text-slate-500">Review</span>
                    )}

                    <div className="flex justify-end gap-2">
                        {currentQuestion > 1 && (
                            <Button size="sm" variant="secondary" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                                <ChevronLeft className="size-4"/> Previous
                            </Button>
                        )}
                        {currentQuestion <= totalQuestions ? (
                            <Button size="sm" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                                Next <ChevronRight className="size-4"/>
                            </Button>
                        ) : (
                            <Button size="sm" onClick={onSubmit}>
                                Submit <Check className="size-4"/>
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}

export default TestNavigation;
