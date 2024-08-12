import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // or useNavigate if you're using React Router v6
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import api from '../components/api';

const { Title } = Typography;

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f0f2f5',
};

const cardStyle = {
    width: 400,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#ffffff'
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
};

const PasswordResetConfirmPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { uidb64, token } = useParams();
    const navigate = useNavigate(); // or useNavigate() in React Router v6

    const handlePasswordResetConfirm = async () => {
        if (password !== confirmPassword) {
            message.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await api.post(`${baseUrl}/api/reset/${uidb64}/${token}/`, {
                'new_password1': password,
                'new_password2': confirmPassword
            });

            if (response.status === 200) {
                message.success('Password reset successful.');
                navigate('/login'); // Redirect to login page
            } else {
                message.error('Invalid token or link expired.');
            }
        } catch (error) {
            message.error('Error resetting password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={2} style={titleStyle}>Set New Password</Title>
                    <Form
                        name="password_reset_confirm"
                        onFinish={handlePasswordResetConfirm}
                    >
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            rules={[{ required: true, message: 'Please confirm your new password!' }]}
                        >
                            <Input.Password
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default PasswordResetConfirmPage;
