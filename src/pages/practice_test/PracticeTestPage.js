import React from 'react';
import { Typography, Card, Button, Row, Col, Layout, Space, Steps, Tour, Divider, Alert } from 'antd';
import { ClockCircleOutlined, BookOutlined, TrophyOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {useNavigate, useLocation} from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import {useAuth} from "../../context/AuthContext";

const { Title, Paragraph, Text } = Typography;
const { Header, Content } = Layout;

//TODO: After the user clicks the "Finish" button, is_first_login should be set to false
const PracticeTestPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTourOpen, setIsTourOpen] = useState(false);
    const diagnosticCardRef = useRef(null);
    const {user} = useAuth();

    useEffect(() => {
        // Show tour if user is new, coming from goal setting, or if it's their first login
        const shouldShowTour = 
            !user || 
            location.state?.fromGoalSetting || 
            location.state?.isNewUser ||
            user?.is_first_login;

        setIsTourOpen(shouldShowTour);
    }, [location, user]);

    const tourSteps = [
        {
            title: 'Start Your Journey!',
            description: 'Take our free diagnostic test to get an initial assessment of your skills. No login required!',
            target: () => diagnosticCardRef.current,
            placement: 'right',
        }
    ];

    const tests = [
        {
            id: 1,
            title: "SAT Diagnostic Test",
            description: "Start here! Get a baseline score and personalized study plan",
            time: "25 minutes",
            questions: 10,
            difficulty: "Adaptive",
            recommended: true,
            link: '/full_length_test/',
            tag: 'RECOMMENDED'
        },
        {
            id: 2,
            title: "Practice Test #1",
            description: "March 2024 SAT Official Practice Test",
            time: "3 hours",
            questions: 98,
            difficulty: "Official SAT Level",
            link: '/full_length_test/1',
            tag: 'NEW',
            comingSoon: true
        },
        // Add more tests as needed
    ];

    return (
        <Layout className="practice-test-layout">
            {/* Updated Hero Section */}
            <Header style={{
                background: 'linear-gradient(135deg, #2b4c8c 0%, #1a365d 100%)',
                padding: '60px 20px',
                textAlign: 'center',
                height: 'auto',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <Title level={1} style={{ 
                        color: '#ffffff', 
                        marginBottom: 16, 
                        fontSize: '2.5rem',
                        fontWeight: 600
                    }}>
                        SAT Practice Tests
                    </Title>
                    <Paragraph style={{ 
                        fontSize: 18, 
                        color: '#ffffff', 
                        opacity: 0.9,
                        margin: '0 auto',
                        maxWidth: '600px'
                    }}>
                        Prepare with confidence using College Board approved practice materials
                    </Paragraph>
                </div>
                {/* Subtle overlay pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 150%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
                    zIndex: 1
                }} />
            </Header>

            <Content style={{ 
                padding: '40px 20px',
                maxWidth: '1200px',
                margin: '0 auto',
                background: '#ffffff'
            }}>
                {/* New User Alert */}
                {user?.is_first_login && (
                    <Alert
                        message="Welcome to SAT Practice!"
                        description="We recommend starting with the Diagnostic Test to get your baseline score."
                        type="info"
                        showIcon
                        style={{ marginBottom: 32 }}
                        action={
                            <Button type="primary" size="small">
                                Take Diagnostic
                            </Button>
                        }
                    />
                )}

                {/* Features Section - More subtle and professional */}
                <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
                    <Col xs={24} md={8}>
                        <Card hoverable bordered={false} style={{ textAlign: 'center', background: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                <Title level={4}>Realistic Testing Experience</Title>
                                <Text type="secondary">
                                    Take full-length tests with the same layout and timing experience as Bluebook.
                                </Text>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card hoverable bordered={false} style={{ textAlign: 'center', background: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                <BookOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                <Title level={4}>Official Questions</Title>
                                <Text type="secondary">
                                    Practice with official SAT questions from Educator Question Bank. © 2024 College Board
                                </Text>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card hoverable bordered={false} style={{ textAlign: 'center', background: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                <TrophyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                <Title level={4}>Detailed Analytics</Title>
                                <Text type="secondary">
                                    Get comprehensive score reports and performance analysis
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Test Selection Section - Enhanced visual hierarchy */}
                <div style={{ marginBottom: 64 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Title level={2} style={{ fontWeight: 600, fontSize: '2rem' }}>
                            Available Practice Tests
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Select the test that matches your preparation level
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {tests.map((test) => (
                            <Col xs={24} md={12} lg={8} key={test.id}>
                                <Card 
                                    ref={test.id === 1 ? diagnosticCardRef : null}
                                    hoverable 
                                    className={`test-card ${test.recommended ? 'recommended-test' : ''}`}
                                    style={{
                                        height: '100%',
                                        borderRadius: '8px',
                                        border: test.recommended ? '2px solid #1890ff' : '1px solid #f0f0f0'
                                    }}
                                >
                                    {test.tag && (
                                        <div className="test-tag" style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: test.tag === 'NEW' ? '#52c41a' : '#1890ff',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {test.tag}
                                        </div>
                                    )}

                                    <Title level={4} style={{ marginBottom: 16 }}>{test.title}</Title>
                                    <Paragraph type="secondary" style={{ 
                                        marginBottom: 24,
                                        minHeight: '44px'
                                    }}>
                                        {test.description}
                                    </Paragraph>

                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Row justify="space-between" align="middle">
                                            <Col span={12}><Text strong>Duration</Text></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Text>{test.time}</Text>
                                            </Col>
                                        </Row>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <Row justify="space-between" align="middle">
                                            <Col span={12}><Text strong>Questions</Text></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Text>{test.questions}</Text>
                                            </Col>
                                        </Row>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <Row justify="space-between" align="middle">
                                            <Col span={12}><Text strong>Difficulty</Text></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Text>{test.difficulty}</Text>
                                            </Col>
                                        </Row>

                                        <Button 
                                            type={test.recommended ? "primary" : "default"}
                                            block   
                                            icon={test.comingSoon ? null : <RightOutlined />}
                                            style={{ 
                                                marginTop: 24,
                                                height: '40px',
                                            }}
                                            onClick={() => !test.comingSoon && navigate(test.link)}
                                            disabled={test.comingSoon}
                                        >
                                            {test.comingSoon ? 'Coming Soon' : 'Start Test'}
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Instructions Section - More visual appeal */}
                <Card 
                    style={{ 
                        marginTop: 48,
                        borderRadius: '8px',
                        background: '#fafafa'
                    }}
                >
                    <Space align="start" style={{ marginBottom: 24 }}>
                        <InfoCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={3} style={{ margin: 0 }}>Before You Begin</Title>
                    </Space>
                    
                    <Steps
                        direction="vertical"
                        current={-1}
                        items={[
                            {
                                title: 'Choose Your Test',
                                description: "Select a test that matches your current preparation level"
                            },
                            {
                                title: 'Prepare Your Environment',
                                description: 'Find a quiet space and ensure you have the recommended time available'
                            },
                            {
                                title: 'Complete the Test',
                                description: 'Work through all sections, following official SAT timing guidelines'
                            }
                        ]}
                    />
                </Card>

                <Tour 
                    open={isTourOpen}
                    onClose={() => setIsTourOpen(false)}
                    steps={tourSteps}
                    mask={true}
                />
            </Content>
        </Layout>
    );
};

export default PracticeTestPage;
