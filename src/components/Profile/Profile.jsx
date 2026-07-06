import React, {useEffect, useState} from 'react';
import {useAuth} from "../../context/AuthContext";
import {Card, Form, Button, message, Row, Col, Statistic} from "antd";
import {
    RiseOutlined,
    CheckCircleOutlined,
    FireOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import api from "../api";

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
        max_streak: '',
        elo_rating: '', // Duel Elo
        sp_elo_rating: '', // Singleplayer Elo
    });
    const [statistics, setStatistics] = useState({
        correct_number: 0,
        incorrect_number: 0,
        current_streak: 0,
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [form] = Form.useForm();
    const {loading, user} = useAuth();
    const navigate = useNavigate();
    const isOwnProfile = user_id === null;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (isOwnProfile) {
                    const response = await api.get(`api/profile/`);
                    const condensedBiography = response.data.biography.replace(/\n+/g, '\n');
                    setProfile(prevProfile => ({
                        ...prevProfile,
                        ...response.data,
                        biography: condensedBiography
                    }));
                    // Fetch Infinite Questions Statistics
                    const infiniteStatsResponse = await api.get(`api/infinite_questions_profile/`);

                    setStatistics(infiniteStatsResponse.data);

                    setLoadingProfile(false);

                    // Set form fields after data is fetched
                    form.setFieldsValue({biography: condensedBiography});
                } else {
                    const response = await api.get(`api/profile/view_profile/${user_id}/`);
                    const profile = response.data.profile;
                    const statistic = response.data.statistics;
                    const condensedBiography = profile.biography.replace(/\n+/g, '\n');
                    setProfile(prevProfile => ({
                        ...prevProfile,
                        ...profile,
                        biography: condensedBiography
                    }));

                    setStatistics(statistic);

                    setLoadingProfile(false);
                    form.setFieldsValue({biography: condensedBiography});
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                message.error('Failed to load profile');
                setLoadingProfile(false);
            }
        };
        if (!loading) fetchProfile();
    }, [user_id, loading, isOwnProfile, form]);

    const sendFriendRequest = async () => {
        if (!user) {
            message.error('You must be logged in to send friend requests');
            return;
        }
        try {
            await api.post(`api/profile/send_friend_request/`,
                {to_user_id: user_id}
            );
            message.success('Friend request sent.');
        } catch (error) {
            console.error('Error sending friend request:', error);
            message.error('Failed to send friend request.');
        }
    };

    const navigateToAdminPage = () => {
        navigate('/admin');
    };
    const totalAnswered = (statistics?.correct_number || 0) + (statistics?.incorrect_number || 0);
    const accuracy = totalAnswered ? `${Math.round((statistics.correct_number / totalAnswered) * 100)}%` : '—';

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <Card
                title={<span style={whiteTextStyle}>Elo Ratings</span>}
                loading={loadingProfile}
                style={{...cardStyle, ...gradientStyle}}
                headStyle={{...gradientStyle, borderBottom: 'none'}}
                extra={!isOwnProfile && (
                    <Button
                        type="primary"
                        onClick={sendFriendRequest}
                        style={{...gradientStyle, border: 'none'}}
                    >
                        Add Friend
                    </Button>
                )}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={<span style={whiteTextStyle}>Duel Elo</span>}
                            value={profile.elo_rating}
                            prefix={<RiseOutlined style={{...iconStyle, color: '#ff4d4f'}}/>}
                            valueStyle={whiteTextStyle}
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={<span style={whiteTextStyle}>Singleplayer Elo</span>}
                            value={profile.sp_elo_rating}
                            prefix={<RiseOutlined style={{...iconStyle, color: '#FFA500'}}/>}
                            valueStyle={whiteTextStyle}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Infinite Questions Statistics Card */}
            {statistics && (
                <Card
                    title={<span
                        style={whiteTextStyle}>{isOwnProfile ? "My Stats" : `${profile.user?.username}'s Stats`}</span>}
                    loading={loadingProfile}
                    style={{...cardStyle, ...gradientStyle}}
                    headStyle={{...gradientStyle, borderBottom: 'none'}}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title={<span style={whiteTextStyle}>Answered</span>}
                                value={totalAnswered}
                                prefix={<CheckCircleOutlined style={{...iconStyle, color: '#10b981'}}/>}
                                valueStyle={whiteTextStyle}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title={<span style={whiteTextStyle}>Correct</span>}
                                value={statistics.correct_number}
                                prefix={<CheckCircleOutlined style={{...iconStyle, color: '#10b981'}}/>}
                                valueStyle={whiteTextStyle}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16} style={{marginTop: '20px'}}>
                        <Col span={12}>
                            <Statistic
                                title={<span style={whiteTextStyle}>Current Streak</span>}
                                value={statistics.current_streak}
                                prefix={<FireOutlined style={{...iconStyle, color: '#f97316'}}/>}
                                valueStyle={whiteTextStyle}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title={<span style={whiteTextStyle}>Accuracy</span>}
                                value={accuracy}
                                prefix={<RiseOutlined style={{...iconStyle, color: '#FFA500'}}/>}
                                valueStyle={whiteTextStyle}
                            />
                        </Col>
                    </Row>
                </Card>
            )}

            {user?.is_admin && isOwnProfile && (
                <Button
                    type="primary"
                    style={{
                        ...gradientStyle,
                        width: '100%',
                        marginTop: '20px',
                        border: 'none'
                    }}
                    onClick={navigateToAdminPage}
                >
                    Admin Page
                </Button>
            )}
        </div>
    );
}

export default Profile;
