import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Profile from "../components/Profile";
import {Tabs, Card, message} from "antd";
import FriendList from "../components/FriendList";
import BattleHistory from "../components/BattleHistory";
import Inventory from "../components/Inventory";
import {useAuth} from "../context/AuthContext";
import { ShoppingCart } from 'lucide-react';
import TournamentHistory from "../components/TournamentHistory";

const {TabPane} = Tabs;

const tabStyle = {
    fontWeight: '600px',
    fontSize: '16px',
};

const cardStyle = {
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px auto',
    maxWidth: '900px',
};

const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
};


function ProfilePage() {
    const {userId} = useParams();
    const {token, loading} = useAuth();
    const isOwnProfile = !userId;
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !token) {
            message.error("You need to be logged in to view profiles");
            navigate('/login');
        }
    }, [navigate, token, loading]);

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Tabs defaultActiveKey="1" type="card" animated={true}>
                    <TabPane tab={<span style={tabStyle}>Profile</span>} key="1">
                        <Profile user_id={userId}/>
                    </TabPane>
                    <TabPane tab={<span style={tabStyle}>Match History</span>} key="2">
                        <BattleHistory user_id={userId}/>
                    </TabPane>
                    {isOwnProfile && (
                        <TabPane tab={<span style={tabStyle}>Friends</span>} key="3">
                            <FriendList/>
                        </TabPane>
                    )}
                    {isOwnProfile && (
                        <TabPane tab={<span style={tabStyle}>Inventory</span>} key="4">
                            <button
                                onClick={() => navigate('/shop')}
                                className="
                                    inline-flex items-center px-4 py-2
                                    bg-blue-500 text-white font-semibold rounded-lg
                                    shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2
                                    focus:ring-blue-400 focus:ring-opacity-75 transition-colors
                                "
                            >
                                <ShoppingCart className="mr-2" size={20}/>
                                Visit Shop
                            </button>
                            <Inventory/>
                        </TabPane>
                    )}
                    <TabPane tab={<span style={tabStyle}>Tournament History</span>} key="5">
                        <TournamentHistory user_id={userId}/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default ProfilePage;