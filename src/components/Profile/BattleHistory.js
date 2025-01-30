import React, { useEffect, useState } from 'react';
import { Layout, message, Spin, Table, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const PageWrapper = styled(Content)`
    padding: 24px;
    min-height: 280px;
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
`;

const StyledTable = styled(Table)`
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .ant-table-thead > tr > th {
        background: #9c27b0;
        color: white;
    }

    .ant-table-tbody > tr:hover > td {
        background: #f3e5f5;
    }
`;

const MatchHistory = ({ user_id = null }) => {
    const [matches, setMatches] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const { token, loading, user } = useAuth();
    const [viewingUser, setViewingUser] = useState(null);

    const isOwnHistory = user_id === null;

    useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const url = isOwnHistory ? `${baseUrl}/api/match/get_match_history/` : `${baseUrl}/api/match/get_match_history/${user_id}/`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMatches(response.data);
                if (!isOwnHistory && response.data.length > 0) {
                    const viewingUser = user_id.toString() === response.data[0].user1.id.toString() ? response.data[0].user1 : response.data[0].user2;
                    setViewingUser(viewingUser);
                }
                setLoadingHistory(false);
            } catch (error) {
                message.error(error.response?.data?.error || 'Failed to load match history. Please try again later.');
                setLoadingHistory(false);
            }
        };

        if (!loading) {
            fetchMatchHistory();
        }
    }, [token, user_id, loading, isOwnHistory]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text, record) => {
                const date = new Date(text);
                return <Link to={`/battle_result/${record.id}`}>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</Link>;
            }
        },
        {
            title: 'Opponent',
            key: 'opponent',
            render: (text, record) => {
                const currentUser = isOwnHistory ? user : viewingUser;
                return record.user1.username === currentUser.username ? record.user2.username : record.user1.username;
            }
        },
        {
            title: 'Result',
            key: 'result',
            render: (text, record) => {
                const currentUser = isOwnHistory ? user : viewingUser;
                const isUser1 = record.user1.username === currentUser.username;
                return record.winner === null ? 'Draw' : record.winner === (isUser1 ? record.user1.id : record.user2.id) ? 'Win' : 'Loss';
            }
        },
        {
            title: 'Score - (You-Opponent)',
            key: 'score',
            render: (text, record) => {
                const currentUser = isOwnHistory ? user : viewingUser;
                const isUser1 = record.user1.username === currentUser.username;
                return isUser1 ? `${record.user1_score} - ${record.user2_score}` : `${record.user2_score} - ${record.user1_score}`;
            }
        }
    ];

    return (
        <PageWrapper>
            <Title level={2} style={{ color: '#4a148c', marginBottom: '24px' }}>Match History</Title>
            {loadingHistory ? (
                <Spin size="large" />
            ) : (
                <StyledTable
                    dataSource={matches}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </PageWrapper>
    );
};

export default MatchHistory;
