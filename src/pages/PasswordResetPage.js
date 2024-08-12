import React, {useState} from 'react';
import {Form, Input, Button, Card, Typography, Space, message} from 'antd';
import api from '../components/api';

const {Title} = Typography;

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

const PasswordResetPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //
    //     console.log(getCSRFToken())
    // })

    const handlePasswordResetRequest = async () => {
        setLoading(true);
        const getCSRFToken = () => {
            const name = 'csrftoken';
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        return decodeURIComponent(cookie.substring(name.length + 1));
                    }
                }
            }
            return null;
        }
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await api.post(`${baseUrl}/api/password_reset/`, {email},
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(), // Include the CSRF token in the headers
                    },
                }
            );
            if (response.status === 200) {
                message.success('Password reset link sent to your email.');
            }
        } catch (error) {
            message.error('Error sending password reset link. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Title level={2} style={titleStyle}>Password Reset</Title>
                    <Form
                        name="password_reset_request"
                        onFinish={handlePasswordResetRequest}
                    >
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%'}}>
                                Send Password Reset Link
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default PasswordResetPage;
