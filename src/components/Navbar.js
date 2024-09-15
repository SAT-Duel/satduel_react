import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import {
    TeamOutlined,
    LoginOutlined,
    UserOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
    UserAddOutlined,
    MenuOutlined, FireOutlined,RiseOutlined,
    ShoppingCartOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import SearchUser from "./SearchUser";
import styled from "styled-components";

const StyledNavbar = styled.div`
     
  .ant-row {
    width: 100%;
  }

  @media (max-width: 1100px) {
    .desktop-menu {
      display: none;
    }
    .mobile-menu {
      display: block;
    }
  }

  @media (min-width: 1100px) {
    .desktop-menu {
      display: block;
    }
    .mobile-menu {
      display: none;
    }
  }
`;

function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [visible, setVisible] = useState(false);

    const userItems = [
        {
            label: 'Hello ' + username + '!',
            key: 'User',
            icon: <UserOutlined />,
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
    ];

    const anonymousItems = [
        {
            label: 'Login',
            key: 'Login',
            icon: <LoginOutlined />,
            onClick: () => navigate('/login'),
        },
        {
            label: 'Signup',
            key: 'Signup',
            icon: <UserAddOutlined />,
            onClick: () => navigate('/register'),
        },
    ];

    const items = [
        {
            label: 'Home',
            key: 'Home',
            icon: <HomeOutlined />,
            onClick: () => navigate('/'),
        },
        {
            label: 'About',
            key: 'About',
            icon: <InfoCircleOutlined />,
            onClick: () => navigate('/about'),
        },
        {
            label: 'SAT Trainer',
            key: 'Trainer',
            icon: <QuestionCircleOutlined />,
            onClick: () => navigate('/trainer'),
        },
        {
            label: 'Match',
            key: 'Match',
            icon: <TeamOutlined />,
            onClick: () => navigate('/match'),
        },
        {
            label: 'College Town',
            key: 'Town',
            icon: <EnvironmentOutlined />,
            onClick: () => navigate('/town'),
        },
        {
            label: "Tournament",
            key: 'Tournament',
            icon: <FireOutlined/>,
            onClick: () => navigate('/tournament'),
        },
        // {
        //     label: "Ranking",
        //     key: 'Ranking',
        //     icon: <RiseOutlined />,
        //     onClick: () => navigate('/ranking'),
        // }
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

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <StyledNavbar>
            <div className="navbar" style={{ width: '100%' }}>
                <Row justify="space-between" align="middle">
                    <Col xs={20} sm={20} md={11} lg={11} xl={11} offset={1} className="desktop-menu">
                        <Menu mode="horizontal" items={items} />
                    </Col>
                    <Col xs={2} sm={2} md={0} lg={0} xl={0} className="mobile-menu">
                        <Button type="primary" onClick={showDrawer}>
                            <MenuOutlined />
                        </Button>
                    </Col>
                    <Col xs={0} sm={0} md={5} lg={5} xl={5} offset={3}>
                        <SearchUser />
                    </Col>
                    <Col xs={0} sm={0} md={4} lg={4} xl={4}>
                        <Menu mode="horizontal" className="user-menu" items={user ? userItems : anonymousItems} />
                    </Col>
                </Row>
            </div>

            <Drawer
                title="Menu"
                placement="left"
                onClose={onClose}
                visible={visible}
            >
                <Menu mode="vertical" items={items.concat(user ? userItems : anonymousItems)} />
                <div style={{ marginTop: '20px' }}>
                    <SearchUser />
                </div>
            </Drawer>
        </StyledNavbar>
    );
}

export default Navbar;