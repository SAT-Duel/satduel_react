import React from 'react';
import {Layout, Button, Space, Typography} from 'antd';

const {Header} = Layout;
const {Text} = Typography;

const headerStyles = {
    background: '#e4ebf7',
    padding: '0 16px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
    position: 'relative'
};

const timerContainerStyles = {
    position: 'absolute',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    top: '50%',
    transform: 'translate(-50%, -50%)'
};

const sectionTitleStyles = {
    fontSize: '18px',
    fontWeight: 600
};

const timerStyles = {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '24px'
};

const buttonTextStyles = {
    fontSize: '16px',
    fontWeight: 500
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const TestHeader = ({timeLeft, hideTimer, onToggleHide}) => {
    return (
        <Header style={headerStyles}>
            <Space>
                <Text strong style={sectionTitleStyles}>
                    Section 1: Reading and Writing
                </Text>
            </Space>

            <div style={timerContainerStyles}>
                {!hideTimer && <Text strong style={timerStyles}>{formatTime(timeLeft)}</Text>}
                <Button type="default" shape="round" size="small" onClick={onToggleHide}>
                    {hideTimer ? 'Show' : 'Hide'}
                </Button>
            </div>

            <Space size="middle">
                <Button type="text" style={buttonTextStyles}>
                    Highlights & Notes
                </Button>
                <Button type="text" style={buttonTextStyles}>
                    More
                </Button>
            </Space>
        </Header>
    );
};

export default TestHeader;