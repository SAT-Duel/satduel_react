import React, {useRef} from 'react';
import {Link} from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Card, Divider, Statistic, Avatar, Rate} from 'antd';
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
    background: linear-gradient(75deg, #193557 0%, #2d2653 100%);
    color: white;
    text-align: center;
`;

const GradientText = styled.span`
    background: linear-gradient(75deg, #8f73ff 0%, #34acfb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Poppins', sans-serif;
`;

const StyledTitleButton = styled.button`
    position: relative;
    background: #1a1a1a;
    border: none;
    color: white;
    font-size: 1.2rem;
    padding: 10px 20px;
    height: auto;
    overflow: visible;
    transition: all 0.3s ease;
    border-radius: 10px;
    z-index: 0;
    margin-right: 20px;
    font-family: 'Poppins', sans-serif;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 110%;
        height: 110%;
        background: conic-gradient(#8a59fa, #6a8fff, #7f73ff, #786cae, #8a59fa);
        border-radius: 15px;
        z-index: -2;
        filter: blur(9px);
        opacity: 80%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1d1e2e;
        border-radius: 10px;
        z-index: -1;
    }

    &:hover {
        background: #489cb5;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: 500;
    }

    &:hover a {
        color: #97abf8;
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


const StyledCard = styled(Card)`
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: #ffffff;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;
const FeatureCardContainer = styled.div`
    display: flex;
    flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const FeatureCard = styled(Card)`
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: #ffffff;
    width: 100%;
    max-width: 400px;
    margin: 10px;
    padding: 17px; // Reduced padding
    display: flex;
    align-items: flex-start;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        padding: 0; // Remove default Card padding
    }
`;

const IconWrapper = styled.div`
    font-size: 2rem;
    margin-right: 15px; // Slightly reduced margin
    padding: 8px; // Slightly reduced padding
    border-radius: 8px;
    background: linear-gradient(135deg, #8a59fa, #7f73ff, #786cae, #8a59fa);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px; // Slightly reduced size
    height: 50px;
    flex-shrink: 0;
`;

const StyledImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin: 0 15px; // Slightly reduced margin
    flex-shrink: 0;
    object-fit: cover; // Ensure the image covers the area without distortion
`;

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f9f9f9;
`;

const StatisticCard = styled(Card)`
    background: white;
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

/* I'm too lazy to change name at the moment but this is not a gradient text */
const GradientTextLarge = styled.span`
    color: black;
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    display: inline-block;

    .yellow-box {
        background-color: #b59cef;
        padding: 2px 10px;
        border-radius: 5px;
        color: #000;
        font-weight: 600;
    }
`;

const IconInBox = styled.div`
    font-size: 2rem;
    color: white;
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
                  <Title level={1} style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Elevate Your SAT Prep with </span>
                    <GradientText style={{fontWeight: 500}}>Duels</GradientText>
                </Title>
                <Paragraph style={{fontSize: '1.5rem', maxWidth: '600px', marginBottom: '40px'}}>
                    <span style={{color: '#FFFFFF'}}> Immerse yourself in a </span><GradientText>futuristic</GradientText> <span style={{color: '#FFFFFF'}}> learning experience designed to </span> <GradientText>boost</GradientText> <span style={{color: '#FFFFFF'}}> your SAT scores. </span>
                </Paragraph>
                <Row gutter={16}>
                    <Col>
                        <StyledTitleButton>
                           <Link to="/trainer" style={{ fontWeight: 500}}>Start Practice</Link>
                        </StyledTitleButton>
                    </Col>
                    <Col>
                        <StyledTitleButton>
                            <Link to="/match" style={{ fontWeight: 500 }}>Challenge a Friend</Link>
                        </StyledTitleButton>
                    </Col>
                </Row>
                <ScrollIndicator onClick={scrollToContent}>
                    <ArrowDownOutlined style={{ fontSize: '24px' }} />
                </ScrollIndicator>
            </HeroSection>

            <ContentSection ref={contentRef}>
                <Content style={{ padding: '0 30px', maxWidth: '1200px', margin: '0 auto' }}> {/* Reduced side padding */}
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}> {/* Reduced bottom margin */}
                        <GradientTextLarge>
                            Prepare for the SAT: <span className="yellow-box">Efficiently. With Friends. While Having Fun.</span>
                        </GradientTextLarge>
                    </Title>
                    <Row gutter={[16, 16]}> {/* Reduced gutter */}
                        {[
                            {
                                icon: <RocketOutlined />,
                                title: "Personalized Learning",
                                content: "Our adaptive algorithms tailor questions to your skill level, ensuring efficient progress.",
                                imgSrc: "../logo512.png", // Replace with your actual image path
                                reverse: false
                            },
                            {
                                icon: <LineChartOutlined />,
                                title: "Real-Time Progress Tracking",
                                content: "Monitor your improvement with detailed analytics and performance insights.",
                                imgSrc: "../logo512.png", // Replace with your actual image path
                                reverse: true
                            },
                            {
                                icon: <TrophyOutlined />,
                                title: "Engaging Duels",
                                content: "Challenge friends or other students to competitive quizzes and boost your motivation.",
                                imgSrc: "../logo512.png", // Replace with your actual image path
                                reverse: false
                            },
                            {
                                icon: <BookOutlined />,
                                title: "Comprehensive Question Bank",
                                content: "Access a vast array of SAT-style questions covering all test sections and difficulty levels.",
                                imgSrc: "../logo512.png", // Replace with your actual image path
                                reverse: true
                            },
                        ].map((item, index) => (
                            <Col xs={24} key={index}>
                                <FeatureCardContainer reverse={item.reverse} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <FeatureCard>
                                        <IconWrapper>{item.icon}</IconWrapper>
                                        <div>
                                            <Title level={4} style={{ marginBottom: '8px' }}>{item.title}</Title>
                                            <Paragraph style={{ marginBottom: 0 }}>{item.content}</Paragraph>
                                        </div>
                                    </FeatureCard>
                                    <StyledImage src={item.imgSrc} alt={item.title} />
                                </FeatureCardContainer>
                            </Col>
                        ))}
                    </Row>
        <Divider />

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
                    <Col span={24}>
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
                    <Col span={24} style={{ marginTop: '16px' }}>
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
                    <Col span={24} style={{ marginTop: '16px' }}>
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

        <Divider />

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