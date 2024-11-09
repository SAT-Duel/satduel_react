// OverviewBox.js

import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress, message } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Title, Paragraph } = Typography;

const OverviewCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: 15px;
  color: white;
`;

const CircularProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsWrapper = styled.div`
  margin-left: 20px;
  color: black;
  text-align: left;
`;

const OverviewBox = () => {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) return;

      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const statsResponse = await axios.get(`${baseUrl}/api/infinite_questions_profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatistics({
          correctAnswers: statsResponse.data.correct_number,
          incorrectAnswers: statsResponse.data.incorrect_number,
        });
        setLoading(false);
      } catch (error) {
        message.error('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  const totalQuestions = statistics.correctAnswers + statistics.incorrectAnswers;
  const correctPercentage = totalQuestions > 0 ? (statistics.correctAnswers / totalQuestions) * 100 : 0;

  return (
    <OverviewCard loading={loading}>
      <Title level={4} style={{ color: 'white' }}>
        Accuracy
      </Title>
      <CircularProgressBarWrapper>
        <Progress
          type="circle"
          percent={correctPercentage}
          strokeWidth={10}
          width={120}
          strokeColor={correctPercentage > 0 ? '#52c41a' : '#f5222d'}
          trailColor="#f5222d"
          format={(percent) => `${Math.round(percent)}%`}
        />
        <StatsWrapper>
          <Paragraph style={{ margin: 0 }}>
            <strong>Correct:</strong> {statistics.correctAnswers}
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <strong>Incorrect:</strong> {statistics.incorrectAnswers}
          </Paragraph>
        </StatsWrapper>
      </CircularProgressBarWrapper>
    </OverviewCard>
  );
};

export default OverviewBox;
