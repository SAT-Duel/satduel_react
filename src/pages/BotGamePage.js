import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Question from '../components/Question';
import axios from 'axios';
import { Button, Card, Row, Col, Progress } from 'antd';

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    display: flex;
    width: 100%;
    max-width: 1200px;
    gap: 40px;
`;

const QuestionContainer = styled.div`
    flex: 3;
`;

const StatsContainer = styled.div`
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    height: fit-content;
`;

// const StatsTitle = styled.h2`
//     color: #4b0082;
//     margin-bottom: 24px;
//     font-size: 1.5rem;
//     border-bottom: 2px solid #4b0082;
//     padding-bottom: 10px;
// `;

const StatItem = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatLabel = styled.span`
    font-weight: 600;
    color: #333;
`;

const StatValue = styled.span`
    color: #4b0082;
    font-weight: 700;
    font-size: 1.1rem;
`;

const NextButton = styled(Button)`
    background-color: #4b0082;
    color: white;
    border: none;
    margin-top: 24px;
    &:hover {
        background-color: #3a006f;
        color: white;
    }
`;

const EndButton = styled(Button)`
    background-color: #dc3545;
    color: white;
    border: none;
    margin-top: 24px;
    margin-left: 12px;
    &:hover {
        background-color: #c82333;
        color: white;
    }
`;

const ProgressWrapper = styled.div`
    margin-top: 10px;
`;

const BotGamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bot, mode, time } = location.state || {};
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
    });
    const [botStats, setBotStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
    });
    const [botAnswerStatus, setBotAnswerStatus] = useState('Thinking');
    const [isFinished, setIsFinished] = useState(false);
    const [timer, setTimer] = useState(time ? time * 60 : null);
    const [botQuestionNumber, setBotQuestionNumber] = useState(0);

    const fetchNextQuestion = useCallback(async () => {
        if (isFinished) return;
        try {
            setLoading(true);
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${baseUrl}/api/questions/?num=1`);
            setCurrentQuestion(response.data[0]);
            setQuestionStatus('Blank');
        } catch (error) {
            setError(`An error occurred: ${error.response ? error.response.data : 'Server unreachable'}`);
            console.error("Error fetching question:", error);
        } finally {
            setLoading(false);
        }
    }, [isFinished]);

    const handleBotResponse = useCallback(() => {
        if (isFinished) return;

        const botSolveChance = Math.random() * 100;
        const botSolveTime = Math.random() * (bot.timeRange[1] - bot.timeRange[0]) + bot.timeRange[0];

        setTimeout(() => {
            if (isFinished) return;

            if (botSolveChance <= bot.solveChance) {
                setBotStats(prev => ({
                    questionsAnswered: prev.questionsAnswered + 1,
                    correctAnswers: prev.correctAnswers + 1,
                }));
                setBotAnswerStatus('Correct');
            } else {
                setBotStats(prev => ({
                    ...prev,
                    questionsAnswered: prev.questionsAnswered + 1,
                }));
                setBotAnswerStatus('Incorrect');
                if (mode === 'SAT Survival') {
                    setIsFinished(true);
                }
            }

            setBotQuestionNumber(prev => prev + 1);

            if (!isFinished && mode !== 'SAT Survival') {
                setTimeout(() => {
                    setBotAnswerStatus('Thinking');
                    handleBotResponse();
                }, 1000); // Wait 1 second before starting the next question
            }
        }, botSolveTime * 1000);
    }, [bot, isFinished, mode]);

    useEffect(() => {
        fetchNextQuestion();
        handleBotResponse();
    }, [fetchNextQuestion, handleBotResponse]);

    useEffect(() => {
        if (mode === 'Power Sprint' && timer > 0 && !isFinished) {
            const countdown = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setIsFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [mode, timer, isFinished]);

    const handleQuestionSubmit = async (id, choice) => {
        if (isFinished) return;
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice
            });
            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');
            updateStats(isCorrect);

            if (mode === 'SAT Survival' && !isCorrect) {
                setIsFinished(true);
            }
        } catch (error) {
            setError('Error checking answer: ' + (error.response ? error.response.data.error : 'Server unreachable'));
        }
    };

    const updateStats = (isCorrect) => {
        setStats(prevStats => ({
            questionsAnswered: prevStats.questionsAnswered + 1,
            correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
            streak: isCorrect ? prevStats.streak + 1 : 0,
        }));
    };

    const handleEndEarly = () => {
        setIsFinished(true);
    };

    const renderStats = (title, stats, showStreak = false, answerStatus = null) => (
        <Card title={title} style={{ marginBottom: 20 }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <StatItem>
                        <StatLabel>Questions:</StatLabel>
                        <StatValue>{stats.questionsAnswered}</StatValue>
                    </StatItem>
                </Col>
                <Col span={12}>
                    <StatItem>
                        <StatLabel>Correct:</StatLabel>
                        <StatValue>{stats.correctAnswers}</StatValue>
                    </StatItem>
                </Col>
                <Col span={24}>
                    <ProgressWrapper>
                        <Progress
                            percent={stats.questionsAnswered > 0 ? (stats.correctAnswers / stats.questionsAnswered) * 100 : 0}
                            status="active"
                            format={percent => `${percent.toFixed(1)}%`}
                        />
                    </ProgressWrapper>
                </Col>
                {showStreak && (
                    <Col span={12}>
                        <StatItem>
                            <StatLabel>Streak:</StatLabel>
                            <StatValue>{stats.streak}</StatValue>
                        </StatItem>
                    </Col>
                )}
                {answerStatus && (
                    <Col span={24}>
                        <StatItem>
                            <StatLabel>Status:</StatLabel>
                            <StatValue>{answerStatus}</StatValue>
                        </StatItem>
                    </Col>
                )}
            </Row>
        </Card>
    );

    const renderEndScreen = () => {
    let result;
    if (mode === 'SAT Survival') {
        result = stats.questionsAnswered > stats.correctAnswers ? 'Bot Wins!' : 'You Win!';
    } else if (mode === 'Power Sprint') {
        result = stats.correctAnswers > botStats.correctAnswers ? 'You Win!' : 'Bot Wins!';
    } else {
        result = 'Quiz Finished!';
    }

        return (
            <Card title={result} style={{ textAlign: 'center' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {renderStats('Your Stats', stats, true)}
                    </Col>
                    <Col span={12}>
                        {renderStats('Bot Stats', botStats)}
                    </Col>
                </Row>
                <Button type="primary" size="large" onClick={() => navigate('/bot_training')}>
                    Back to Training Setup
                </Button>
            </Card>
        );
    };

    if (loading && !currentQuestion) return <PageContainer><p>Loading question... Please wait...</p></PageContainer>;
    if (error) return <PageContainer><p>Error loading question: {error}</p></PageContainer>;

    return (
        <PageContainer>
            <ContentWrapper>
                {!isFinished ? (
                    <>
                        <QuestionContainer>
                            {currentQuestion && (
                                <Question
                                    questionData={currentQuestion}
                                    onSubmit={handleQuestionSubmit}
                                    status={questionStatus}
                                    questionNumber={stats.questionsAnswered + 1}
                                />
                            )}
                            {questionStatus !== 'Blank' && (
                                <NextButton onClick={fetchNextQuestion}>Next Question</NextButton>
                            )}
                            <EndButton onClick={handleEndEarly}>End Quiz</EndButton>
                        </QuestionContainer>
                        <StatsContainer>
                            {renderStats('Your Stats', stats, true)}
                            {renderStats('Bot Stats', botStats, false, botAnswerStatus)}
                            <Card title="Current Question" style={{ marginTop: 20 }}>
                                <StatValue style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                                    Bot: {botQuestionNumber + 1} | You: {stats.questionsAnswered + 1}
                                </StatValue>
                            </Card>
                            {mode === 'Power Sprint' && (
                                <Card title="Time Left" style={{ marginTop: 20 }}>
                                    <StatValue style={{ fontSize: '2rem', textAlign: 'center' }}>
                                        {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}
                                    </StatValue>
                                </Card>
                            )}
                        </StatsContainer>
                    </>
                ) : (
                    renderEndScreen()
                )}
            </ContentWrapper>
        </PageContainer>
    );
};

export default BotGamePage;
