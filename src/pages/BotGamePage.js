import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {Layout, Card, Button, Row, Col, message} from 'antd';
import Question from '../components/Question';
import Progress from '../components/Progress';

const {Content} = Layout;

const PageContainer = styled(Layout)`
    min-height: 100vh;
`;

const StyledContent = styled(Content)`
    max-width: 1200px;
    margin: 0 auto;
`;

const BattleContainer = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
`;

const QuestionsSection = styled.div`
    flex: 3;
    margin-right: 24px;
`;

const ProgressSection = styled.div`
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    height: fit-content;
    position: sticky;
    top: 24px;
    background: linear-gradient(135deg, #e6e6fa, #e6f7ff);
`;

const Title = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 16px;
    color: #1a1a1a;
`;

const TimeDisplay = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #1a1a1a;
    background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
`;

const StyledButton = styled(Button)`
    background-color: #1890ff;
    border-color: #1890ff;
    color: white;
    font-weight: bold;
    height: 40px;
    font-size: 16px;

    &:hover, &:focus {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: white;
    }
`;

const BotTrainingBattle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {selectedBot, selectedMode} = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [botProgress, setBotProgress] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        console.log(selectedMode)
        if (!selectedBot || !selectedMode) {
            navigate('/bot_training');
            return;
        }

        const fetchQuestions = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const numQuestion = getQuestionForMode(selectedMode)
                console.log(numQuestion)
                const response = await axios.get(`${baseUrl}/api/questions/?num=${numQuestion}`);
                setQuestions(response.data.map(q => ({...q, status: 'Blank'})));
                setBotProgress(response.data.map(q => ({...q, status: 'Blank'})))
                setTimeLeft(getTimeForMode(selectedMode) * 60);
            } catch (error) {
                message.error('Error fetching questions');
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [selectedBot, selectedMode, navigate]);

    useEffect(() => {
        if (timeLeft === null) return;

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
        if (questions.length === 0) return;

        const bot = getBotDetails(selectedBot);
        const totalQuestions = questions.length;
        let questionsSolved = 0;

        const interval = setInterval(() => {
            if (questionsSolved < totalQuestions && !isFinished) {
                const isSolved = Math.random() < bot.solveChance / 100;
                questionsSolved++;
                setBotProgress(prev => {
                    const newProgress = [...prev];
                    newProgress[questionsSolved - 1] = {status: isSolved ? 'Correct' : 'Incorrect'};
                    return newProgress;
                });
            } else {
                clearInterval(interval);
            }
        }, (getTimeForMode(selectedMode) *bot.speed* 1000) / totalQuestions);

        return () => clearInterval(interval);
    }, [questions, selectedBot, selectedMode, isFinished]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice
            });
            const isCorrect = response.data.result === 'correct';
            setQuestions(prevQuestions =>
                prevQuestions.map(q => q.id === id ? {...q, status: isCorrect ? 'Correct' : 'Incorrect'} : q)
            );
        } catch (error) {
            message.error('Error checking answer');
            console.error("Error checking answer:", error);
        }
    };

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimeForMode = (mode) => {
        const timings = {'Quick': 5, 'Standard': 10, 'Extended': 15};
        return timings[mode.split(' ')[0]] || 10;
    };

    const getQuestionForMode = (mode) => {
        const timings = {'Quick': 5, 'Standard': 10, 'Extended': 15};
        return timings[mode.split(' ')[0]] || 10;
    };

    const getBotDetails = (botName) => {
        const bots = {
            'Easy Bot': {speed: 35, solveChance: 50},
            'Medium Bot': {speed: 25, solveChance: 70},
            'Hard Bot': {speed: 15, solveChance: 90},
        };
        return bots[botName] || bots['Medium Bot'];
    };

    const renderBattle = () => (
        <BattleContainer>
            <QuestionsSection>
                {questions.map((question, index) => (
                    <Question
                        key={question.id}
                        questionData={question}
                        onSubmit={handleQuestionSubmit}
                        status={question.status}
                        questionNumber={index + 1}
                    />
                ))}
            </QuestionsSection>
            <ProgressSection>
                <Title level={4}>Bot's Progress</Title>
                {botProgress.map((progress, index) => (
                    <Progress key={index} status={progress.status} questionNumber={index + 1}/>
                ))}
                <Title level={4}>Time Left</Title>
                <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
            </ProgressSection>
        </BattleContainer>
    );

    const renderFinished = () => {
        const userCorrect = questions.filter(q => q.status === 'Correct').length;
        const botCorrect = botProgress.filter(p => p.status === 'Correct').length;
        const result = userCorrect > botCorrect ? 'You Win!' : userCorrect < botCorrect ? 'Bot Wins!' : 'It\'s a Tie!';

        return (
            <Card title={result} style={{textAlign: 'center'}}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Title level={4}>Your Score: {userCorrect}</Title>
                    </Col>
                    <Col span={12}>
                        <Title level={4}>Bot's Score: {botCorrect}</Title>
                    </Col>
                </Row>
                <StyledButton onClick={() => navigate('/bot_training')}>
                    Back to Training Setup
                </StyledButton>
            </Card>
        );
    };

    return (
        <PageContainer>
            <StyledContent>
                {!isFinished && renderBattle()}
                {isFinished && renderFinished()}
            </StyledContent>
        </PageContainer>
    );
};

export default BotTrainingBattle;