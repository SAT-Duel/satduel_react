import React, { useEffect, useState } from 'react';
import { Modal, Typography, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Text } = Typography;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const StyledLoadingIcon = styled(LoadingOutlined)`
  font-size: 48px;
  color: #4C3D97;
  margin-bottom: 24px;
`;

const MatchingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  text-align: center;
`;

const LoadingText = styled(Text)`
  font-size: 18px;
  margin-top: 16px;
  color: #4A4A4A;
`;

const sentences = [
    "Searching for opponents...",
    "Getting ready for the battle...",
    "Preparing your duel...",
    "Almost there...",
    "Setting up your battle arena..."
];

const MatchingModal = ({ visible, onCancel }) => {
    const [loadingMessage, setLoadingMessage] = useState(sentences[0]);

    useEffect(() => {
        if (visible) {
            const interval = setInterval(() => {
                setLoadingMessage((prev) => {
                    const currentIndex = sentences.indexOf(prev);
                    return sentences[(currentIndex + 1) % sentences.length];
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            closable={true}
            centered
            width={400}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            bodyStyle={{ padding: 0 }}
        >
            <MatchingContainer>
                <StyledLoadingIcon spin />
                <LoadingText>{loadingMessage}</LoadingText>
            </MatchingContainer>
        </Modal>
    );
};

export default MatchingModal; 