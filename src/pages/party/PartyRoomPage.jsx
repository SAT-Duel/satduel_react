import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Check, Copy, Crown, Users, X} from 'lucide-react';
import {Button, Spinner} from '../../components/ui';
import UserAvatar from '../../components/UserAvatar';
import RenderWithMath from '../../components/RenderWithMath';
import api from '../../components/api';
import {notify} from '../../utils/notify';
import '../../styles/party.css';

const POLL_MS = 1000;
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const MEDALS = ['🥇', '🥈', '🥉'];

const fmtClock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function WaitingDots({children}) {
    return (
        <p className="m-0 animate-pulse text-center text-[15px] font-semibold text-slate-500">{children}</p>
    );
}

function PlayerChip({player}) {
    return (
        <div className="party-fade-up flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
            <UserAvatar
                backgroundId={player.avatar}
                iconId={player.avatar_icon}
                profile={{username: player.username}}
                size="xs"
                className="ring-0"
            />
            <span className="max-w-32 truncate text-sm font-bold text-slate-800">{player.username}</span>
        </div>
    );
}

function Lobby({state, roomId, onLeave}) {
    const [starting, setStarting] = useState(false);
    const {settings} = state;

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(state.code);
            notify.success('Join code copied.');
        } catch {
            // Clipboard can be unavailable (http, permissions); the code is on screen anyway.
        }
    };

    const start = async () => {
        setStarting(true);
        try {
            await api.post(`/api/party/${roomId}/start/`);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Could not start the game.');
            setStarting(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6">
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">
                    <Users className="size-4 text-slate-400"/> {state.players.length}/{settings.max_players}
                </span>
                <button
                    type="button"
                    onClick={onLeave}
                    aria-label="Leave room"
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
                >
                    <X className="size-5"/>
                </button>
            </div>

            <div className="mt-8 text-center">
                <p className="m-0 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Join code</p>
                <button
                    type="button"
                    onClick={copyCode}
                    title="Copy the join code"
                    className="mt-2 inline-flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-white px-7 py-4 shadow-sm transition-transform active:scale-95"
                >
                    <span className="font-mono text-4xl font-black tracking-[0.25em] text-slate-900 sm:text-5xl">
                        {state.code}
                    </span>
                    <Copy className="size-5 text-slate-400"/>
                </button>
                <p className="mt-3 text-sm text-slate-500">
                    Friends open <span className="font-bold text-slate-700">Party → Join room</span> and type this in.
                </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {state.players.map((player) => <PlayerChip key={player.id} player={player}/>)}
            </div>

            <div className="mt-auto pt-8">
                <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] font-semibold text-slate-400">
                    <span className="capitalize">{settings.subject === 'mixed' ? 'Math + English' : settings.subject}</span>
                    <span>·</span>
                    <span className="capitalize">{settings.difficulty}</span>
                    <span>·</span>
                    <span>{settings.num_questions} questions</span>
                    <span>·</span>
                    <span>{settings.seconds_per_question}s each</span>
                </div>
                {state.is_host ? (
                    <>
                        <Button block size="lg" loading={starting} onClick={start}>
                            Start game
                        </Button>
                        <p className="mb-0 mt-2 text-center text-xs text-slate-400">Players can still join until you start.</p>
                    </>
                ) : (
                    <WaitingDots>Waiting for {state.host_username} to start…</WaitingDots>
                )}
            </div>
        </div>
    );
}

function Countdown({secondsLeft}) {
    const digit = Math.max(1, Math.ceil(secondsLeft));
    return (
        <div className="grid min-h-dvh place-items-center">
            <div key={digit} className="party-pop text-center">
                <p className="m-0 text-[9rem] font-black leading-none text-primary-600">{digit}</p>
                <p className="m-0 mt-2 text-lg font-bold uppercase tracking-[0.3em] text-slate-400">Get ready</p>
            </div>
        </div>
    );
}

