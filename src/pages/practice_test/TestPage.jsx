import React, {useCallback, useEffect, useRef, useState} from 'react';
import TestHeader from '../../components/PracticeTest/TestHeader';
import QuestionContent from '../../components/PracticeTest/QuestionContent';
import AnswerSection from '../../components/PracticeTest/AnswerSection';
import TestNavigation from '../../components/PracticeTest/TestNavigation';
import ReviewPage from '../../components/PracticeTest/ReviewPage';
import api from '../../components/api';
import {Spinner} from '../../components/ui';
import {useLocation, useNavigate} from 'react-router-dom';

function TestPage() {
    const location = useLocation();
    const initialSeconds = location.state?.initialSeconds ?? 600;

    const [questions, setQuestions] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [reviewQuestions, setReviewQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [hideTimer, setHideTimer] = useState(false);

    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const getAnsweredQuestions = () => (
        Object.entries(selectedAnswer)
            .filter(([, val]) => val !== null)
            .map(([key]) => parseInt(key, 10))
    );

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        const fetchQuestions = async () => {
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: 'any',
                page: 1,
                page_size: 10,
                random: true,
            }).toString();
            try {
                const response = await api.get(`api/filter_questions/?${queryParams}`);
                setQuestions(response.data);
                const initialAnswers = {};
                for (let i = 1; i <= response.data.total; i += 1) {
                    initialAnswers[i] = null;
                }
                setSelectedAnswer(initialAnswers);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingQuestions(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleSubmit = useCallback(() => {
        navigate('/test_result', {state: {questions: questions.questions, selectedAnswers: selectedAnswer}});
    }, [navigate, questions, selectedAnswer]);

    useEffect(() => {
        if (!questions) return undefined;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [handleSubmit]);

    const toggleHideTimer = () => setHideTimer((hidden) => !hidden);

    if (loadingQuestions || !questions) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-600">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <Spinner/> Loading your test…
                </div>
            </div>
        );
    }

    const activeQuestion = questions.questions[currentQuestion - 1];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <TestHeader
                timeLeft={timeLeft}
                hideTimer={hideTimer}
                onToggleHide={toggleHideTimer}
            />

            {currentQuestion <= questions.total && activeQuestion && (
                <main className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
                    <section className="border-b border-slate-200 bg-slate-50 lg:min-h-[calc(100vh-9rem)] lg:border-b-0 lg:border-r">
                        <QuestionContent question={activeQuestion}/>
                    </section>
                    <section className="bg-white lg:min-h-[calc(100vh-9rem)]">
                        <AnswerSection
                            question={activeQuestion}
                            currentQuestion={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            setSelectedAnswer={setSelectedAnswer}
                            reviewQuestions={reviewQuestions}
                            setReviewQuestions={setReviewQuestions}
                        />
                    </section>
                </main>
            )}

            {currentQuestion > questions.total && (
                <ReviewPage
                    currentQuestion={currentQuestion}
                    totalQuestions={questions.total}
                    setCurrentQuestion={setCurrentQuestion}
                    reviewQuestions={reviewQuestions}
                    answeredQuestions={getAnsweredQuestions()}
                />
            )}

            <TestNavigation
                currentQuestion={currentQuestion}
                totalQuestions={questions.total}
                setCurrentQuestion={setCurrentQuestion}
                reviewQuestions={reviewQuestions}
                answeredQuestions={getAnsweredQuestions()}
                handelSubmit={handleSubmit}
            />
        </div>
    );
}

export default TestPage;
