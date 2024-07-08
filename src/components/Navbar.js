import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import {Menu} from 'antd';
import {
    TeamOutlined,
    LoginOutlined,
    UserOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import {Row, Col} from 'antd';
import SearchUser from "./SearchUser";
import styled from "styled-components";

// const Logo = styled(Link)`
//     font-size: 24px;
//     font-weight: bold;
//     color: #1890ff;
//     margin-right: 24px;
//     white-space: nowrap; /* Prevent text from wrapping */
// `;

function Navbar() {
    const {user, logout, loading} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [userItem, setUserItem] = useState([]);
    const userItems = [
        {
            label: 'Hello ' + username + '!',
            key: 'User',
            icon: <UserOutlined/>,
            children: [
                {
                    label: 'Profile',
                    key: 'Profile',
                    onClick: () => navigate('/profile'),
                },
                {
                    label: 'Friend Requests',
                    key: 'FriendRequests',
                    onClick: () => navigate('/friend_requests'),
                },
                {
                    label: 'Logout',
                    key: 'Logout',
                    onClick: () => handleLogout(),
                },
            ],
        },
    ]
    const anonymousItems = [
        {
            label: 'Login',
            key: 'Login',
            icon: <LoginOutlined/>,
            onClick: () => navigate('/login'),
        },
        {
            label: 'Signup',
            key: 'Signup',
            icon: <UserAddOutlined/>,
            onClick: () => navigate('/register'),
        },
    ]
    const items = [
        {
            label: 'Home',
            key: 'Home',
            icon: <HomeOutlined/>,
            onClick: () => navigate('/'),
        },
        {
            label: 'About',
            key: 'About',
            icon: <InfoCircleOutlined/>,
            onClick: () => navigate('/about'),
        },
        {
            label: 'Practice Questions',
            key: 'Questions',
            icon: <QuestionCircleOutlined/>,
            onClick: () => navigate('/questions'),
        },
        {
            label: 'Match',
            key: 'Match',
            icon: <TeamOutlined/>,
            onClick: () => navigate('/match'),
        },
    ];
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!loading && user) {
            setUsername(user.username);
        }
    }, [loading, user]);

    return (
        <div className="navbar" style={{width: '100%'}}>
            <Row justify="space-between" align="middle">
                <Col offset="1" span="11">
                    <Menu mode="horizontal" items={items}/>
                </Col>
                <Col offset="3" span="5">
                    <SearchUser/>
                </Col>
                <Col span="4">
                    <Menu mode="horizontal" className="user-menu" items={user ? userItems : anonymousItems}/>
                </Col>
            </Row>
        </div>

    );
}

export default Navbar;