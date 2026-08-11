import React, {useEffect, useState} from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    History,
    MinusCircle,
    Trophy,
    Users,
    XCircle,
} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import UserAvatar from '../../components/UserAvatar';
import {Alert, Card, PageContainer, Spinner} from '../../components/ui';
import {PARTY_MODES} from './modes';

const MODE_NAMES = Object.fromEntries(PARTY_MODES.map((mode) => [mode.key, mode.name]));
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

const formatDate = (value) => DATE_FORMAT.format(new Date(value));
const formatScore = (value) => value == null ? '—' : value.toLocaleString();

function RoleTag({role}) {
    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
            role === 'hosted'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-cyan-100 text-cyan-700'
        }`}>
            {role}
        </span>
    );
}

function HistoryList({rooms, onSelect}) {
    if (!rooms.length) {
        return (
            <Card className="mt-6 px-6 py-12 text-center">
                <History className="mx-auto size-9 text-slate-300"/>
                <h2 className="m-0 mt-3 text-lg font-bold text-slate-800">No completed parties yet</h2>
                <p className="mx-auto mb-0 mt-1 max-w-sm text-sm text-slate-500">
                    Parties you host or join will appear here after the game ends.
                </p>
            </Card>
        );
    }

    return (
        <div className="mt-6 space-y-3">
            {rooms.map((room) => (
                <button
                    key={room.id}
                    type="button"
                    onClick={() => onSelect(room.id)}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-primary-300 sm:px-5"
                >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                        room.is_winner ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {room.is_winner ? <Trophy className="size-5"/> : <Users className="size-5"/>}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900">{MODE_NAMES[room.mode] || room.mode}</span>
                            <RoleTag role={room.role}/>
                        </span>
                        <span className="mt-1 block text-sm text-slate-500">
                            {formatDate(room.created_at)} · {room.player_count} player{room.player_count === 1 ? '' : 's'}
                        </span>
                        <span className="mt-1 block truncate text-xs font-semibold text-slate-400">
                            Winner: {room.winners.join(', ') || 'No winner'} · Your score: {formatScore(room.your_score)}
                        </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-slate-300"/>
                </button>
            ))}
        </div>
    );
}

function Scoreboard({detail}) {
    return (
        <Card className="mt-5 overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="m-0 text-lg font-bold text-slate-900">Final standings</h2>
            </div>
            {detail.teams?.length > 0 && (
                <div className="grid gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 sm:grid-cols-2">
                    {detail.teams.map((team) => (
                        <div key={team.name} className="flex items-center justify-between text-sm">
                            <span className="font-bold text-slate-700">{team.is_winner && '🏆 '}{team.name}</span>
                            <span className="font-mono font-bold text-slate-500">{formatScore(team.score)}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="divide-y divide-slate-100">
                {detail.players.map((player) => (
                    <div key={player.id} className={`flex items-center gap-3 px-4 py-3 sm:px-5 ${player.is_you ? 'bg-primary-50/50' : ''}`}>
                        <span className="w-6 text-center text-sm font-black text-slate-400">{player.rank}</span>
                        <UserAvatar
                            backgroundId={player.avatar}
                            iconId={player.avatar_icon}
                            profile={{username: player.username}}
                            size="xs"
                            className="ring-0"
                        />
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-slate-900">
                                {player.username}{player.is_you ? ' (you)' : ''}
                            </span>
                            {player.team && <span className="block text-xs text-slate-400">{player.team}</span>}
                        </span>
                        {player.is_winner && <Trophy className="size-4 text-amber-500"/>}
                        <span className="text-right font-mono font-bold text-slate-800">
                            {detail.mode === 'survival' ? `${player.lives} ♥` : formatScore(player.score)}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function QuestionResult({question}) {
    const ResultIcon = question.skipped ? MinusCircle : question.correct ? CheckCircle2 : XCircle;
    const resultTone = question.skipped
        ? 'text-slate-500'
        : question.correct ? 'text-emerald-600' : 'text-rose-600';
    const resultLabel = question.skipped ? 'Skipped' : question.correct ? 'Correct' : 'Incorrect';

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Question {question.number}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${resultTone}`}>
                    <ResultIcon className="size-4"/> {resultLabel}
                    {question.points !== 0 && ` · ${question.points > 0 ? '+' : ''}${question.points}`}
                </span>
            </div>
            <div className="mt-3 text-[15px] leading-relaxed text-slate-900 sm:text-base">
                <RenderWithMath text={question.question}/>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice, index) => {
                    const letter = CHOICE_LABELS[index];
                    const isCorrect = letter === question.correct_choice;
                    const isMine = letter === question.your_choice;
                    return (
                        <div
                            key={letter}
                            className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${
                                isCorrect
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                    : isMine
                                        ? 'border-rose-200 bg-rose-50 text-rose-900'
                                        : 'border-slate-200 text-slate-600'
                            }`}
                        >
                            <span className="font-black">{letter}</span>
                            <span className="min-w-0 flex-1"><RenderWithMath text={choice}/></span>
                            {isMine && <span className="text-[10px] font-black uppercase">You</span>}
                        </div>
                    );
                })}
            </div>
            {question.explanation && (
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-600">
                    <span className="font-bold text-slate-700">Why: </span>
                    <RenderWithMath text={question.explanation}/>
                </div>
            )}
        </section>
    );
}

function PartyDetail({detail, onBack}) {
    return (
        <>
            <button
                type="button"
                onClick={onBack}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft className="size-4"/> All party history
            </button>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="m-0 font-display text-2xl font-black text-slate-950 sm:text-3xl">
                            {MODE_NAMES[detail.mode] || detail.mode}
                        </h1>
                        <RoleTag role={detail.role}/>
                    </div>
                    <p className="m-0 mt-1 text-sm text-slate-500">
                        {formatDate(detail.created_at)} · Hosted by {detail.host_username}
                    </p>
                </div>
                <div className="sm:text-right">
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-400">Winner</p>
                    <p className="m-0 mt-0.5 font-bold text-slate-900">{detail.winners.join(', ') || 'No winner'}</p>
                </div>
            </div>
            <Scoreboard detail={detail}/>
            <div className="mt-7 flex items-baseline justify-between gap-3">
                <h2 className="m-0 text-xl font-bold text-slate-900">Your question review</h2>
                <span className="text-sm font-semibold text-slate-400">{detail.questions.length} questions</span>
            </div>
            {detail.questions.length ? (
                <div className="mt-4 space-y-3">
                    {detail.questions.map((question, index) => (
                        <QuestionResult key={`${question.id}-${index}`} question={question}/>
                    ))}
                </div>
            ) : (
                <Card className="mt-4 px-5 py-8 text-center text-sm text-slate-500">
                    No saved question attempts are available for this party.
                </Card>
            )}
        </>
    );
}

export default function PartyHistoryPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/party/history/')
            .then(({data}) => setRooms(data))
            .catch((requestError) => setError(requestError.response?.data?.error || 'Could not load party history.'));
    }, []);

    const openDetail = async (roomId) => {
        setLoadingDetail(true);
        setError('');
        try {
            const {data} = await api.get(`/api/party/history/${roomId}/`);
            setDetail(data);
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not load that party.');
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <div className="sat-bubble-field min-h-screen py-6 sm:py-8">
            <PageContainer maxWidth="max-w-4xl">
                {detail ? (
                    <PartyDetail detail={detail} onBack={() => setDetail(null)}/>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/party')}
                                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800"
                                >
                                    <ArrowLeft className="size-4"/> Party Mode
                                </button>
                                <h1 className="m-0 mt-4 font-display text-3xl font-black text-slate-950">Party history</h1>
                                <p className="m-0 mt-1 text-sm text-slate-500">
                                    Completed rooms you hosted or joined, with scores and question review.
                                </p>
                            </div>
                            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-100 text-primary-700">
                                <History className="size-5"/>
                            </span>
                        </div>
                        {error && <div className="mt-5"><Alert>{error}</Alert></div>}
                        {rooms == null || loadingDetail ? (
                            <div className="flex justify-center py-16"><Spinner/></div>
                        ) : (
                            <HistoryList rooms={rooms} onSelect={openDetail}/>
                        )}
                    </>
                )}
            </PageContainer>
        </div>
    );
}
