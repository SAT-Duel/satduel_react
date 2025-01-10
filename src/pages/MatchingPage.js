import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from 'react-router-dom';
import {Button, Row, Col, Typography, Card, message, List, Avatar} from 'antd';
import {UserOutlined, RocketOutlined, LoadingOutlined, TeamOutlined} from '@ant-design/icons';
import styled, {keyframes} from 'styled-components';
import '../styles/Match.css';
import api from "../components/api"; // Assuming you have a CSS file for custom styles

const {Title, Paragraph} = Typography;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F7FF 0%, #E8EEFF 100%);
    padding: 60px 20px;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const HeroTitle = styled(Title)`
    font-size: 3.5rem;
    color: #0B2F7D;
    margin-bottom: 20px;
    text-align: center;

    /* Use a different font for "SAT Duel" */

    span.sat-duel {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        //color: #4C3D97;
        //background: linear-gradient(90deg, #2B7FA3, #C95FFB);
        //-webkit-background-clip: text;
        //-webkit-text-fill-color: transparent;
        background: linear-gradient(75deg, #8f73ff 0%, #34acfb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

const HeroParagraph = styled(Paragraph)`
    font-size: 1.25rem;
    color: #4A4A4A;
    max-width: 700px;
    margin: 0 auto 40px;
    text-align: center;
`;

const BigButton = styled(Button)`
    background: #4C3D97;
    color: #fff;
    border: none;
    font-size: 1.25rem;
    height: auto;
    padding: 15px 50px;
    border-radius: 30px;
    margin: 20px auto;
    display: block;
    transition: all 0.3s ease;

    &:hover {
        background: #3C2D87;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(76, 61, 151, 0.2);
    }
`;

const StyledCard = styled(Card)`
    height: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    }

    .anticon {
        font-size: 2.5rem;
        color: #4C3D97;
    }

    .ant-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`;

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoadingIcon = styled(LoadingOutlined)`
    font-size: 3rem;
    color: #4C3D97;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
`;

const CancelButton = styled(Button)`
    background: #ff4d4f;
    color: #fff;
    border: none;
    font-size: 1.25rem;
    height: auto;
    padding: 15px 50px;
    border-radius: 30px;
    margin: 20px auto;
    display: block;
    transition: all 0.3s ease;

    &:hover {
        background: #d9363e;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(255, 77, 79, 0.2);
    }
`;

const OnlineUsersContainer = styled.div`
    margin-top: 60px;
    padding: 20px;
    border-radius: 12px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
