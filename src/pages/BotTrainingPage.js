import React, { useState } from 'react';
import { Layout, Typography, Card, Button, Row, Col, Select, Radio, InputNumber } from 'antd';
import { RobotOutlined, QuestionCircleOutlined, BookOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const StyledContent = styled(Content)`
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const GradientBackground = styled.div`
    background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
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
    margin-bottom: 20px;
    border-radius: 15px;
    overflow: hidden;
`;

const StyledButton = styled(Button)`
    background-color: #00b09b;
    border-color: #00b09b;
    color: white;
    font-weight: bold;
    transition: all 0.3s ease;
    padding: 10px 20px; // Adjust padding as needed
    
    &:hover, &:focus {
        background-color: #008c7a;
        border-color: #008c7a;
        color: white;
    }
`;

const StyledRadioButton = styled(Radio.Button)`
    border-radius: 20px;
    margin-bottom: 10px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
`;

const StyledRadioGroup = styled(Radio.Group)`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const BotTrainingPage = () => {
    const [selectedBot, setSelectedBot] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);
    const [powerSprintTime, setPowerSprintTime] = useState(5);
    const navigate = useNavigate();

    const bots = [
    { name: 'UFO', score: 1000, speed: 100, solveChance: 50, timeRange: [5, 15] },
    { name: 'Thomas Tan', score: 1200, speed: 150, solveChance: 70, timeRange: [3, 10] },
    { name: 'Clement Zhou', score: 1400, speed: 180, solveChance: 85, timeRange: [2, 7] },
    { name: 'Warren Bei', score: 1600, speed: 200, solveChance: 95, timeRange: [1, 5] },
    ];

    const modes = [
        { name: 'Infinite Questions', icon: <QuestionCircleOutlined /> },
        { name: 'Power Sprint', icon: <FieldTimeOutlined /> },
        { name: 'SAT Survival', icon: <BookOutlined /> },
    ];

    const handleStart = () => {
        if (selectedBot && selectedMode) {
            const bot = bots.find(b => b.name === selectedBot);
            const trainingData = {
                bot: bot,
                mode: selectedMode,
                time: selectedMode === 'Power Sprint' ? powerSprintTime : null
            };
            navigate('/bot_training/start', { state: trainingData });
        }
    };

    return (
        <Layout>
            <GradientBackground>
                <StyledContent>
                    <WhiteText>
                        <StyledTitle level={2}>Bot Training Setup</StyledTitle>
                        <StyledSubtitle>
                            Choose your AI opponent and training mode to begin your practice session.
                        </StyledSubtitle>
                    </WhiteText>
                </StyledContent>
            </GradientBackground>

            <StyledContent>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <StyledCard title="Select Your AI Opponent">
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Choose a bot"
                                onChange={(value) => setSelectedBot(value)}
                            >
                                {bots.map((bot, index) => (
                                    <Option key={index} value={bot.name}>
                                        <RobotOutlined /> {bot.name} (Score: {bot.score + bot.speed})
                                        <br />
                                        <small>Speed: {bot.speed}, Solve Chance: {bot.solveChance}%</small>
                                    </Option>
                                ))}
                            </Select>
                        </StyledCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <StyledCard title="Select Training Mode">
                            <StyledRadioGroup onChange={(e) => setSelectedMode(e.target.value)}>
                                {modes.map((mode, index) => (
                                    <StyledRadioButton key={index} value={mode.name}>
                                        {mode.icon} {mode.name}
                                    </StyledRadioButton>
                                ))}
                            </StyledRadioGroup>
                        </StyledCard>
                    </Col>
                </Row>
                {selectedMode === 'Power Sprint' && (
                    <Row justify="center" style={{ marginTop: '20px' }}>
                        <Col>
                            <Card title="Power Sprint Time">
                                <InputNumber
                                    min={1}
                                    max={60}
                                    defaultValue={5}
                                    onChange={(value) => setPowerSprintTime(value)}
                                    addonAfter="minutes"
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
                <Row justify="center" style={{ marginTop: '30px' }}>
                    <Col>
                        <StyledButton
                            size="large"
                            onClick={handleStart}
                            disabled={!selectedBot || !selectedMode}
                            selected={selectedBot && selectedMode}
                        >
                            Start Training
                        </StyledButton>
                    </Col>
                </Row>
            </StyledContent>
        </Layout>
    );
};

export default BotTrainingPage;
