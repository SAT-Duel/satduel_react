import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {useAuth} from "../context/AuthContext";


function BattleResultPage() {
    const {roomId} = useParams(); // Get the roomId from the URL params
    const {loading} = useAuth(); // Get the token from the AuthContext
    const fetchResults = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/match/get_results/', {
                room_id: roomId,
            });
            console.log(response.data)
        } catch (err) {
            console.error('Error fetching opponent progress:', err);
        }
    };

    useEffect(() => {
        if(!loading){
            fetchResults();
        }
    }, [roomId, loading]);
    return (
        <div>Hello</div>
    );
}

export default BattleResultPage;