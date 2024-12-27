import React, {useEffect, useState} from 'react';
import {Layout, Typography, Row, Col, Button, Modal, Input, message, Space, Card, Divider} from 'antd';
import {TrophyOutlined, LoginOutlined, InfoCircleOutlined, RightOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import api from '../components/api';
import TournamentCard from '../components/Tournament/TournamentCard';

const {Content} = Layout;
const {Title, Paragraph, Text} = Typography;

const StyledHeader = styled(Layout.Header)`
    background: linear-gradient(135deg, #2b4c8c 0%, #1a365d 100%);
    padding: 60px 20px;
    text-align: center;
    height: auto;
    position: relative;
    overflow: hidden;
`;

const HeaderContent = styled.div`
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
`;

const HeaderOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 150%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
    z-index: 1;
`;

const StyledContent = styled(Content)`
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: #ffffff;
`;

const CTAButton = styled(Button)`
    height: 44px;
    padding: 6px 24px;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const StyledCard = styled(Card)`
    height: 100%;
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const InfoCard = styled(Card)`
    background: #f8f9fa;
    border: 1px solid #e8e8e8;
    transition: all 0.3s;
    height: 100%;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
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
        <Layout className="tournament-layout">
            <StyledHeader>
                <HeaderContent>
                    <Title level={1} style={{ 
                        color: '#ffffff', 
                        marginBottom: 16, 
                        fontSize: '2.5rem',
                        fontWeight: 600 
                    }}>
                        SAT Tournament Arena
                    </Title>
                    <Paragraph style={{ 
                        fontSize: 18, 
                        color: '#ffffff', 
                        opacity: 0.9,
                        margin: '0 auto',
                        maxWidth: '600px'
                    }}>
                        Compete with students worldwide, test your skills, and climb the rankings
                    </Paragraph>
                </HeaderContent>
                <HeaderOverlay />
            </StyledHeader>

            <StyledContent>
                {/* Tournament List Section */}
                <div style={{ marginBottom: 64 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Title level={2} style={{ fontWeight: 600 }}>Available Tournaments</Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Join these competitions to test your skills and compete with others
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {tournaments.map((tournament) => (
                            <Col xs={24} sm={12} md={8} key={tournament.id}>
                                <TournamentCard tournament={tournament} />
                            </Col>
                        ))}
                    </Row>

                    <Divider style={{ margin: '40px 0' }} />
                    
                    {/* Private Tournament Section */}
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Space direction="vertical" size="large" align="center">
                            <Text>Have a private tournament code?</Text>
                            <Button 
                                type="primary"
                                icon={<LoginOutlined />}
                                onClick={handleJoinTournament}
                                size="large"
                            >
                                Join Private Tournament
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Info Section */}
                <div style={{ background: '#fafafa', padding: '48px 24px', borderRadius: '8px' }}>
                    
                    <Row gutter={[24, 24]}>
                        {[
                            {
                                title: "Competitive Learning",
                                description: "Challenge yourself against peers and accelerate your progress",
                                icon: <TrophyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            },
                            {
                                title: "Real-Time Rankings",
                                description: "Track your performance and see how you rank against others",
                                icon: <InfoCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            },
                            {
                                title: "Detailed Analytics",
                                description: "Get comprehensive insights into your performance",
                                icon: <RightOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            }
                        ].map((item, index) => (
                            <Col xs={24} md={8} key={index}>
                                <InfoCard>
                                    <Space direction="vertical" size="middle">
                                        {item.icon}
                                        <Title level={4} style={{ marginTop: 0 }}>{item.title}</Title>
                                        <Text type="secondary">{item.description}</Text>
                                    </Space>
                                </InfoCard>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <Link to="/tournaments/info">
                            <Button type="primary" icon={<RightOutlined />}>
                                Learn More About Tournaments
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Keep existing Modal */}
                <Modal
                    title="Join Private Tournament"
                    visible={joinCodeModalVisible}
                    onOk={handleJoinCodeSubmit}
                    onCancel={handleJoinCodeCancel}
                    okText="Join Tournament"
                    cancelText="Cancel"
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>Enter the tournament code provided by your instructor:</Text>
                        <Input
                            size="large"
                            placeholder="Enter tournament code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            style={{ marginTop: 12 }}
                        />
                    </Space>
                </Modal>
            </StyledContent>
        </Layout>
    );
};

export default TournamentListPage;
