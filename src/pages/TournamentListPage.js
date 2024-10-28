import React, {useEffect, useState} from 'react';
import {Layout, Typography, Card, Row, Col, Button, Divider} from 'antd';
import {
    TrophyOutlined,
    UserOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import {Link} from "react-router-dom";
import styled from "styled-components";


const {Content} = Layout;
const {Title, Paragraph} = Typography;

const StyledContent = styled(Content)`
    padding: 50px;
    max-width: 1400px;
    margin: 0 auto;
`;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 12px;
`;

const StyledTitle = styled(Title)`
    margin-bottom: 0;
    color: #1890ff;
    display: flex;
    align-items: center;
`;

const CTAButton = styled(Button)`
    font-size: 18px;
    height: auto;
    padding: 12px 24px;
    border-radius: 8px;
    background: #ff4500;
    border-color: #ff4500;

    &:hover, &:focus {
        background: #ff6347;
        border-color: #ff6347;
    }
`;

const TournamentListSection = styled.div`
    background-color: #f0f2f5;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
`;

const TournamentCard = styled(Card)`
    width: 100%;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .ant-card-cover {
        height: 120px;
        background: #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ant-card-meta-title {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .ant-card-meta-description {
        font-size: 14px;

        p {
            margin-bottom: 8px;
        }
    }
`;

const TournamentIcon = styled(TrophyOutlined)`
    font-size: 60px;
    color: #fff;
`;

const StyledDivider = styled(Divider)`
    border-top: 2px solid #001529;
    margin: 40px 0;
`;

const InfoSection = styled.div`
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
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
                <HeaderSection>
                    <StyledTitle level={2}>
                        <TrophyOutlined style={{marginRight: '10px', fontSize: '32px'}}/>
                        SAT Prep Tournaments
                    </StyledTitle>
                    <Link to="/create_tournament">
                        <CTAButton type="primary" size="large" icon={<PlusCircleOutlined/>}>
                            Create Tournament
                        </CTAButton>
                    </Link>
                </HeaderSection>

                <TournamentListSection>
                    <Row gutter={[24, 24]}>
                        {tournaments.map(tournament => (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={tournament.id}>
                                <TournamentCard
                                    hoverable
                                    cover={<TournamentIcon/>}
                                    actions={[
                                        <Link to={`/tournament/${tournament.id}`}>
                                            <Button type="primary" >Join Tournament</Button>
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
                </TournamentListSection>

                <StyledDivider/>

                <InfoSection>
                    <Title level={3}>What are SAT Tournaments?</Title>
                    <Paragraph style={{fontSize: '16px', lineHeight: '1.6'}}>
                        SAT Tournaments are competitive events designed to help students prepare for the SAT exam in a
                        fun and engaging way. Participants can challenge themselves, compete with peers, and improve
                        their skills through timed quizzes and practice tests.
                    </Paragraph>
                    <Link to="/tournaments/info">
                        <Button type="primary" icon={<InfoCircleOutlined/>} size="large">
                            Learn More About Tournaments
                        </Button>
                    </Link>
                </InfoSection>
            </StyledContent>
        </Layout>
    );
};

export default TournamentListPage;