`;

const sentences = [
    "Searching for opponents...",
    "Getting ready for the battle...",
    "Preparing your duel...",
    "Almost there...",
    "Setting up your battle arena..."
];

const Match = () => {
    const {token, loading} = useAuth();
    const [matching, setMatching] = useState(false);
    const [roomId, setRoomIdInternal] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState(sentences[0]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const navigate = useNavigate();

    const handleMatch = async () => {
        if (!token) {
            message.error('You must be logged in to start a duel.');
            return;
        }

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${baseUrl}/api/match/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRoomIdInternal(response.data.id);
            if (response.data.full === 'true') {
                setMatching(false);
                navigate(`/match-loading/${response.data.id}`);
                return;
            }
            setMatching(true);
            startMatchingTimeout();
        } catch (err) {
            console.error('Error initiating duel:', err);
            message.error(err.response?.data?.error || 'An error occurred while initiating the duel.');
            setMatching(false);
        }
    };

    const handleCancel = useCallback(async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/match/cancel_match/`, {
                room_id: roomId
            });
            setMatching(false);
            setRoomIdInternal(null);
            message.success('Duel canceled.');
        } catch (err) {
            console.error('Error canceling the duel:', err);
            message.error(err.response?.data?.error || 'An error occurred while canceling the duel.');
        }
    }, [roomId]);


    const startMatchingTimeout = () => {
        setTimeout(async () => {
            if (matching) {
                await handleCancel();
                message.info('We couldn\'t find you an opponent. Please try again later.');
            }
        }, 60000);
    };

    useEffect(() => {
        const getStatus = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/match/status/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        room_id: roomId
                    }
                });
                if (response.data.status === 'full') {
                    navigate(`/match-loading/${roomId}`);
                }
            } catch (err) {
                console.error('Error checking room status:', err);
            }
        };
        if (roomId) {
            const interval = setInterval(async () => {
                await getStatus();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [roomId, token, navigate, matching]);

    useEffect(() => {
        if (matching) {
            const interval = setInterval(() => {
                setLoadingMessage((prev) => {
                    const currentIndex = sentences.indexOf(prev);
                    return sentences[(currentIndex + 1) % sentences.length];
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [matching]);

    useEffect(() => {
        const rejoinRoom = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/match/rejoin/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.battle_room_id) {
                    navigate(`/duel_battle/${response.data.battle_room_id}`);
                } else if (response.data.searching_room_id) {
                    setMatching(true);
                    setRoomIdInternal(response.data.searching_room_id);
                }
            } catch (err) {
                // Handle error
            }
        };
        if (!loading) {
            rejoinRoom();
        }
    }, [loading, navigate, token]);

    // Fetch online users
    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const response = await api.get(`api/online_users/`);
                setOnlineUsers(response.data.users);
            } catch (err) {
                console.error('Error fetching online users:', err);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 8000); // Update every 8 seconds
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const sendHeartbeat = async () => {
            try {
                await api.post(`api/update_online_status/`);
            } catch (err) {
                console.error('Error updating online status:', err);
            }
        };

        if (token) {
            sendHeartbeat(); // Send an initial heartbeat
            const interval = setInterval(sendHeartbeat, 8000); // Every 8 seconds
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        const removeOnlineStatus = async () => {
            try {
                await api.post(`api/remove_online_user/`);
            } catch (err) {
                console.error('Error removing online status:', err);
            }
            // if(matching){
            //     await handleCancel();
            // }
        };

        window.addEventListener('beforeunload', removeOnlineStatus);
        return () => {
            window.removeEventListener('beforeunload', removeOnlineStatus);
            removeOnlineStatus();
        };
    }, [handleCancel, matching, token]);

    return (
        <Container>
            <ContentWrapper>
                <HeroTitle level={1}>
                    Engage in an <span className="sat-duel">SAT Duel</span>
                </HeroTitle>
                <HeroParagraph>
                    Test your skills and challenge others in real-time SAT duels.
                    Compete with students worldwide and climb the leaderboards.
                </HeroParagraph>

                {matching ? (
                    <div style={{textAlign: 'center', marginBottom: '40px'}}>
                        <LoadingIcon/>
                        <Paragraph style={{fontSize: '1.2rem', color: '#4A4A4A'}}>{loadingMessage}</Paragraph>
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                    </div>
                ) : (
                    <BigButton onClick={handleMatch}>Start a Duel</BigButton>
                )}

                {/* Online Users Section */}
                <OnlineUsersContainer>
                    <Title level={3} style={{textAlign: 'center', color: '#0B2F7D'}}>
                        <TeamOutlined/> Online Users
                    </Title>
                    <Paragraph style={{textAlign: 'center', color: '#4A4A4A'}}>
                        See who is currently online and ready to duel.
                    </Paragraph>
                    <List
                        itemLayout="horizontal"
                        dataSource={onlineUsers}
                        renderItem={user => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined/>}/>}
                                    title={<span style={{color: '#0B2F7D'}}>{user.username}</span>}
                                    description={<span style={{color: '#4A4A4A'}}>{user.status}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </OnlineUsersContainer>

                {/* Instructions Section */}
                <div style={{marginTop: '60px'}}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <StyledCard>
                                <RocketOutlined/>
                                <Title level={3} style={{marginTop: '20px', color: '#0B2F7D'}}>How It Works</Title>
                                <Paragraph style={{fontSize: '1rem', color: '#4A4A4A'}}>
                                    Click the "Start a Duel" button to be matched with an opponent.
                                    Battle in real-time SAT quizzes and see who comes out on top.
                                </Paragraph>
                            </StyledCard>
                        </Col>
                        <Col xs={24} md={12}>
                            <StyledCard>
                                <UserOutlined/>
                                <Title level={3} style={{marginTop: '20px', color: '#0B2F7D'}}>Challenge a
                                    Friend</Title>
                                <Paragraph style={{fontSize: '1rem', color: '#4A4A4A'}}>
                                    Invite your friends to a duel and compete directly with them.
                                    (Coming Soon)
                                </Paragraph>
                            </StyledCard>
                        </Col>
                    </Row>
                </div>
            </ContentWrapper>
        </Container>
    );
};

export default Match;
