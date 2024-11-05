import React, {useEffect, useState} from 'react';
import {Layout, Typography, Row, Col, Button, Divider, Modal, Input, message} from 'antd';
import {TrophyOutlined, LoginOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import api from '../components/api';
import TournamentCard from '../components/Tournament/TournamentCard';

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const HeroTitle = styled(Title)`
    font-size: 3.5rem;
    color: #0B2F7D;
    margin-bottom: 20px;
    text-align: center;

    span.sat-duel {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        background: linear-gradient(75deg, #8f73ff 0%, #34acfb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

const HeroParagraph = styled(Paragraph)`
    font-size: 1.25rem;
    color: #4A4A4A;
    max-width: 700px;
    margin: 0 auto 40px;
    text-align: center;
`;

const StyledContent = styled(Content)`
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
`;

const HeaderSection = styled.div`
    text-align: center;
    margin-bottom: 30px;
`;

const CTAButton = styled(Button)`
    font-size: 16px;
    height: auto;
    padding: 10px 20px;
    border-radius: 8px;
    background: #7b00ff;
    border-color: #7b00ff;
    margin-top: 20px;

    &:hover,
    &:focus {
        background: #7a2fc2 !important;
        border-color: #7a2fc2 !important;
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
    const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const navigate = useNavigate();

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

    const handleJoinTournament = () => {
        setJoinCodeModalVisible(true);
    };

    const handleJoinCodeSubmit = async () => {
        if (!joinCode.trim()) {
            message.warning('Please enter a join code.');
            return;
        }

        try {
            const response = await api.post('api/tournaments/join_from_code/', {
                join_code: joinCode.trim(),
            });
            const tournamentId = response.data.id;
            message.success('Successfully joined the tournament!');
            setJoinCodeModalVisible(false);
            setJoinCode('');
            navigate(`/tournament/${tournamentId}`);
        } catch (error) {
            console.error('Error joining tournament:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Invalid join code. Please try again.');
            }
        }
    };

    const handleJoinCodeCancel = () => {
        setJoinCodeModalVisible(false);
        setJoinCode('');
    };

    return (
        <Layout>
            <StyledContent>
                <HeaderSection>
                    <HeroTitle level={1}>
                        Welcome to <span className="sat-duel">SAT Tournament</span>
                        <TrophyOutlined style={{marginLeft: '10px'}}/>
                    </HeroTitle>
                    <HeroParagraph>
                        Join SAT Tournaments to compete against students from all over the world.
                        Test your skills and motivate yourself to become the best!
                    </HeroParagraph>
                    <CTAButton
                        type="primary"
                        size="large"
                        icon={<LoginOutlined/>}
                        onClick={handleJoinTournament}
                    >
                        Join Private Tournament
                    </CTAButton>
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

                {/* Join Code Modal */}
                <Modal
                    title="Enter Join Code"
                    visible={joinCodeModalVisible}
                    onOk={handleJoinCodeSubmit}
                    onCancel={handleJoinCodeCancel}
                    okText="Join"
                    cancelText="Cancel"
                >
                    <Input
                        placeholder="Enter the tournament join code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                    />
                </Modal>
            </StyledContent>
        </Layout>
    );
};

export default TournamentListPage;
