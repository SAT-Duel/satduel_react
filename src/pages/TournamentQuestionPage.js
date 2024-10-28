import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate, useParams} from 'react-router-dom';
import Question from "../components/Question";
import {Button, message, Modal} from "antd";
import Leaderboard from "../components/TournamentLeaderboard";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const SectionTitle = styled.h2`
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

const ContentWrapper = styled.div`
    display: flex;
    gap: 24px;
`;

const TournamentQuestionContainer = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    gap: 24px;
`;

const QuestionsSection = styled.div`
    flex: 2;
`;

const InfoAndLeaderboardSection = styled.div`
    flex: 1;
    position: sticky;
    top: 24px;
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
`;

const InfoSection = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    background: linear-gradient(135deg, #e6e6fa, #e6f7ff);
    margin-bottom: 24px;
`;

const LeaderboardWrapper = styled.div`
    flex-grow: 1;
    overflow: hidden;
`;

const TournamentQuestionPage = () => {
    const {token, loading} = useAuth();
    const {tournamentId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [tournamentQuestionMap, setTournamentQuestionMap] = useState({}); // Mapping of Question IDs to TrackedQuestion IDs
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [participantInfo, setParticipantInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const navigate = useNavigate();

    const finishTournament = useCallback(async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/tournaments/${tournamentId}/finish/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
                    'Authorization': `Bearer ${token}`
                }
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
                const response = await axios.post(`${baseUrl}/api/tournaments/${tournamentId}/questions/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setQuestions(response.data);
                const questionMap = {};
                response.data.forEach(tournamentQuestion => {
                    questionMap[tournamentQuestion.question.id] = tournamentQuestion.id;
                });
                setTournamentQuestionMap(questionMap);
                setLoading(false);
            } catch (err) {
                message.error(err.response?.data?.error || 'An error occurred while fetching tournament questions.');
                setLoading(false);
            }
        };

        const fetchParticipantInfo = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/get_participation_info/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setParticipantInfo(response.data);
                console.log(response.data)
            } catch (err) {
                message.error(err.response?.data?.error || 'An error occurred while fetching tournament information.');
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
        setIsReadOnly(searchParams.get('readonly') === 'true'); // Check if readonly mode is enabled

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
    }, [participantInfo, navigate, tournamentId, finishTournament, isReadOnly]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--:--';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleQuestionSubmit = async (id, choice) => {
        if(isReadOnly) return;

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${baseUrl}/api/tournaments/${tournamentId}/submit-answer/`, {
                question_id: id,
                selected_choice: choice,
                tournament_question_id: tournamentQuestionMap[id]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const tournament_question_id = tournamentQuestionMap[id];
            const status = response.data.status;
            // Update the local state to reflect the answered question
            setQuestions(prevQuestions => prevQuestions.map(q =>
                q.id === tournament_question_id ? {...q, status: status} : q
            ));
            fetchLeaderboard();
        } catch (err) {
            message.error(err.response?.data?.error || 'An error occurred while submitting the answer.');
        }
    };

    const showEndTournamentConfirm = () => {
        if(isReadOnly){
            navigate(`/tournament/${tournamentId}`);
            return;
        }
        Modal.confirm({
            title: 'Are you sure you want to leave the tournament?',
            icon: <ExclamationCircleOutlined/>,
            content: 'This action is not reversible. You can view this tournament in the tournament history page.',
            onOk() {
                finishTournament();
            },
            onCancel() {
            },
        });
    };

    if (loadingQuestions) {
        return <div>Loading questions...</div>;
    }

    return (
        <TournamentQuestionContainer>
            <ContentWrapper>
                <QuestionsSection>
                    <SectionTitle>Tournament Questions</SectionTitle>
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
                    <Button
                        type="primary"
                        danger
                        onClick={showEndTournamentConfirm}
                        style={{marginTop: '16px', width: '100%'}}
                    >
                        {isReadOnly?"Go Back": "Finish Tournament"}
                    </Button>
                </QuestionsSection>
                <InfoAndLeaderboardSection>
                    <InfoSection>
                        <SectionTitle>Tournament Info</SectionTitle>
                        {participantInfo && (
                            <>
                                <p><b>Name:</b> {participantInfo.tournament.name}</p>
                                <p><b>Questions:</b> {participantInfo.tournament.questionNumber}</p>
                                <p><b>Participants:</b> {participantInfo.tournament.participantNumber}</p>
                            </>
                        )}
                        <SectionTitle>Time Left</SectionTitle>
                        <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
                    </InfoSection>
                    <LeaderboardWrapper>
                        <Leaderboard
                            leaderboardData={leaderboardData}
                            tournamentStartTime={participantInfo?.start_time}
                        />
                    </LeaderboardWrapper>
                </InfoAndLeaderboardSection>
            </ContentWrapper>
        </TournamentQuestionContainer>
    );
};

export default TournamentQuestionPage;