import React, {useRef} from 'react';
import {Link} from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Card, Divider, Statistic, Avatar, Rate, Steps} from 'antd';
import {
    ArrowDownOutlined,
    RocketOutlined,
    LineChartOutlined,
    TrophyOutlined,
    BookOutlined,
    UserOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const {Content} = Layout;
const {Title, Paragraph} = Typography;



const HeroSection = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #5d75ec 0%, #5f2f8c 100%);
    color: white;
    text-align: center;
`;

const GradientText = styled.span`
    background: linear-gradient(90deg, #0036a1, #00d2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StyledButton = styled(Button)`
    background: transparent;
    border: 2px solid white;
    color: white;
    font-size: 1.2rem;
    padding: 10px 20px;
    height: auto;
    transition: all 0.3s ease;

    &:hover {
        background: white;
        color: #0099f7;
        transform: translateY(-3px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

const ScrollIndicator = styled.div`
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
        }
        40% {
            transform: translateY(-30px) translateX(-50%);
        }
        60% {
            transform: translateY(-15px) translateX(-50%);
        }
    }
`;

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f9f9f9;
`;

const IconWrapper = styled.div`
    font-size: 3rem;
    color: #667eea;
    margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const FeatureCard = styled(Card)`
    height: 100%;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
`;

const StatisticCard = styled(Card)`
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const TestimonialCard = styled(Card)`
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;
function HomePage() {
    const contentRef = useRef(null);

    React.useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    }, []);

    const scrollToContent = () => {
        contentRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <Layout>
            <HeroSection>
                <Title level={1} style={{fontSize: '4rem', marginBottom: '20px'}}>
                    Elevate Your SAT Prep with <GradientText>Duels</GradientText>
                </Title>
                <Paragraph style={{fontSize: '1.5rem', maxWidth: '600px', marginBottom: '40px'}}>
                    Immerse yourself in a <GradientText>futuristic</GradientText> learning experience designed to <GradientText>boost</GradientText> your SAT scores.
                </Paragraph>
                <Row gutter={16}>
                    <Col>
                        <StyledButton>
                            <Link to="/questions">Start Practice</Link>
                        </StyledButton>
                    </Col>
                    <Col>
                        <StyledButton>
                            <Link to="/match">Challenge a Friend</Link>
                        </StyledButton>
                    </Col>
                </Row>
                <ScrollIndicator onClick={scrollToContent}>
                    <ArrowDownOutlined style={{ fontSize: '24px' }} />
                </ScrollIndicator>
            </HeroSection>

            <ContentSection ref={contentRef}>
                <Content style={{padding: '0 50px', maxWidth: '1200px', margin: '0 auto'}}>
                    <Title level={2} style={{textAlign: 'center', marginBottom: '40px'}}>
                        Why Choose Our SAT Prep Platform?
                    </Title>
                    <Row gutter={[24, 24]}>
                        {[
                            {
                                icon: <RocketOutlined/>,
                                title: "Personalized Learning",
                                content: "Our adaptive algorithms tailor questions to your skill level, ensuring efficient progress."
                            },
                            {
                                icon: <LineChartOutlined/>,
                                title: "Real-Time Progress Tracking",
                                content: "Monitor your improvement with detailed analytics and performance insights."
                            },
                            {
                                icon: <TrophyOutlined/>,
                                title: "Engaging Duels",
                                content: "Challenge friends or other students to competitive quizzes and boost your motivation."
                            },
                            {
                                icon: <BookOutlined/>,
                                title: "Comprehensive Question Bank",
                                content: "Access a vast array of SAT-style questions covering all test sections and difficulty levels."
                            }
                        ].map((item, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <FeatureCard data-aos="fade-up" data-aos-delay={index * 100}>
                                    <IconWrapper>{item.icon}</IconWrapper>
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph style={{ flexGrow: 1 }}>{item.content}</Paragraph>
                                </FeatureCard>
                            </Col>
                        ))}
                    </Row>

                    <Divider/>

                    <Row gutter={[48, 48]} align="middle" style={{ marginTop: '60px' }}>
                        <Col xs={24} md={12}>
                            <StyledCard data-aos="fade-right">
                                <IconWrapper>
                                    <RocketOutlined />
                                </IconWrapper>
                                <Title level={3}>Boost Your Scores</Title>
                                <Paragraph>
                                    Our platform is designed to help you achieve your best possible SAT score.
                                    With personalized study plans, real-time feedback, and a vast question bank,
                                    you'll be well-prepared for test day.
                                </Paragraph>
                            </StyledCard>
                        </Col>
                        <Col xs={24} md={12}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <StatisticCard data-aos="fade-left" data-aos-delay="100">
                                        <Statistic
                                            title="Average Score Improvement"
                                            value={200}
                                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                                            suffix="points"
                                            valueStyle={{ color: '#3f8600' }}
                                        />
                                    </StatisticCard>
                                </Col>
                                <Col span={12}>
                                    <StatisticCard data-aos="fade-left" data-aos-delay="200">
                                        <Statistic
                                            title="Students Helped"
                                            value={50000}
                                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                                            suffix="+"
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </StatisticCard>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                                <Col span={24}>
                                    <StatisticCard data-aos="fade-left" data-aos-delay="300">
                                        <Statistic
                                            title="Success Rate"
                                            value={98.5}
                                            prefix={<RocketOutlined style={{ color: '#eb2f96' }} />}
                                            suffix="%"
                                            valueStyle={{ color: '#eb2f96' }}
                                        />
                                    </StatisticCard>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Divider/>

                    <Title level={2} style={{textAlign: 'center', marginTop: '60px', marginBottom: '40px'}}>
                        What Our Users Say
                    </Title>
                    <Row gutter={[24, 24]}>
                        {[
                            {
                                name: "Alex Johnson",
                                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                                rating: 5,
                                comment: "This platform significantly boosted my SAT score. The personalized learning approach really works!"
                            },
                            {
                                name: "Sarah Lee",
                                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                                rating: 4,
                                comment: "I love the duels feature. It makes studying fun and competitive!"
                            },
                            {
                                name: "Michael Chen",
                                avatar: "https://randomuser.me/api/portraits/men/22.jpg",
                                rating: 5,
                                comment: "The comprehensive question bank helped me tackle every type of question on the actual SAT."
                            }
                        ].map((testimonial, index) => (
                            <Col xs={24} sm={8} key={index}>
                                <TestimonialCard data-aos="fade-up" data-aos-delay={index * 100}>
                                    <Card.Meta
                                        avatar={<Avatar src={testimonial.avatar} size={64}/>}
                                        title={testimonial.name}
                                        description={<Rate disabled defaultValue={testimonial.rating}/>}
                                    />
                                    <Paragraph
                                        style={{marginTop: '16px', marginBottom: '0', flexGrow: 1}}>{testimonial.comment}</Paragraph>
                                </TestimonialCard>
                            </Col>
                        ))}
                    </Row>
                </Content>
            </ContentSection>
        </Layout>
    );
}

export default HomePage;