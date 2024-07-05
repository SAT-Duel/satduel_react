import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Card, Form, Input, Button, message } from "antd";

function Profile({ user_id = null }) {
    const [profile, setProfile] = useState({
        user: {
            username: '',
            email: '',
        },
        biography: '',
        grade: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const { token, loading } = useAuth();
    const isOwnProfile = user_id === null;

    const fetchProfile = async () => {
        try {
            const url = isOwnProfile ? 'http://localhost:8000/api/profile/' : `http://localhost:8000/api/profile/view_profile/${user_id}/`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
            setLoadingProfile(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            message.error('Failed to load profile');
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        if(!loading) fetchProfile();
    }, [user_id, token, loading]);

    const onFinish = async (values) => {
        if (!isOwnProfile) return;
        try {
            const response = await axios.patch('http://localhost:8000/api/profile/update_biography/', values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
            message.success('Biography updated successfully');
        } catch (error) {
            console.error('Error updating biography:', error);
            message.error('Failed to update biography');
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axios.post('http://localhost:8000/api/profile/send_friend_request/',
                { to_user_id: user_id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            message.success('Friend request sent.');
        } catch (error) {
            console.error('Error sending friend request:', error);
            message.error('Failed to send friend request.');
        }
    };

    return (
        <div>
            <Card
                title={isOwnProfile ? "My Profile" : `${profile.user?.username}'s Profile`}
                loading={loadingProfile}
                extra={!isOwnProfile && <Button type="primary" onClick={sendFriendRequest}>Add Friend</Button>}
            >
                <p><strong>Username:</strong> {profile.user?.username}</p>
                <p><strong>Email:</strong> {profile.user?.email}</p>
                <p><strong>Biography:</strong></p>
                <p className="paragraph">{profile.biography}</p>
                <p><strong>Grade:</strong> {profile.grade}</p>
            </Card>
            {isOwnProfile && (
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
            )}
        </div>
    );
}

export default Profile;