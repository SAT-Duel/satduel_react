import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";
import {Card, Form, Input, Button, message, Row, Col, Statistic} from "antd";
import { UserOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';

const gradientStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
};

const cardStyle = {
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
};
const whiteTextStyle = {
    color: 'white'
};

const iconStyle = {
    fontSize: '24px',
    background: '#fff',
    borderRadius: '50%',
    padding: '8px',
    marginRight: '8px'
};

function Profile({user_id = null}) {
    const [profile, setProfile] = useState({
        user: {
            username: '',
            email: '',
        },
        biography: '',
        grade: '',
        max_streak: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const {token, loading} = useAuth();
    const isOwnProfile = user_id === null;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token){
                return;
            }
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const url = isOwnProfile ? `${baseUrl}/api/profile/` : `${baseUrl}/api/profile/view_profile/${user_id}/`;
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const condensedBiography = response.data.biography.replace(/\n+/g, '\n');
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...response.data,
                    biography: condensedBiography
                }));

                setLoadingProfile(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                message.error('Failed to load profile');
                setLoadingProfile(false);
            }
        };
        if (!loading) fetchProfile();
    }, [user_id, token, loading, isOwnProfile]);

    const onFinish = async (values) => {
        if (!isOwnProfile) return;
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.patch(`${baseUrl}/api/profile/update_biography/`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const condensedBiography = response.data.biography.replace(/\n+/g, '\n');
            setProfile(prevProfile => ({
                ...prevProfile,
                biography: condensedBiography
            }));

            message.success('Biography updated successfully');
        } catch (error) {
            console.error('Error updating biography:', error);
            message.error('Failed to update biography');
        }
    };

    const sendFriendRequest = async () => {
        if(!token){
            message.error('You must be logged in to send friend requests');
            return;
        }
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/profile/send_friend_request/`,
                {to_user_id: user_id},
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
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <Card
                title={<span style={whiteTextStyle}>{isOwnProfile ? "My Profile" : `${profile.user?.username}'s Profile`}</span>}
                loading={loadingProfile}
                extra={!isOwnProfile && (
                    <Button
                        type="primary"
                        onClick={sendFriendRequest}
                        style={{...gradientStyle, border: 'none'}}
                    >
                        Add Friend
                    </Button>
                )}
                style={{...cardStyle, ...gradientStyle}}
                headStyle={{...gradientStyle, borderBottom: 'none'}}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={<span style={whiteTextStyle}>Username</span>}
                            value={profile.user?.username}
                            prefix={<UserOutlined style={{...iconStyle, color: '#1890ff'}} />}
                            valueStyle={whiteTextStyle}
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={<span style={whiteTextStyle}>Grade</span>}
                            value={profile.grade}
                            prefix={<TrophyOutlined style={{...iconStyle, color: '#FFA500'}} />}
                            valueStyle={whiteTextStyle}
                        />
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '20px'}}>
                    <Col span={12}>
                        <Statistic
                            title={<span style={whiteTextStyle}>Max Win-Streak</span>}
                            value={profile.max_streak}
                            prefix={<FireOutlined style={{...iconStyle, color: '#ff4d4f'}} />}
                            valueStyle={whiteTextStyle}
                        />
                    </Col>
                </Row>
            </Card>

            <Card title="Biography" style={cardStyle}>
                <p>{profile.biography}</p>
            </Card>

            {isOwnProfile && (
                <Card title="Edit Biography" style={cardStyle}>
                    <Form
                        name="biography"
                        initialValues={{biography: profile.biography}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="biography"
                            rules={[
                                {required: true, message: 'Please enter your biography'},
                                {max: 5000, message: 'Biography cannot be longer than 5000 characters'}
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                maxLength={5000}
                                autoSize={{minRows: 4, maxRows: 10}}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{...gradientStyle, border: 'none'}}
                            >
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