import React, {useState, useEffect, useCallback} from 'react';
import {Card, Button, Typography, message, Row, Col} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import styled from 'styled-components';
import TournamentLeaderboard from '../components/TournamentLeaderboard';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const {Title, Text} = Typography;

const PageContainer = styled.div`
    padding: 24px;
    background: linear-gradient(135deg, #f0f2f5, #e6f7ff);
    min-height: 100vh;
`;

const StyledCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const InfoItem = styled.div`
    background-color: #ffffff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const InfoLabel = styled(Text)`
    font-weight: bold;
    color: #1890ff;
`;

const InfoValue = styled(Text)`
    color: #262626;
`;

const JoinButton = styled(Button)`
    margin-top: 24px;
    height: 48px;
    font-size: 18px;
    width: 100%;
`;

const TournamentDetail = () => {
    const {token} = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const {tournamentId} = useParams();
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const convertDurationToSeconds = (duration) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    useEffect(() => {
        const fetchTournamentDetail = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/`);
                setTournament(response.data);
                setLoading(false);
                console.log(response.data)
            } catch (error) {
                message.error('Failed to fetch tournament details');
                setLoading(false);
            }
        };
        const fetchLeaderboard = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/leaderboard/`);
                setLeaderboardData(response.data);
            } catch (err) {
                message.error(err.response?.data?.error || 'An error occurred while fetching leaderboard.');
            }
        };
        fetchTournamentDetail();
        fetchLeaderboard();
    }, [baseUrl, tournamentId]);


    const handleStartTournament = async () => {
        if (!token) {
            message.error('You need to be logged in to start the tournament');
            return;
        }
        try {
            const response = await axios.post(`${baseUrl}/api/tournaments/${tournamentId}/join/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.status === 'Active') {
                navigate(`/tournament/${tournamentId}/questions/`);
                message.success('Tournament joined successfully');
            } else {
                message.error("You've already finished this tournament!");
            }
        } catch (error) {
            message.error('Failed to start the tournament');
        }
    };

    if (loading) {
        return <PageContainer>Loading...</PageContainer>;
    }

    if (!tournament) {
        return <PageContainer>Tournament not found</PageContainer>;
    }

    return (
        <PageContainer>
            <Row gutter={24}>
                <Col xs={24} lg={12}>
                    <StyledCard>
                        <Title level={2}>{tournament.name}</Title>
                        <InfoContainer>
                            <InfoItem>
                                <InfoLabel>Description: </InfoLabel>
                                <InfoValue>{tournament.description}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Start Time: </InfoLabel>
                                <InfoValue>{dayjs(tournament.start_time).format('YYYY-MM-DD HH:mm')}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>End Time: </InfoLabel>
                                <InfoValue>{dayjs(tournament.end_time).format('YYYY-MM-DD HH:mm')}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Time: </InfoLabel>
                                <InfoValue>{dayjs.duration(convertDurationToSeconds(tournament.duration)*1000).humanize()}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Number of Questions: </InfoLabel>
                                <InfoValue>{tournament.questionNumber}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Number of Participants: </InfoLabel>
                                <InfoValue>{tournament.participantNumber}</InfoValue>
                            </InfoItem>
                        </InfoContainer>
                        <JoinButton type="primary" onClick={handleStartTournament}>
                            Join Tournament
                        </JoinButton>
                    </StyledCard>
                </Col>
                <Col xs={24} lg={12}>
                    <StyledCard>
                        <TournamentLeaderboard leaderboardData={leaderboardData}
                                               tournamentStartTime={tournament.start_time}/>
                    </StyledCard>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default TournamentDetail;