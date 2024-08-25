import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Button, Card, Row, Col } from 'antd';
import { TrophyOutlined, TeamOutlined, RocketOutlined, BarChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Aos from 'aos';
import 'aos/dist/aos.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PageHeader = styled.div`
    background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
    color: white;
    padding: 80px 0 90px;
    text-align: center;
    position: relative;
`;

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f0f2f5;
    margin-top: -50px;
`;

const StyledContent = styled(Content)`
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const StyledCard = styled(Card)`
    height: 100%;
    text-align: center;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s;
    background: ${props => props.gradient};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
    }
`;

const IconWrapper = styled.div`
    font-size: 48px;
    margin-bottom: 20px;
    color: ${props => props.color || 'white'};
`;

const CTAButton = styled(Button)`
    font-size: 18px;
    height: auto;
    padding: 12px 30px;
    border-radius: 50px;
    background: #ff4500;
    border-color: #ff4500;
    margin-top: 20px;
    transition: all 0.3s;

    &:hover, &:focus {
        background: #ff6347;
        border-color: #ff6347;
        transform: scale(1.05);
    }
`;

const TournamentBenefitsSection = styled.section`
    margin-top: 80px;
`;

function TournamentPage() {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    const features = [
        {
            title: "Find Tournaments",
            description: "Search and join community tournaments that match your skill level and goals.",
            gradient: "linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)",
            icon: <TrophyOutlined />,
        },
        {
            title: "Flexible Entry",
            description: "Enter tournaments anytime before the deadline and compete at your convenience.",
            gradient: "linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)",
            icon: <TeamOutlined />,
        },
        {
            title: "Fair Competition",
            description: "Tackle the same questions as other participants and see how you rank in the community.",
            gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            icon: <RocketOutlined />,
        },
    ];

    const benefits = [
        {
            title: "Competitive Edge",
            description: "Challenge yourself against peers and rise to the top of the leaderboard.",
            icon: <TrophyOutlined />,
            gradient: "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)",
        },
        {
            title: "Community Learning",
            description: "Join a vibrant community of learners and share strategies for success.",
            icon: <TeamOutlined />,
            gradient: "linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)",
        },
        {
            title: "Accelerated Growth",
            description: "Push your limits and see rapid improvement in your SAT skills.",
            icon: <RocketOutlined />,
            gradient: "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)",
        },
        {
            title: "Performance Insights",
            description: "Gain valuable insights into your strengths and areas for improvement.",
            icon: <BarChartOutlined />,
            gradient: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)",
        },
    ];

    return (
        <Layout>
            <PageHeader>
                <Title level={1} style={{ color: 'white', marginBottom: '20px', fontSize: '3rem' }}>
                    SAT Prep Tournaments
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 30px' }}>
                    Elevate your scores with our innovative, engaging, and personalized tournament mode.
                </Paragraph>
                <Link to="/tournaments">
                    <CTAButton type="primary" size="large">
                        View All Tournaments
                    </CTAButton>
                </Link>
            </PageHeader>

            <ContentSection>
                <StyledContent>
                    <Row gutter={[24, 24]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={8} key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                <StyledCard gradient={feature.gradient}>
                                    <IconWrapper>{feature.icon}</IconWrapper>
                                    <Title level={3} style={{color: 'white'}}>{feature.title}</Title>
                                    <Paragraph style={{color: 'rgba(255,255,255,0.9)'}}>{feature.description}</Paragraph>
                                </StyledCard>
                            </Col>
                        ))}
                    </Row>

                    <TournamentBenefitsSection>
                        <Title level={2} style={{textAlign: 'center', marginBottom: '30px', color: '#4834d4'}}>
                            Tournament Benefits
                        </Title>
                        <Row gutter={[24, 24]}>
                            {benefits.map((benefit, index) => (
                                <Col xs={24} sm={12} md={6} key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                    <StyledCard gradient={benefit.gradient}>
                                        <IconWrapper>{benefit.icon}</IconWrapper>
                                        <Title level={4} style={{color: 'white'}}>{benefit.title}</Title>
                                        <Paragraph style={{color: 'rgba(255,255,255,0.9)'}}>{benefit.description}</Paragraph>
                                    </StyledCard>
                                </Col>
                            ))}
                        </Row>
                    </TournamentBenefitsSection>
                </StyledContent>
            </ContentSection>
        </Layout>
    );
}

export default TournamentPage;