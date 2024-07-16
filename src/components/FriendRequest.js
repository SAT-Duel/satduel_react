import React, { useState, useEffect } from 'react';
import { List, Button, message } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FriendRequests = () => {
    const { token, loading } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/profile/friend_requests/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
                message.error('Failed to fetch friend requests.');
            }
        };
        if(!loading) fetchFriendRequests();
    }, [loading, token]);

    const respondToRequest = async (requestId, status) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/profile/respond_friend_request/${requestId}/`, { status }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            message.success(`Friend request ${status}.`);
            setRequests(requests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error(`Error ${status} friend request:`, error);
            message.error(`Failed to ${status} friend request.`);
        }
    };

    return (
        <List
            itemLayout="horizontal"
            dataSource={requests}
            renderItem={(request) => (
                <List.Item
                    actions={[
                        <Button type="primary" onClick={() => respondToRequest(request.id, 'accepted')}>Accept</Button>,
                        <Button type="danger" onClick={() => respondToRequest(request.id, 'rejected')}>Reject</Button>
                    ]}
                >
                    <List.Item.Meta
                        title={request.from_user.username}
                        description={`Friend request from ${request.from_user.username}`}
                    />
                </List.Item>
            )}
        />
    );
};

export default FriendRequests;
