import React, {useEffect, useState} from 'react';
import {Layout, Typography, Card, Row, Col, Button} from 'antd';
import {TrophyOutlined, UserOutlined, CalendarOutlined, PlusCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import {Link} from "react-router-dom";
import styled from "styled-components";

const {Content} = Layout;
const {Title} = Typography;

const StyledContent = styled(Content)`
    padding: 50px;
`;

const StyledTitle = styled(Title)`
    margin-bottom: 30px;
`;

const CTAButton = styled(Button)`
    font-size: 18px;
    height: auto;
    padding: 12px 24px;
    border-radius: 8px;
    background: #ff4500;
    border-color: #ff4500;
    margin-bottom: 30px;

    &:hover, &:focus {
        background: #ff6347;
        border-color: #ff6347;
    }
`;

const TournamentCard = styled(Card)`
    .ant-card-cover {
        height: 120px;
        background: #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ant-card-meta-description {
        p {
            margin-bottom: 5px;
        }
    }
`;

const TournamentIcon = styled(TrophyOutlined)`
    font-size: 48px;
    color: #fff;
`;

const TournamentListPage = () => {
    const [tournaments, setTournaments] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/tournaments/`);
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, [baseUrl]);

    return (
        <Layout>
            <StyledContent>
                <StyledTitle level={2}>SAT Prep Tournaments</StyledTitle>
                <Link to="/create_tournament">
                    <CTAButton type="primary" size="large" icon={<PlusCircleOutlined/>}>
                        Create Tournament
                    </CTAButton>
                </Link>
                <Row gutter={[16, 16]}>
                    {tournaments.map(tournament => (
                        <Col xs={24} sm={12} md={8} lg={6} key={tournament.id}>
                            <TournamentCard
                                hoverable
                                cover={<TournamentIcon/>}
                                actions={[
                                    <Link to={`/tournament/${tournament.id}`}>
                                        <Button type="primary">Join Tournament</Button>
                                    </Link>,
                                ]}
                            >
                                <Card.Meta
                                    title={tournament.name}
                                    description={
                                        <>
                                            <p><UserOutlined/> {tournament.participantNumber} participants</p>
                                            <p>
                                                <CalendarOutlined/> Starts: {new Date(tournament.start_time).toLocaleDateString()}
                                            </p>
                                            <p>
                                                <CalendarOutlined/> Ends: {new Date(tournament.end_time).toLocaleDateString()}
                                            </p>
                                        </>
                                    }
                                />
                            </TournamentCard>
                        </Col>
                    ))}
                </Row>
            </StyledContent>
        </Layout>
    );
};

export default TournamentListPage;