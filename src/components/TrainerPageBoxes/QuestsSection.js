import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Progress, Button, message } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const WeeklyQuest = () => {
  const { token } = useAuth();
  const [questProgress, setQuestProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestProgress = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${baseUrl}/api/weekly_quest/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestProgress(response.data.progress);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load quest progress');
        setLoading(false);
      }
    };

    if (token) {
      fetchQuestProgress();
    }
  }, [token]);

  return (
    <Layout>
      <Content style={{ padding: '30px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Card loading={loading} style={{ borderRadius: '15px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Title level={3}>Weekly Quest</Title>
          <Paragraph>Complete 100 questions within the week!</Paragraph>
          <Progress percent={questProgress} status="active" />
          <Button type="primary" style={{ marginTop: '20px' }} onClick={() => message.info('Keep going!')}>
            Check Progress
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default WeeklyQuest;
