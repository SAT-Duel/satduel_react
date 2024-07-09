import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Typography, Row, Col, Avatar} from 'antd';
import styled, {keyframes} from 'styled-components';
import {UserOutlined} from '@ant-design/icons';
import {useAuth} from "../context/AuthContext";

const {Title, Text} = Typography;

const MatchLoadingContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F7FF 0%, #E8EEFF 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const LoadingCard = styled.div`
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    text-align: center;
    max-width: 600px;
    width: 100%;
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
`;

const VersusText = styled(Title)`
    color: #4C3D97;
    margin: 20px 0;
    animation: ${pulse} 1.5s infinite;
`;

const CountdownText = styled(Title)`
    font-size: 4rem;
    color: #4C3D97;
    margin-top: 30px;
`;

const PlayerInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledAvatar = styled(Avatar)`
    background-color: #4C3D97;
    margin-bottom: 10px;
`;

const MatchLoadingPage = () => {
    const {roomId} = useParams();
    const [countdown, setCountdown] = useState(5);
    const [opponent, setOpponent] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const {token} = useAuth();

    useEffect(() => {
        const fetchMatchInfo = async () => {
            try {
                const response = await axios.post(`/api/match/info/`, {
                    room_id: roomId
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                setOpponent(response.data.opponent);
                setCurrentUser(response.data.currentUser);
            } catch (error) {
                console.error('Error fetching match info:', error);
            }
        };

        fetchMatchInfo();
    }, [roomId, token]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(timer);
                    navigate(`/duel_battle/${roomId}`);
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [roomId, navigate]);

    return (
        <MatchLoadingContainer>
            <LoadingCard>
                <Title level={2}>Match Found!</Title>
                <Row justify="space-around" align="middle" style={{marginTop: 30}}>
                    <Col span={10}>
                        <PlayerInfo>
                            <StyledAvatar size={80} icon={<UserOutlined/>}/>
                            <Text strong>{currentUser?.username || 'You'}</Text>
                        </PlayerInfo>
                    </Col>
                    <Col span={4}>
                        <VersusText level={3}>VS</VersusText>
                    </Col>
                    <Col span={10}>
                        <PlayerInfo>
                            <StyledAvatar size={80} icon={<UserOutlined/>}/>
                            <Text strong>{opponent?.username || 'Opponent'}</Text>
                        </PlayerInfo>
                    </Col>
                </Row>
                <CountdownText level={2}>{countdown}</CountdownText>
                <Text type="secondary">Prepare for battle!</Text>
            </LoadingCard>
        </MatchLoadingContainer>
    );
};

export default MatchLoadingPage;