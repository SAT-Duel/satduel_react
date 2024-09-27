import React, {useState} from 'react';
import styled from 'styled-components';
import {Select, message} from 'antd';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const {Option} = Select;

const StyledSelect = styled(Select)`
    width: 100%;

    .ant-select-selector {
        border-radius: 20px !important;
        height: 40px !important;
        padding: 4px 16px !important;
        border: 2px solid #d9d9d9 !important;

        &:hover {
            border-color: #40a9ff !important;
        }
    }

    .ant-select-selection-search-input {
        height: 36px !important;
    }
`;

const OptionWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 0;
`;

const Avatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #1890ff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-weight: bold;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const Username = styled.span`
    font-weight: 600;
`;

const Email = styled.span`
    font-size: 12px;
    color: #8c8c8c;
`;

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (value) => {
        setQuery(value);
        if (value) {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/profile/search/?q=${value}`);
                setResults(response.data.slice(0, 10));
            } catch (error) {
                console.error('Error searching users:', error);
                message.error('Failed to search users.');
            }
        } else {
            setResults([]);
        }
    };

    const handleSelect = (value, option) => {
        navigate(`/profile/${option.key}`);
        setQuery('');
        setResults([]);
    };

    return (
        <StyledSelect
            showSearch
            placeholder="Search for users by name or email"
            value={query}
            onSearch={handleSearch}
            onChange={(value) => setQuery(value)}
            onSelect={handleSelect}
            filterOption={false}
            notFoundContent={null}
        >
            {results.map((user) => (
                <Option key={user.id} value={user.username}>
                    <OptionWrapper>
                        <Avatar>{user.username[0].toUpperCase()}</Avatar>
                        <UserInfo>
                            <Username>{user.username}</Username>
                            <Email>{user.email}</Email>
                        </UserInfo>
                    </OptionWrapper>
                </Option>
            ))}
        </StyledSelect>
    );
};

export default SearchUsers;