import React from 'react';
import { Col, Divider, Layout, Row, Typography, Space } from 'antd';
import Navbar from "../components/Navbar";
import { Link, Outlet } from 'react-router-dom';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const SecondaryLayout = () => {
    const { Title, Paragraph } = Typography;
    return (
        <Layout>
            <Header className="site-layout-header">
                <Navbar />
            </Header>
            <Content>
                <Outlet />
            </Content>
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
                                <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.65)' }}>About</Link></li>
                                <li><Link to="/about#contact-us" style={{ color: 'rgba(255,255,255,0.65)' }}>Contact</Link></li>
                                <li><Link to="/about#faq" style={{ color: 'rgba(255,255,255,0.65)' }}>FAQ</Link></li>
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
        </Layout>
    );
};

export default SecondaryLayout;
