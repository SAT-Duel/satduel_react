import React, {createContext, useCallback, useContext, useState, useEffect} from 'react';
import axios from "axios";
import api from '../components/api';
import {notify} from '../utils/notify';

const AuthContext = createContext(null);

function profileToUserUpdates(profile) {
    return {
        id: profile.user?.id,
        username: profile.user?.username,
        email: profile.user?.email,
        first_name: profile.user?.first_name,
        last_name: profile.user?.last_name,
        is_premium: profile.is_premium,
        avatar: profile.avatar,
        avatar_icon: profile.avatar_icon,
    };
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }, []);

    const login = async (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            let response = await axios.post(`${baseUrl}/api/logout/`);
            notify.success(response.data.message);
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            clearAuth();
        }
    };

    const setFirstLogin = async () => {
        setUser({...user, is_first_login: false});
    };

    const updateUser = useCallback((updates) => {
        setUser((previousUser) => {
            const nextUser = {...(previousUser || {}), ...updates};
            localStorage.setItem('user', JSON.stringify(nextUser));
            return nextUser;
        });
    }, []);

    const refreshUser = useCallback(async () => {
        const response = await api.get('api/profile/');
        updateUser(profileToUserUpdates(response.data));
        return response.data;
    }, [updateUser]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const refreshAccessToken = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${baseUrl}/api/token/refresh/`, {
                refresh: localStorage.getItem('refresh_token')
            });
            const newAccessToken = response.data.access;
            setToken(newAccessToken);
            localStorage.setItem('access_token', newAccessToken);
        } catch (error) {
            console.error('Error refreshing access token', error);
            logout();
        }
    };

    useEffect(() => {
        try {
            const accessTokenFromCookie = localStorage.getItem('access_token');
            const userFromCookie = JSON.parse(localStorage.getItem('user'));
            setToken(accessTokenFromCookie);
            setUser(userFromCookie);
        } catch (error) {
            console.error('Error getting user from cookie', error);
        }
        setLoading(false);
    }, [loading]);

    useEffect(() => {
        if (token) {
            try {
                const tokenExpiryTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
                console.log('Token expiry time:', new Date(tokenExpiryTime).toLocaleString(), tokenExpiryTime);
                const timeout = tokenExpiryTime - Date.now() - 60000; // Refresh 1 minute before expiry
                const timer = setTimeout(refreshAccessToken, timeout);
                return () => clearTimeout(timer);
            }
            catch (error) {
                logout();
            }
        }
    }, [refreshAccessToken, token]);

    return (
        <AuthContext.Provider value={{user, login, logout, clearAuth, token, loading, setFirstLogin, updateUser, refreshUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
