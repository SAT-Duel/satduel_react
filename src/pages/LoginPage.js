import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Form, Input, Button, Card, Typography, Space } from 'antd';

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

const errorStyle = {
    color: 'red',
    textAlign: 'center',
};

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, loading, user } = useAuth();
    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, navigate, loading]);
    const handleLogin = async () => {
        let userData = null;
        try {
            const response = await axios.post('/api/login/', {
                username,
                password
            });
            if (response.status === 200) {
                userData = response.data;
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred during login');
            }
            return;
        }
        try {
            const response = await axios.post('/api/token/', {
                username,
                password
            });
            const refreshToken = response.data.refresh;
            if (response.status === 200) {
                handleLoginSuccess(userData, response.data.access, refreshToken);
                console.log("login successful");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred during login');
            }
        }
    };

    const handleLoginSuccess = (userData, userToken, refreshToken) => {
        login(userData, userToken, refreshToken);
        navigate('/');
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={2} style={titleStyle}>Login</Title>
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        {error && <p style={errorStyle}>{error}</p>}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}

export default Login;
