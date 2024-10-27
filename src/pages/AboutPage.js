import React, { useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Avatar, Divider, Form, Input, Button } from 'antd';
import { TeamOutlined, TrophyOutlined, HistoryOutlined, BulbOutlined, StarOutlined, GlobalOutlined, HeartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Aos from 'aos';
import 'aos/dist/aos.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const PageHeader = styled.div`
    background: linear-gradient(75deg, #214570 0%, #463b80 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
    position: relative;
`;

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f9f9f9;
`;

const StyledCard = styled(Card)`
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const IconWrapper = styled.div`
    font-size: 3rem;
    color: #4834d4;
    margin-bottom: 20px;
`;

const TeamMemberCard = styled(Card)`
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const ValuesCard = styled(Card)`
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    text-align: center;
    padding: 20px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const ContactForm = styled(Form)`
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const valuesIcons = {
    Innovation: <BulbOutlined style={{ fontSize: '3rem', color: '#ff5733' }} />,
    Excellence: <StarOutlined style={{ fontSize: '3rem', color: '#ffbd33' }} />,
    Accessibility: <GlobalOutlined style={{ fontSize: '3rem', color: '#33d9ff' }} />,
    Engagement: <HeartOutlined style={{ fontSize: '3rem', color: '#ff33a6' }} />,
};

function AboutPage() {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    const teamMembers = [
        {
            name: "Clement Zhou",
            role: "Co-founder & CEO",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            name: "Alex Jin",
            role: "Co-founder & CTO",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            name: "William Yang",
            role: "Professional Developer",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            name: "Weiwei Luo",
            role: "SEO Specialist",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            name: "Cyan Ni",
            role: "SEO + Marketing Specialist",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            name: "Oscar Nie",
            role: "UFO",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
    ];

    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <Layout>
            <PageHeader>
                <Title level={1} style={{ color: 'white', marginBottom: '20px' }}>
                    About Us
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                    We're on a mission to revolutionize SAT preparation through innovative technology and engaging
                    learning experiences.
                </Paragraph>
            </PageHeader>
            <ContentSection>
                <Content style={{ padding: '0 50px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={8} data-aos="fade-up" data-aos-delay="100">
                            <StyledCard>
                                <IconWrapper>
                                    <HistoryOutlined />
                                </IconWrapper>
                                <Title level={3}>Our Story</Title>
                                <Paragraph>
                                    Founded in 2023, we set out to create a platform that makes SAT preparation not just
                                    effective, but also engaging and fun.
                                </Paragraph>
                            </StyledCard>
                        </Col>
                        <Col xs={24} md={8} data-aos="fade-up" data-aos-delay="200">
                            <StyledCard>
                                <IconWrapper>
                                    <TrophyOutlined />
                                </IconWrapper>
                                <Title level={3}>Our Mission</Title>
                                <Paragraph>
                                    We're committed to empowering students worldwide to achieve their best possible SAT
                                    scores through personalized, interactive learning.
                                </Paragraph>
                            </StyledCard>
                        </Col>
                        <Col xs={24} md={8} data-aos="fade-up" data-aos-delay="300">
                            <StyledCard>
                                <IconWrapper>
                                    <TeamOutlined />
                                </IconWrapper>
                                <Title level={3}>Our Team</Title>
                                <Paragraph>
                                    Our diverse team of educators, technologists, and innovators is passionate about
                                    creating the best SAT prep experience possible.
                                </Paragraph>
                            </StyledCard>
                        </Col>
                    </Row>

                    <Divider />

                    <Title level={2} style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
                        Meet Our Team
                    </Title>
                    <Row gutter={[24, 24]} justify="center">
                        {teamMembers.map((member, index) => (
                            <Col xs={24} sm={12} md={6} key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                <TeamMemberCard>
                                    <Avatar size={128} src={member.avatar} />
                                    <Title level={4} style={{ marginTop: '20px', marginBottom: '5px' }}>{member.name}</Title>
                                    <Paragraph>{member.role}</Paragraph>
                                </TeamMemberCard>
                            </Col>
                        ))}
                    </Row>

                    <Divider />

                    <Title level={2} style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
                        Our Values
                    </Title>
                    <Row gutter={[24, 24]}>
                        {['Innovation', 'Excellence', 'Accessibility', 'Engagement'].map((value, index) => (
                            <Col xs={24} sm={12} md={6} key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                <ValuesCard>
                                    {valuesIcons[value]}
                                    <Title level={4} style={{ marginTop: '20px' }}>{value}</Title>
                                    <Paragraph>
                                        We believe in {value.toLowerCase()} as a core principle guiding our work and our
                                        interaction with students.
                                    </Paragraph>
                                </ValuesCard>
                            </Col>
                        ))}
                    </Row>

                    <Divider />

                    <div>
                        <Title level={2} style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
                            Contact Us
                        </Title>
                        <Row justify="center">
                            <Col xs={24} md={12}>
                                <ContactForm layout="vertical" onFinish={onFinish} data-aos="fade-up">
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input placeholder="Your Name" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input placeholder="Your Email" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Message"
                                        name="message"
                                        rules={[{ required: true, message: 'Please enter your message' }]}
                                    >
                                        <TextArea rows={4} placeholder="Your Message" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            Send Message
                                        </Button>
                                    </Form.Item>
                                </ContactForm>
                            </Col>
                        </Row>
                    </div>

                    <Divider/>

                    <div id="contact-us">
                        <Title level={2} style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
                            Frequently Asked Questions
                        </Title>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12} data-aos="fade-up" data-aos-delay="100">
                                <StyledCard>
                                    <Title level={4}>What is the best way to contact you?</Title>
                                    <Paragraph>You can contact us using the form above or via email at contact@oursite.com.</Paragraph>
                                </StyledCard>
                            </Col>
                            <Col xs={24} md={12} data-aos="fade-up" data-aos-delay="200">
                                <StyledCard>
                                    <Title level={4}>How long does it take to get a response?</Title>
                                    <Paragraph>We aim to respond to all inquiries within 24-48 hours.</Paragraph>
                                </StyledCard>
                            </Col>
                            <Col xs={24} md={12} data-aos="fade-up" data-aos-delay="300">
                                <StyledCard>
                                    <Title level={4}>Can I visit your office?</Title>
                                    <Paragraph>Currently, we are an online-only company and do not have physical offices for visits.</Paragraph>
                                </StyledCard>
                            </Col>
                            <Col xs={24} md={12} data-aos="fade-up" data-aos-delay="400">
                                <StyledCard>
                                    <Title level={4}>Do you offer customer support?</Title>
                                    <Paragraph>Yes, our customer support team is available to help with any issues or questions you may have.</Paragraph>
                                </StyledCard>
                            </Col>
                        </Row>
                    </div>
                    <div id="faq">
                    </div>
                </Content>
            </ContentSection>
        </Layout>
    );
}

export default AboutPage;
