import React, {useEffect, useState} from 'react';
import {Check, Home, Minus, RotateCcw, Swords, Trophy, X} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import api from '../components/api';

const OUTCOMES = {
    win: {
        eyebrow: 'Victory',
        title: 'You won the duel',
        text: 'Strong finish. Your Duel Elo is moving up.',
        classes: 'bg-emerald-600',
    },
    loss: {
        eyebrow: 'Defeat',
        title: 'Your opponent takes it',
        text: 'Review the misses, then run it back.',
        classes: 'bg-rose-600',
    },
    draw: {
        eyebrow: 'Draw',
        title: 'Dead even',
        text: 'Same score. One more duel settles it.',
        classes: 'bg-slate-800',
    },
};

function RatingLine({player}) {
    const hasSnapshot = player?.elo_before != null && player?.elo_after != null;
    const change = player?.elo_change;
    const changeClass = change == null
        ? 'text-slate-400'
        : change >= 0 ? 'text-emerald-600' : 'text-rose-600';

    return (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="m-0 text-[11px] font-black uppercase tracking-wide text-slate-400">Duel Elo</p>
            {hasSnapshot ? (
                <div className="mt-1 flex items-baseline justify-center gap-2">
                    <span className="font-bold text-slate-500">{player.elo_before}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-xl font-black text-slate-950">{player.elo_after}</span>
                    <span className={`font-black ${changeClass}`}>
                        {change >= 0 ? '+' : ''}{change}
                    </span>
                </div>
            ) : (
                <p className="m-0 mt-1 font-bold text-slate-700">{player?.elo_rating ?? '—'}</p>
            )}
        </div>
    );
}

function PlayerResult({player, label}) {
    const total = player?.results?.length || 10;
    return (
        <section className="min-w-0 text-center">
            <UserAvatar profile={player} size="md" rounded="xl" className="mx-auto sm:size-20"/>
            <p className="m-0 mt-3 truncate font-bold text-slate-900">{player?.username || label}</p>
            <p className="m-0 mt-1 font-display text-4xl font-black text-slate-950">
                {player?.score ?? 0}<span className="text-lg text-slate-300">/{total}</span>
            </p>
            <RatingLine player={player}/>
        </section>
    );
}

function QuestionTrack({player, label}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-32 shrink-0">
                <p className="m-0 truncate text-sm font-bold text-slate-800">{label}</p>
                <p className="m-0 text-xs text-slate-400">{player?.score ?? 0} correct</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {(player?.results || []).map((result, index) => {
                    const correct = result.status === 'Correct';
                    const blank = result.status === 'Blank';
                    return (
                        <span
                            key={result.id}
                            title={`Question ${index + 1}: ${result.status}`}
                            className={[
                                'flex size-8 items-center justify-center rounded-full text-white',
                                correct ? 'bg-emerald-500' : blank ? 'bg-slate-300' : 'bg-rose-500',
                            ].join(' ')}
                        >
                            {correct ? <Check className="size-4"/> : blank ? <Minus className="size-4"/> : <X className="size-4"/>}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function BattleResultPage() {
    const {roomId} = useParams();
    const {loading} = useAuth();
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.post('api/match/get_results/', {room_id: roomId});
                setResults(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Could not load this duel result.');
            }
        };
        if (!loading) fetchResults();
    }, [loading, roomId]);

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="max-w-xl"><Alert>{error}</Alert></PageContainer>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 text-slate-600"><Spinner/> Loading result…</div>
                </PageContainer>
            </div>
        );
    }

    const outcome = OUTCOMES[results.outcome] || OUTCOMES.draw;
    const me = results.current_user;
    const opponent = results.opponent;

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <PageContainer className="max-w-4xl">
                <Card className="sat-arena-card overflow-hidden">
                    <header className={`${outcome.classes} px-6 py-7 text-center text-white sm:px-10 sm:py-9`}>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider">
                            {results.outcome === 'win' ? <Trophy className="size-4"/> : <Swords className="size-4"/>}
                            {outcome.eyebrow}
                        </span>
                        <h1 className="m-0 mt-3 font-display text-3xl font-black sm:text-4xl">{outcome.title}</h1>
                        <p className="mx-auto mb-0 mt-2 max-w-md text-sm font-medium text-white/80 sm:text-base">{outcome.text}</p>
                    </header>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-4 px-5 py-7 sm:gap-10 sm:px-10 sm:py-9">
                        <PlayerResult player={me} label="You"/>
                        <div className="pt-8 text-center sm:pt-10">
                            <p className="m-0 font-display text-2xl font-black text-slate-300">VS</p>
                            <p className="m-0 mt-2 whitespace-nowrap font-display text-2xl font-black text-slate-950 sm:text-3xl">
                                {me?.score ?? 0}–{opponent?.score ?? 0}
                            </p>
                        </div>
                        <PlayerResult player={opponent} label="Opponent"/>
                    </div>
                </Card>

                <Card className="mt-5 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="m-0 text-lg font-bold text-slate-900">Question breakdown</h2>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">10 questions</span>
                    </div>
                    <div className="mt-5 space-y-5">
                        <QuestionTrack player={me} label="You"/>
                        <QuestionTrack player={opponent} label={opponent?.username || 'Opponent'}/>
                    </div>
                </Card>

                <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                    <Button onClick={() => navigate('/')} variant="secondary">
                        <Home className="size-4"/> Home
                    </Button>
                    <Button onClick={() => navigate('/match')}>
                        <RotateCcw className="size-4"/> Duel again
                    </Button>
                </div>
            </PageContainer>
        </div>
    );
}

export default BattleResultPage;
