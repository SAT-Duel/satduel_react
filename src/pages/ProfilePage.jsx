import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Profile from "../components/Profile/Profile";
import {Tabs, message} from "antd";
import FriendList from "../components/Profile/FriendList";
import BattleHistory from "../components/Profile/BattleHistory";
import {useAuth} from "../context/AuthContext";
import TournamentHistory from "../components/Profile/TournamentHistory";
import styled from 'styled-components';
import ProfileSidebar from '../components/Profile/ProfileSidebar';

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    display: grid;
    gap: 24px;
    grid-template-columns: 300px 1fr;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

function ProfilePage() {
    const {userId} = useParams();
    const {token, loading} = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');
    useEffect(() => {
        setActiveTab('1');
    }, [userId]);

    useEffect(() => {
        if (!loading && !token) {
            message.error("You need to be logged in to view profiles");
            navigate('/login');
        }
    }, [navigate, token, loading]);


    const items = [
        {
            key: '1',
            label: 'Overview',
            children: <Profile user_id={userId}/>,
        },
        {
            key: '2',
            label: 'Battle History',
            children: <BattleHistory user_id={userId}/>,
        },
        {
            key: '3',
            label: 'Friends',
            children: <FriendList/>,
        },
        {
            key: '4',
            label: 'Tournament History',
            children: <TournamentHistory user_id={userId}/>,
        },
    ];

    return (
        <PageContainer>
            <ProfileSidebar/>
            <Tabs
                activeKey={activeTab}
                onChange={key => setActiveTab(key)}
                items={items}
                style={{background: 'white', padding: '20px', borderRadius: '8px'}}
            />
        </PageContainer>
    );
}

export default ProfilePage;