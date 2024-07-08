import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        setRefreshToken(refreshToken);
        Cookies.set('accessToken', JSON.stringify(accessToken), { expires: 1, secure: true });
        Cookies.set('refreshToken', JSON.stringify(refreshToken), { expires: 7, secure: true });
        Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true });
    };

    const logout = async () => {
        try {
            let response = await axios.post('/api/logout/');
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            alert(response.data.message);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('/api/token/refresh/', {
                refresh: JSON.parse(Cookies.get('refreshToken'))
            });
            const newAccessToken = response.data.access;
            setToken(newAccessToken);
            Cookies.set('accessToken', JSON.stringify(newAccessToken), { expires: 1, secure: true });
        } catch (error) {
            console.error('Error refreshing access token', error);
            logout();
        }
    };

    useEffect(() => {
        try {
            const accessTokenFromCookie = JSON.parse(Cookies.get('accessToken'));
            const refreshTokenFromCookie = JSON.parse(Cookies.get('refreshToken'));
            const userFromCookie = JSON.parse(Cookies.get('user'));
            setToken(accessTokenFromCookie);
            setRefreshToken(refreshTokenFromCookie);
            setUser(userFromCookie);
        } catch (error) {
            console.error('Error getting user from cookie', error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            const tokenExpiryTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
            console.log('Token expiry time:', new Date(tokenExpiryTime).toLocaleString(), tokenExpiryTime);
            const timeout = tokenExpiryTime - Date.now() - 60000; // Refresh 1 minute before expiry
            const timer = setTimeout(refreshAccessToken, timeout);
            return () => clearTimeout(timer);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, login, logout, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
