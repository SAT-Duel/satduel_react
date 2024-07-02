import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate  } from 'react-router-dom';


function Navbar() {
    const { user, logout, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        if (!loading && user) {
            setUsername(user.username);
        }

    }, [loading, user]);

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/questions">Questions</Link></li>
                <li><Link to="/match">Match</Link></li>
                {!loading && user ? (
                    <li onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                        {username}
                        {dropdownOpen && (
                            <ul>
                                <li><Link to="/profile">Profile</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        )}
                    </li>
                ) : (
                    <div>
                        <li><Link to="/login">Login</Link></li>
                        <p>Or</p>
                        <li><Link to="/register">Register</Link></li>
                    </div>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;