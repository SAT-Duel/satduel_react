import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {Form, Input, Button, Card, Typography, Space, Select, message} from 'antd';
import api from '../components/api';

const {Title} = Typography;
const {Option} = Select;

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
    backgroundColor: '#ffffff',
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
};

const errorStyle = {
    color: 'red',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
};

function Register() {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {loading, user} = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, navigate, loading]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        // Google Analytics event tracking
        if (window.gtag) {
            window.gtag('event', 'sign_up', {
                event_category: 'User Interaction',
                event_label: 'sign_up',
                value: 1,
            });
            console.log("triggered");
        }

        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        const payload = {
            username: values.username,
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            password1: values.password,
            password2: values.confirmPassword,
            grade: values.grade,
        };

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await api.post(`${baseUrl}/api/register/`, payload);
            message.success('Registration successful');
            navigate(`/email_verification/${values.email}`);
        } catch (error) {
            const errors = error.response?.data || {error: 'An error occurred'};
            const errorList = Object.values(errors).flat();
            errorList.forEach((error) => message.error(error));
            setIsSubmitting(false);
        }
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Title level={2} style={titleStyle}>Register</Title>
                    <Form name="register" onFinish={handleSubmit} netlify>
                        <Form.Item
                            name="username"
                            rules={[
                                {required: true, message: 'Please input your username!'},
                                {max: 15, message: 'Username cannot be longer than 15 characters!'},
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Username can only include letters, numbers, and underscores.'
                                },
                            ]}
                        >
                            <Input placeholder="Username"/>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <Input type="email" placeholder="Email"/>
                        </Form.Item>

                        <Form.Item
                            name="first_name"
                            rules={[
                                {required: true, message: 'Please input your first name!'},
                                {
                                    pattern: /^[a-zA-Z0-9\s]+$/, // Allow only English letters and spaces
                                    message: 'Only English letters are allowed for first names. Sorry for the inconvenience.',
                                },
                            ]}
                        >
                            <Input placeholder="First Name"/>
                        </Form.Item>

                        <Form.Item
                            name="last_name"
                            rules={[
                                {required: true, message: 'Please input your last name!'},
                                {
                                    pattern: /^[a-zA-Z0-9\s]+$/, // Allow only English letters and spaces
                                    message: 'Only English letters are allowed for last names. Sorry for the inconvenience.',
                                },
                            ]}
                        >
                            <Input placeholder="Last Name"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {required: true, message: 'Please input your password!'},
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password"/>
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {required: true, message: 'Please confirm your password!'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password"/>
                        </Form.Item>

                        <Form.Item
                            name="grade"
                            label="Select Grade"
                            rules={[{required: true, message: 'Please select your grade!'}]}
                        >
                            <Select placeholder="Select Grade">
                                <Option value="<1">{'<1'}</Option>
                                {[...Array(12)].map((_, i) => (
                                    <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                                ))}
                                <Option value=">12">{'>12'}</Option>
                            </Select>
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
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}

export default Register;
