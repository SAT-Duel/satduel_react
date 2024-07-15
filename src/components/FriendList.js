import React, {useState, useEffect} from 'react';
import {List, Card, message} from 'antd';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {Link} from "react-router-dom";

const FriendsList = () => {
    const {token, loading} = useAuth();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/api/profile/friends/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
                message.error('Failed to fetch friends.');
            }
        };

        if (!loading) fetchFriends();
    }, [loading, token]);

    return (
        <Card title="Friends List">
            <List
                itemLayout="horizontal"
                dataSource={friends}
                renderItem={(friend) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<Link to={`/profile/${friend.user.id}`}>{friend.user.username}</Link>}
                            description={
                                <div>
                                    <div>Email: {friend.user.email}</div>
                                    <div>Grade: {friend.grade}</div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default FriendsList;