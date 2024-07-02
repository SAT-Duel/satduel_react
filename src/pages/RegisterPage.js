import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        grade: ''
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = null;
        try {
            const response = await axios.post('http://localhost:8000/api/register/', formData);
            userData = response.data;
        } catch (error) {
            alert(error.response ? error.response.data.error : "Registration failed");
            if (error.response.status === 401) {
                setError(error.response.data.error);
            }
        }
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username: formData.username,
                password: formData.password
            });
            login(userData, response.data.access);
            alert("Registration successful");
            navigate('/');
        } catch (error) {
            alert(error.response ? error.response.data.error : "Registration failed");
            if (error.response.status === 401) {
                setError(error.response.data.error);
            }
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={formData.username} onChange={handleChange}
                       placeholder="Username" required/>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                       required/>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                       placeholder="First Name" required/>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                       placeholder="Last Name" required/>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                       placeholder="Password" required/>
                <select name="grade" value={formData.grade} onChange={handleChange} required>
                    <option value="">Select Grade</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
                {error && <p>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
