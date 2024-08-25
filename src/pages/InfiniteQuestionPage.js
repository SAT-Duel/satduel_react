import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from '../animations/lootbox.json';
import { useAuth } from "../context/AuthContext";
import Question from '../components/Question';

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

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
`;

const LootboxContainer = styled.div`
    position: relative;
    width: 400px;
    height: 400px;
    perspective: 1500px;
    z-index: 1001;
`;

const LevelUpMessage = styled.div`
    position: absolute;
    top: -50px;
    width: 100%;
    text-align: center;
    font-size: 48px;
    font-weight: bold;
    color: yellow;
    text-shadow: 2px 2px 4px #000;
`;

const LootboxMessage = styled.div`
    position: absolute;
    top: -50px;
    width: 100%;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    color: gold;
    text-shadow: 2px 2px 4px #000;
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
        xp: 0,
        level: 0,
        coins: 0,
        multiplier: 1,
    });
    const [isFinished, setIsFinished] = useState(false);
    const { token, loading } = useAuth();

    const [isLootboxOpened, setIsLootboxOpened] = useState(false);
    const [isLootboxVisible, setIsLootboxVisible] = useState(false);
    const [animationStopped, setAnimationStopped] = useState(true);
    const [lootboxMessage, setLootboxMessage] = useState('');
    const [levelUpMessage, setLevelUpMessage] = useState('');
    const [showReward, setShowReward] = useState(false);
    const [canCloseLootbox, setCanCloseLootbox] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL;

    const saveStats = useCallback(async (statsToSave) => {
        console.log('called');
        try {
            const payload = {
                correct_number: statsToSave.correctAnswers,
                incorrect: statsToSave.questionsAnswered - statsToSave.correctAnswers,
                current_streak: statsToSave.streak,
                xp: statsToSave.xp,
                level: statsToSave.level,
                coins: statsToSave.coins,
                multiplier: statsToSave.multiplier,
            };
            console.log("Saving stats:", payload);
            await axios.post(`${baseUrl}/api/trainer/set_infinite_question_stats/`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = response.data;
            setStats({
                questionsAnswered: statsData.correct_number + statsData.incorrect_number,
                correctAnswers: statsData.correct_number,
                streak: statsData.current_streak,
                xp: statsData.xp,
                level: statsData.level,
                coins: statsData.coins,
                multiplier: statsData.total_multiplier,
            });
        } catch (error) {
            setError('Error fetching stats: ' + (error.response ? error.response.data : 'Server unreachable'));
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (!loading) {
            fetchNextQuestion();
            fetchStats();
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

            setStats(prevStats => {
                const newStats = {
                    questionsAnswered: prevStats.questionsAnswered + 1,
                    correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
                    streak: isCorrect ? prevStats.streak + 1 : 0,
                    xp: isCorrect ? prevStats.xp + 1 : prevStats.xp,
                    level: getLevel(isCorrect ? prevStats.xp + 1 : prevStats.xp),
                    coins: isCorrect ? prevStats.coins + Math.floor(getRandomNumber(3) * prevStats.multiplier) : prevStats.coins,
                    multiplier: prevStats.multiplier,
                };

                if (newStats.level > prevStats.level) {
                    setLevelUpMessage("LEVEL UP!!!");

                    const coinRewards = [10 * newStats.level, 20 * newStats.level, 30 * newStats.level, 40 * newStats.level, 50 * newStats.level, 66 * newStats.level, newStats.level ** 2, newStats.level ** 3, newStats.level ** 5, 666 * newStats.level];
                    const multiplierRewards = [1.01 * newStats.level, 1.02 * newStats.level, 1.05 * newStats.level, 1.06 * newStats.level, 1.1 * newStats.level, 1.2 * newStats.level, 1.25 * newStats.level];

                    let lootboxMessage = "";
                    let reward;

                    if (Math.random() < 0.33) {
                        reward = multiplierRewards[Math.floor(Math.random() * multiplierRewards.length)];
                        lootboxMessage = `${reward}x Permanent Coin Multiplier`;
                        newStats.multiplier *= reward;
                    } else {
                        reward = Math.round(coinRewards[Math.floor(Math.random() * coinRewards.length)] * newStats.multiplier);
                        lootboxMessage = `$${reward}`;
                        newStats.coins += reward;
                    }

                    setLootboxMessage(lootboxMessage);
                    setIsLootboxVisible(true);
                    setIsLootboxOpened(false);
                    setAnimationStopped(false);
                    setShowReward(false);
                    setCanCloseLootbox(false);
                }

                saveStats(newStats);
                return newStats;
            });
        } catch (error) {
            setError('Error checking answer: ' + (error.response ? error.response.data.error : 'Server unreachable'));
        }
    };

    const getLevel = (cur_xp) => {
        if (cur_xp < 1) {
            return 0;
        } else if (cur_xp >= 1 && cur_xp < 5) {
            return 1;
        } else if (cur_xp >= 5 && cur_xp < 10) {
            return 2;
        } else if (cur_xp >= 10 && cur_xp < 20) {
            return 3;
        } else if (cur_xp >= 20 && cur_xp < 50) {
            return 4;
        } else if (cur_xp >= 50 && cur_xp < 100) {
            return 5;
        } else if (cur_xp >= 100 && cur_xp < 200) {
            return 6;
        } else {
            return 7;
        }
    };

    const handleLootboxClick = () => {
        if (canCloseLootbox && isLootboxOpened) {
            setIsLootboxVisible(false);
            setIsLootboxOpened(false);
            setLevelUpMessage(''); // Clear the level up message when closing the lootbox
        }
    };

    const handleAnimationComplete = () => {
        setShowReward(true);
        setCanCloseLootbox(true);
        setIsLootboxOpened(true); // Mark lootbox as opened after animation completes
    };

    const defaultOptions = {
        loop: false,
        autoplay: !animationStopped,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const getRandomNumber = (cap) => {
        return Math.floor(Math.random() * cap) + 1;
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
                                <StatLabel>XP:</StatLabel>
                                <StatValue>{stats.xp}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Level:</StatLabel>
                                <StatValue>{stats.level}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Coins:</StatLabel>
                                <StatValue>{stats.coins}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Multiplier:</StatLabel>
                                <StatValue>{stats.multiplier}</StatValue>
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

            {isLootboxVisible && (
                <Overlay onClick={handleLootboxClick}>
                    <LootboxContainer>
                        {levelUpMessage && <LevelUpMessage>{levelUpMessage}</LevelUpMessage>}
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400}
                            isStopped={animationStopped}
                            eventListeners={[
                                {
                                    eventName: 'complete',
                                    callback: handleAnimationComplete,
                                },
                            ]}
                        />
                        {showReward && <LootboxMessage>{lootboxMessage}</LootboxMessage>}
                    </LootboxContainer>
                </Overlay>
            )}
        </PageContainer>
    );
}

export default InfiniteQuestionsPage;
