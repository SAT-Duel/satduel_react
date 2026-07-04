import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {Form, Input, Button, Card, Typography, Space, Divider, message} from 'antd';
import GoogleLoginButton from "../components/GoogleLogin";

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

const errorStyle = {
    color: 'red',
    textAlign: 'center',
};

const textStyle = {
    color: 'gray',
    textAlign: 'center',
}

const formItem = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {login, loading, user} = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, navigate, loading]);

    const handleLogin = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // Single request: authenticate and receive tokens + user together.
            const response = await axios.post(`${baseUrl}/api/auth/login/`, {
                username,
                password,
                timezone: userTimezone
            });
            const {access, refresh, user: userData} = response.data;
            await login(userData, access, refresh);
            if (userData.is_first_login) {
                navigate('/goal_setting');
            } else {
                navigate('/');
            }
        } catch (error) {
            const msg = error.response?.data?.error;
            if (error.response && error.response.status === 401) {
                setError(msg || 'Invalid username or password');
                message.error(msg || 'Invalid username or password');
            } else {
                setError('An error occurred during login');
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Title level={2} style={titleStyle}>Login</Title>
                    <Form
                        name="login"
                        initialValues={{remember: true}}
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your username/email!'}]}
                        >
                            <Input
                                placeholder="Username or Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        {error && <p style={errorStyle}>{error}</p>}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{width: '100%'}}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Login
                            </Button>
                        </Form.Item>

                        <Divider plain style={{color: 'gray'}}>or</Divider>
                        <div style={{marginBottom: '10px'}}>
                            <GoogleLoginButton/>
                        </div>

                        <Form.Item>
                            <div style={formItem}>
                                <span style={textStyle}>Forgot your password? </span><Link to="/password_reset">Reset
                                Password</Link>
                            </div>
                            <div style={formItem}>
                                <span style={textStyle}>New user? </span><Link to="/register">Create an account!</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}

export default Login;
