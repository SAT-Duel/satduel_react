import React, {useEffect, useRef, useState} from 'react';
import TestHeader from '../../components/PracticeTest/TestHeader';
import QuestionContent from "../../components/PracticeTest/QuestionContent";
import AnswerSection from "../../components/PracticeTest/AnswerSection";
import TestNavigation from "../../components/PracticeTest/TestNavigation";
import api from '../../components/api';
import {Layout, Spin} from 'antd';
import ReviewPage from "../../components/PracticeTest/ReviewPage";
import {useNavigate} from "react-router-dom";

const {Content} = Layout;

function TestPage() {
    const [questions, setQuestions] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [reviewQuestions, setReviewQuestions] = useState([]);

    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const getAnsweredQuestions = () => {
        let answeredQuestions = [];
        for (let question in selectedAnswer) {
            if (selectedAnswer[question] !== null) {
                answeredQuestions.push(parseInt(question));
            }
        }
        return answeredQuestions;
    }


    useEffect(() => {
        if (hasFetched.current) return
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
        }
        fetchQuestions();
    }, []);

    const handelSubmit = () => {
        // Submit the answers
        console.log(selectedAnswer);
        navigate('/test_result', {state: {questions: questions.questions, selectedAnswers: selectedAnswer}});
    }

    if (loadingQuestions) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f2f5' // Optional: Matches Ant Design's default background
            }}>
                <Spin size="large" tip="We are loading your test..."/>
            </div>
        );
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <TestHeader/>
            {currentQuestion <= questions.total &&
                <Content style={{
                    display: 'flex',
                    background: '#fff'
                }}>
                    <div style={{
                        width: '50%',
                        borderRight: '2px solid #f0f0f0'
                    }}>
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
                handelSubmit={handelSubmit}
            />
        </Layout>
    );
}

export default TestPage;
