import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from 'react-router-dom';


const Match = ({setRoomId}) => {
    const {token} = useAuth(); // Get the token from the AuthContext
    const [matching, setMatching] = useState(false);
    const [roomId, setRoomIdInternal] = useState(null);
    const navigate = useNavigate();
    const handleMatch = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/match/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRoomId(response.data.id);
            setRoomIdInternal(response.data.id);
            setMatching(true);
            console.log(response.data);
            await getStatus();
        } catch (err) {
            console.error('Error making a match:', err);
            setMatching(false);
        }
    };

    const getStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/match/status/',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        room_id: roomId
                    }
                });
            if (response.data.status === 'full') {
                navigate(`/duel_battle/${roomId}`)
                // navigate('/')
            }
        } catch (err) {
            console.error('Error checking room status:', err);
        }
    }

    useEffect(() => {
        if (roomId) {
            const interval = setInterval(async () => {
                await getStatus();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [roomId, token, navigate]);

    return (
        <div>
            {matching ? (
                <div>Loading... Please wait.</div>
            ) : (
                <button onClick={handleMatch}>Find a Match</button>
            )}
        </div>
    );
};

export default Match;