function QuestionPhase({state, roomId, secondsLeft}) {
    const [locked, setLocked] = useState(null);
    const question = state.question;
    const questionId = question?.id;

    // Server knows best (covers rejoining mid-question).
    useEffect(() => {
        setLocked(state.your_answer || null);
    }, [questionId, state.your_answer]);

    const answeredCount = state.players.filter((p) => p.answered).length;
    const totalSeconds = state.settings.seconds_per_question;
    const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
    const urgent = secondsLeft <= 10;
    // Short answers (math) sit two-up; sentence answers (English) stack.
    const compactChoices = question.choices.every((choice) => String(choice).length <= 32);

    const answer = async (letter) => {
        if (locked) return;
        setLocked(letter);
        try {
            await api.post(`/api/party/${roomId}/answer/`, {choice: letter});
        } catch (error) {
            const message = error.response?.data?.error;
            if (message && message !== 'Already answered.') {
                setLocked(null);
                notify.error(message);
            }
        }
    };

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-bold text-slate-700">
                    Q {state.question_number}/{state.total_questions}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                    {answeredCount}/{state.players.length} answered
                </span>
                <span
                    className={`rounded-full px-3.5 py-1.5 font-mono text-sm font-bold ${
                        urgent
                            ? 'animate-pulse bg-rose-500 text-white'
                            : 'border border-slate-200 bg-white text-slate-700'
                    }`}
                >
                    {fmtClock(secondsLeft)}
                </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                    className={`h-full rounded-full ${urgent ? 'bg-rose-400' : 'bg-primary-500'}`}
                    style={{width: `${fraction * 100}%`, transition: 'width 1s linear'}}
                />
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="text-[15.5px] leading-relaxed text-slate-900 sm:text-[17px]">
                    <RenderWithMath text={question.question}/>
                </div>
            </div>

            <div className={`mt-4 grid gap-2.5 ${compactChoices ? 'grid-cols-2' : 'grid-cols-1'} sm:gap-3`}>
                {question.choices.map((choice, index) => {
                    const letter = CHOICE_LABELS[index];
                    const isMine = locked === letter;
                    const dim = locked && !isMine;
                    return (
                        <button
                            key={letter}
                            type="button"
                            onClick={() => answer(letter)}
                            disabled={Boolean(locked)}
                            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98] disabled:cursor-default sm:min-h-16 ${
                                isMine
                                    ? 'border-primary-400 bg-primary-50'
                                    : 'border-slate-200 bg-white hover:border-primary-300'
                            } ${dim ? 'opacity-40' : ''}`}
                        >
                            <span
                                className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold ${
                                    isMine
                                        ? 'bg-primary-600 text-white'
                                        : 'border-2 border-slate-300 text-slate-500'
                                }`}
                            >
                                {letter}
                            </span>
                            <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-slate-900">
                                <RenderWithMath text={choice}/>
                            </span>
                            {isMine && <Check className="size-5 shrink-0 text-primary-600"/>}
                        </button>
                    );
                })}
            </div>

            {locked && (
                <p className="m-0 mt-3 animate-pulse text-center text-sm font-bold text-slate-500">
                    Locked in! Waiting for everyone else…
                </p>
            )}
        </div>
    );
}

