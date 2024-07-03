import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";
import {Card, Form, Input, Button} from "antd";

function Profile() {
    const [profile, setProfile] = useState({
        user: {
            username: '',
            email: '',
        },
        biography: '',
        grade: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const {token, loading} = useAuth(); // Get the token from the AuthContext
    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                }
            });
            setProfile(response.data);
            setLoadingProfile(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setLoadingProfile(false);
        }

    };
    useEffect(() => {
        if (!loading) {
            fetchProfile();
        }
    }, [loading]);

    const onFinish = async (values) => {
        try {
            const response = await axios.patch('http://localhost:8000/api/profile/update_biography/', values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error updating biography:', error);
        }
    };

    return (
        <div>
            <Card title="Profile" loading={loadingProfile}>
                <p><strong>Username:</strong> {profile.user?.username}</p>
                <p><strong>Email:</strong> {profile.user?.email}</p>
                <p><strong>Biography:</strong></p>
                <p className="paragraph">{profile.biography}</p>
                <p><strong>Grade:</strong> {profile.grade}</p>
            </Card>
            <Card title="Edit Biography">
                <Form
                    name="biography"
                    initialValues={{biography: profile.biography}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="biography"
                        label="Biography"
                        rules={[{required: true, message: 'Please enter your biography'}]}
                    >
                        <Input.TextArea rows={4} defaultValue={profile.biography}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Biography
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Profile;
