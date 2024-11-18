import React from 'react';
import { Typography, Card, Button, Row, Col, Layout, Space, Steps } from 'antd';
import { ClockCircleOutlined, BookOutlined, TrophyOutlined, RightOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Header, Content } = Layout;

const PracticeTestPage = () => {
    const navigate = useNavigate();
    const tests = [
        {
            id: 1,
            title: "Diagnostic Test",
            description: "10 official SAT practice questions to give you a taste of the test",
            time: "No time limit",
            questions: 10,
            difficulty: "Medium",
            link: '/full_length_test/'
        },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <Header style={{ background: '#fafafa', padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                <Title level={1} style={{ fontWeight: 700, color: '#333' }}>Full Length SAT Practice Tests</Title>
                <Paragraph style={{ fontSize: 18, color: '#666' }}>
                    Practice with official, full-length SAT tests under timed conditions to prepare for test day
                </Paragraph>
            </Header>

            <Content style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', background: '#f9f9f9' }}>
                {/* Features Section */}
                <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
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

                {/* Test Selection Section */}
                <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontWeight: 600 }}>Select Your Practice Test</Title>

                <Row gutter={[32, 32]}>
                    {tests.map((test) => (
                        <Col xs={24} md={8} key={test.id}>
                            <Card hoverable bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Title level={4}>{test.title}</Title>
                                <Paragraph type="secondary" style={{ marginBottom: 16 }}>{test.description}</Paragraph>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Row justify="space-between">
                                        <Text strong>Time:</Text>
                                        <Text>{test.time}</Text>
                                    </Row>
                                    <Row justify="space-between">
                                        <Text strong>Questions:</Text>
                                        <Text>{test.questions}</Text>
                                    </Row>
                                    <Row justify="space-between">
                                        <Text strong>Difficulty:</Text>
                                        <Text>{test.difficulty}</Text>
                                    </Row>

                                    <Button type="primary" block icon={<RightOutlined />} style={{ marginTop: 20 }} onClick={()=>navigate(test.link)}>
                                        Start Test
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Instructions Section */}
                <Card style={{ marginTop: 64, padding: 24, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Title level={3} style={{ fontWeight: 600 }}>How to Use This Page</Title>
                    <Steps
                        direction="vertical"
                        current={-1}
                        items={[
                            {
                                title: 'Choose Your Test',
                                description: "Select from our collection of official SAT practice tests above",
                            },
                            {
                                title: 'Prepare Your Environment',
                                description: 'Find a quiet space and ensure you have 3 hours of uninterrupted time',
                            },
                            {
                                title: 'Start Your Test',
                                description: 'Click the Start Test button to begin your timed practice session',
                            },
                        ]}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default PracticeTestPage;
