import React, {useRef} from 'react';
import {Link} from 'react-router-dom';
import {Layout, Typography, Row, Col, Card, Divider, Statistic, Avatar, Rate} from 'antd';
import {
    ArrowDownOutlined,
    LineChartOutlined,
    TrophyOutlined,
    BookOutlined,
    UserOutlined,
    CheckCircleOutlined,
    BulbOutlined, RocketOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import engaging_duels from '../assets/engaging_duels.png';
import personalized_learning from '../assets/personalized_learning.jpg';
import progress_tracking from '../assets/progress_tracking.png';
import question_bank from '../assets/question_bank.png';
import {Helmet} from "react-helmet";


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

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f9f9f9;
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
        background: conic-gradient(#bfa6ed, #789afb, #7f73ff, #786cae, #bfa6ed);
        border-radius: 15px;
        z-index: -2;
        filter: blur(9px);
        opacity: 40%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        border-radius: 10px;
        z-index: -1;
        opacity: 0.62;
    }

    &:hover {
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
        color: #c0d0fd;
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

const FeatureCardContainer = styled.div`
    display: flex;
    flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
    align-items: center;
    margin-bottom: 40px;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const FeatureCard = styled.div`
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: #ffffff;
    width: 100%;
    max-width: 700px;
    height: 180px;
    margin-bottom: 20px;
    padding: 20px;
    display: flex;
    align-items: center; /* Center content vertically */
    justify-content: center; /* Center content horizontally */

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    h4 {
        font-size: 1.4rem; // Increased font size for the title
        margin-bottom: 12px;
    }

    p {
        font-size: 1.1rem; // Increased font size for the content
    }
`;
const IconWrapper = styled.div`
    font-size: 2rem;
    margin-right: 20px; // Increased from 25px to create more space between icon and text
    border-radius: 12px;
    background: ${props => props.background || 'linear-gradient(135deg, #8a59fa, #7f73ff, #786cae, #8a59fa)'};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px; // Adjusted for better proportions
    height: 58px; // Adjusted for better proportions
    flex-shrink: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const RocketIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
`;

const ChartIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #4E54C8, #8F94FB);
`;

const TrophyIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #11998E, #38EF7D);
`;

const BookIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #FC466B, #3F5EFB);
`;

const StyledImage = styled.img`
    width: 600px;
    height: 250px;
    border-radius: 8px;
    margin: 0 15px;
    flex-shrink: 0;
    object-fit: cover;
`;

const StatisticCard = styled(Card)`
    background: white;
    border-radius: 8px;
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-statistic-title {
        font-family: 'Poppins', sans-serif;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .ant-statistic-content {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
    }
`;

const TestimonialCard = styled(Card)`
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .ant-card-meta-title {
        font-family: 'Poppins', sans-serif;
        font-size: 1.2rem;
    }

    .ant-typography {
        font-family: 'Poppins', sans-serif;
    }
`;

const GlobalStyle = styled.div`
    font-family: 'Poppins', sans-serif;
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
        contentRef.current.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <GlobalStyle>
            <Helmet>
                <title>SAT Duel!</title>
                <meta name="description" content="SAT Duel - The best way to practice SAT while competing with your friends! Practice using REAL SAT questions"/>
                <meta name="keywords" content="SAT, SAT practice, SAT prep, SAT question, SAT questionbank, test prep, SAT highscore, SAT tips, standard testing, fun way to practice"/>
            </Helmet>
            <Layout>
                <HeroSection>
                    <Title level={1} style={{fontSize: '4rem', marginBottom: '20px'}}>
                        <span style={{color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 500}}>
                            Elevate Your SAT Prep with{' '}
                        </span>
                        <GradientText style={{fontWeight: 500}}>Duels</GradientText>
                    </Title>
                    <Paragraph style={{fontSize: '1.5rem', maxWidth: '600px', marginBottom: '40px'}}>
                        <span style={{color: '#FFFFFF'}}> Immerse yourself in a </span>
                        <GradientText>futuristic</GradientText>
                        <span style={{color: '#FFFFFF'}}> learning experience designed to </span>
                        <GradientText>boost</GradientText>
                        <span style={{color: '#FFFFFF'}}> your SAT scores. </span>
                    </Paragraph>
                    <Row gutter={16}>
                        <Col>
                            <StyledTitleButton>
                                <Link to="/trainer" style={{fontWeight: 500}}>Start Practice</Link>
                            </StyledTitleButton>
                        </Col>
                        <Col>
                            <StyledTitleButton>
                                <Link to="/match" style={{fontWeight: 500}}>Challenge a Friend</Link>
                            </StyledTitleButton>
                        </Col>
                    </Row>
                    <ScrollIndicator onClick={scrollToContent}>
                        <ArrowDownOutlined style={{fontSize: '24px'}}/>
                    </ScrollIndicator>
                </HeroSection>

                <ContentSection ref={contentRef}>
                    <Content style={{padding: '0 30px', maxWidth: '1200px', margin: '0 auto'}}>
                        <Title level={2}
                               style={{textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1}}>
                            <GradientTextLarge>
                                Prepare for the SAT: <span className="yellow-box">Efficiently. With Friends. While Having Fun.</span>
                            </GradientTextLarge>
                        </Title>

                        <Row gutter={[16, 16]}>
                            {[
                                {
                                    icon: <RocketOutlined/>,
                                    iconWrapper: RocketIconWrapper,
                                    title: "Personalized Learning",
                                    content: "Our adaptive algorithms tailor questions to your skill level, ensuring efficient progress.",
                                    imgSrc: personalized_learning,
                                    reverse: false
                                },
                                {
                                    icon: <LineChartOutlined/>,
                                    iconWrapper: ChartIconWrapper,
                                    title: "Real-Time Progress Tracking",
                                    content: "Monitor your improvement with detailed analytics and performance insights.",
                                    imgSrc: progress_tracking,
                                    reverse: true
                                },
                                {
                                    icon: <TrophyOutlined/>,
                                    iconWrapper: TrophyIconWrapper,
                                    title: "Engaging Duels",
                                    content: "Challenge friends or other students to competitive quizzes and boost your motivation.",
                                    imgSrc: engaging_duels,
                                    reverse: false
                                },
                                {
                                    icon: <BookOutlined/>,
                                    iconWrapper: BookIconWrapper,
                                    title: "Comprehensive Question Bank",
                                    content: "Access a vast array of SAT questions covering all test sections and difficulty levels.",
                                    imgSrc: question_bank,
                                    reverse: true
                                },
                            ].map((item, index) => (
                                <Col xs={24} key={index}>
                                    <FeatureCardContainer reverse={item.reverse} data-aos="fade-up"
                                                          data-aos-delay={index * 100}>
                                        <FeatureCard>
                                            <item.iconWrapper>{item.icon}</item.iconWrapper>
                                            <div>
                                                <Title level={4} style={{
                                                    marginBottom: '8px',
                                                    fontFamily: 'Poppins, sans-serif'
                                                }}>{item.title}</Title>
                                                <Paragraph style={{
                                                    marginBottom: 0,
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '1.1rem'
                                                }}>{item.content}</Paragraph>
                                            </div>
                                        </FeatureCard>
                                        <StyledImage src={item.imgSrc} alt={item.title}/>
                                    </FeatureCardContainer>
                                </Col>
                            ))}
                        </Row>
                        <Divider/>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <FeatureCardContainer reverse={false} data-aos="fade-right">
                                    <FeatureCard>
                                        <IconWrapper>
                                            <BulbOutlined/>
                                        </IconWrapper>
                                        <div>
                                            <Title level={4}
                                                   style={{marginBottom: '8px', fontFamily: 'Poppins, sans-serif'}}>
                                                Boost Your Scores
                                            </Title>
                                            <Paragraph style={{
                                                marginBottom: 0,
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '1.1rem'
                                            }}>
                                                Our platform helps you ace the SAT with personalized study plans,
                                                real-time feedback, and a vast question bank.
                                            </Paragraph>
                                        </div>
                                    </FeatureCard>
                                </FeatureCardContainer>
                            </Col>

                            <Col xs={24} md={12}>
                                {[
                                    {
                                        title: "Average Score Improvement",
                                        value: 200,
                                        prefix: (
                                            <IconWrapper background="linear-gradient(135deg, #FF6B6B, #FF8E53)">
                                                <TrophyOutlined/>
                                            </IconWrapper>
                                        ),
                                        suffix: "points",
                                        delay: 100
                                    },
                                    {
                                        title: "Students Helped",
                                        value: 50000,
                                        prefix: (
                                            <IconWrapper background="linear-gradient(135deg, #4E54C8, #8F94FB)">
                                                <UserOutlined/>
                                            </IconWrapper>
                                        ),
                                        suffix: "+",
                                        delay: 200
                                    },
                                    {
                                        title: "Success Rate",
                                        value: 98.5,
                                        prefix: (
                                            <IconWrapper background="linear-gradient(135deg, #11998E, #38EF7D)">
                                                <CheckCircleOutlined/>
                                            </IconWrapper>
                                        ),
                                        suffix: "%",
                                        delay: 300
                                    }
                                ].map((item, index) => (
                                    <Col span={24} key={index} style={{marginTop: '12px', textAlign: 'center'}}>
                                        <StatisticCard data-aos="fade-left" data-aos-delay={item.delay}>
                                            <Statistic
                                                title={<span
                                                    style={{color: 'black', fontWeight: '600'}}>{item.title}</span>}
                                                value={item.value}
                                                prefix={item.prefix}
                                                suffix={item.suffix}
                                                valueStyle={{

                                                    fontSize: '1.5rem',
                                                    color: '#434343',
                                                    fontFamily: 'Poppins, sans-serif'
                                                }}
                                            />
                                        </StatisticCard>
                                    </Col>
                                ))}
                            </Col>
                        </Row>

                        <Divider/>

                        <Title level={2} style={{
                            textAlign: 'center',
                            marginTop: '60px',
                            marginBottom: '40px',
                            fontFamily: 'Poppins, sans-serif'
                        }}>
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
                                    name: "Sarah Parker",
                                    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                                    rating: 4,
                                    comment: "I loved the competitive aspect of duels. It made learning so much more engaging!"
                                },
                                {
                                    name: "Michael Lee",
                                    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                                    rating: 5,
                                    comment: "The real-time progress tracking helped me stay on top of my study plan. Highly recommend!"
                                },
                            ].map((testimonial, index) => (
                                <Col xs={24} md={8} key={index}>
                                    <TestimonialCard data-aos="fade-up" data-aos-delay={index * 100}>
                                        <Avatar src={testimonial.avatar} alt={testimonial.name}/>
                                        <Title level={4} style={{
                                            marginBottom: '8px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}>{testimonial.name}</Title>
                                        <Paragraph
                                            style={{fontFamily: 'Poppins, sans-serif'}}>{testimonial.comment}</Paragraph>
                                        <Rate disabled defaultValue={testimonial.rating}/>
                                    </TestimonialCard>
                                </Col>
                            ))}
                        </Row>

                    </Content>
                </ContentSection>
            </Layout>
        </GlobalStyle>
    );
}

export default HomePage;
