import React, { useState, useEffect } from 'react';
import { Card, Button, Descriptions, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useParams } from 'react-router-dom';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const TournamentDetail = () => {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const { tournamentId } = useParams();
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchTournamentDetail();
    }, [tournamentId]);

    const fetchTournamentDetail = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/`);
            setTournament(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch tournament details');
            setLoading(false);
        }
    };

    const handleStartTournament = async () => {
        try {
            // Implement the API call to start the tournament
            // For example: await axios.post(`/api/tournaments/${tournamentId}/start/`);
            message.success('Tournament started successfully');
        } catch (error) {
            message.error('Failed to start the tournament');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!tournament) {
        return <div>Tournament not found</div>;
    }

    return (
        <Card
            title={tournament.name}
            extra={
                <Button type="primary" onClick={handleStartTournament}>
                    Start Tournament
                </Button>
            }
        >
            <Descriptions bordered>
                <Descriptions.Item label="Description" span={3}>
                    {tournament.description}
                </Descriptions.Item>
                <Descriptions.Item label="Start Time">
                    {dayjs(tournament.start_time).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                    {dayjs.duration(tournament.duration).humanize()}
                </Descriptions.Item>
                <Descriptions.Item label="End Time">
                    {dayjs(tournament.end_time).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Number of Questions">
                    {tournament.questionNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Number of Participants">
                    {tournament.participantNumber}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default TournamentDetail;
