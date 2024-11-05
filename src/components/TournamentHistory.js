import React, { useEffect, useState } from 'react';
import { Layout, message, Spin, Table, Typography, Empty } from 'antd';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const { Title } = Typography;
const { Content } = Layout;

const PAGE_BACKGROUND = 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
const HEADER_COLOR = '#2196f3';
const TITLE_COLOR = '#0d47a1';

const PageWrapper = styled(Content)`
    padding: 24px;
    min-height: 280px;
    background: ${PAGE_BACKGROUND};
`;

const StyledTable = styled(Table)`
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .ant-table-thead > tr > th {
        background: ${HEADER_COLOR};
        color: white;
    }

    .ant-table-tbody > tr:hover > td {
        background: #e3f2fd;
    }
`;

const TournamentHistory = ({ user_id = null }) => {
    const [tournaments, setTournaments] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const { token, loading } = useAuth();

    const isOwnHistory = user_id === null;

    useEffect(() => {
        const fetchTournamentHistory = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const url = isOwnHistory
                    ? `${baseUrl}/api/tournaments/get_history/`
                    : `${baseUrl}/api/tournaments/get_history/${user_id}/`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTournaments(response.data);
            } catch (error) {
                message.error(
                    error.response?.data?.error ||
                        'Failed to load tournament history. Please try again later.'
                );
            } finally {
                setLoadingHistory(false);
            }
        };

        if (!loading) {
            fetchTournamentHistory();
        }
    }, [token, user_id, loading, isOwnHistory]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const columns = [
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (text) => formatDateTime(text),
        },
        {
            title: 'Tournament',
            dataIndex: ['tournament', 'name'],
            key: 'tournament',
            render: (text, record) => (
                <Link to={`/tournament/${record.tournament.id}`}>{record.tournament.name}</Link>
            ),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Out of',
            dataIndex: ['tournament', 'questionNumber'],
            key: 'out_of',
        },
    ];

    return (
        <PageWrapper>
            <Title level={2} style={{ color: TITLE_COLOR, marginBottom: '24px' }}>
                Tournament History
            </Title>
            {loadingHistory ? (
                <Spin size="large" />
            ) : tournaments.length > 0 ? (
                <StyledTable
                    dataSource={tournaments}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            ) : (
                <Empty description="No tournament history available." />
            )}
        </PageWrapper>
    );
};

TournamentHistory.propTypes = {
    user_id: PropTypes.string,
};

export default TournamentHistory;
