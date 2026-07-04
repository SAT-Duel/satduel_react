import React from 'react';
import {Row, Col} from 'antd';
import {TrophyOutlined, UserOutlined, CheckCircleOutlined, BulbOutlined} from '@ant-design/icons';

import styled from 'styled-components';

const StatsContainer = styled.div`
  padding: 40px 0;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 24px;
  margin: 40px 0;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const IconBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d2653;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #2d2653 0%, #193557 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
`;

const StatDescription = styled.div`
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.4;
  font-family: 'Poppins', sans-serif;
`;

const stats = [
    {
        icon: <TrophyOutlined/>,
        value: "150+",
        label: "Point Improvement",
        description: "Average score increase after 3 months",
        gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)"
    },
    {
        icon: <UserOutlined/>,
        value: "500+",
        label: "Active Students",
        description: "Learning and improving every day",
        gradient: "linear-gradient(135deg, #4E54C8, #8F94FB)"
    },
    {
        icon: <CheckCircleOutlined/>,
        value: "45min",
        label: "Daily Practice",
        description: "Recommended study time for best results",
        gradient: "linear-gradient(135deg, #11998E, #38EF7D)"
    },
    {
        icon: <BulbOutlined/>,
        value: "92%",
        label: "Success Rate",
        description: "Students reaching their target score",
        gradient: "linear-gradient(135deg, #8A2387, #E94057)"
    }
];

function Stats () {
    return (
        <StatsContainer>
            <Row gutter={[24, 24]}>
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <StatCard data-aos="fade-up" data-aos-delay={index * 100}>
                            <IconBox gradient={stat.gradient}>
                                {stat.icon}
                            </IconBox>
                            <StatValue>{stat.value}</StatValue>
                            <StatLabel>{stat.label}</StatLabel>
                            <StatDescription>{stat.description}</StatDescription>
                        </StatCard>
                    </Col>
                ))}
            </Row>
        </StatsContainer>
    );
}

export default Stats;