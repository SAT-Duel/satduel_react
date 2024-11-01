import React, {useEffect, useState} from 'react';
import {Layout, Typography, Row, Col, Button, Divider} from 'antd';
import {TrophyOutlined, PlusCircleOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import api from '../components/api';
import TournamentCard from '../components/Tournament/TournamentCard';

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const StyledContent = styled(Content)`
    padding: 30px 15px;
    max-width: 1200px;
    margin: 0 auto;
`;

const HeaderSection = styled.div`
    text-align: center;
    margin-bottom: 30px;
`;

const StyledTitle = styled(Title)`
    color: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CTAButton = styled(Button)`
    font-size: 16px;
    height: auto;
    padding: 10px 20px;
    border-radius: 8px;
    background: #ff4500;
    border-color: #ff4500;
    margin-top: 20px;

    &:hover,
    &:focus {
        background: #ff6347;
        border-color: #ff6347;
    }
`;

const TournamentListSection = styled.div`
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
`;

const StyledDivider = styled(Divider)`
    border-top: 2px solid #001529;
    margin: 40px 0;
`;

const InfoSection = styled.div`
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
`;

const TournamentListPage = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await api.get('api/tournaments/');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, []);

    return (
        <Layout>
            <StyledContent>
                <HeaderSection>
                    <StyledTitle level={2}>
                        <TrophyOutlined style={{marginRight: '10px'}}/>
                        SAT Prep Tournaments
                    </StyledTitle>
                    <Link to="/create_tournament">
                        <CTAButton type="primary" size="large" icon={<PlusCircleOutlined/>}>
                            Create Tournament
                        </CTAButton>
                    </Link>
                </HeaderSection>

                <TournamentListSection>
                    <Row gutter={[16, 16]} justify="center">
                        {tournaments.map((tournament) => (
                            <Col xs={24} sm={12} md={8} key={tournament.id}>
                                <TournamentCard tournament={tournament}/>
                            </Col>
                        ))}
                    </Row>
                </TournamentListSection>

                <StyledDivider/>

                <InfoSection>
                    <Title level={3}>What are SAT Tournaments?</Title>
                    <Paragraph style={{fontSize: '16px', lineHeight: '1.6'}}>
                        SAT Tournaments are competitive events designed to help students prepare for the SAT exam
                        in a fun and engaging way. Participants can challenge themselves, compete with peers, and
                        improve their skills through timed quizzes and practice tests.
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
