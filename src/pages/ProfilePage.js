import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from "../components/Profile";
import { Tabs } from "antd";
import FriendList from "../components/FriendList";

function ProfilePage() {
    const { userId } = useParams();
    const isOwnProfile = !userId;

    const items = [
        {
            label: 'Profile',
            key: '1',
            children: <Profile user_id={userId} />,
        },
        ...(isOwnProfile ? [{
            label: 'Friends',
            key: '2',
            children: <FriendList />,
        }] : []),
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
}

export default ProfilePage;