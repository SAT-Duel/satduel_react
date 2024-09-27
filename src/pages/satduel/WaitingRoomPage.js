import React, { useEffect, useState, useCallback } from 'react';
import { Layout, List, Button, message } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from "../../context/AuthContext";

const { Header, Content } = Layout;

function WaitingRoomPage() {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const { user, token, loading } = useAuth();
    const navigate = useNavigate();

    const fetchGameInfo = useCallback(() => {
        const baseUrl = process.env.REACT_APP_API_URL;
        axios.get(`${baseUrl}/api/games/${gameId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setGame(response.data);
            setIsHost(response.data.host.id === user.id);
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                message.error('Game not found.');
                navigate('/duels');
            } else {
                message.error('Failed to fetch game info.');
            }
        });
    }, [gameId, token, user, navigate]);

    // Long polling function
    const waitForGameStart = useCallback(() => {
        const baseUrl = process.env.REACT_APP_API_URL;
        axios.get(`${baseUrl}/api/games/${gameId}/wait_for_start/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeout: 35000, // Slightly more than server timeout
        })
        .then(response => {
            if (response.data.status === 'Battling') {
                message.success('Game has started!');
                navigate(`/game/${gameId}`);
            } else {
                // Restart the long polling
                waitForGameStart();
            }
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                // Request was cancelled, do nothing
            } else if (error.code === 'ECONNABORTED') {
                // Timeout occurred, restart the long polling
                waitForGameStart();
            } else if (error.response && error.response.status === 404) {
                message.error('Game not found.');
                navigate('/duels');
            } else {
                message.error('Connection error. Retrying...');
                setTimeout(waitForGameStart, 5000); // Retry after delay
            }
        });
    }, [gameId, token, navigate]);

    useEffect(() => {
        if (loading || !user) return;

        fetchGameInfo();

        if (!isHost) {
            waitForGameStart();
        }
    }, [fetchGameInfo, loading, user, isHost, waitForGameStart]);

    const handleStartGame = () => {
        const baseUrl = process.env.REACT_APP_API_URL;
        axios.post(`${baseUrl}/api/games/${gameId}/start/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            message.success('Game started!');
            navigate(`/game/${gameId}`);
        })
        .catch(error => message.error('Failed to start game.'+error));
    };

    if (!game) return null;

    return (
        <Layout className="layout">
            <Header className="header">
                <h1>Waiting Room - {game.host.username}'s Game</h1>
            </Header>
            <Content className="content">
                <div className="room-info">
                    <p><strong>Host:</strong> {game.host.username}</p>
                    <p><strong>Number of Players:</strong> {game.players.length + 1}</p>
                </div>
                <List
                    header={<div>Players Joined</div>}
                    bordered
                    dataSource={[game.host, ...game.players]}
                    renderItem={player => (
                        <List.Item>
                            {player.username} {player.id === game.host.id ? '(Host)' : ''}
                        </List.Item>
                    )}
                />
                {isHost && (
                    <Button type="primary" onClick={handleStartGame} className="start-button">
                        Start Game
                    </Button>
                )}
            </Content>
        </Layout>
    );
}

export default WaitingRoomPage;
