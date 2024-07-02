import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state

    const login = async (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        Cookies.set('token', JSON.stringify(userToken), { expires: 3, secure: true }); // Store the token in a secure HTTP-only cookie
        Cookies.set('user', JSON.stringify(userData), { expires: 3, secure: true }); // Store the user in a secure HTTP-only cookie
    };

    const logout = async () => {
        try {
            let response = await axios.post('http://localhost:8000/api/logout/');
            setUser(null);
            setToken(null);
            Cookies.remove('token'); // Remove the token from the cookie
            Cookies.remove('user'); // Remove the user from the cookie
            alert(response.data.message);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    useEffect(() => {
        try{
            const tokenFromCookie = JSON.parse(Cookies.get('token'));
            const userFromCookie = JSON.parse(Cookies.get('user'));
            setToken(tokenFromCookie);
            setUser(userFromCookie);
        } catch (error) {
            console.error('Error getting user from cookie', error);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);