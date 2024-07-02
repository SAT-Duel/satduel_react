import {useEffect} from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";

const useOpponentProgress = (roomId, setOpponentProgress) => {
    const {token, loading} = useAuth();
    const fetchOpponentProgress = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/match/get_opponent_progress/', {
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

    useEffect(() => {
        if(!loading){
            const interval = setInterval(fetchOpponentProgress, 2000);
            return () => clearInterval(interval); // Clear the interval on component unmount
        }
    }, [roomId, token, setOpponentProgress, loading]);
};

export default useOpponentProgress;
