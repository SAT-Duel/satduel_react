import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";
import {Card, Form, Input, Button, message} from "antd";
import {blue} from '@ant-design/colors';

const blueStyles = {
    card: {
        backgroundColor: blue[0],
        border: `1px solid ${blue[3]}`
    },
    cardHeader: {
        backgroundColor: blue[3],
        color: 'white'
    },
    buttonPrimary: {
        backgroundColor: blue[5],
        borderColor: blue[5]
    },
    buttonPrimaryHover: {
        backgroundColor: blue[7],
        borderColor: blue[7]
    },
    text: {
        color: blue[7]
    },
    formItemLabel: {
        color: blue[7]
    }
};

function Profile({user_id = null}) {
    const [profile, setProfile] = useState({
        user: {
            username: '',
            email: '',
        },
        biography: '',
        grade: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const {token, loading} = useAuth();
    const isOwnProfile = user_id === null;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = isOwnProfile ? '/api/profile/' : `/api/profile/view_profile/${user_id}/`;
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Condense multiple newlines into a single newline
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
            const response = await axios.patch('/api/profile/update_biography/', values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Condense multiple newlines into a single newline
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
        try {
            await axios.post('/api/profile/send_friend_request/',
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
        <div>
            <Card
                title={isOwnProfile ? "My Profile" : `${profile.user?.username}'s Profile`}
                loading={loadingProfile}
                extra={!isOwnProfile && (
                    <Button
                        type="primary"
                        onClick={sendFriendRequest}
                        style={blueStyles.buttonPrimary}
                        onMouseOver={(e) => e.currentTarget.style = blueStyles.buttonPrimaryHover}
                        onMouseOut={(e) => e.currentTarget.style = blueStyles.buttonPrimary}
                    >
                        Add Friend
                    </Button>
                )}
                style={blueStyles.card}
                headStyle={blueStyles.cardHeader}
            >
                <p style={blueStyles.text}><strong>Username:</strong> {profile.user?.username}</p>
                <p style={blueStyles.text}><strong>Email:</strong> {profile.user?.email}</p>
                <p style={blueStyles.text}><strong>Biography:</strong></p>
                <p className="paragraph" style={blueStyles.text}>{profile.biography}</p>
                <p style={blueStyles.text}><strong>Grade:</strong> {profile.grade}</p>
            </Card>
            {isOwnProfile && (
                <Card title="Edit Biography" style={blueStyles.card} headStyle={blueStyles.cardHeader}>
                    <Form
                        name="biography"
                        initialValues={{biography: profile.biography}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="biography"
                            label="Biography"
                            rules={[
                                {required: true, message: 'Please enter your biography'},
                                {max: 5000, message: 'Biography cannot be longer than 5000 characters'}
                            ]}
                            labelCol={{style: blueStyles.formItemLabel}}
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
                                style={blueStyles.buttonPrimary}
                                onMouseOver={(e) => e.currentTarget.style = blueStyles.buttonPrimaryHover}
                                onMouseOut={(e) => e.currentTarget.style = blueStyles.buttonPrimary}
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
