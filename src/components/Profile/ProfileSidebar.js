import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Button, Avatar, Typography, Modal, Form, Input, message, Skeleton, Select} from 'antd';
import {EditOutlined, UserOutlined} from '@ant-design/icons';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import api from '../api';

const {Title, Text} = Typography;
const {Option} = Select;

const SidebarContainer = styled.div`
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
`;

const ProfileHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
    position: relative;
`;

const Biography = styled.div`
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #495057;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 20px 0;
    white-space: pre-wrap;
`;

const EditButton = styled(Button)`
    width: 100%;
    margin-top: 16px;
`;

const ProfileSidebar = () => {
    const {userId} = useParams();
    const {user: currentUser, token} = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        user: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
        },
        biography: '',
        grade: '',
        country: 'US',
    });
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const isOwnProfile = !userId || currentUser?.id.toString() === userId;

    const gradeOptions = [
        {value: '<1', label: 'Below Grade 1'},
        ...Array.from({length: 12}, (_, i) => ({
            value: String(i + 1),
            label: `Grade ${i + 1}`
        })),
        {value: '>12', label: 'Above Grade 12'}
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let profile;

                if (isOwnProfile) {
                    const profileResponse = await api.get(`api/profile/`);
                    profile = profileResponse.data

                } else {
                    const profileResponse = await api.get(`api/profile/view_profile/${userId}/`);
                    profile = profileResponse.data.profile
                }

                const condensedBiography = profile.biography?.replace(/\n+/g, '\n') || '';
                setProfile({
                    ...profile,
                    biography: condensedBiography
                });

                form.setFieldsValue({biography: condensedBiography});
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                message.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [userId, token, form, isOwnProfile]);

    const handleEdit = async (values) => {
        try {
            // Structure the data correctly for nested user update
            const updateData = {
                biography: values.biography,
                grade: values.grade,
                country: values.country,
                user: {
                    first_name: values.first_name,
                    last_name: values.last_name
                }
            };

            const response = await api.patch(`api/profile/`, updateData);
            
            setProfile(prev => ({
                ...prev,
                ...response.data,
                user: {
                    ...prev.user,
                    ...response.data.user
                }
            }));
            
            setIsEditing(false);
            message.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            message.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <SidebarContainer>
                <Skeleton avatar paragraph={{rows: 4}} active/>
            </SidebarContainer>
        );
    }

    return (
        <SidebarContainer>
            <ProfileHeader>
                <Avatar
                    size={128}
                    src={profile?.avatar}
                    icon={!profile?.avatar && <UserOutlined/>}
                    style={{
                        border: '3px solid #fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Title level={2} style={{margin: '24px 0 8px', color: '#212529'}}>
                    {profile?.user.username}
                </Title>
                <Text type="secondary" style={{fontSize: '0.9rem'}}>
                    {profile?.user.first_name} {profile?.user.last_name}
                </Text>

                <div style={{marginBottom: 24}}>
                    <Text strong style={{color: '#4a4a4a', fontSize: '0.95rem'}}>
                        {gradeOptions.find(g => g.value === profile?.grade)?.label || 'No grade specified'}
                    </Text>
                </div>
            </ProfileHeader>

            <Biography>
                {profile?.biography || 'This user hasn\'t written a biography yet.'}
            </Biography>

            {isOwnProfile && (
                <EditButton
                    icon={<EditOutlined/>}
                    onClick={() => setIsEditing(true)}
                    type="primary"
                    style={{background: '#6366f1', borderColor: '#6366f1'}}
                >
                    Edit Profile
                </EditButton>
            )}

            <Modal
                title="Edit Profile"
                open={isEditing}
                onCancel={() => setIsEditing(false)}
                onOk={() => form.submit()}
                okText="Save Changes"
            >
                <Form
                    form={form}
                    onFinish={handleEdit}
                    layout="vertical"
                    initialValues={{
                        biography: profile?.biography,
                        grade: profile?.grade,
                        first_name: profile?.user.first_name,
                        last_name: profile?.user.last_name
                    }}
                >
                    <Form.Item name="first_name" label="First Name">
                        <Input placeholder="First name"/>
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name">
                        <Input placeholder="Last name"/>
                    </Form.Item>
                    <Form.Item
                        name="biography"
                        label="Biography"
                        rules={[{max: 500, message: 'Biography cannot exceed 500 characters'}]}
                    >
                        <Input.TextArea rows={4} placeholder="Tell us about yourself..."/>
                    </Form.Item>
                    <Form.Item name="grade" label="Grade">
                        <Select placeholder="Select your grade">
                            {gradeOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </SidebarContainer>
    );
};

export default ProfileSidebar; 