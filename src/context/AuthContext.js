import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import {message} from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        Cookies.set('accessToken', JSON.stringify(accessToken), {expires: 1, secure: true});
        Cookies.set('refreshToken', JSON.stringify(refreshToken), {expires: 7, secure: true});
        Cookies.set('user', JSON.stringify(userData), {expires: 7, secure: true});
    };

    const logout = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            let response = await axios.post(`${baseUrl}/api/logout/`);
            setUser(null);
            setToken(null);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
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
                refresh: JSON.parse(Cookies.get('refreshToken'))
            });
            const newAccessToken = response.data.access;
            setToken(newAccessToken);
            Cookies.set('accessToken', JSON.stringify(newAccessToken), {expires: 1, secure: true});
        } catch (error) {
            console.error('Error refreshing access token', error);
            logout();
        }
    };

    useEffect(() => {
        try {
            const accessTokenFromCookie = JSON.parse(Cookies.get('accessToken'));
            const userFromCookie = JSON.parse(Cookies.get('user'));
            setToken(accessTokenFromCookie);
            setUser(userFromCookie);
        } catch (error) {
            console.error('Error getting user from cookie', error);
        }
        setLoading(false);
    }, [loading]);

    useEffect(() => {
        if (token) {
            const tokenExpiryTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
            console.log('Token expiry time:', new Date(tokenExpiryTime).toLocaleString(), tokenExpiryTime);
            const timeout = tokenExpiryTime - Date.now() - 60000; // Refresh 1 minute before expiry
            const timer = setTimeout(refreshAccessToken, timeout);
            return () => clearTimeout(timer);
        }
    }, [refreshAccessToken, token]);

    return (
        <AuthContext.Provider value={{user, login, logout, token, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
