// HeaderSection.js

import React, { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const HeaderSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const GreetingText = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const NotificationIcon = styled(BellOutlined)`
  font-size: 24px;
`;

const HeaderSection = ({ username }) => {
  const [greeting, setGreeting] = useState(''); // Initialize with an empty string

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good afternoon');
    } else if (currentHour >= 18) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good morning'); // Ensure greeting is set for all cases
    }
  }, []);

  return (
    <HeaderSectionWrapper>
      <GreetingText>{`${greeting}, ${username}`}</GreetingText>
      <NotificationIcon />
    </HeaderSectionWrapper>
  );
};

export default HeaderSection;