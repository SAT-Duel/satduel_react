import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";

function Profile() {
    const [profile, setProfile] = useState({
        user: {
            username: '',
            email: '',
        },
        biography: '',
        grade: ''
    });
    const { token, loading } = useAuth(); // Get the token from the AuthContext
    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                }
            });
            setProfile(response.data);
            console.log(response.data)
        } catch (err) {
            console.error('Error fetching profile:', err);
        }

    };
    useEffect(() => {
        if (!loading){
            fetchProfile();

        }
    }, [loading]);

    return (
        <div>
            <h1>Profile Page</h1>
            <p>Username: {profile.user.username}</p>
            <p>Email: {profile.user.email}</p>
            <p>Biography: {profile.biography}</p>
            <p>Grade: {profile.grade}</p>
        </div>
    );
}

export default Profile;
