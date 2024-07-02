import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        let userData = null;
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username: username,
                password: password
            });
            if (response.status === 200) {
                userData = response.data;
            }
        } catch (error) {
            // alert(error.response.data.error);
            if (error.response.status === 401) {
                setError('Invalid username or password');
            }
        }
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username: username,
                password: password
            });
            if (response.status === 200) {
                handleLoginSuccess(userData, response.data.access);
            }
        } catch (error) {
            // alert(error.response.data.error);
            if (error.response.status === 401) {
                setError('Invalid username or password');
            }
        }
    };
    const handleLoginSuccess = (userData, userToken) => {
        login(userData, userToken);
        navigate('/');
    };



    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {error && <p>{error}</p>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
