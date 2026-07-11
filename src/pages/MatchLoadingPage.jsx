import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Swords} from 'lucide-react';
import {Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import UserAvatar from '../components/UserAvatar';

function PlayerBadge({user, fallback}) {
    const username = user?.username || fallback;
    return (
        <div className="flex flex-col items-center">
            <UserAvatar profile={user || {username}} size="md" rounded="xl" className="sm:size-20"/>
            <p className="m-0 mt-3 font-bold text-slate-900">{username}</p>
            <p className="m-0 mt-0.5 text-sm font-bold text-primary-600">
                {user?.elo_rating != null ? `${user.elo_rating} Elo` : '— Elo'}
            </p>
        </div>
    );
}

function MatchLoadingPage() {
    const {roomId} = useParams();
    const [countdown, setCountdown] = useState(5);
    const [opponent, setOpponent] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const hasNavigated = useRef(false);
    const {token} = useAuth();

    useEffect(() => {
        const fetchMatchInfo = async () => {
            try {
                const response = await api.post('/api/match/info/', {room_id: roomId});
                setOpponent(response.data.opponent);
                setCurrentUser(response.data.currentUser);
            } catch (error) {
                console.error('Error fetching match info:', error);
            }
        };

        if (token) fetchMatchInfo();
    }, [roomId, token]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((previousCount) => {
                if (previousCount === 1 && !hasNavigated.current) {
                    clearInterval(timer);
                    hasNavigated.current = true;
                    navigate(`/duel_battle/${roomId}`);
                }
                return previousCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, roomId]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
            <PageContainer className="max-w-3xl">
                <Card className="p-6 text-center sm:p-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-sm font-semibold text-primary-700">
                        <Swords className="size-4"/> Match found
                    </span>
                    <h1 className="mt-5 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                        Get ready to duel
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-slate-600">
                        You and your opponent will answer the same SAT questions on the same clock.
                    </p>

                    <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <PlayerBadge user={currentUser} fallback="You"/>
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 font-display text-xl font-bold text-slate-600">
                            VS
                        </div>
                        <PlayerBadge user={opponent} fallback="Opponent"/>
                    </div>

                    <div className="mt-10">
                        <p className="m-0 font-display text-6xl font-bold text-primary-600">{Math.max(countdown, 0)}</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                            <Spinner className="size-4 border-2"/> Starting battle…
                        </div>
                    </div>
                </Card>
            </PageContainer>
        </div>
    );
}

export default MatchLoadingPage;
