import React, {useState, useEffect, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {Card, Typography, Modal, Button} from 'antd';
import Question from '../components/Question';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import api from "../components/api";

const {Title, Text} = Typography;

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

const StatsContainer = styled(Card)`
    flex: 1;
    height: fit-content;
    text-align: center;
`;

const StreakCounter = styled(Title)`
    font-size: 4rem;
    margin-bottom: 0;
    color: #1890ff;
`;

const ResultModal = styled(Modal)`
    text-align: center;

    .ant-modal-content {
        border-radius: 8px;
    }
`;

const NextButton = styled(Button)`
    margin-top: 16px;
`;

function SATSurvivalPage() {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState('Blank');
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const {token} = useAuth();
    const hasFetchedData = useRef(false);


    const fetchNextQuestion = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                type: 'any',
                difficulty: 'any',
                page: 1,
                page_size: 1,
                random: true
            }).toString();
            const response = await api.get(`api/filter_questions/?${queryParams}`);
            setCurrentQuestion(response.data.questions[0]);
            setQuestionStatus('Blank');
        } catch (error) {
            setError(`An error occurred: ${error.response ? error.response.data : 'Server unreachable'}`);
            console.error("Error fetching question:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchNextQuestion();
            hasFetchedData.current = true;
        }
    }, [fetchNextQuestion]);

    const handleQuestionSubmit = async (id, choice) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await api.post(`${baseUrl}/api/check_answer/`, {
                question_id: id,
                selected_choice: choice
            });
            const isCorrect = response.data.result === 'correct';

            if (isCorrect) {
                setQuestionStatus('Correct');
                setStreak(prevStreak => prevStreak + 1);
            } else {
                setQuestionStatus('Incorrect');
                setGameOver(true);
                await axios.patch(`${baseUrl}/api/profile/update_streak/`, {
                    max_streak: streak
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
            }
        } catch (error) {
            setError('Error checking answer: ' + (error.response ? error.response.data.error : 'Server unreachable'));
        }
    };

    if (loading) return <PageContainer><p>Loading question... Please wait...</p></PageContainer>;
    if (error) return <PageContainer><p>Error loading question: {error}</p></PageContainer>;

    return (
        <PageContainer>
            <ContentWrapper>
                <QuestionContainer>
                    {currentQuestion && (
                        <Question
                            questionData={currentQuestion}
                            onSubmit={handleQuestionSubmit}
                            status={questionStatus}
                            questionNumber={streak + 1}
                        />
                    )}
                    {questionStatus === 'Correct' && (
                        <NextButton type="primary" onClick={fetchNextQuestion}>Next Question</NextButton>
                    )}
                </QuestionContainer>
                <StatsContainer>
                    <Title level={3}>Current Streak</Title>
                    <StreakCounter level={1}>{streak}</StreakCounter>
                    <Text type="secondary">Questions answered correctly</Text>
                </StatsContainer>
            </ContentWrapper>

            <ResultModal
                visible={gameOver}
                onOk={() => window.location.reload()}
                onCancel={() => window.location.href = '/trainer'}
                okText="Try Again"
                cancelText="Back to Trainer"
            >
                <Title level={2}>Game Over!</Title>
                <Title level={3}>Your final score: {streak}</Title>
                <Text>Great job! You answered {streak} questions correctly in a row.</Text>
            </ResultModal>
        </PageContainer>
    );
}

export default SATSurvivalPage;
