// ModulesBox.js

import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import styled from 'styled-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ModulesBoxWrapper = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fafafa;
`;

const ModulesTitle = styled.h4`
  margin-bottom: 20px;
`;

const PerformanceRow = styled(Row)`
  margin-bottom: 20px;
`;

const PerformanceCol = styled(Col)`
  margin-bottom: 20px;
`;

const PortfolioCard = styled.div`
  background: linear-gradient(135deg, #833ab4, #fd1d1d);
  color: white;
  border-radius: 15px;
  height: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const PortfolioItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;

  .icon {
    font-size: 24px;
  }

  .value {
    font-weight: bold;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const ArrowButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModulesBoxComponent = () => {
  const portfolioItems = [
    { title: 'Bitcoin', value: '32.234 BTC', icon: '💰' },
    { title: 'Ethereum', value: '380.58 ETH', icon: '💰' },
    { title: 'Litecoin', value: '0.4500 LTC', icon: '💰' },
    { title: 'Cardano', value: '50,000 ADA', icon: '💰' },
    { title: 'Polkadot', value: '10,000 DOT', icon: '💰' },
  ];

  const [visiblePortfolioIndex, setVisiblePortfolioIndex] = useState(0);

  const handleNextPortfolio = () => {
    if (visiblePortfolioIndex + 3 < portfolioItems.length) {
      setVisiblePortfolioIndex(visiblePortfolioIndex + 1);
    }
  };

  const handlePrevPortfolio = () => {
    if (visiblePortfolioIndex > 0) {
      setVisiblePortfolioIndex(visiblePortfolioIndex - 1);
    }
  };

  return (
    <ModulesBoxWrapper>
      <ModulesTitle>Modules</ModulesTitle>
      <PerformanceRow gutter={[24, 24]}>
        {portfolioItems.slice(visiblePortfolioIndex, visiblePortfolioIndex + 3).map((item, index) => (
          <PerformanceCol span={8} key={index}>
            <PortfolioCard>
              <PortfolioItem>
                <div>
                  <span className="icon">{item.icon}</span> {item.title}
                </div>
                <div className="value">{item.value}</div>
              </PortfolioItem>
            </PortfolioCard>
          </PerformanceCol>
        ))}
      </PerformanceRow>

      {/* Arrow Navigation for Portfolio */}
      <ArrowContainer>
        <ArrowButton onClick={handlePrevPortfolio} icon={<LeftOutlined />} disabled={visiblePortfolioIndex === 0} />
        <ArrowButton
          onClick={handleNextPortfolio}
          icon={<RightOutlined />}
          disabled={visiblePortfolioIndex + 3 >= portfolioItems.length}
        />
      </ArrowContainer>
    </ModulesBoxWrapper>
  );
};

export default ModulesBoxComponent;
