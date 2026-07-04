import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Button, Row, Col, Select, Form } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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
    padding: 10px 20px;
    
    &:hover, &:focus {
        background-color: #008c7a;
        border-color: #008c7a;
        color: white;
    }
`;

const BotTrainingSetup = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const bots = [
        { name: 'Easy Bot', score: 1000, speed: 100, solveChance: 50 },
        { name: 'Medium Bot', score: 1400, speed: 150, solveChance: 70 },
        { name: 'Hard Bot', score: 1800, speed: 200, solveChance: 90 },
    ];

    const modes = [
        { name: 'Quick Sprint', questions: 5, time: 5 },
        { name: 'Standard Sprint', questions: 10, time: 10 },
        { name: 'Extended Sprint', questions: 15, time: 15 },
    ];

    const handleStart = (values) => {
        navigate('/bot_training/start', { state: values });
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
                <Form form={form} onFinish={handleStart} layout="vertical">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <StyledCard title="Select Your AI Opponent">
                                <Form.Item
                                    name="selectedBot"
                                    rules={[{ required: true, message: 'Please select a bot' }]}
                                >
                                    <Select placeholder="Choose a bot">
                                        {bots.map((bot, index) => (
                                            <Option key={index} value={bot.name}>
                                                <RobotOutlined /> {bot.name} (Score: {bot.score})
                                                <br />
                                                <small>Speed: {bot.speed}, Solve Chance: {bot.solveChance}%</small>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </StyledCard>
                        </Col>
                        <Col xs={24} md={12}>
                            <StyledCard title="Select Training Mode">
                                <Form.Item
                                    name="selectedMode"
                                    rules={[{ required: true, message: 'Please select a training mode' }]}
                                >
                                    <Select placeholder="Choose a mode">
                                        {modes.map((mode, index) => (
                                            <Option key={index} value={mode.name}>
                                                {mode.name} ({mode.questions} questions in {mode.time} minutes)
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </StyledCard>
                        </Col>
                    </Row>
                    <Row justify="center" style={{ marginTop: '30px' }}>
                        <Col>
                            <Form.Item>
                                <StyledButton type="primary" htmlType="submit" size="large">
                                    Start Training
                                </StyledButton>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </StyledContent>
        </Layout>
    );
};

export default BotTrainingSetup;