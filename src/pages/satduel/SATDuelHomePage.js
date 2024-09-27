// src/components/HomePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Layout, List, Button, message, Modal, Input } from 'antd';
import axios from 'axios';
import CreateGameModal from '../../components/CreateGameModal';
import './styles.css';
import withAuth from "../../hoc/withAuth";
import { useAuth } from "../../context/AuthContext";

const { Header, Content, Sider } = Layout;

function SATDuelHomePage() {
    const [games, setGames] = useState([]);
    const [createGameVisible, setCreateGameVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [password, setPassword] = useState('');
    const { token, loading } = useAuth();

    // Memoize the fetchGames function to prevent it from causing useEffect re-runs
    const fetchGames = useCallback(() => {
        const baseUrl = process.env.REACT_APP_API_URL;
        axios.get(`${baseUrl}/api/games/waiting/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setGames(response.data))
        .catch(error => message.error('Failed to fetch games.'+error));

    }, [token]); // Dependency array includes only token

    useEffect(() => {
        if (!loading) {
            fetchGames();
            // Set interval to fetch games every 10 seconds
            const interval = setInterval(fetchGames, 10000);
            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [fetchGames, loading]); // useEffect depends on fetchGames and loading

    const handleJoinGame = (game) => {
        console.log(game)
        if (game.has_password) {
            // If the game has a password, prompt the user for it
            setSelectedGame(game);
            setPasswordModalVisible(true);
        } else {
            // Otherwise, try to join the game directly
            joinGame(game.id);
        }
    };

    const joinGame = (gameId, password = '') => {
        const baseUrl = process.env.REACT_APP_API_URL;
        axios.post(`${baseUrl}/api/games/${gameId}/join/`, { password }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            message.success('Joined the game successfully.');
            window.location.href = `/waiting-room/${gameId}`;
        })
        .catch(error => {
            message.error(error.response?.data?.error || 'Failed to join the game.');
        });
    };

    const handlePasswordSubmit = () => {
        if (selectedGame) {
            joinGame(selectedGame.id, password);
            setPasswordModalVisible(false);
            setPassword('');
        }
    };

    return (
        <Layout className="layout">
            <Header className="header">
                <h1>SAT Duel</h1>
            </Header>
            <Layout>
                <Content className="content">
                    <List
                        header={<div>Available Rooms</div>}
                        bordered
                        dataSource={games}
                        renderItem={game => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => handleJoinGame(game)}
                                    >
                                        Join
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={`Game ID: ${game.id}`}
                                    description={`Players: ${game.players.length + 1}/${game.max_players}`}
                                />
                            </List.Item>
                        )}
                    />
                </Content>
                <Sider width={200} className="sider">
                    <div className="placeholder">
                        {/* Placeholder for "People Online" */}
                        <h3>People Online</h3>
                    </div>
                </Sider>
            </Layout>
            <div className="footer">
                <Button type="primary" onClick={() => setCreateGameVisible(true)}>Create Game</Button>
            </div>
            <CreateGameModal
                visible={createGameVisible}
                onClose={() => setCreateGameVisible(false)}
                onGameCreated={gameId => window.location.href = `/waiting-room/${gameId}`}
            />
            <Modal
                title="Enter Game Password"
                visible={passwordModalVisible}
                onOk={handlePasswordSubmit}
                onCancel={() => setPasswordModalVisible(false)}
            >
                <Input.Password
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </Modal>
        </Layout>
    );
}

export default withAuth(SATDuelHomePage);
