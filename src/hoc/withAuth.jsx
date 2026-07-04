import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const withAuth = (WrappedComponent, requiresAdmin = false) => {
    return (props) => {
        const { user, loading } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    message.error('You must be logged in to view this page.');
                    navigate('/login'); // Redirect to login if not authenticated
                } else if (requiresAdmin && !user.is_admin) {
                    message.error('You do not have the necessary permissions to view this page.');
                    navigate('/'); // Redirect to home if not authorized
                }
            }
        }, [user, loading, navigate]);

        if (loading || (!user && !requiresAdmin)) {
            return null; // Optionally, you could return a spinner or loading indicator
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
