import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Profile from "../components/Profile";
import { Tabs } from "antd";
import FriendList from "../components/FriendList";
import BattleHistory from "../components/BattleHistory";
function ProfilePage() {
    const { userId } = useParams();
    const isOwnProfile = !userId;

    useEffect(() => {
        console.log('userId:', userId);
    }, [userId]);

    const items = [
        {
            label: 'Profile',
            key: '1',
            children: <Profile user_id={userId} />,
        },
        {
            label: 'Match History',
            key: '2',
            children: <BattleHistory user_id={userId}/>
        },
        ...(isOwnProfile ? [{
            label: 'Friends',
            key: '3',
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