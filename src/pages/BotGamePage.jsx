import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Bot, Clock3} from 'lucide-react';
import Question from '../components/Question';
import Progress from '../components/Progress';
import {Button, Card, PageContainer} from '../components/ui';
import {notify} from '../utils/notify';

function getTimeForMode(mode) {
    const timings = {Quick: 5, Standard: 10, Extended: 15};
    return timings[mode?.split(' ')[0]] || 10;
}

function getQuestionForMode(mode) {
    const counts = {Quick: 5, Standard: 10, Extended: 15};
    return counts[mode?.split(' ')[0]] || 10;
}

function getBotDetails(botName) {
    const bots = {
        'Easy Bot': {speed: 35, solveChance: 50},
        'Medium Bot': {speed: 25, solveChance: 70},
        'Hard Bot': {speed: 15, solveChance: 90},
    };
    return bots[botName] || bots['Medium Bot'];
}

function formatTime(seconds) {
    if (seconds === null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function BotTrainingBattle() {
    const location = useLocation();
    const navigate = useNavigate();
    const {selectedBot, selectedMode} = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [botProgress, setBotProgress] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!selectedBot || !selectedMode) {
            navigate('/bot_training');
            return;
        }

        const fetchQuestions = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                const numQuestion = getQuestionForMode(selectedMode);
                const response = await axios.get(`${baseUrl}/api/questions/?num=${numQuestion}`);
                setQuestions(response.data.map((question) => ({...question, status: 'Blank'})));
                setBotProgress(response.data.map(() => ({status: 'Blank'})));
                setTimeLeft(getTimeForMode(selectedMode) * 60);
            } catch (error) {
                notify.error('Error fetching questions');
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [selectedBot, selectedMode, navigate]);

    useEffect(() => {
        if (timeLeft === null) return undefined;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (questions.length === 0) return undefined;

        const bot = getBotDetails(selectedBot);
        const totalQuestions = questions.length;
        let questionsSolved = 0;

        const interval = setInterval(() => {
            if (questionsSolved < totalQuestions && !isFinished) {
                const isSolved = Math.random() < bot.solveChance / 100;
                questionsSolved += 1;
                setBotProgress((progress) => {
                    const nextProgress = [...progress];
                    nextProgress[questionsSolved - 1] = {status: isSolved ? 'Correct' : 'Incorrect'};
                    return nextProgress;
                });
            } else {
                clearInterval(interval);
            }
        }, (getTimeForMode(selectedMode) * bot.speed * 1000) / totalQuestions);

        return () => clearInterval(interval);
    }, [questions, selectedBot, selectedMode, isFinished]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice,
            });
            const isCorrect = response.data.result === 'correct';
            setQuestions((prevQuestions) => (
                prevQuestions.map((question) => (
                    question.id === id ? {...question, status: isCorrect ? 'Correct' : 'Incorrect'} : question
                ))
            ));
        } catch (error) {
            notify.error('Error checking answer');
            console.error('Error checking answer:', error);
        }
    };

    const userCorrect = questions.filter((question) => question.status === 'Correct').length;
    const botCorrect = botProgress.filter((progress) => progress.status === 'Correct').length;

    if (isFinished) {
        const result = userCorrect > botCorrect ? 'You Win!' : userCorrect < botCorrect ? 'Bot Wins!' : 'It\'s a Tie!';

        return (
            <PageContainer className="flex min-h-screen items-center justify-center py-8">
                <Card className="w-full max-w-xl p-6 text-center sm:p-8">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                        <Bot size={26}/>
                    </div>
                    <h1 className="text-3xl font-black text-slate-950">{result}</h1>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-black text-slate-400">Your Score</p>
                            <p className="mt-1 text-4xl font-black text-slate-950">{userCorrect}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-black text-slate-400">Bot Score</p>
                            <p className="mt-1 text-4xl font-black text-slate-950">{botCorrect}</p>
                        </div>
                    </div>
                    <Button className="mt-6" onClick={() => navigate('/bot_training')}>
                        Back to Training Setup
                    </Button>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                        <Bot size={14}/> {selectedBot}
                    </div>
                    <h1 className="text-3xl font-black text-slate-950">{selectedMode}</h1>
                </div>
                <Card className="flex items-center gap-3 px-4 py-3">
                    <Clock3 size={20} className="text-primary-700"/>
                    <span className="text-2xl font-black text-slate-950">{formatTime(timeLeft)}</span>
                </Card>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-5">
                    {questions.map((question, index) => (
                        <Question
                            key={question.id}
                            questionData={question}
                            onSubmit={handleQuestionSubmit}
                            status={question.status}
                            questionNumber={index + 1}
                        />
                    ))}
                </div>
                <Card className="h-fit p-5 lg:sticky lg:top-6">
                    <h2 className="mb-4 text-lg font-black text-slate-950">Bot Progress</h2>
                    {botProgress.map((progress, index) => (
                        <Progress key={index} status={progress.status} questionNumber={index + 1}/>
                    ))}
                </Card>
            </div>
        </PageContainer>
    );
}

export default BotTrainingBattle;
