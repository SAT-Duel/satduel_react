import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Card } from 'antd';
import { ThunderboltOutlined, TrophyOutlined, TeamOutlined, RocketOutlined, SearchOutlined, CalendarOutlined, FormOutlined, LineChartOutlined, BulbOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const TournamentPageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60px 20px;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 12px;
    padding: 60px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const HeroSection = styled.div`
    text-align: center;
    margin-bottom: 60px;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
`;

const FeatureCard = styled(Card)`
    text-align: center;
    height: 100%;
    background-color: ${props => props.bgColor};
    .ant-card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const CTAButton = styled(Button)`
    font-size: 20px;
    height: auto;
    padding: 15px 30px;
    border-radius: 8px;
`;

const HowItWorksSection = styled.section`
    margin-top: 80px;
`;

const StepGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
`;

const StepCard = styled(Card)`
    text-align: center;
    background-color: ${props => props.bgColor};
    .ant-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

const StepIcon = styled.div`
    font-size: 48px;
    margin-bottom: 20px;
`;

function TournamentPage() {
    return (
        <TournamentPageContainer>
            <ContentWrapper>
                <HeroSection>
                    <Title level={1} style={{color: '#4b0082', fontSize: '48px', marginBottom: '30px'}}>SAT Prep Tournaments</Title>
                    <Paragraph style={{fontSize: '24px', marginBottom: '40px'}}>
                        Compete, Learn, and Excel in SAT Prep through exciting tournaments!
                    </Paragraph>
                    <Link to="/search-tournaments">
                        <CTAButton type="primary" size="large">
                            Search for a Tournament
                        </CTAButton>
                    </Link>
                </HeroSection>

                <FeatureGrid>
                    <FeatureCard
                        bgColor="#e6f7ff"
                        cover={<ThunderboltOutlined style={{ fontSize: '64px', color: '#1890ff', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Live Competitions</Title>
                        <Paragraph>Battle in real-time against other students</Paragraph>
                    </FeatureCard>
                    <FeatureCard
                        bgColor="#f6ffed"
                        cover={<TrophyOutlined style={{ fontSize: '64px', color: '#52c41a', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Leaderboards</Title>
                        <Paragraph>Climb the ranks and showcase your skills</Paragraph>
                    </FeatureCard>
                    <FeatureCard
                        bgColor="#fff7e6"
                        cover={<TeamOutlined style={{ fontSize: '64px', color: '#faad14', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Community Engagement</Title>
                        <Paragraph>Join a motivated community of learners</Paragraph>
                    </FeatureCard>
                    <FeatureCard
                        bgColor="#fff1f0"
                        cover={<RocketOutlined style={{ fontSize: '64px', color: '#f5222d', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Skill Advancement</Title>
                        <Paragraph>Rapidly improve your SAT skills</Paragraph>
                    </FeatureCard>
                    <FeatureCard
                        bgColor="#f9f0ff"
                        cover={<LineChartOutlined style={{ fontSize: '64px', color: '#722ed1', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Progress Tracking</Title>
                        <Paragraph>Monitor your improvement over time</Paragraph>
                    </FeatureCard>
                    <FeatureCard
                        bgColor="#e6fffb"
                        cover={<BulbOutlined style={{ fontSize: '64px', color: '#13c2c2', marginTop: '20px' }} />}
                    >
                        <Title level={3}>Personalized Insights</Title>
                        <Paragraph>Receive tailored feedback on your performance</Paragraph>
                    </FeatureCard>
                </FeatureGrid>

                <HowItWorksSection>
                    <Title level={2} style={{fontSize: '36px', marginBottom: '40px', textAlign: 'center'}}>How It Works</Title>
                    <StepGrid>
                        <StepCard bgColor="#e6f7ff">
                            <StepIcon><SearchOutlined style={{ color: '#1890ff' }} /></StepIcon>
                            <Title level={4}>Search</Title>
                            <Paragraph>Find an open tournament that matches your goals</Paragraph>
                        </StepCard>
                        <StepCard bgColor="#f6ffed">
                            <StepIcon><CalendarOutlined style={{ color: '#52c41a' }} /></StepIcon>
                            <Title level={4}>Join</Title>
                            <Paragraph>Select a tournament that fits your schedule</Paragraph>
                        </StepCard>
                        <StepCard bgColor="#fff7e6">
                            <StepIcon><FormOutlined style={{ color: '#fa8c16' }} /></StepIcon>
                            <Title level={4}>Compete</Title>
                            <Paragraph>Answer SAT questions against other participants</Paragraph>
                        </StepCard>
                        <StepCard bgColor="#fff1f0">
                            <StepIcon><TrophyOutlined style={{ color: '#f5222d' }} /></StepIcon>
                            <Title level={4}>Earn</Title>
                            <Paragraph style={{textAlign: 'center'}}>Gain points and climb the leaderboard</Paragraph>
                        </StepCard>
                    </StepGrid>
                </HowItWorksSection>
            </ContentWrapper>
        </TournamentPageContainer>
    );
}

export default TournamentPage;