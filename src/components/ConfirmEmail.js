// src/ConfirmEmail.js
import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {message, Spin} from 'antd';

const ConfirmEmail = () => {
    const {key} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await axios.post('/auth/registration/verify-email/', {
                    key: key
                });
                message.success('Email confirmed successfully!');
                navigate('/login');  // Redirect to the login page or wherever appropriate
            } catch (error) {
                message.error('Email confirmation failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [key, navigate]);

    return (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
            {loading ? <Spin size="large"/> : null}
        </div>
    );
};

export default ConfirmEmail;
