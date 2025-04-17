import React, {useEffect, useRef, useState} from 'react';
import TestHeader from '../../components/PracticeTest/TestHeader';
import QuestionContent from "../../components/PracticeTest/QuestionContent";
import AnswerSection from "../../components/PracticeTest/AnswerSection";
import TestNavigation from "../../components/PracticeTest/TestNavigation";
import api from '../../components/api';
import {Layout, Spin} from 'antd';
import ReviewPage from "../../components/PracticeTest/ReviewPage";
import {useLocation, useNavigate} from "react-router-dom";

const {Content} = Layout;

function TestPage() {
    const location = useLocation();

    // get the seconds we passed, or default to 600
    const initialSeconds =
        location.state?.initialSeconds ?? 600;

    const [questions, setQuestions] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [reviewQuestions, setReviewQuestions] = useState([]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [hideTimer, setHideTimer] = useState(false);

    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const getAnsweredQuestions = () => {
        return Object.entries(selectedAnswer)
            .filter(([, val]) => val !== null)
            .map(([key]) => parseInt(key, 10));
    }

    // Fetch questions once
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        const fetchQuestions = () => {
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: 'any',
                page: 1,
                page_size: 10,
                random: true
            }).toString();
            api.get('api/filter_questions/?' + queryParams)
                .then(response => {
                    setQuestions(response.data);
                    setLoadingQuestions(false);
                    let initialAnswers = {};
                    for (let i = 1; i <= response.data.total; i++) {
                        initialAnswers[i] = null;
                    }
                    setSelectedAnswer(initialAnswers);
                })
                .catch(error => {
                    console.error(error);
                    setLoadingQuestions(false);
                });
        };
        fetchQuestions();
    }, []);

    const handleSubmit = () => {
        navigate('/test_result', {state: {questions: questions.questions, selectedAnswers: selectedAnswer}});
    }

    // Countdown timer effect
    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
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

    const toggleHideTimer = () => setHideTimer(h => !h);

    if (loadingQuestions) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f2f5'
            }}>
                <Spin size="large" tip="We are loading your test..."/>
            </div>
        );
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <TestHeader
                timeLeft={timeLeft}
                hideTimer={hideTimer}
                onToggleHide={toggleHideTimer}
            />

            {/* Question & Answer Sections */}
            {currentQuestion <= questions.total &&
                <Content style={{
                    display: 'flex',
                    background: '#fff'
                }}>
                    <div style={{width: '50%', borderRight: '2px solid #f0f0f0'}}>
                        <QuestionContent question={questions.questions[currentQuestion - 1]}/>
                    </div>
                    <div style={{width: '50%'}}>
                        <AnswerSection
                            question={questions.questions[currentQuestion - 1]}
                            currentQuestion={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            setSelectedAnswer={setSelectedAnswer}
                            reviewQuestions={reviewQuestions}
                            setReviewQuestions={setReviewQuestions}
                        />
                    </div>
                </Content>
            }

            {/* Review Page */}
            {currentQuestion > questions.total &&
                <ReviewPage
                    currentQuestion={currentQuestion}
                    totalQuestions={questions.total}
                    setCurrentQuestion={setCurrentQuestion}
                    reviewQuestions={reviewQuestions}
                    answeredQuestions={getAnsweredQuestions()}
                />
            }

            <TestNavigation
                currentQuestion={currentQuestion}
                totalQuestions={questions.total}
                setCurrentQuestion={setCurrentQuestion}
                reviewQuestions={reviewQuestions}
                answeredQuestions={getAnsweredQuestions()}
                handelSubmit={handleSubmit}
            />
        </Layout>
    );
}

export default TestPage;