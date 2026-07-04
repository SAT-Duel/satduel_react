import React, {useEffect, useState} from 'react';
import {Card, List, Typography, message, Empty} from 'antd';
import {Link} from 'react-router-dom';
import api from '../components/api';
import styled from 'styled-components';
import {CopyOutlined, TrophyOutlined} from '@ant-design/icons';

const {Title, Text} = Typography;

const Container = styled.div`
    padding: 40px 20px;
    max-width: 1000px;
    margin: 0 auto;
`;

const StyledTitle = styled(Title)`
    text-align: center;
    color: #1a1a1a;
    font-weight: bold;
`;

const StyledCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fafafa;

    .ant-card-head {
        background-color: #001529;
        border-radius: 12px 12px 0 0;
    }

    .ant-card-head-title a {
        color: #fff;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .ant-card-body {
        padding: 20px;
    }
`;

const JoinCode = styled.div`
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    background-color: #e6f7ff;
    padding: 15px;
    border-radius: 8px;
    color: #0050b3;
    display: flex;
    align-items: center;
    justify-content: center;

    .join-code-text {
        margin-left: 8px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 20px;
    }
`;

const NoTournaments = styled(Empty)`
    margin-top: 50px;
`;

const MyTournamentsPage = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchMyTournaments = async () => {
            try {
                const response = await api.get('api/tournaments/my_tournaments/');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
                message.error('Failed to load your tournaments.');
            }
        };
        fetchMyTournaments();
    }, []);

    return (
        <Container>
            <StyledTitle level={2}>
                <TrophyOutlined style={{marginRight: '10px', color: '#faad14'}}/>
                My Tournaments
            </StyledTitle>
            {tournaments.length === 0 ? (
                <NoTournaments
                    description={
                        <span>
              You have not created any tournaments yet.
              <br/>
              <Link to="/create_tournament">Create a new tournament now!</Link>
            </span>
                    }
                />
            ) : (
                <List
                    grid={{gutter: 16, column: 1}}
                    dataSource={tournaments}
                    renderItem={(tournament) => (
                        <List.Item>
                            <StyledCard
                                title={
                                    <Link to={`/tournament/${tournament.id}`}>{tournament.name}</Link>
                                }
                            >
                                <Typography.Paragraph ellipsis={{rows: 2, expandable: true}}>
                                    {tournament.description}
                                </Typography.Paragraph>
                                <p>
                                    <Text strong>Start Time:</Text>{' '}
                                    {new Date(tournament.start_time).toLocaleString()}
                                </p>
                                <p>
                                    <Text strong>End Time:</Text>{' '}
                                    {new Date(tournament.end_time).toLocaleString()}
                                </p>
                                {tournament.private && tournament.join_code && (
                                    <JoinCode>
                                        <CopyOutlined/>
                                        <span className="join-code-text">{tournament.join_code}</span>
                                    </JoinCode>
                                )}
                            </StyledCard>
                        </List.Item>
                    )}
                />
            )}
        </Container>
    );
};

export default MyTournamentsPage;
