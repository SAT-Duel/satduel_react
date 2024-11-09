// UserStatistics.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  StarOutlined,
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
    coins: 0,
    xp: 0,
    level: 0,
    total_multiplier: 1.0,
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
          coins: statsResponse.data.coins,
          xp: statsResponse.data.xp,
          level: statsResponse.data.level,
          total_multiplier: statsResponse.data.total_multiplier,
        });
        setLoading(false);
      } catch (error) {
        message.error('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

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
            title={<span style={whiteTextStyle}>Coins</span>}
            value={statistics.coins}
            prefix={<DollarCircleOutlined style={{ ...iconStyle, color: '#FFD700' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>XP</span>}
            value={statistics.xp}
            prefix={<ThunderboltOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Level</span>}
            value={statistics.level}
            prefix={<StarOutlined style={{ ...iconStyle, color: '#FFD700' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span style={whiteTextStyle}>Multiplier</span>}
            value={statistics.total_multiplier.toFixed(2)}
            prefix={<RiseOutlined style={{ ...iconStyle, color: '#FFA500' }} />}
            valueStyle={whiteTextStyle}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default UserStatisticsCard;
