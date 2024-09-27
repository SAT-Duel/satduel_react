import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {List, Button, message, Empty} from 'antd';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';

const StyledList = styled(List)`
    .ant-list-empty-text {
        padding: 24px 0;
    }
`;

const ListItem = styled(List.Item)`
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const Username = styled.span`
    font-weight: 600;
    color: #262626;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const AcceptButton = styled(Button)`
    background-color: #52c41a;
    border-color: #52c41a;

    &:hover, &:focus {
        background-color: #73d13d;
        border-color: #73d13d;
    }
`;

const RejectButton = styled(Button)`
    background-color: #ff4d4f;
    border-color: #ff4d4f;

    &:hover, &:focus {
        background-color: #ff7875;
        border-color: #ff7875;
    }
`;

const EmptyStateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
`;

const EmptyStateText = styled.p`
    color: #8c8c8c;
    font-size: 16px;
    margin-top: 16px;
`;

const FriendRequests = () => {
    const {token, loading} = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/profile/friend_requests/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
                message.error('Failed to fetch friend requests.');
            }
        };
        if (!loading) fetchFriendRequests();
    }, [loading, token]);

    const respondToRequest = async (requestId, status) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(
                `${baseUrl}/api/profile/respond_friend_request/${requestId}/`,
                {status},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            message.success(`Friend request ${status}.`);
            setRequests(requests.filter((request) => request.id !== requestId));
        } catch (error) {
            console.error(`Error ${status} friend request:`, error);
            message.error(`Failed to ${status} friend request.`);
        }
    };

    if (requests.length === 0) {
        return (
            <EmptyStateWrapper>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <EmptyStateText>
                            You have no pending friend requests at the moment.
                        </EmptyStateText>
                    }
                />
            </EmptyStateWrapper>
        );
    }

    return (
        <StyledList
            itemLayout="horizontal"
            dataSource={requests}
            renderItem={(request) => (
                <ListItem
                    actions={[
                        <ActionButtons>
                            <AcceptButton
                                type="primary"
                                onClick={() => respondToRequest(request.id, 'accepted')}
                            >
                                Accept
                            </AcceptButton>
                            <RejectButton
                                type="primary"
                                onClick={() => respondToRequest(request.id, 'rejected')}
                            >
                                Reject
                            </RejectButton>
                        </ActionButtons>,
                    ]}
                >
                    <List.Item.Meta
                        title={<Username>{request.from_user.username}</Username>}
                        description={`Friend request from ${request.from_user.username}`}
                    />
                </ListItem>
            )}
        />
    );
};

export default FriendRequests;