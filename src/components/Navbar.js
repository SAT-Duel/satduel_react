import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import logo from '../assets/logo192.png';
import {
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  MenuOutlined,
  FireOutlined, CopyOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const StyledNavbar = styled.nav`
  .navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background: white;
    padding: 0 24px;
  }

  .navbar-container {
    max-width: 1500px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 64px;
  }

  .logo-section {
    display: flex;
    align-items: center;
    flex-shrink: 0; /* Prevent logo from shrinking */
    cursor: pointer;
  }

  .logo-image {
    height: 40px;
    width: 40px;
    margin-right: 8px;
  }

  .brand-name {
    font-family: 'Courier New', monospace;
    font-weight: bold;
    font-size: 1.25rem;
    background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nav-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    min-width: 400px; /* Ensure enough space for nav items */
    gap: 30px; /* Add spacing between nav items */
  }

  .nav-menu {
    display: flex;
    justify-content: flex-end; /* Equal spacing between items */
    align-items: center;
    flex: 1;
  }

  .user-menu {
    display: flex;
    justify-content: flex-end;

    margin-left: 24px;
    min-width: 200px; /* Ensure enough space for user items */
  }

  .mobile-menu {
    display: none;
  }

  @media (max-width: 768px) {
    .nav-section {
      display: none;
    }

    .mobile-menu {
      display: block;
    }
  }
`;

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [visible, setVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!loading && user) {
      setUsername(user.username);
    }
  }, [loading, user]);

  const userItems = [
    {
      label: `Hello ${username}!`,
      key: 'User',
      icon: <UserOutlined />,
      children: [
        {
          label: 'Profile',
          key: 'Profile',
          onClick: () => navigate('/profile'),
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

  const navItems = [
    {
      label: 'SAT Trainer',
      key: 'Trainer',
      icon: <QuestionCircleOutlined />,
      onClick: () => navigate('/trainer'),
    },
    {
      label: 'SAT Duel',
      key: 'Duel',
      icon: <TeamOutlined />,
      onClick: () => navigate('/match'),
    },
    {
      label: 'Tournament',
      key: 'Tournament',
      icon: <FireOutlined />,
      onClick: () => navigate('/tournaments'),
    },
      {
      label: 'Practice Test',
      key: 'Practice Test',
      icon: <CopyOutlined />,
      onClick: () => navigate('/practice_test'),
    },
  ];

  return (
    <StyledNavbar>
      <div className="navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="logo-section" onClick={() => navigate('/')}>
            <img src={logo} alt="SAT Duel Logo" className="logo-image" />
            <span className="brand-name">SAT Duel</span>
          </div>

          {/* Navigation Section */}
          <div className="nav-section">
            <Menu mode="horizontal" items={navItems} className="nav-menu" />
            <Menu mode="horizontal" items={user ? userItems : anonymousItems} className="user-menu" />
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setVisible(true)} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="logo-section">
            <img
              src={logo}
              alt="SAT Duel Logo"
              className="logo-image"
              style={{ height: '32px', width: '32px' }}
            />
            <span className="brand-name">SAT Duel</span>
          </div>
        }
        placement="left"
        onClose={() => setVisible(false)}
        open={visible}
        width={280}
        style={{ maxWidth: '80vw' }}
      >
        <Menu
          mode="inline"
          items={[...navItems, ...(user ? userItems : anonymousItems)]}
          onClick={({ key }) => {
            setVisible(false);
          }}
        />
      </Drawer>
    </StyledNavbar>
  );
};

export default Navbar;
