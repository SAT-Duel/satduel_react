// ProfileSectionComponent.js

import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

const ProfileSectionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  background-color: #e0e0e0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const UserName = styled(Text)`
  font-size: 18px;
`;

const ProfileSectionComponent = ({ username }) => (
  <ProfileSectionWrapper>
    <Avatar>
      <UserOutlined style={{ fontSize: '24px' }} />
    </Avatar>
    <UserName>{username}</UserName>
  </ProfileSectionWrapper>
);

export default ProfileSectionComponent;
