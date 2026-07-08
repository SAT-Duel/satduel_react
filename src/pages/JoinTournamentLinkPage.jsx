import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../components/api';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';

function JoinTournamentLinkPage() {
    const {joinCode} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const openTournament = async () => {
            try {
                const {data} = await api.post('api/tournaments/join_from_code/', {join_code: joinCode});
                navigate(`/tournament/${data.id}`, {replace: true});
            } catch (err) {
                setError(err.response?.data?.error || 'This tournament invite is invalid.');
            }
        };

        openTournament();
    }, [joinCode, navigate]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
            <PageContainer className="max-w-xl">
                <Card className="p-6 text-center">
                    {error ? (
                        <>
                            <Alert>{error}</Alert>
                            <Button to="/tournaments" className="mt-5" variant="secondary">
                                Back to tournaments
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-3 text-slate-600">
                            <Spinner/> Opening tournament invite…
                        </div>
                    )}
                </Card>
            </PageContainer>
        </div>
    );
}

export default JoinTournamentLinkPage;
