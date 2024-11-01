import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, message, Modal, Drawer} from 'antd';
import {ExclamationCircleOutlined, MenuOutlined} from '@ant-design/icons';
import Question from '../components/Question';
import Leaderboard from '../components/TournamentLeaderboard';
import TournamentInfo from '../components/Tournament/TournamentInfo';
import {useMediaQuery} from 'react-responsive';

const TournamentQuestionContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: 992px) {
        flex-direction: row;
        gap: 24px;
    }
`;

const QuestionsSection = styled.div`
    flex: 2;
`;

const SidebarSection = styled.div`
    flex: 1;
    margin-top: 16px;

    @media (min-width: 992px) {
        margin-top: 0;
        position: sticky;
        top: 16px;
        height: calc(100vh - 32px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FinishButton = styled(Button)`
    margin-top: 16px;
    width: 100%;
`;

const TournamentQuestionPage = () => {
    const {token, loading} = useAuth();
    const {tournamentId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [tournamentQuestionMap, setTournamentQuestionMap] = useState({});
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [participantInfo, setParticipantInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();

    // Media query to detect screen size
    const isDesktopOrLaptop = useMediaQuery({minWidth: 992});

    const finishTournament = useCallback(async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(
                `${baseUrl}/api/tournaments/${tournamentId}/finish/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            message.success('Tournament ended.');
            navigate(`/tournament/${tournamentId}`);
        } catch (err) {
            message.error(err.response?.data?.error || 'An error occurred while finishing the tournament.');
        }
    }, [tournamentId, token, navigate]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/leaderboard/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaderboardData(response.data);
        } catch (err) {
            message.error(err.response?.data?.error || 'An error occurred while fetching leaderboard.');
        }
    }, [tournamentId, token]);

    useEffect(() => {
        const fetchTournamentQuestions = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.post(
                    `${baseUrl}/api/tournaments/${tournamentId}/questions/`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setQuestions(response.data);
                const questionMap = {};
                response.data.forEach((tournamentQuestion) => {
                    questionMap[tournamentQuestion.question.id] = tournamentQuestion.id;
                });
                setTournamentQuestionMap(questionMap);
                setLoading(false);
            } catch (err) {
                message.error(
                    err.response?.data?.error || 'An error occurred while fetching tournament questions.'
                );
                setLoading(false);
            }
        };

        const fetchParticipantInfo = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(
                    `${baseUrl}/api/tournaments/${tournamentId}/get_participation_info/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setParticipantInfo(response.data);
            } catch (err) {
                message.error(
                    err.response?.data?.error || 'An error occurred while fetching tournament information.'
                );
            }
        };
        if (!loading) {
            fetchTournamentQuestions();
            fetchParticipantInfo();
            fetchLeaderboard();
        }
    }, [tournamentId, token, loading, fetchLeaderboard]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setIsReadOnly(searchParams.get('readonly') === 'true');

        if (participantInfo && !isReadOnly) {
            const timer = setInterval(() => {
                const now = new Date();
                const endTime = new Date(participantInfo.end_time);
                const difference = endTime - now;

                if (difference > 0) {
                    setTimeLeft(Math.round(difference / 1000));
                } else {
                    clearInterval(timer);
                    setTimeLeft(0);
                    finishTournament();
                }
            }, 500);

            return () => clearInterval(timer);
        }
    }, [participantInfo, finishTournament, isReadOnly]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--:--';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleQuestionSubmit = async (id, choice) => {
        if (isReadOnly) return;

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${baseUrl}/api/tournaments/${tournamentId}/submit-answer/`,
                {
                    question_id: id,
                    selected_choice: choice,
                    tournament_question_id: tournamentQuestionMap[id],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const tournament_question_id = tournamentQuestionMap[id];
            const status = response.data.status;
            // Update the local state to reflect the answered question
            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === tournament_question_id ? {...q, status: status} : q
                )
            );
            fetchLeaderboard();
        } catch (err) {
            message.error(err.response?.data?.error || 'An error occurred while submitting the answer.');
        }
    };

    const showEndTournamentConfirm = () => {
        if (isReadOnly) {
            navigate(`/tournament/${tournamentId}`);
            return;
        }
        Modal.confirm({
            title: 'Are you sure you want to leave the tournament?',
            icon: <ExclamationCircleOutlined/>,
            content:
                'This action is not reversible. You can view this tournament in the tournament history page.',
            onOk() {
                finishTournament();
            },
            onCancel() {
            },
        });
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    if (loadingQuestions) {
        return <div>Loading questions...</div>;
    }

    return (
        <TournamentQuestionContainer>
            <ContentWrapper>
                <QuestionsSection>
                    {questions.map((question, i) => (
                        <Question
                            questionData={question.question}
                            key={question.id}
                            onSubmit={handleQuestionSubmit}
                            status={question.status}
                            questionNumber={i + 1}
                            disabled={isReadOnly}
                        />
                    ))}
                    <FinishButton
                        type="primary"
                        danger
                        onClick={showEndTournamentConfirm}
                    >
                        {isReadOnly ? 'Go Back' : 'Finish Tournament'}
                    </FinishButton>
                </QuestionsSection>

                {isDesktopOrLaptop ? (
                    <SidebarSection>
                        <TournamentInfo participantInfo={participantInfo} timeLeft={formatTime(timeLeft)}/>
                        <Leaderboard
                            leaderboardData={leaderboardData}
                            tournamentStartTime={participantInfo?.start_time}
                        />
                    </SidebarSection>
                ) : (
                    <>
                        <FloatingButton
                            type="primary"
                            icon={<MenuOutlined/>}
                            onClick={toggleDrawer}
                        />
                        <Drawer
                            title="Tournament Info & Leaderboard"
                            placement="right"
                            closable={true}
                            onClose={toggleDrawer}
                            visible={drawerVisible}
                            width={300}
                        >
                            <TournamentInfo participantInfo={participantInfo} timeLeft={formatTime(timeLeft)}/>
                            <Leaderboard
                                leaderboardData={leaderboardData}
                                tournamentStartTime={participantInfo?.start_time}
                            />
                        </Drawer>
                    </>
                )}
            </ContentWrapper>
        </TournamentQuestionContainer>
    );
};

export default TournamentQuestionPage;
