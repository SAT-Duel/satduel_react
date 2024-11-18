import React from 'react';
import {Row, Col, Typography} from 'antd';
import {RocketOutlined, LineChartOutlined, TrophyOutlined, BookOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import engaging_duels from '../../assets/engaging_duels.png';
import personalized_learning from '../../assets/personalized_learning.jpg';
import progress_tracking from '../../assets/progress_tracking.png';
import question_bank from '../../assets/question_bank.png';
const {Title, Paragraph} = Typography;


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

    @media (max-width: 768px) {
        height: auto;
        flex-direction: column;
        padding: 20px 10px;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`;

const StyledImage = styled.img`
    width: 600px;
    height: 250px;
    border-radius: 8px;
    margin: 0 15px;
    flex-shrink: 0;
    object-fit: cover;

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        margin: 20px 0;
    }
`;

const IconWrapper = styled.div`
    font-size: 2rem;
    margin-right: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8a59fa, #7f73ff, #786cae, #8a59fa);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 10px;
    }
`;

const GradientTextLarge = styled.span`
    color: black;
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    display: inline-block;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
    @media (max-width: 576px) {
        font-size: 1.2rem;
    }

    .yellow-box {
        background-color: #b59cef;
        padding: 2px 10px;
        border-radius: 5px;
        color: #000;
        font-weight: 600;
    }
`;

const RocketIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
`;

const ChartIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
`;

const TrophyIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #11998e, #38ef7d);
`;

const BookIconWrapper = styled(IconWrapper)`
    background: linear-gradient(135deg, #fc466b, #3f5efb);
`;

const features = [
    {
        icon: <RocketOutlined/>,
        iconWrapper: RocketIconWrapper,
        title: 'Personalized Learning',
        content: 'Our adaptive algorithms tailor questions to your skill level, ensuring efficient progress.',
        imgSrc: personalized_learning,
        reverse: "true",
    },
    {
        icon: <LineChartOutlined/>,
        iconWrapper: ChartIconWrapper,
        title: 'Real-Time Progress Tracking',
        content: 'Monitor your improvement with detailed analytics and performance insights.',
        imgSrc: progress_tracking,
        reverse: "false",
    },
    {
        icon: <TrophyOutlined/>,
        iconWrapper: TrophyIconWrapper,
        title: 'Engaging Duels',
        content: 'Challenge friends or other students to competitive quizzes and boost your motivation.',
        imgSrc: engaging_duels,
        reverse: "true",
    },
    {
        icon: <BookOutlined/>,
        iconWrapper: BookIconWrapper,
        title: 'Comprehensive Question Bank',
        content: 'Access a vast array of SAT questions covering all test sections and difficulty levels.',
        imgSrc: question_bank,
        reverse: "false",
    },
];



export const Features: React.FC = () => {
    return (
        <>
            <Title
                level={2}
                style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <GradientTextLarge>
                    Prepare for the SAT:{' '}
                    <span className="yellow-box">
                  Efficiently. With Friends. While Having Fun.
                </span>
                </GradientTextLarge>
            </Title>
            <Row gutter={[16, 16]}>
                {features.map((item, index) => (
                    <Col xs={24} key={index}>
                        <FeatureCardContainer
                            reverse={item.reverse === "true"}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <FeatureCard>
                                <item.iconWrapper>{item.icon}</item.iconWrapper>
                                <div>
                                    <Title level={4} style={{marginBottom: '8px', fontFamily: 'Poppins, sans-serif'}}>
                                        {item.title}
                                    </Title>
                                    <Paragraph
                                        style={{
                                            marginBottom: 0,
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '1.1rem'
                                        }}>
                                        {item.content}
                                    </Paragraph>
                                </div>
                            </FeatureCard>
                            <StyledImage src={item.imgSrc} alt={item.title}/>
                        </FeatureCardContainer>
                    </Col>
                ))}
            </Row>
        </>
    );
};