import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from "axios";
import {message} from 'antd';
import api from '../components/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserData = async (accessToken) => {
        await api.get('api/get_user/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            })
    }

    const login = async (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        getUserData(accessToken);
        setToken(accessToken);
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
        await api.post('auth/token/', {
            refresh_token: localStorage.getItem('refresh_token'),
            grant_type: 'refresh_token',
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        })
            .then((res) => {
                login(res.data.access, res.data.refresh);
            })
            .catch((error) => {
                console.error('Error refreshing token', error);
            });
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
            const timeout = 3500000;
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
