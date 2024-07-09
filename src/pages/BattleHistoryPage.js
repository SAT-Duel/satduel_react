import React, {useState, useEffect} from 'react';
import {Table, Typography, Layout, Spin, message} from 'antd';
import {useAuth} from '../context/AuthContext'; // Adjust this import based on your auth context
import axios from 'axios';
import styled from 'styled-components';

const {Title} = Typography;
const {Content} = Layout;

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

const MatchHistoryPage = () => {
    const [matches, setMatches] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const {token, loading, user} = useAuth(); // Assuming you have an auth context

    useEffect(() => {
        if (!loading) {
            fetchMatchHistory();
        }
    }, [loading]);

    const fetchMatchHistory = async () => {
        try {
            const response = await axios.get('/api/match/get_match_history/', {
                headers: {
                    Authorization: `Bearer ${token}` // Adjust based on your token storage method
                }
            });
            setMatches(response.data);
            setLoadingHistory(false);
            console.log(response.data);
            console.log(user.id);
        } catch (error) {
            console.error('Error fetching match history:', error);
            message.error('Failed to load match history. Please try again later.');
            setLoadingHistory(false);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => {
                const date = new Date(text);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            }
        },
        {
            title: 'Opponent',
            key: 'opponent',
            render: (text, record) => record.user1.username === user.username ? record.user2.username : record.user1.username
        },
        {
            title: 'Result',
            key: 'result',
            render: (text, record) => {
                const isUser1 = record.user1.username === user.username;
                if (record.winner === null) return 'Draw';
                return record.winner === (isUser1 ? record.user1.id : record.user2.id) ? 'Win' : 'Loss';
            }
        },
        {
            title: 'Score',
            key: 'score',
            render: (text, record) => `${record.user1_score} - ${record.user2_score}`
        }
    ];


    return (
        <PageWrapper>
            <Title level={2} style={{color: '#4a148c', marginBottom: '24px'}}>Match History</Title>
            {loadingHistory ? (
                <Spin size="large"/>
            ) : (
                <StyledTable
                    dataSource={matches}
                    columns={columns}
                    rowKey="id"
                    pagination={{pageSize: 10}}
                />
            )}
        </PageWrapper>
    );
};

export default MatchHistoryPage;