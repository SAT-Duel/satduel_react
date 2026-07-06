import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Flame} from 'lucide-react';
import Question from '../../components/Question';
import {useAuth} from '../../context/AuthContext';
import api from '../../components/api';
import {Button, Card, ModalShell, PageContainer, Spinner} from '../../components/ui';

function SATSurvivalPage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const {token} = useAuth();
    const hasFetchedData = useRef(false);

    const fetchNextQuestion = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: 'any',
                page: 1,
                page_size: 1,
                random: true,
            }).toString();
            const response = await api.get(`api/filter_questions/?${queryParams}`);
            setCurrentQuestion(response.data.questions?.[0] || null);
            setQuestionStatus('Blank');
        } catch (fetchError) {
            setError(`An error occurred: ${fetchError.response ? fetchError.response.data : 'Server unreachable'}`);
            console.error('Error fetching question:', fetchError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchNextQuestion();
            hasFetchedData.current = true;
        }
    }, [fetchNextQuestion]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await api.post('api/check_answer/', {
                question_id: id,
                selected_choice: choice,
            });
            const isCorrect = response.data.result === 'correct';

            if (isCorrect) {
                setQuestionStatus('Correct');
                setStreak((prevStreak) => prevStreak + 1);
            } else {
                setQuestionStatus('Incorrect');
                setGameOver(true);
                await axios.patch(`${baseUrl}/api/profile/update_streak/`, {
                    max_streak: streak,
                }, {
                    headers: {Authorization: `Bearer ${token}`},
                });
            }
        } catch (submitError) {
            setError(`Error checking answer: ${submitError.response ? submitError.response.data.error : 'Server unreachable'}`);
        }
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
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                    {currentQuestion && (
                        <Question
                            questionData={currentQuestion}
                            onSubmit={handleQuestionSubmit}
                            status={questionStatus}
                            questionNumber={streak + 1}
                        />
                    )}
                    {questionStatus === 'Correct' && (
                        <Button className="mt-4" onClick={fetchNextQuestion}>
                            Next Question
                        </Button>
                    )}
                </div>

                <Card className="h-fit p-6 text-center lg:sticky lg:top-6">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600">
                        <Flame size={26}/>
                    </div>
                    <h2 className="text-lg font-black text-slate-950">Current Streak</h2>
                    <div className="my-3 text-6xl font-black text-primary-700">{streak}</div>
                    <p className="text-sm leading-6 text-slate-500">Questions answered correctly</p>
                </Card>
            </div>

            <ModalShell
                open={gameOver}
                title="Game Over"
                onClose={() => { window.location.href = '/trainer'; }}
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => { window.location.href = '/trainer'; }}>
                            Back to Trainer
                        </Button>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </>
                )}
            >
                <p className="text-sm leading-6 text-slate-500">
                    Great job. You answered {streak} questions correctly in a row.
                </p>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <div className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Final Score</div>
                    <div className="mt-2 text-5xl font-black text-slate-950">{streak}</div>
                </div>
            </ModalShell>
        </PageContainer>
    );
}

export default SATSurvivalPage;