function Leaderboard({state, roomId}) {
    const [advancing, setAdvancing] = useState(false);
    const reveal = state.reveal || {};

    const next = async () => {
        setAdvancing(true);
        try {
            await api.post(`/api/party/${roomId}/next/`);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Could not advance.');
        } finally {
            setAdvancing(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6">
            <p className="m-0 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Question {state.question_number}/{state.total_questions}
            </p>

            <div
                className={`party-fade-up mt-4 rounded-2xl border p-4 text-center ${
                    reveal.correct
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-rose-200 bg-rose-50'
                }`}
            >
                <p className={`m-0 text-xl font-black ${reveal.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {reveal.correct ? `Correct! +${reveal.points_earned}` : reveal.your_choice ? 'Not this time' : "Time's up"}
                </p>
                {!reveal.correct && (
                    <div className="mt-1 text-sm font-semibold text-rose-600">
                        Answer: {reveal.correct_choice} — <span className="inline-block max-w-full align-bottom"><RenderWithMath text={reveal.correct_text || ''}/></span>
                    </div>
                )}
            </div>

            <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
                {state.players.map((player, index) => (
                    <div
                        key={player.id}
                        className="party-fade-up flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm"
                        style={{animationDelay: `${index * 70}ms`}}
                    >
                        <span className="w-7 text-center text-lg">{MEDALS[index] || <span className="text-sm font-bold text-slate-400">{index + 1}</span>}</span>
                        <UserAvatar
                            backgroundId={player.avatar}
                            iconId={player.avatar_icon}
                            profile={{username: player.username}}
                            size="xs"
                            className="ring-0"
                        />
                        <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-slate-900">{player.username}</span>
                        {player.last_points > 0 && (
                            <span className="text-xs font-bold text-emerald-600">+{player.last_points}</span>
                        )}
                        <span className="font-mono text-[15px] font-bold text-slate-700">{player.score}</span>
                    </div>
                ))}
            </div>

            <div className="pt-5">
                {state.is_host ? (
                    <Button block size="lg" loading={advancing} onClick={next}>
                        {reveal.is_last ? 'Show podium 🏆' : 'Next question →'}
                    </Button>
                ) : (
                    <WaitingDots>Waiting for {state.host_username}…</WaitingDots>
                )}
            </div>
        </div>
    );
}

function Podium({state, onExit}) {
    const [top1, top2, top3] = state.players;
    const rest = state.players.slice(3);
    const columns = [
        {player: top2, place: 2, height: 'h-28', delay: '0.35s', tone: 'bg-slate-200'},
        {player: top1, place: 1, height: 'h-40', delay: '0.75s', tone: 'bg-amber-200'},
        {player: top3, place: 3, height: 'h-20', delay: '0s', tone: 'bg-orange-100'},
    ];

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-8">
            <h1 className="m-0 text-center font-display text-3xl font-black text-slate-900">Final results</h1>

            <div className="mt-10 flex items-end justify-center gap-3">
                {columns.map(({player, place, height, delay, tone}) => player ? (
                    <div key={place} className="flex w-1/3 max-w-36 flex-col items-center">
                        <div className={`mb-2 text-center ${place === 1 ? 'party-bounce' : ''}`}>
                            {place === 1 && <Crown className="mx-auto mb-1 size-7 fill-amber-400 text-amber-400"/>}
                            <UserAvatar
                                backgroundId={player.avatar}
                                iconId={player.avatar_icon}
                                profile={{username: player.username}}
                                size="sm"
                                className="mx-auto ring-2 ring-slate-200"
                            />
                            <p className="m-0 mt-1 max-w-32 truncate text-sm font-bold text-slate-800">{player.username}</p>
                            <p className="m-0 font-mono text-lg font-black text-slate-900">{player.score}</p>
                        </div>
                        <div
                            className={`party-podium-bar w-full rounded-t-2xl ${height} ${tone} grid place-items-start justify-center pt-2 text-2xl`}
                            style={{animationDelay: delay}}
                        >
                            {MEDALS[place - 1]}
                        </div>
                    </div>
                ) : <div key={place} className="w-1/3 max-w-36"/>)}
            </div>

            {rest.length > 0 && (
                <div className="mt-8 space-y-2">
                    {rest.map((player, index) => (
                        <div key={player.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-slate-800">
                            <span className="w-6 text-center text-sm font-bold text-slate-400">{index + 4}</span>
                            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{player.username}</span>
                            <span className="font-mono font-bold">{player.score}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-8">
                <Button block size="lg" onClick={onExit}>
                    Back to Party
                </Button>
            </div>
        </div>
    );
}

function PartyRoomPage() {
    const {roomId} = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState(null);
    // Timer is interpolated locally between polls from the server's seconds_left.
    const deadlineRef = useRef(null);
    const [, forceTick] = useState(0);

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const {data} = await api.get(`/api/party/${roomId}/state/`);
                if (!active) return;
                if (data.seconds_left != null) {
                    deadlineRef.current = Date.now() + data.seconds_left * 1000;
                } else {
                    deadlineRef.current = null;
                }
                setState(data);
            } catch (error) {
                if (!active) return;
                const status = error.response?.status;
                if (status === 403 || status === 404) {
                    notify.error(error.response?.data?.error || 'This room is unavailable.');
                    navigate('/party');
                }
                // Transient network errors: keep polling.
            }
        };
        poll();
        const pollId = setInterval(poll, POLL_MS);
        const tickId = setInterval(() => forceTick((n) => n + 1), 250);
        return () => {
            active = false;
            clearInterval(pollId);
            clearInterval(tickId);
        };
    }, [roomId, navigate]);

    const leave = useCallback(async () => {
        try {
            await api.post(`/api/party/${roomId}/leave/`);
        } catch {
            // Leaving is best-effort; presence timeouts clean up after us anyway.
        }
        navigate('/party');
    }, [roomId, navigate]);

    if (!state) {
        return (
            <div className="grid min-h-dvh place-items-center bg-slate-50">
                <Spinner/>
            </div>
        );
    }

    const secondsLeft = deadlineRef.current == null
        ? 0
        : Math.max(0, (deadlineRef.current - Date.now()) / 1000);

    let content;
    if (state.status === 'lobby') {
        content = <Lobby state={state} roomId={roomId} onLeave={leave}/>;
    } else if (state.status === 'countdown') {
        content = <Countdown secondsLeft={secondsLeft}/>;
    } else if (state.status === 'question') {
        content = <QuestionPhase state={state} roomId={roomId} secondsLeft={secondsLeft}/>;
    } else if (state.status === 'leaderboard') {
        content = <Leaderboard state={state} roomId={roomId}/>;
    } else if (state.started) {
        content = <Podium state={state} onExit={() => navigate('/party')}/>;
    } else {
        content = (
            <div className="grid min-h-dvh place-items-center px-6 text-center">
                <div>
                    <p className="text-lg font-bold text-slate-800">This room has closed.</p>
                    <Button size="lg" onClick={() => navigate('/party')} className="mt-4">
                        Back to Party
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-slate-50">
            {content}
        </div>
    );
}

export default PartyRoomPage;
