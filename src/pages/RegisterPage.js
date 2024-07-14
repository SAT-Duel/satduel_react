import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Card, Typography, Space, Select, message } from 'antd';

const { Title } = Typography;
const { Option } = Select;

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

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        grade: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const { login, loading, user } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, navigate, loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (values) => {
        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(values.password)) {
            setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number");
            return;
        }

        let userData = null;
        try {
            const response = await axios.post('/api/register/', values);
            userData = response.data;
            message.success("Registration successful");
        } catch (error) {
            message.error(error.response ? error.response.data.error : "Registration failed");
            if (error.response && error.response.status === 401) {
                setError(error.response.data.error);
            }
            return;
        }
        try {
            const response = await axios.post('/api/token/', {
                username: values.username,
                password: values.password
            });
            login(userData, response.data.access, response.data.refresh);
            navigate('/');
        } catch (error) {
            message.error(error.response ? error.response.data.error : "Login failed");
            if (error.response && error.response.status === 401) {
                setError(error.response.data.error);
            }
        }
    };

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={2} style={titleStyle}>Register</Title>
                    <Form
                        name="register"
                        initialValues={formData}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: 'Please input your username!' },
                                { max: 10, message: 'Username cannot be longer than 10 characters!' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only include letters, numbers, and underscores, with no spaces.' }
                            ]}
                        >
                            <Input placeholder="Username" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}                        >
                            <Input type="email" placeholder="Email" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="first_name"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                        >
                            <Input placeholder="First Name" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                        >
                            <Input placeholder="Last Name" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number'
                                }
                            ]}
                        >
                            <Input.Password placeholder="Password" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please confirm your password!' }]}
                        >
                            <Input.Password placeholder="Confirm Password" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            name="grade"
                            label="Select Grade"
                            rules={[{ required: true, message: 'Please select your grade!' }]}
                        >
                            <Select placeholder="Select Grade" onChange={(value) => setFormData({ ...formData, grade: value })}>
                                {[...Array(12)].map((_, i) => (
                                    <Option key={i} value={i + 1}>{i + 1}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {error && <p style={errorStyle}>{error}</p>}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
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
