import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Adjust the path as necessary
import { useLocation, useNavigate } from 'react-router-dom';
import {notify} from '../utils/notify';
import {loginPathFor} from '../utils/authRedirect';

const withAuth = (WrappedComponent, requiresAdmin = false) => {
    return (props) => {
        const { user, loading } = useAuth();
        const navigate = useNavigate();
        const location = useLocation();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    notify.error('You must be logged in to view this page.');
                    navigate(loginPathFor(`${location.pathname}${location.search}${location.hash}`)); // Redirect to login if not authenticated
                } else if (requiresAdmin && !user.is_admin) {
                    notify.error('You do not have the necessary permissions to view this page.');
                    navigate('/'); // Redirect to home if not authorized
                }
            }
        }, [user, loading, navigate, location]);

        if (loading || !user || (requiresAdmin && !user.is_admin)) {
            return null; // Optionally, you could return a spinner or loading indicator
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
