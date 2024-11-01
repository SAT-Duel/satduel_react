import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Button, Row, Col } from 'antd';
import {
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import Aos from 'aos';
import 'aos/dist/aos.css';
import FeatureCard from '../components/Tournament/FeatureCard';
import BenefitCard from '../components/Tournament/BenefitCard';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
  color: white;
  padding: 60px 0 70px;
  text-align: center;
`;

const ContentSection = styled.div`
  padding: 30px 0;
  background-color: #f0f2f5;
`;

const StyledContent = styled(Content)`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CTAButton = styled(Button)`
  font-size: 16px;
  height: auto;
  padding: 10px 25px;
  border-radius: 50px;
  background: #ff4500;
  border-color: #ff4500;
  margin-top: 20px;
  transition: all 0.3s;

  &:hover,
  &:focus {
    background: #ff6347;
    border-color: #ff6347;
    transform: scale(1.05);
  }
`;

const TournamentBenefitsSection = styled.section`
  margin-top: 60px;
`;

function TournamentPage() {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const features = [
    {
      title: 'Find Tournaments',
      description: 'Search and join community tournaments that match your skill level and goals.',
      gradient: 'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)',
      icon: <TrophyOutlined />,
    },
    {
      title: 'Flexible Entry',
      description: 'Enter tournaments anytime before the deadline and compete at your convenience.',
      gradient: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
      icon: <TeamOutlined />,
    },
    {
      title: 'Fair Competition',
      description: 'Tackle the same questions as other participants and see how you rank in the community.',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      icon: <RocketOutlined />,
    },
  ];

  const benefits = [
    {
      title: 'Competitive Edge',
      description: 'Challenge yourself against peers and rise to the top of the leaderboard.',
      icon: <TrophyOutlined />,
      gradient: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
    },
    {
      title: 'Community Learning',
      description: 'Join a vibrant community of learners and share strategies for success.',
      icon: <TeamOutlined />,
      gradient: 'linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)',
    },
    {
      title: 'Accelerated Growth',
      description: 'Push your limits and see rapid improvement in your SAT skills.',
      icon: <RocketOutlined />,
      gradient: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    },
    {
      title: 'Performance Insights',
      description: 'Gain valuable insights into your strengths and areas for improvement.',
      icon: <BarChartOutlined />,
      gradient: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)',
    },
  ];

  return (
    <Layout>
      <PageHeader>
        <Title level={1} style={{ color: 'white', fontSize: '2.5rem' }}>
          SAT Prep Tournaments
        </Title>
        <Paragraph
          style={{
            color: 'white',
            fontSize: '1rem',
            maxWidth: '800px',
            margin: '0 auto 20px',
          }}
        >
          Elevate your scores with our innovative, engaging, and personalized tournament mode.
        </Paragraph>
        <Link to="/tournaments">
          <CTAButton type="primary" size="large">
            View All Tournaments
          </CTAButton>
        </Link>
      </PageHeader>

      <ContentSection>
        <StyledContent>
          <Row gutter={[16, 16]} justify="center">
            {features.map((feature, index) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                key={index}
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <FeatureCard feature={feature} />
              </Col>
            ))}
          </Row>

          <TournamentBenefitsSection>
            <Title
              level={2}
              style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: '#4834d4',
              }}
            >
              Tournament Benefits
            </Title>
            <Row gutter={[16, 16]} justify="center">
              {benefits.map((benefit, index) => (
                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <BenefitCard benefit={benefit} />
                </Col>
              ))}
            </Row>
          </TournamentBenefitsSection>
        </StyledContent>
      </ContentSection>
    </Layout>
  );
}

export default TournamentPage;
