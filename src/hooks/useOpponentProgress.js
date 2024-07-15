import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const fetchOpponentProgress = async ({ roomId, token, setOpponentProgress }) => {
    try {
        const response = await axios.post('/api/match/get_opponent_progress/', {
            room_id: roomId,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setOpponentProgress(response.data);
    } catch (err) {
        console.error('Error fetching opponent progress:', err);
    }
};

const useOpponentProgress = (roomId, setOpponentProgress) => {
    const { token, loading } = useAuth();

    const fetchProgress = useCallback(() => {
        fetchOpponentProgress({ roomId, token, setOpponentProgress }).catch(err => {
            console.error('Error inside setInterval:', err);
        });
    }, [roomId, token, setOpponentProgress]);

    useEffect(() => {
        if (!loading) {
            const interval = setInterval(() => {
                fetchProgress(); // Call the function inside the interval
            }, 2000);
            return () => clearInterval(interval); // Clear the interval on component unmount
        }
    }, [fetchProgress, loading]);
};

export default useOpponentProgress;
