import React, {useRef} from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Divider,
    Statistic,
    Avatar,
    Rate,
} from 'antd';
import {
    TrophyOutlined,
    UserOutlined,
    CheckCircleOutlined,
    BulbOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Helmet} from 'react-helmet';
import {Hero} from "../components/HomePage/Hero";
import {Features} from "../components/HomePage/Features";
import DiagnosticSection from "../components/HomePage/DiagnosticSection";
import Stats from "../components/HomePage/Stats";

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const ContentSection = styled.div`
    padding: 50px 0;
    background-color: #f9f9f9;
    @media (max-width: 768px) {
        padding: 30px 0;
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
    align-items: center;
    justify-content: center;

    /* Adjustments for mobile */
    @media (max-width: 768px) {
        height: auto;
        flex-direction: column;
        padding: 20px 10px;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    h4 {
        font-size: 1.4rem;
        margin-bottom: 12px;
        @media (max-width: 768px) {
            font-size: 1.2rem;
        }
    }

    p {
        font-size: 1.1rem;
        @media (max-width: 768px) {
            font-size: 1rem;
        }
    }
`;

const IconWrapper = styled.div`
    font-size: 2rem;
    margin-right: 20px;
    border-radius: 12px;
    background: ${props =>
            props.background ||
            'linear-gradient(135deg, #8a59fa, #7f73ff, #786cae, #8a59fa)'};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    /* Adjustments for mobile */
    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 10px;
    }
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
        @media (max-width: 768px) {
            font-size: 1rem;
        }
    }

    .ant-statistic-content {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
        @media (max-width: 768px) {
            font-size: 1.5rem;
        }
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
        @media (max-width: 768px) {
            font-size: 1rem;
        }
    }

    .ant-typography {
        font-family: 'Poppins', sans-serif;
    }
`;

const GlobalStyle = styled.div`
    font-family: 'Poppins', sans-serif;
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
                <meta
                    name="description"
                    content="SAT Duel - The best way to practice SAT while competing with your friends! Practice using REAL SAT questions"
                />
                <meta
                    name="keywords"
                    content="SAT, SAT practice, SAT prep, SAT question, SAT questionbank, test prep, SAT highscore, SAT tips, standard testing, fun way to practice"
                />
            </Helmet>
            <Layout>
                <Hero onScrollClick={scrollToContent}/>

                <ContentSection ref={contentRef}>
                    <Content style={{padding: '0 30px', maxWidth: '1200px', margin: '0 auto'}}>

                        <Features/>

                        <Divider/>

                        <Stats/>
                        <Title
                            level={2}
                            style={{
                                textAlign: 'center',
                                marginTop: '60px',
                                marginBottom: '40px',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            What Our Users Say
                        </Title>
                        <Row gutter={[24, 24]}>
                            {[
                                {
                                    name: 'Alex Johnson',
                                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                                    rating: 5,
                                    comment:
                                        'This platform significantly boosted my SAT score. The personalized learning approach really works!',
                                },
                                {
                                    name: 'Sarah Parker',
                                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                                    rating: 4,
                                    comment:
                                        'I loved the competitive aspect of duels. It made learning so much more engaging!',
                                },
                                {
                                    name: 'Michael Lee',
                                    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
                                    rating: 5,
                                    comment:
                                        'The real-time progress tracking helped me stay on top of my study plan. Highly recommend!',
                                },
                            ].map((testimonial, index) => (
                                <Col xs={24} md={8} key={index}>
                                    <TestimonialCard
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <Avatar src={testimonial.avatar} alt={testimonial.name}/>
                                        <Title
                                            level={4}
                                            style={{
                                                marginBottom: '8px',
                                                fontFamily: 'Poppins, sans-serif',
                                            }}
                                        >
                                            {testimonial.name}
                                        </Title>
                                        <Paragraph
                                            style={{fontFamily: 'Poppins, sans-serif'}}
                                        >
                                            {testimonial.comment}
                                        </Paragraph>
                                        <Rate disabled defaultValue={testimonial.rating}/>
                                    </TestimonialCard>
                                </Col>
                            ))}
                        </Row>
                        <Divider/>
                        <DiagnosticSection/>

                    </Content>
                </ContentSection>
            </Layout>
        </GlobalStyle>
    );
}

export default HomePage;
