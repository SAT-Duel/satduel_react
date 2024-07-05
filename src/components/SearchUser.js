import React, {useState} from 'react';
import {Input, List, Button, message, Select, Opt} from 'antd';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {Link, useNavigate} from "react-router-dom";

const SearchUsers = () => {
    const {token} = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const {Option} = Select;
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/profile/search/?q=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
            message.error('Failed to search users.');
        }
    };
    const handleSelect = (value, option) => {
        navigate(`/profile/${option.key}`);
        setQuery('');  // Clear the input
        setResults([]);  // Clear the results
    };

    return (
        <div>
            <Select
                showSearch
                placeholder="Search for users"
                style={{width: 300}}
                onSearch={handleSearch}
                onChange={value => setQuery(value)}
                onSelect={handleSelect}
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
