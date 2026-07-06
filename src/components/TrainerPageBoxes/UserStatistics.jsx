// UserStatistics.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import {
  CheckCircleOutlined,
  FireOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const cardStyle = {
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const gradientStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
};

const whiteTextStyle = {
  color: 'white',
};

const iconStyle = {
  fontSize: '24px',
  background: '#fff',
  borderRadius: '50%',
  padding: '8px',
  marginRight: '8px',
};

const UserStatisticsCard = () => {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState({
    correct_number: 0,
    incorrect_number: 0,
    current_streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) return;

      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const statsResponse = await axios.get(`${baseUrl}/api/infinite_questions_profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatistics({
          correct_number: statsResponse.data.correct_number,
          incorrect_number: statsResponse.data.incorrect_number,
          current_streak: statsResponse.data.current_streak,
        });
        setLoading(false);
      } catch (error) {
        message.error('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  const totalAnswered = (statistics.correct_number || 0) + (statistics.incorrect_number || 0);
  const accuracy = totalAnswered ? `${Math.round((statistics.correct_number / totalAnswered) * 100)}%` : '—';

  return (
    <Card
      loading={loading}
      title={<span style={whiteTextStyle}>Your Stats</span>}
      style={{ ...cardStyle, ...gradientStyle }}
      headStyle={{ borderBottom: 'none', ...gradientStyle }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Answered</span>}
            value={totalAnswered}
            prefix={<CheckCircleOutlined style={{ ...iconStyle, color: '#10b981' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Correct</span>}
            value={statistics.correct_number}
            prefix={<CheckCircleOutlined style={{ ...iconStyle, color: '#10b981' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Streak</span>}
            value={statistics.current_streak}
            prefix={<FireOutlined style={{ ...iconStyle, color: '#f97316' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Accuracy</span>}
            value={accuracy}
            prefix={<RiseOutlined style={{ ...iconStyle, color: '#FFA500' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default UserStatisticsCard;
