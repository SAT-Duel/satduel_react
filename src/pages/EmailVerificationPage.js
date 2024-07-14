import React from 'react';
import { Layout, Menu, Card, Typography, Button, Space, Divider } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const EmailVerificationPage = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '50px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Card style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 24 }} />
          <Title level={2}>Verification Email Sent</Title>
          <Paragraph>
            Please check your inbox to complete registration
          </Paragraph>
          <Paragraph>
            We've sent a verification link to your email address. Click the link in the email to activate your account.
          </Paragraph>
          <MailOutlined style={{ fontSize: 36, color: '#1890ff', margin: '24px 0' }} />
          <Divider />
          <Space direction="vertical" size="large">
            <Text>Didn't receive the email?</Text>
            <Button type="primary">Resend Email</Button>
          </Space>
          <Card style={{ background: '#f0f2f5', marginTop: 24 }}>
            <Text strong>Tip:</Text> Remember to check your spam folder if you don't see the email in your inbox.
          </Card>
        </Card>
      </Content>
    </Layout>
  );
};

export default EmailVerificationPage;