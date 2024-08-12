import React, {useState, useEffect, useCallback, useRef} from 'react';
import styled from 'styled-components';
import Question from '../components/Question';
import axios from "axios";
import {useAuth} from "../context/AuthContext";

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

const StatsTitle = styled.h2`
    color: #4b0082;
    margin-bottom: 24px;
    font-size: 1.5rem;
    border-bottom: 2px solid #4b0082;
    padding-bottom: 10px;
`;

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

const NextButton = styled.button`
    background-color: #4b0082;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 24px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #3a006f;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const EndButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 24px;
    margin-left: 12px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #c82333;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const SummaryContainer = styled.div`
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    width: 80%;
    max-width: 500px;
    height: 300px;
    max-height: 80vh;
    overflow: auto;
`;

function InfiniteQuestionsPage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loadingQuestions, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
    });
    const [isFinished, setIsFinished] = useState(false);
    const {token, loading} = useAuth();
    const hasFetchedData = useRef(false);

    const baseUrl = process.env.REACT_APP_API_URL;

    const saveStats = useCallback(async (statsToSave) => {
        try {
            const payload = {
                correct_number: statsToSave.correctAnswers,
                incorrect: statsToSave.questionsAnswered - statsToSave.correctAnswers,
                current_streak: statsToSave.streak,
            };
            console.log("Saving stats:", payload);
            await axios.post(`${baseUrl}/api/trainer/set_infinite_question_stats/`, payload, {
                headers: {'Authorization': `Bearer ${token}`}
            });
        } catch (error) {
            console.error('Error saving stats:', error.response ? error.response.data : error);
        }
    }, [baseUrl, token]);

    const fetchNextQuestion = useCallback(async () => {
        if (isFinished) return;
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/api/questions/?num=1`);
            setCurrentQuestion(response.data[0]);
            setQuestionStatus('Blank');
        } catch (error) {
            setError(`An error occurred: ${error.response ? error.response.data : 'Server unreachable'}`);
            console.error("Error fetching question:", error);
        } finally {
            setLoading(false);
        }
    }, [baseUrl, isFinished]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/trainer/infinite_question_stats/`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const statsData = response.data;
            setStats({
                questionsAnswered: statsData.correct_number + statsData.incorrect_number,
                correctAnswers: statsData.correct_number,
                streak: statsData.current_streak,
            });
        } catch (error) {
            setError('Error fetching stats: ' + (error.response ? error.response.data : 'Server unreachable'));
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (!loading && !hasFetchedData.current) {
            fetchNextQuestion();
            fetchStats();
            hasFetchedData.current = true;
        }
    }, [loading, fetchNextQuestion, fetchStats]);

    const handleQuestionSubmit = async (id, choice) => {
        if (isFinished) return;
        try {
            const response = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice
            });
            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');
            updateStats(isCorrect);
        } catch (error) {
            setError('Error checking answer: ' + (error.response ? error.response.data.error : 'Server unreachable'));
        }
    };

    const updateStats = (isCorrect) => {
        setStats(prevStats => {
            const newStats = {
                questionsAnswered: prevStats.questionsAnswered + 1,
                correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
                streak: isCorrect ? prevStats.streak + 1 : 0,
            };
            saveStats(newStats);
            return newStats;
        });
    };

    const handleEndEarly = () => {
        setIsFinished(true);
        saveStats(stats);
    };

    if (loadingQuestions && !isFinished) return <PageContainer><p>Loading question... Please wait...</p></PageContainer>;
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
                            <StatsTitle>Your Stats</StatsTitle>
                            <StatItem>
                                <StatLabel>Questions Answered:</StatLabel>
                                <StatValue>{stats.questionsAnswered}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Correct Answers:</StatLabel>
                                <StatValue>{stats.correctAnswers}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Current Streak:</StatLabel>
                                <StatValue>{stats.streak}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Accuracy:</StatLabel>
                                <StatValue>
                                    {stats.questionsAnswered > 0
                                        ? `${((stats.correctAnswers / stats.questionsAnswered) * 100).toFixed(1)}%`
                                        : 'N/A'}
                                </StatValue>
                            </StatItem>
                        </StatsContainer>
                    </>
                ) : (
                    <SummaryContainer>
                        <StatsTitle>Quiz Summary</StatsTitle>
                        <StatItem>
                            <StatLabel>Total Questions Answered:</StatLabel>
                            <StatValue>{stats.questionsAnswered}</StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Correct Answers:</StatLabel>
                            <StatValue>{stats.correctAnswers}</StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Final Streak:</StatLabel>
                            <StatValue>{stats.streak}</StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Final Accuracy:</StatLabel>
                            <StatValue>
                                {stats.questionsAnswered > 0
                                    ? `${((stats.correctAnswers / stats.questionsAnswered) * 100).toFixed(1)}%`
                                    : 'N/A'}
                            </StatValue>
                        </StatItem>
                    </SummaryContainer>
                )}
            </ContentWrapper>
        </PageContainer>
    );
}

export default InfiniteQuestionsPage;
