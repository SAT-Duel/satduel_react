import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Card } from 'antd';
import { TrophyOutlined, TeamOutlined, RocketOutlined, BarChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const TournamentPageContainer = styled.div`
    min-height: 100vh;
`;

const HeroSection = styled.div`
    background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
    padding: 60px 20px;
    margin-bottom: 50px;
    text-align: center;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: white;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
`;

const FeatureCard = styled(Card)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: ${props => props.gradient || 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'};
    .ant-card-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px 30px;
        height: 250px; // Increased height
    }
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

const TournamentBenefitsSection = styled.section`
    margin-top: 80px;
    background-color: #f8f4ff; // Light purple background
    padding: 40px 20px;
`;

const BenefitGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
`;

const BenefitCard = styled(Card)`
    text-align: center;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    background: white;
    .ant-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
    }
`;

const IconWrapper = styled.div`
    font-size: 48px;
    margin-bottom: 20px;
    color: #4b0082;
`;

function TournamentPage() {
    return (
        <TournamentPageContainer>
            <HeroSection>
                <Title level={1} style={{color: 'white', fontSize: '48px', marginBottom: '10px'}}>SAT Prep Tournaments</Title>
                <Paragraph style={{fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '30px'}}>
                    Elevate your scores with our innovative, engaging, and personalized tournament mode.
                </Paragraph>
                <Link to="/tournaments">
                    <CTAButton type="primary" size="large">
                        View All Tournaments
                    </CTAButton>
                </Link>
            </HeroSection>

            <ContentWrapper>

                <FeatureGrid>
                    <FeatureCard gradient="linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)">
                        <Title level={3} style={{color: 'white'}}>Find Tournaments</Title>
                        <Paragraph style={{color: 'rgba(255,255,255,0.8)'}}>Search and join community tournaments that match your skill level and goals.</Paragraph>
                    </FeatureCard>
                    <FeatureCard gradient="linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)">
                        <Title level={3} style={{color: 'white'}}>Flexible Entry</Title>
                        <Paragraph style={{color: 'rgba(255,255,255,0.8)'}}>Enter tournaments anytime before the deadline and compete at your convenience.</Paragraph>
                    </FeatureCard>
                    <FeatureCard gradient="linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)">
                        <Title level={3} style={{color: 'white'}}>Fair Competition</Title>
                        <Paragraph style={{color: 'rgba(255,255,255,0.8)'}}>Tackle the same questions as other participants and see how you rank in the community.</Paragraph>
                    </FeatureCard>
                </FeatureGrid>

                <TournamentBenefitsSection>
                    <Title level={2} style={{textAlign: 'center', marginBottom: '30px', color: '#4b0082'}}>Tournament Benefits</Title>
                    <BenefitGrid>
                        <BenefitCard>
                            <IconWrapper><TrophyOutlined /></IconWrapper>
                            <Title level={4}>Competitive Edge</Title>
                            <Paragraph>Challenge yourself against peers and rise to the top of the leaderboard.</Paragraph>
                        </BenefitCard>
                        <BenefitCard>
                            <IconWrapper><TeamOutlined /></IconWrapper>
                            <Title level={4}>Community Learning</Title>
                            <Paragraph>Join a vibrant community of learners and share strategies for success.</Paragraph>
                        </BenefitCard>
                        <BenefitCard>
                            <IconWrapper><RocketOutlined /></IconWrapper>
                            <Title level={4}>Accelerated Growth</Title>
                            <Paragraph>Push your limits and see rapid improvement in your SAT skills.</Paragraph>
                        </BenefitCard>
                        <BenefitCard>
                            <IconWrapper><BarChartOutlined /></IconWrapper>
                            <Title level={4}>Performance Insights</Title>
                            <Paragraph>Gain valuable insights into your strengths and areas for improvement.</Paragraph>
                        </BenefitCard>
                    </BenefitGrid>
                </TournamentBenefitsSection>
            </ContentWrapper>
        </TournamentPageContainer>
    );
}

export default TournamentPage;
