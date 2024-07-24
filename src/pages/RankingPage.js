import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Avatar, Alert } from 'antd';
import { TrophyOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const { Title } = Typography;

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 50px 0;
`;

const GradientTitle = styled(Title)`
  background: linear-gradient(90deg, #c453f5, #69c4f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StyledTable = styled(Table)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .ant-table-thead > tr > th {
    background: #667eea;
    color: white;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f2ff;
  }
`;

const RankCell = styled.div`
  display: flex;
  align-items: center;
  
  .rank-number {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .trophy {
    color: gold;
    font-size: 20px;
  }
`;

const CountryFlag = styled(Avatar)`
  margin-right: 8px;
`;

function RankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/rankings');
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setError('Failed to load rankings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank) => (
        <RankCell>
          <span className="rank-number">#{rank}</span>
          {rank <= 3 && <TrophyOutlined className="trophy" />}
        </RankCell>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'ELO',
      dataIndex: 'elo',
      key: 'elo',
      sorter: (a, b) => a.elo - b.elo,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (country) => (
        <>
          <CountryFlag src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`} size="small" />
          {country}
        </>
      ),
    },
    {
      title: 'Problems Solved',
      dataIndex: 'problemsSolved',
      key: 'problemsSolved',
      sorter: (a, b) => a.problemsSolved - b.problemsSolved,
    },
  ];

  return (
    <PageWrapper>
      <ContentWrapper>
        <GradientTitle level={2} data-aos="fade-down">
          <GlobalOutlined style={{ marginRight: '10px' }} />
          Global SAT Duel Rankings
        </GradientTitle>
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        <StyledTable
          columns={columns}
          dataSource={rankings}
          pagination={{ pageSize: 10 }}
          data-aos="fade-up"
          loading={loading}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}

export default RankingPage;