import React, { useState } from 'react';
import { Select, message } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SearchUsers = () => {
    const { token } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { Option } = Select;
    const navigate = useNavigate();

    const handleSearch = async (value) => {
        setQuery(value); // Update the query state with the current search input
        if (value) {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/profile/search/?q=${value}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResults(response.data.slice(0, 10)); // Limit results to first 10 users
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
        setQuery(''); // Clear the input
        setResults([]); // Clear the results
    };

    return (
        <div>
            <Select
                showSearch
                placeholder="Search for users"
                style={{ width: 300 }}
                value={query}
                onSearch={handleSearch}
                onChange={value => setQuery(value)}
                onSelect={handleSelect}
                filterOption={false} // Disable default filtering behavior
            >
                {results.map(user => (
                    <Option key={user.id} value={user.username}>
                        {user.username}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default SearchUsers;
