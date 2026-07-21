import React, {useEffect, useRef, useState} from 'react';
import {CheckCircle2, Eye, Home, Sparkles, TrendingDown, TrendingUp, X, XCircle} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import {useAuth} from '../../context/AuthContext';
import {Alert, Button, Card, PageContainer, Spinner} from '../../components/ui';

function ReviewModal({question, details, loading, onClose, getChoiceText, getCorrectChoiceText}) {
    if (!question) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-primary-600">Question {question.id} review</p>
                        <h2 className="m-0 mt-1 font-display text-2xl font-black text-slate-950">See what happened</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close question review"
                    >
                        <X className="size-5"/>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 py-12 text-slate-600">
                        <Spinner/> Loading question details…
                    </div>
                ) : details ? (
                    <div className="space-y-5">
                        <section>
                            <h3 className="m-0 text-lg font-black text-slate-950">Question</h3>
                            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-800">
                                <RenderWithMath text={details.question}/>
                            </div>
                        </section>

                        <section>
                            <h3 className="m-0 text-lg font-black text-slate-950">Choices</h3>
                            <div className="mt-3 space-y-2">
                                {[
                                    {label: 'A', text: details.choice_a},
                                    {label: 'B', text: details.choice_b},
                                    {label: 'C', text: details.choice_c},
                                    {label: 'D', text: details.choice_d},
                                ].map((choice) => {
                                    const correct = choice.label === details.answer;
                                    const selectedWrong = choice.label === question.userChoice && !correct;
                                    return (
                                        <div
                                            key={choice.label}
                                            className={`rounded-2xl border p-4 ${
                                                correct
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : selectedWrong
                                                        ? 'border-rose-300 bg-rose-50'
                                                        : 'border-slate-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className={`sat-answer-bubble inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                                                    correct ? 'bg-emerald-600 text-white' : selectedWrong ? 'bg-rose-600 text-white' : 'bg-white text-slate-500'
                                                }`}>
                                                    {choice.label}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="m-0 text-sm leading-relaxed text-slate-800">{choice.text}</p>
                                                    {correct && <p className="m-0 mt-2 text-xs font-black uppercase text-emerald-700">Correct answer</p>}
                                                    {selectedWrong && <p className="m-0 mt-2 text-xs font-black uppercase text-rose-700">Your answer</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Your answer</p>
                                <p className="m-0 mt-1 font-bold text-slate-900">
                                    {question.userChoice != null
                                        ? `${question.userChoice}. ${getChoiceText(details, question.userChoice)}`
                                        : 'No answer selected'}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-4">
                                <p className="m-0 text-xs font-black uppercase text-emerald-700">Correct answer</p>
                                <p className="m-0 mt-1 font-bold text-emerald-800">
                                    {details.answer}. {getCorrectChoiceText(details)}
                                </p>
                            </div>
                        </section>

                        {details.explanation && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-4">
                                <h3 className="m-0 text-lg font-black text-slate-950">Explanation</h3>
                                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{details.explanation}</p>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                        Failed to load question details.
                    </div>
                )}
            </div>
        </div>
    );
}

function TestResults() {
    const location = useLocation();
    const {user} = useAuth();
    const {
        questions = [],
        selectedAnswers = [],
        testId = 1,
        testName = 'SAT Diagnostic Test',
        timeUsedSeconds = null,
        savedResult = null,
    } = location.state || {};
    const [testData, setTestData] = useState({score: 0, questions: []});
    const [loadingScore, setLoadingScore] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    // {previousBest, previousLast} from the save call — powers the progress banner.
    const [progress, setProgress] = useState(null);
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        // Reopened from test history: everything is already graded and stored.
        if (savedResult) {
            setTestData({
                score: savedResult.score,
                questions: (savedResult.questions || []).map((question, index) => ({
                    id: index + 1,
                    status: question.correct ? 'correct' : 'incorrect',
                    questionId: question.question_id,
                    userChoice: question.user_choice,
                })),
            });
            setLoadingScore(false);
            return;
        }

        const checkAnswers = async () => {
            if (!questions.length) {
                setLoadingScore(false);
                return {score: 0, questions: []};
            }

            let score = 0;
            let totalScore = 0;

            const results = await Promise.all(
                questions.map(async (question, index) => {
                    let status = 'incorrect';
                    const questionScore = Math.sqrt(6 - question.difficulty);
                    const choiceMap = {A: 0, B: 1, C: 2, D: 3};

                    if (selectedAnswers[index + 1] != null) {
                        try {
                            const response = await api.post('api/check_answer/', {
                                question_id: question.id,
                                selected_choice: question.choices[choiceMap[selectedAnswers[index + 1]]],
                            });
                            status = response.data.result;
                        } catch (error) {
                            console.error('Error checking answer:', error);
                        }
                    }

                    totalScore += questionScore;
                    if (status === 'correct') score += questionScore;

                    return {
                        id: index + 1,
                        status,
                        questionId: question.id,
                        userChoice: selectedAnswers[index + 1],
                        questionData: question,
                    };
                })
            );

            const finalScore = totalScore ? 200 + Math.round(600 * (score / totalScore) / 10) * 10 : 0;
            setLoadingScore(false);
            return {score: finalScore, questions: results};
        };

        checkAnswers().then(async (data) => {
            setTestData(data);
            if (!user || !data.questions.length) return;
            try {
                const {data: saved} = await api.post('api/practice_test/save/', {
                    test_id: testId,
                    test_name: testName,
                    score: data.score,
                    correct: data.questions.filter((question) => question.status === 'correct').length,
                    total: data.questions.length,
                    time_used_seconds: timeUsedSeconds,
                    questions: data.questions.map((question) => ({
                        question_id: question.questionId,
                        user_choice: question.userChoice ?? null,
                        correct: question.status === 'correct',
                    })),
                });
                setProgress({previousBest: saved.previous_best, previousLast: saved.previous_last});
            } catch (error) {
                console.error('Error saving test result:', error);
            }
        });
    }, [questions, selectedAnswers, savedResult, user, testId, testName, timeUsedSeconds]);

    const handleQuestionClick = async (question) => {
        setSelectedQuestion(question);
        setQuestionDetails(null);
        setLoadingQuestion(true);

        try {
            const [questionRes, answerRes] = await Promise.all([
                api.get(`api/get_question/${question.questionId}`),
                api.post('api/get_answer/', {question_id: question.questionId}),
            ]);
            setQuestionDetails({
                ...questionRes.data,
                answer: answerRes.data.answer_choice,
                explanation: answerRes.data.explanation,
            });
        } catch (error) {
            console.error('Error fetching question details:', error);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const getChoiceText = (details, choiceValue) => {
        if (!details || choiceValue == null) return 'No answer selected';
        const choices = {A: details.choice_a, B: details.choice_b, C: details.choice_c, D: details.choice_d};
        return choices[choiceValue] || 'Invalid choice';
    };

    const getCorrectChoiceText = (details) => {
        if (!details) return '';
        const choices = [details.choice_a, details.choice_b, details.choice_c, details.choice_d];
        const choiceMap = {A: 0, B: 1, C: 2, D: 3};
        return choices[choiceMap[details.answer]] || '';
    };

    if (loadingScore) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Calculating your score…
                    </div>
                </PageContainer>
            </div>
        );
    }

    const correctCount = testData.questions.filter((question) => question.status === 'correct').length;
    const timeUsed = savedResult ? savedResult.time_used_seconds : timeUsedSeconds;
    const headerName = savedResult ? savedResult.test_name : testName;
    const takenAt = savedResult && new Date(savedResult.created_at);

    const renderProgressBanner = () => {
        const {previousBest, previousLast} = progress;
        let icon;
        let title;
        let copy;
        if (previousLast == null) {
            icon = <Sparkles className="size-5"/>;
            title = 'Baseline set';
            copy = 'First test saved. Take another soon to see your score move.';
        } else {
            const delta = testData.score - previousLast;
            if (previousBest != null && testData.score > previousBest) {
                icon = <Sparkles className="size-5"/>;
                title = 'New personal best!';
                copy = `Up ${delta} points from your last test (${previousLast}).`;
            } else if (delta > 0) {
                icon = <TrendingUp className="size-5"/>;
                title = `+${delta} points since your last test`;
                copy = `Last time you scored ${previousLast}. Keep it going.`;
            } else if (delta < 0) {
                icon = <TrendingDown className="size-5"/>;
                title = `${delta} points since your last test`;
                copy = `Last time you scored ${previousLast}. Review your misses below — that's where the points come back.`;
            } else {
                icon = <TrendingUp className="size-5"/>;
                title = `Same score as your last test (${previousLast})`;
                copy = 'Review your misses below to break through.';
            }
        }
        return (
            <Card className="sat-arena-card mt-6 p-5">
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                        {icon}
                    </div>
                    <div>
                        <p className="m-0 font-display text-lg font-black text-slate-950">{title}</p>
                        <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{copy}</p>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="sat-bubble-field min-h-screen py-8 sm:py-12">
            <PageContainer className="max-w-4xl">
                <Card className="sat-arena-card overflow-hidden text-center">
                    <div className="sat-duel-lanes bg-slate-950 px-5 py-8 text-white">
                        <p className="m-0 text-sm font-black uppercase text-cyan-200">{headerName}</p>
                        <h1 className="m-0 mt-3 font-display text-5xl font-black">{testData.score}</h1>
                        <p className="m-0 mt-2 text-slate-300">
                            {takenAt
                                ? `Taken on ${takenAt.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}`
                                : 'Estimated score from this practice set'}
                        </p>
                    </div>
                    <div className={`grid divide-y divide-slate-100 sm:divide-x sm:divide-y-0 ${timeUsed != null ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                        <div className="p-4">
                            <p className="m-0 font-display text-2xl font-black text-emerald-600">{correctCount}</p>
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Correct</p>
                        </div>
                        <div className="p-4">
                            <p className="m-0 font-display text-2xl font-black text-rose-600">{testData.questions.length - correctCount}</p>
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Missed</p>
                        </div>
                        <div className="p-4">
                            <p className="m-0 font-display text-2xl font-black text-primary-600">{testData.questions.length}</p>
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Questions</p>
                        </div>
                        {timeUsed != null && (
                            <div className="p-4">
                                <p className="m-0 font-display text-2xl font-black text-slate-900">
                                    {Math.floor(timeUsed / 60)}m {timeUsed % 60}s
                                </p>
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Time used</p>
                            </div>
                        )}
                    </div>
                </Card>

                {!savedResult && (user ? (progress && renderProgressBanner()) : (
                    <Card className="sat-arena-card mt-6 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="m-0 font-display text-lg font-black text-slate-950">Don't lose this score</p>
                                <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">
                                    Sign in to save your results, build a test history, and track your progress over time.
                                </p>
                            </div>
                            <Button to="/login" variant="primary" size="sm">Sign in</Button>
                        </div>
                    </Card>
                ))}

                <Card className="sat-arena-card mt-6 p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="m-0 font-display text-2xl font-black text-slate-950">Question review</h2>
                        <div className="flex items-center gap-2">
                            <Button to="/practice_test" variant="primary" size="sm">
                                {savedResult ? 'All tests' : 'Take another test'}
                            </Button>
                            <Button to="/trainer" variant="secondary" size="sm">
                                <Home className="size-4"/> Dashboard
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {testData.questions.map((question) => {
                            const correct = question.status === 'correct';
                            return (
                                <button
                                    key={question.id}
                                    type="button"
                                    onClick={() => handleQuestionClick(question)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-primary-300 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex size-9 items-center justify-center rounded-full ${
                                            correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                        }`}>
                                            {correct ? <CheckCircle2 className="size-5"/> : <XCircle className="size-5"/>}
                                        </span>
                                        <div>
                                            <p className="m-0 font-black text-slate-900">Question {question.id}</p>
                                            <p className={`m-0 text-xs font-black uppercase ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {correct ? 'Correct' : 'Incorrect'}
                                            </p>
                                        </div>
                                    </div>
                                    <Eye className="size-5 text-slate-300"/>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            </PageContainer>

            <ReviewModal
                question={selectedQuestion}
                details={questionDetails}
                loading={loadingQuestion}
                onClose={() => setSelectedQuestion(null)}
                getChoiceText={getChoiceText}
                getCorrectChoiceText={getCorrectChoiceText}
            />
        </div>
    );
}

export default TestResults;
