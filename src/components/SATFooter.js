import React from 'react';
import { Col, Divider, Layout, Row, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { FacebookOutlined, InstagramOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Footer } = Layout;
const { Title, Paragraph } = Typography;

const StyledList = styled('li')`
    color: rgba(255,255,255,0.65);
    margin-bottom: 8px;
`;
const SATFooter = () => {
    return (
        <Footer style={{ textAlign: 'center', background: '#001529', color: 'white', padding: '40px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <Row justify="space-between" align="top" gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <Title level={4} style={{ color: 'white' }}>About Us</Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                            We're dedicated to helping students achieve their best SAT scores through
                            innovative and engaging online preparation.
                        </Paragraph>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Title level={4} style={{ color: 'white' }}>Quick Links</Title>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <StyledList><Link to="/about#header">About</Link></StyledList>
                            <StyledList><Link to="/about#contact-us">Contact</Link></StyledList>
                            <StyledList><Link to="/about#faq">FAQ</Link></StyledList>
                        </ul>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Title level={4} style={{ color: 'white' }}>Connect With Us</Title>
                        <Space size="large">
                            <FacebookOutlined style={{ fontSize: '24px', color: 'white' }} />
                            <TwitterOutlined style={{ fontSize: '24px', color: 'white' }} />
                            <InstagramOutlined style={{ fontSize: '24px', color: 'white' }} />
                            <LinkedinOutlined style={{ fontSize: '24px', color: 'white' }} />
                        </Space>
                    </Col>
                </Row>
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <Paragraph style={{ color: 'rgba(255,255,255,0.45)' }}>
                    © 2024 SAT Prep Platform. All rights reserved.
                </Paragraph>
            </div>
        </Footer>
    );
};

export default SATFooter;
