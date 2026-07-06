import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Clock3, X} from 'lucide-react';
import Question from '../../components/Question';
import api from '../../components/api';
import {Button, Card, ModalShell, PageContainer, Spinner} from '../../components/ui';

const INITIAL_TIME = 120;
const MIN_TIME = 30;
const TIME_DECREMENT = 10;
const MAX_FAILS = 3;

function StatusPill({status}) {
    const classes = status === 'Correct'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : status === 'Incorrect'
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-slate-200 bg-slate-50 text-slate-500';

    return (
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${classes}`}>
            {status}
        </span>
    );
}

export default function TimedChallengePage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [correctCount, setCorrectCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [timePerQuestion, setTimePerQuestion] = useState(INITIAL_TIME);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const fetchNextQuestion = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({random: true, page: 1, page_size: 1});
            const res = await api.get(`api/filter_questions/?${params.toString()}`);
            setCurrentQuestion(res.data.questions?.[0] || null);
            setQuestionStatus('Blank');
        } catch {
            setError('Failed to load question.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) fetchNextQuestion();
        hasFetched.current = true;
    }, [fetchNextQuestion]);

    const handleFail = useCallback(() => {
        clearInterval(timerRef.current);
        setFailCount((failures) => {
            const next = failures + 1;
            if (next >= MAX_FAILS) setGameOver(true);
            return next;
        });
        setQuestionStatus('Incorrect');
    }, []);

    useEffect(() => {
        clearInterval(timerRef.current);
        if (!currentQuestion || gameOver || questionStatus !== 'Blank') return;
        setTimeLeft(timePerQuestion);
        timerRef.current = setInterval(() => {
            setTimeLeft((seconds) => {
                if (seconds <= 1) {
                    clearInterval(timerRef.current);
                    handleFail();
                    return 0;
                }
                return seconds - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentQuestion, timePerQuestion, gameOver, questionStatus, handleFail]);

    const handleQuestionSubmit = async (id, choice) => {
        clearInterval(timerRef.current);
        try {
            const res = await api.post('api/check_answer/', {question_id: id, selected_choice: choice});
            if (res.data.result === 'correct') {
                setQuestionStatus('Correct');
                setCorrectCount((count) => count + 1);
            } else {
                handleFail();
            }
        } catch {
            setError('Submission error.');
        }
    };

    const handleNext = () => {
        setTimePerQuestion((seconds) => Math.max(MIN_TIME, seconds - TIME_DECREMENT));
        fetchNextQuestion();
    };

    if (loading) {
        return (
            <PageContainer className="flex min-h-screen items-center justify-center">
                <Spinner/>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer className="flex min-h-screen items-center justify-center py-8">
                <Card className="max-w-xl p-6 text-center text-rose-600">{error}</Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <Card className="mb-5 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl border-2 border-cyan-200 bg-cyan-50 text-cyan-700">
                            <Clock3 size={22}/>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Time Left</p>
                            <p className="text-3xl font-black text-slate-950">{timeLeft}s</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {Array.from({length: MAX_FAILS}).map((_, index) => (
                            <div
                                key={index}
                                className={[
                                    'flex size-8 items-center justify-center rounded-xl border-2',
                                    index < failCount
                                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                                        : 'border-slate-200 bg-slate-50 text-transparent',
                                ].join(' ')}
                            >
                                <X size={16}/>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <Card className="p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h1 className="text-lg font-black text-slate-950">Question {correctCount + failCount + 1}</h1>
                        <StatusPill status={questionStatus}/>
                    </div>
                    <Question
                        questionData={currentQuestion}
                        status={questionStatus}
                        onSubmit={handleQuestionSubmit}
                        questionNumber={correctCount + failCount + 1}
                    />
                    {questionStatus !== 'Blank' && !gameOver && (
                        <Button className="mt-4" onClick={handleNext} block>Next Question</Button>
                    )}
                </Card>

                <Card className="h-fit p-6 text-center lg:sticky lg:top-6">
                    <h2 className="text-lg font-black text-slate-950">Correct Answers</h2>
                    <div className="my-3 text-6xl font-black text-primary-700">{correctCount}</div>
                    <p className="text-sm leading-6 text-slate-500">Answered correctly this run</p>
                </Card>
            </div>

            <ModalShell
                open={gameOver}
                title="Game Over"
                onClose={() => navigate('/trainer')}
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => navigate('/trainer')}>Back to Trainer</Button>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </>
                )}
            >
                <p className="text-sm leading-6 text-slate-500">Final score</p>
                <div className="mt-3 text-5xl font-black text-slate-950">{correctCount}</div>
            </ModalShell>
        </PageContainer>
    );
}
