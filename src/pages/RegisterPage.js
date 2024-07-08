import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {Form, Input, Button, Card, Typography, Space, Select} from 'antd';

const {Title} = Typography;
const {Option} = Select;

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        grade: ''
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const {login} = useAuth();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (values) => {
        let userData = null;
        try {
            const response = await axios.post('/api/register/', values);
            userData = response.data;
        } catch (error) {
            alert(error.response ? error.response.data.error : "Registration failed");
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
            login(userData, response.data.access);
            alert("Registration successful");
            navigate('/');
        } catch (error) {
            alert(error.response ? error.response.data.error : "Registration failed");
            if (error.response && error.response.status === 401) {
                setError(error.response.data.error);
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5'
        }}>
            <Card style={{width: 400}}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Title level={2} style={{textAlign: 'center'}}>Register</Title>
                    <Form
                        name="register"
                        initialValues={formData}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your username!'}]}
                        >
                            <Input placeholder="Username" onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <Input type="email" placeholder="Email" onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item
                            name="first_name"
                            rules={[{required: true, message: 'Please input your first name!'}]}
                        >
                            <Input placeholder="First Name" onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            rules={[{required: true, message: 'Please input your last name!'}]}
                        >
                            <Input placeholder="Last Name" onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password placeholder="Password" onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item
                            name="grade"
                            label="Select Grade"
                            rules={[{required: true, message: 'Please select your grade!'}]}
                        >
                            <Select placeholder="Select Grade" onChange={(value) => setFormData({ ...formData, grade: value })}>
                                {[...Array(12)].map((_, i) => (
                                    <Option key={i} value={i + 1}>{i + 1}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
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
