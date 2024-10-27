import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import Question from '../components/Question';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../components/api";

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
    flex-direction: ${props => props.timeUp ? 'column' : 'row'};
    align-items: ${props => props.timeUp ? 'center' : 'flex-start'};
`;

const QuestionContainer = styled.div`
    flex: 3;
    transition: opacity 0.5s ease-out;
    opacity: ${props => props.fadeOut ? 0 : 1};
    display: ${props => props.hide ? 'none' : 'block'};
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StatsContainer = styled.div`
    flex: ${props => props.timeUp ? 1 : 'none'};
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    height: fit-content;
    width: ${props => props.timeUp ? '100%' : 'auto'};
    max-width: 600px;
    animation: ${props => props.timeUp ? fadeIn : 'none'} 0.5s ease-in;
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

const Timer = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.isLow ? '#f5222d' : '#4b0082'};
    text-align: center;
    margin-bottom: 20px;
`;


const TimeUpMessage = styled.h2`
    color: #4b0082;
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
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

    &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

function PowerSprintPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [gameSettings, setGameSettings] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [fadeOutQuestion, setFadeOutQuestion] = useState(false);
    const [hideQuestion, setHideQuestion] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);

    const fetchNextQuestion = useCallback(async (difficulty) => {
        if (!isTimerRunning) return;

        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: difficulty,
                page: 1,
                page_size: 1,
                random: true
            }).toString();
            const response = await api.get(`api/filter_questions192/?${queryParams}`);
            setCurrentQuestion(response.data.questions[0]);
            setQuestionStatus('Blank');
            setShowNextButton(false);
        } catch (error) {
            setError(`An error occurred: ${error.response ? error.response.data : 'Server unreachable'}`);
            console.error("Error fetching question:", error);
        } finally {
            setLoading(false);
        }
    }, [isTimerRunning]);

    useEffect(() => {
        if (location.state && location.state.gameSettings) {
            setGameSettings(location.state.gameSettings);
            setTimeLeft(location.state.gameSettings.timer);
            setIsTimerRunning(true);
        } else {
            navigate('/'); // Redirect to home if no game settings
        }
    }, [location, navigate]);

    useEffect(() => {
        if (gameSettings && isTimerRunning) {
            fetchNextQuestion(gameSettings.difficulty);
        }
    }, [gameSettings, isTimerRunning, fetchNextQuestion]);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setFadeOutQuestion(true);
            setTimeout(() => setHideQuestion(true), 500);
        }
    }, [timeLeft, isTimerRunning]);

    const handleQuestionSubmit = async (id, choice) => {
        if (!isTimerRunning) return;

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice
            });
            const isCorrect = response.data.result === 'correct';
            setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect');
            updateStats(isCorrect);
            setShowNextButton(true);
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const exportStats = () => {
        const dataStr = JSON.stringify(stats);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'game_stats.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (!gameSettings) {
        return <PageContainer><p>Please initialize PowerSprint through start page</p></PageContainer>;
    }

    return (
        <PageContainer>
            <ContentWrapper timeUp={!isTimerRunning}>
                {!hideQuestion && (
                    <QuestionContainer fadeOut={fadeOutQuestion}>
                        <Timer isLow={timeLeft <= 60}>{formatTime(timeLeft)}</Timer>
                        {loading ? (
                            <p>Loading question... Please wait...</p>
                        ) : error ? (
                            <p>Error loading question: {error}</p>
                        ) : currentQuestion && (
                            <>
                                <Question
                                    questionData={currentQuestion}
                                    onSubmit={handleQuestionSubmit}
                                    status={questionStatus}
                                    questionNumber={stats.questionsAnswered + 1}
                                    disabled={!isTimerRunning || showNextButton}
                                />
                                {showNextButton && (
                                    <NextButton
                                        onClick={() => fetchNextQuestion(gameSettings.difficulty)}
                                        disabled={!isTimerRunning}
                                    >
                                        Next Question
                                    </NextButton>
                                )}
                            </>
                        )}
                    </QuestionContainer>
                )}
                <StatsContainer timeUp={!isTimerRunning}>
                    {!isTimerRunning && <TimeUpMessage>Time's Up!</TimeUpMessage>}
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
                    {!isTimerRunning && (
                        <NextButton onClick={exportStats}>
                            Download Stats
                        </NextButton>
                    )}
                </StatsContainer>
            </ContentWrapper>
        </PageContainer>
    );
}

export default PowerSprintPage;
