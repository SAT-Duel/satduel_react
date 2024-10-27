import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from "axios";
import {message} from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            let response = await axios.post(`${baseUrl}/api/logout/`);
            setUser(null);
            setToken(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            message.success(response.data.message);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const refreshAccessToken = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
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
        <AuthContext.Provider value={{user, login, logout, token, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
