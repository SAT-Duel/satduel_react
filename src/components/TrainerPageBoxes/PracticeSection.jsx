// PracticeSection.js

import React from 'react';
import { Card, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Title } = Typography;

const StyledCard = styled(Card)`
  border-radius: 15px;
  background: linear-gradient(135deg, #ff4e50 0%, #f9d423 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const GameModesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  margin-top: 20px;
`;

const GameModeCard = styled(Card)`
  background: ${(props) => props.bg};
  color: white;
  border-radius: 15px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  .icon {
    font-size: 24px;
    color: white;
  }
`;

const PracticeBox = () => {
  const gameModes = [
    {
      title: 'Infinite Questions',
      icon: '🚀',
      bg: 'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)',
      link: '/infinite_questions',
    },
    {
      title: 'Power Sprint',
      icon: '⚡',
      bg: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
      link: '/power_sprint_home',
    },
    {
      title: 'SAT Survival',
      icon: '🔥',
      bg: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
      link: '/sat_survival_home',
    },
    {
      title: 'Timed Challenges',
      icon: '⏱️',
      bg: 'linear-gradient(135deg, #42e695 0%, #3bb2b8 100%)',
      link: '/timed_challenges',
    },
  ];

  return (
    <StyledCard>
      <Title level={4} style={{ color: 'white' }}>
        Practice
      </Title>

      {/* Game Modes as Subboxes */}
      <GameModesContainer>
        {gameModes.map((mode, index) => (
          <GameModeCard key={index} bg={mode.bg}>
            <div>
              <span className="icon">{mode.icon}</span> {mode.title}
            </div>
            <Link to={mode.link}>
              <Button
                type="primary"
                shape="round"
                style={{ background: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
              >
                Start
              </Button>
            </Link>
          </GameModeCard>
        ))}
      </GameModesContainer>
    </StyledCard>
  );
};

export default PracticeBox;
