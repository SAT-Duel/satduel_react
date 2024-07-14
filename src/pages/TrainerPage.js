import React from 'react';
import {Layout, Typography, Card, Button, Row, Col, Statistic} from 'antd';
import {
    RocketOutlined,
    ThunderboltOutlined,
    FireOutlined,
    TrophyOutlined,
    UpCircleOutlined,
    StarOutlined, CrownOutlined, TeamOutlined, BulbOutlined, SmileOutlined, RiseOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const StyledContent = styled(Content)`
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const GradientBackground = styled.div`
    background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
    padding: 40px 0;
    margin-bottom: 50px;
`;

const WhiteText = styled.div`
    color: white;
    text-align: center;
`;

const StyledTitle = styled(Title)`
    color: white !important;
    font-size: 3rem !important;
    margin-bottom: 10px !important;
`;

const StyledSubtitle = styled(Paragraph)`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
`;

const StyledCard = styled(Card)`
    height: 100%;
    text-align: center;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s;
    background: ${props => props.gradient};

    &:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
    }
`;

const IconWrapper = styled.div`
    font-size: 48px;
    margin-bottom: 20px;
    color: white;
`;

const CardTitle = styled(Title)`
    color: white !important;
    margin-bottom: 10px !important;
`;

const CardDescription = styled(Paragraph)`
    color: rgba(255, 255, 255, 0.8);
`;

const StyledButton = styled(Button)`
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-weight: bold;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
    }
`;

const FeatureSection = styled.div`
    margin-top: 60px;
    background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
    padding: 40px;
    border-radius: 20px;
    color: white;
`;

const FeatureCard = styled(Card)`
    border-radius: 15px;
    overflow: hidden;
    height: 100%;
    transition: all 0.3s;
    background: rgba(255, 255, 255, 0.1);
    border: none;

    &:hover {
        transform: translateY(-5px) rotate(2deg);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .ant-statistic-title, .ant-statistic-content {
        color: white !important;
    }
`;


const FeatureTitle = styled(Title)`
    color: white !important;
    text-align: center;
    margin-bottom: 40px !important;
`;
const AdvantageSection = styled.div`
    margin-top: 60px;
    padding: 40px;
    background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
    border-radius: 20px;
`;

const AdvantageTitle = styled(Title)`
    color: white !important;
    text-align: center;
    margin-bottom: 40px !important;
`;

const AdvantageCard = styled(Card)`
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s;
    border: none;
    background: rgba(255, 255, 255, 0.9);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
`;

// const IconWrapper = styled.div`
//   font-size: 48px;
//   margin-bottom: 20px;
//   color: #0072ff;
// `;

const TrainerPage = () => {
    const advantages = [
        {
            icon: <BulbOutlined/>,
            title: "Engaging Learning",
            description: "Turn boring study sessions into exciting quests and challenges."
        },
        {
            icon: <SmileOutlined/>,
            title: "Stress Reduction",
            description: "Reduce test anxiety by making SAT prep feel like a fun game."
        },
        {
            icon: <TeamOutlined/>,
            title: "Social Motivation",
            description: "Compete with friends and join a community of motivated learners."
        },
        {
            icon: <RiseOutlined/>,
            title: "Rapid Progress",
            description: "Track your improvement with real-time stats and visual progress indicators."
        }
    ];

    const trainingModes = [
        {
            icon: <RocketOutlined/>,
            title: "Rapid Booster",
            description: "Accelerate your learning with quick, focused practice sessions.",
            gradient: "linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)"
        },
        {
            icon: <ThunderboltOutlined/>,
            title: "Power Sprint",
            description: "Intense, timed challenges to sharpen your skills under pressure.",
            gradient: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)"
        },
        {
            icon: <FireOutlined/>,
            title: "Mastery Forge",
            description: "Build unbreakable knowledge through progressive difficulty levels.",
            gradient: "linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)"
        }
    ];

    return (
        <Layout>
            <GradientBackground>
                <StyledContent>
                    <WhiteText>
                        <StyledTitle level={2}>SAT Prep Reimagined</StyledTitle>
                        <StyledSubtitle>
                            Elevate your scores with our innovative, engaging, and personalized training modes.
                        </StyledSubtitle>
                    </WhiteText>
                </StyledContent>
            </GradientBackground>

            <StyledContent>
                <Row gutter={[24, 24]}>
                    {trainingModes.map((mode, index) => (
                        <Col xs={24} sm={8} key={index}>
                            <StyledCard gradient={mode.gradient}>
                                <IconWrapper>{mode.icon}</IconWrapper>
                                <CardTitle level={3}>{mode.title}</CardTitle>
                                <CardDescription>{mode.description}</CardDescription>
                                <StyledButton size="large">
                                    Start Training
                                </StyledButton>
                            </StyledCard>
                        </Col>
                    ))}
                </Row>

                <AdvantageSection>
                    <AdvantageTitle level={2}>Why Fun Learning Works Better</AdvantageTitle>
                    <Row gutter={[24, 24]}>
                        {advantages.map((advantage, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <AdvantageCard>
                                    <IconWrapper>{advantage.icon}</IconWrapper>
                                    <Title level={4}>{advantage.title}</Title>
                                    <Paragraph>{advantage.description}</Paragraph>
                                </AdvantageCard>
                            </Col>
                        ))}
                    </Row>
                </AdvantageSection>


                <FeatureSection>
                    <FeatureTitle level={2}>Level Up Your Learning!</FeatureTitle>
                    <Row gutter={[24, 24]}>
                        {[
                            {title: "SAT ELO Rating", value: "1500+", prefix: <TrophyOutlined/>, suffix: "points"},
                            {title: "Achievements Unlocked", value: "50+", prefix: <StarOutlined/>, suffix: "badges"},
                            {title: "Global Leaderboard", value: "Top 5%", prefix: <CrownOutlined/>, suffix: "rank"},
                            {title: "Study Streaks", value: "30", prefix: <FireOutlined/>, suffix: "days"},
                            {title: "Knowledge Quests", value: "100+", prefix: <RocketOutlined/>, suffix: "completed"},
                            {title: "Friends Challenged", value: "25", prefix: <TeamOutlined/>, suffix: "rivals"},
                            {
                                title: "Skill Tree Progress",
                                value: "75%",
                                prefix: <UpCircleOutlined/>,
                                suffix: "unlocked"
                            },
                            {
                                title: "Boss Battles Won",
                                value: "10",
                                prefix: <ThunderboltOutlined/>,
                                suffix: "victories"
                            },
                        ].map((feature, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <FeatureCard>
                                    <Statistic
                                        title={feature.title}
                                        value={feature.value}
                                        prefix={feature.prefix}
                                        suffix={feature.suffix}
                                        valueStyle={{color: '#ffffff', fontWeight: 'bold'}}
                                    />
                                </FeatureCard>
                            </Col>
                        ))}
                    </Row>
                </FeatureSection>
            </StyledContent>
        </Layout>
    );
};

export default TrainerPage;