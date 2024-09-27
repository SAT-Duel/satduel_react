import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {List, Card, message} from 'antd';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import FriendRequest from './FriendRequest';
import SearchUser from './SearchUser';

const Container = styled.div`
    background-color: #f0f2f5;
    padding: 30px;
    min-height: 100vh;
`;

const StyledCard = styled(Card)`
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SearchCard = styled(StyledCard)`
    background-color: #ffffff;
`;

const FriendRequestsCard = styled(StyledCard)`
    background-color: #f8f9fa;
`;

const FriendsListCard = styled(StyledCard)`
    background-color: #ffffff;
`;

const ListItem = styled(List.Item)`
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
`;

const ListItemMetaTitle = styled(Link)`
    font-weight: 600;
    color: #1890ff;

    &:hover {
        color: #40a9ff;
    }
`;

const ListItemMetaDescription = styled.div`
    color: #595959;
`;

const FriendsList = () => {
    const {token, loading} = useAuth();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/profile/friends/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        <Container>
            <SearchCard title="Search Users">
                <SearchUser/>
            </SearchCard>
            <FriendRequestsCard title="Friend Requests">
                <FriendRequest/>
            </FriendRequestsCard>
            <FriendsListCard title="Friends List">
                <List
                    itemLayout="horizontal"
                    dataSource={friends}
                    renderItem={(friend) => (
                        <ListItem>
                            <List.Item.Meta
                                title={
                                    <ListItemMetaTitle to={`/profile/${friend.user.id}`}>
                                        {friend.user.username}
                                    </ListItemMetaTitle>
                                }
                                description={
                                    <ListItemMetaDescription>
                                        <div>Email: {friend.user.email}</div>
                                        <div>Grade: {friend.grade}</div>
                                    </ListItemMetaDescription>
                                }
                            />
                        </ListItem>
                    )}
                />
            </FriendsListCard>
        </Container>
    );
};

export default FriendsList;