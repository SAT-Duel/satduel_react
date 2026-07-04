import React, {useState, useEffect, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {Card, Typography, Modal, Button, Badge} from 'antd';
import {ClockCircleOutlined, StopOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import Question from '../../components/Question';
import api from '../../components/api';

const {Title, Text} = Typography;

// Timing constants (in seconds)
const INITIAL_TIME = 120;
const MIN_TIME = 30;
const TIME_DECREMENT = 10;
const MAX_FAILS = 3;

// Containers & Layout
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    background: #f0f2f5;
    min-height: 100vh;
`;

const TimerContainer = styled.div`
    background: #fff;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`;

const ContentWrapper = styled.div`
    display: flex;
    width: 100%;
    max-width: 1200px;
    gap: 32px;
`;

// Styled Cards
const QuestionCard = styled(Card)`
    flex: 3;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);

    .ant-card-body {
        padding: 24px;
    }
`;

const StatsCard = styled(Card)`
    flex: 1;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    text-align: center;

    .ant-card-body {
        padding: 24px;
    }
`;

// UI Elements
const TimerDisplay = styled(Title)`
    margin: 0;
    color: #1890ff;
    font-size: 2rem !important;
`;

const ChancesContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const ChanceBox = styled.div`
    width: 28px;
    height: 28px;
    border: 2px solid ${props => (props.filled ? '#ff4d4f' : '#d9d9d9')};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${props => (props.filled ? '#ff4d4f' : 'transparent')};
`;

const NextButton = styled(Button)`
    margin-top: 24px;
    width: 100%;
    background: #1890ff;
    border: none;
    font-weight: 600;

    &:hover, &:focus {
        background: #40a9ff;
    }
`;

export default function TimedChallengePage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [correctCount, setCorrectCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [timePerQuestion, setTimePerQuestion] = useState(INITIAL_TIME);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    // Fetch a question
    const fetchNextQuestion = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({random: true, page: 1, page_size: 1});
            const res = await api.get(`api/filter_questions/?${params.toString()}`);
            setCurrentQuestion(res.data.questions[0]);
            setQuestionStatus('Blank');
        } catch {
            setError('Failed to load question.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (!hasFetched.current) fetchNextQuestion();
        hasFetched.current = true;
    }, [fetchNextQuestion]);

    // Handle failures
    const handleFail = useCallback(() => {
        setFailCount(f => {
            const next = f + 1;
            if (next >= MAX_FAILS) setGameOver(true);
            return next;
        });
        setQuestionStatus('Incorrect');
    }, []);

    // Timer logic
    useEffect(() => {
        clearInterval(timerRef.current);
        if (!currentQuestion || gameOver) return;
        setTimeLeft(timePerQuestion);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    handleFail();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentQuestion, timePerQuestion, gameOver, handleFail]);

    // Submit answer
    const handleQuestionSubmit = async (id, choice) => {
        try {
            const res = await api.post('api/check_answer/', {question_id: id, selected_choice: choice});
            if (res.data.result === 'correct') {
                setQuestionStatus('Correct');
                setCorrectCount(c => c + 1);
            } else handleFail();
        } catch {
            setError('Submission error.');
        }
    };

    // Move to next
    const handleNext = () => {
        setTimePerQuestion(tp => Math.max(MIN_TIME, tp - TIME_DECREMENT));
        fetchNextQuestion();
    };

    if (loading) return <PageContainer><Text>Loading...</Text></PageContainer>;
    if (error) return <PageContainer><Text type="danger">{error}</Text></PageContainer>;

    return (
        <PageContainer>
            <TimerContainer>
                <Text><ClockCircleOutlined/> Time Left</Text>
                <TimerDisplay level={2}>{timeLeft}s</TimerDisplay>
                <ChancesContainer>
                    {Array(MAX_FAILS).fill().map((_, i) => <ChanceBox key={i}
                                                                      filled={i < failCount}><StopOutlined/></ChanceBox>)}
                </ChancesContainer>
            </TimerContainer>

            <ContentWrapper>
                <QuestionCard title={`Question ${correctCount + failCount + 1}`} extra={<Badge
                    status={questionStatus === 'Correct' ? 'success' : questionStatus === 'Incorrect' ? 'error' : 'default'}
                    text={questionStatus}/>}>
                    <Question
                        questionData={currentQuestion}
                        status={questionStatus}
                        onSubmit={handleQuestionSubmit}
                    />
                    {questionStatus !== 'Blank' && !gameOver && (
                        <NextButton type="primary" block onClick={handleNext}>Next Question</NextButton>
                    )}
                </QuestionCard>

                <StatsCard>
                    <Title level={4}>Correct Answers</Title>
                    <Title level={1}>{correctCount}</Title>
                    <Text>You’ve answered these correctly</Text>
                </StatsCard>
            </ContentWrapper>

            <Modal
                visible={gameOver}
                title="Game Over"
                centered
                onOk={() => window.location.reload()}
                onCancel={() => navigate('/trainer')}
                okText="Retry"
                cancelText="Back to Trainer"
            >
                <Title level={3}>Final Score</Title>
                <Text strong style={{fontSize: '1.5rem'}}>{correctCount}</Text>
            </Modal>
        </PageContainer>
    );
}
