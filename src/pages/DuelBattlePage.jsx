import React, {useEffect, useState, useCallback} from 'react';
import styled from 'styled-components';
import {useAuth} from '../context/AuthContext';
import {useNavigate, useParams} from 'react-router-dom';
import Question from '../components/Question';
import useOpponentProgress from '../hooks/useOpponentProgress';
import Progress from '../components/Progress';
import {message, Button, Drawer} from 'antd';
import {MenuOutlined} from '@ant-design/icons';
import api from '../components/api';
import {useMediaQuery} from 'react-responsive';

const DuelBattleContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (min-width: 992px) {
        flex-direction: row;
    }
`;

const QuestionsSection = styled.div`
    flex: 3;
`;

const ProgressSection = styled.div`
    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 16px;
    position: sticky;
    top: 16px;
    height: fit-content;

    @media (max-width: 991px) {
        display: none;
    }
`;

const FloatingButton = styled(Button)`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    border-radius: 50%;
    width: 60px;
    height: 60px;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #1a1a1a;
    margin-top: 5px;
`;

const TimeDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #1a1a1a;
    background: #f0f0f0;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    margin-top: 16px;
`;

const TextDisplay = styled.p`
    font-size: 1rem;
    margin-top: 16px;
    color: #e0502e;
    text-align: center;
`;

const DuelBattle = () => {
    const {loading} = useAuth();
    const {roomId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [trackedQuestionMap, setTrackedQuestionMap] = useState({});
    const [opponentProgress, setOpponentProgress] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const isDesktopOrLaptop = useMediaQuery({minWidth: 992});

    const endMatch = useCallback(async () => {
        try {
            await api.post(`api/match/end_match/`, {
                room_id: roomId,
            });
        } catch (err) {
            message.error(err.response?.data?.error || 'An error occurred while ending the match.');
        }
    }, [roomId]);

    useEffect(() => {
        if (loading || loadingQuestions) {
            return;
        }
        if (
            questions.length > 0 &&
            opponentProgress.length > 0 &&
            questions.every((entry) => entry.status !== 'Blank') &&
            opponentProgress.every((entry) => entry.status !== 'Blank')
        ) {
            message.success('Both players have finished the battle. Redirecting to results page.');
            endMatch();
            navigate(`/battle_result/${roomId}`);
        }
    }, [endMatch, loading, loadingQuestions, navigate, opponentProgress, questions, roomId]);

    useEffect(() => {
        const fetchEndTime = async () => {
            try {
                const response = await api.post(`api/match/get_end_time/`, {
                    room_id: roomId,
                });
                setEndTime(new Date(response.data.end_time));
            } catch (err) {
                message.error(err.response?.data?.error || 'An error occurred while fetching end time.');
            }
        };
        fetchEndTime();
    }, [roomId]);

    useEffect(() => {
        if (endTime) {
            const timer = setInterval(() => {
                const now = new Date();
                const difference = endTime - now;
                if (difference > 0) {
                    setTimeLeft(Math.round(difference / 1000));
                } else {
                    clearInterval(timer);
                    setTimeLeft(0);
                    endMatch();
                    navigate(`/battle_result/${roomId}`);
                }
            }, 500);

            return () => clearInterval(timer);
        }
    }, [endMatch, endTime, navigate, roomId]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useOpponentProgress(roomId, setOpponentProgress);

    const fetchTrackedQuestions = async (roomId) => {
        const response = await api.post(`api/match/questions/`, {
            room_id: roomId,
        });
        return response.data;
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const trackedQuestions = await fetchTrackedQuestions(roomId);
                setQuestions(trackedQuestions);
                const questionMap = {};
                trackedQuestions.forEach((trackedQuestion) => {
                    questionMap[trackedQuestion.question.id] = trackedQuestion.id;
                });
                setTrackedQuestionMap(questionMap);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching match questions:', err);
                setLoading(false);
            }
        };

        if (!loading) {
            fetchQuestions();
        }
    }, [roomId, loading]);

    const checkAnswer = async (id, choice) => {
        const response = await api.post(`api/check_answer/`, {
            question_id: id,
            selected_choice: choice,
        });
        return response.data.result;
    };

    const updateStatus = async (tracked_question_id, result) => {
        const response = await api.post(`api/match/update/`, {
            tracked_question_id: tracked_question_id,
            result: result,
        });
        if (response.data.status === 'success') {
            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === tracked_question_id
                        ? {...q, status: result === 'correct' ? 'Correct' : 'Incorrect'}
                        : q
                )
            );
        }
    };

    const handleQuestionSubmit = async (id, choice) => {
        const trackedQuestionId = trackedQuestionMap[id];
        const result = await checkAnswer(id, choice);
        await updateStatus(trackedQuestionId, result);
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    if (loadingQuestions) {
        return <div>Loading questions...</div>;
    }
    if (endTime === null) {
        return <div>Loading battle information...</div>;
    }

    return (
        <DuelBattleContainer>
            <ContentWrapper>
                <QuestionsSection>
                    {questions.map((trackedQuestion, i) => (
                        <Question
                            questionData={trackedQuestion.question}
                            key={trackedQuestion.id}
                            onSubmit={handleQuestionSubmit}
                            status={trackedQuestion.status}
                            questionNumber={i + 1}
                        />
                    ))}
                    <TextDisplay>
                        <b>Please wait for your opponent to finish...</b>
                        <br/>
                        Your answers were saved; it's safe to quit.
                        <br/>
                        You can find the battle results in Profile &gt; Match History.
                    </TextDisplay>
                </QuestionsSection>

                {isDesktopOrLaptop ? (
                    <ProgressSection>
                        <SectionTitle>Opponent's Progress</SectionTitle>
                        {opponentProgress.map((trackedQuestion, i) => (
                            <Progress
                                key={trackedQuestion.id}
                                status={trackedQuestion.status}
                                questionNumber={i + 1}
                            />
                        ))}
                        <SectionTitle>Time Left</SectionTitle>
                        <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
                    </ProgressSection>
                ) : (
                    <>
                        <FloatingButton type="primary" icon={<MenuOutlined/>} onClick={toggleDrawer}/>
                        <Drawer
                            title="Opponent's Progress"
                            placement="right"
                            closable={true}
                            onClose={toggleDrawer}
                            visible={drawerVisible}
                            height="50%"
                        >
                            <SectionTitle>Opponent's Progress</SectionTitle>
                            {opponentProgress.map((trackedQuestion, i) => (
                                <Progress
                                    key={trackedQuestion.id}
                                    status={trackedQuestion.status}
                                    questionNumber={i + 1}
                                    isMobile={true}
                                />
                            ))}
                            <SectionTitle>Time Left</SectionTitle>
                            <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
                        </Drawer>
                    </>
                )}
            </ContentWrapper>
        </DuelBattleContainer>
    );
};

export default DuelBattle;
