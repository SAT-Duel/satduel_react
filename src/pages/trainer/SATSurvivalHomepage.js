import React from 'react';
import { Card, Button, Typography, List } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faRocket, faBolt, faTrophy, faPlay } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({ duration: 1000, once: true });

const { Title, Paragraph } = Typography;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f4f1f8;
  padding: 40px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  background-color: #8e44ad;
  color: white;
  padding: 60px;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StyledCard = styled(Card)`
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StartButton = styled(Button)`
  background-color: #8e44ad;
  border-color: #8e44ad;
  height: auto;
  padding: 12px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #9b59b6;
    border-color: #9b59b6;
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  color: #f1c40f;
`;

const ListItemIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: #8e44ad;
`;

const ListItemTitle = styled(Title)`
  && {
    margin-bottom: 0;
  }
`;

const SATSurvivalHomepage = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection data-aos="fade-down">
          <IconWrapper>
            <FontAwesomeIcon icon={faFire} />
          </IconWrapper>
          <Title level={1} style={{ color: 'white', marginBottom: 20 }}>SAT Survival</Title>
          <Paragraph style={{ color: 'white', fontSize: '1.1rem' }}>
            Build unbreakable knowledge through progressive difficulty levels.
          </Paragraph>
        </HeaderSection>

        <StyledCard data-aos="fade-up">
          <Title level={2} style={{ color: '#8e44ad', marginBottom: 30 }}>How It Works</Title>
          <List
            itemLayout="horizontal"
            dataSource={[
              { icon: faRocket, text: "Start with easier questions and progress to more challenging ones.", title: "Progressive Difficulty" },
              { icon: faBolt, text: "Answer as many questions as you can without making a mistake.", title: "Endurance Challenge" },
              { icon: faTrophy, text: "Compete for the highest streak and improve your SAT skills!", title: "Skill Mastery" },
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<ListItemIcon icon={item.icon} />}
                  title={<ListItemTitle level={4}>{item.title}</ListItemTitle>}
                  description={<Paragraph>{item.text}</Paragraph>}
                />
              </List.Item>
            )}
          />
        </StyledCard>

        <StyledCard data-aos="fade-up">
          <Title level={2} style={{ color: '#8e44ad' }}>Ready to Challenge Yourself?</Title>
          <Paragraph style={{ fontSize: '1.1rem' }}>
            Start your SAT Survival journey and push your limits!
          </Paragraph>
          <Link to="/sat_survival">
            <StartButton type="primary" size="large" icon={<FontAwesomeIcon icon={faPlay} />}>
              Start Training
            </StartButton>
          </Link>
        </StyledCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default SATSurvivalHomepage;
