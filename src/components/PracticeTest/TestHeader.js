import React from 'react';
import {
    Layout,
    Button,
    Space,
    Typography,
} from 'antd';

const {Header} = Layout;
const {Text} = Typography;

const headerStyles = {
    background: '#e4ebf7',
    padding: '0 16px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',  // Increased height to accommodate the stacked elements
    position: 'relative'
};

const timerContainerStyles = {
    position: 'absolute',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',  // Increased gap for better spacing
    top: '50%',  // Center vertically
    transform: 'translate(-50%, -50%)'  // Center both horizontally and vertically
};

const sectionTitleStyles = {
    fontSize: '18px',
    fontWeight: 600
};

const timerStyles = {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '24px'  // Added to control vertical space
};

const buttonTextStyles = {
    fontSize: '16px',
    fontWeight: 500
};

const TestHeader = () => {
    return (
        <Header style={headerStyles}>
            {/* Left section */}
            <Space>
                <Text strong style={sectionTitleStyles}>
                    Section 1: Reading and Writing
                </Text>
            </Space>

            {/* Center section - Timer and Hide button */}
            <div style={timerContainerStyles}>
                <Text strong style={timerStyles}>0:00</Text>
                <Button type="default" shape="round" size="small">
                    Hide
                </Button>
            </div>

            {/* Right section */}
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