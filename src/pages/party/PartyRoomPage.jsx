import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {BarChart3, BookOpen, Check, ChevronDown, Copy, Crown, Pencil, Shuffle, Users, X} from 'lucide-react';
import {Button, ModalShell, Spinner} from '../../components/ui';
import UserAvatar from '../../components/UserAvatar';
import RenderWithMath from '../../components/RenderWithMath';
import api from '../../components/api';
import {notify} from '../../utils/notify';
import '../../styles/party.css';

const POLL_MS = 1000;
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const MEDALS = ['🥇', '🥈', '🥉'];
const TEAM_TONES = [
    {chip: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', ring: 'border-violet-300', soft: 'bg-violet-50'},
    {chip: 'bg-sky-100 text-sky-700', bar: 'bg-sky-500', ring: 'border-sky-300', soft: 'bg-sky-50'},
    {chip: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', ring: 'border-amber-300', soft: 'bg-amber-50'},
    {chip: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', ring: 'border-emerald-300', soft: 'bg-emerald-50'},
];
const toneFor = (index) => TEAM_TONES[index % TEAM_TONES.length];

const fmtClock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function WaitingDots({children}) {
    return (
        <p className="m-0 animate-pulse text-center text-[15px] font-semibold text-slate-500">{children}</p>
    );
}

/** Per-question score change. Losses only happen on a Final Jeopardy bet. */
function DeltaBadge({points, className = 'text-xs'}) {
    if (!points) return null;
    const up = points > 0;
    return (
        <span className={`${className} font-bold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
            {up ? `+${points}` : points}
        </span>
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

function TeamNameField({team, editable, onRename}) {
    const [draft, setDraft] = useState(null);
    const tone = toneFor(team.index);

    if (draft === null) {
        return (
            <button
                type="button"
                disabled={!editable}
                onClick={() => setDraft(team.name)}
                title={editable ? 'Rename this team' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold ${tone.chip} ${
                    editable ? 'cursor-pointer hover:brightness-95' : ''
                }`}
            >
                {team.name}
                {editable && <Pencil className="size-3 opacity-60"/>}
            </button>
        );
    }

    const commit = () => {
        const name = draft.trim();
        setDraft(null);
        if (name && name !== team.name) onRename(name);
    };

    return (
        <input
            autoFocus
            value={draft}
            maxLength={24}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') setDraft(null);
            }}
            className="w-32 rounded-full border-2 border-slate-300 px-2.5 py-1 text-[13px] font-bold text-slate-800 outline-none focus:border-primary-400"
        />
    );
}

/**
 * Host-only team sorter for the lobby.
 *
 * Tap-a-player-then-tap-a-team is the primary interaction — HTML5 drag events
 * never fire on touch, and this is a phone-first feature. Drag is layered on
 * top for anyone hosting from a laptop.
 */
function TeamSorter({state, teams, editable, selected, onSelect, onMove, onRename}) {
    const unassigned = state.players.filter((p) => p.team == null);

    const seat = (player, teamIndex) => (
        <button
            key={player.id}
            type="button"
            disabled={!editable}
            draggable={editable}
            onDragStart={() => onSelect(player.id)}
            // Chips live inside a team's drop zone; without this, picking a player
            // up also counts as dropping the previous one onto that team.
            onClick={(e) => {
                e.stopPropagation();
                onSelect(selected === player.id ? null : player.id);
            }}
            className={`flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-sm font-bold transition-all ${
                selected === player.id
                    ? 'border-primary-500 bg-primary-50 text-primary-800 ring-2 ring-primary-200'
                    : 'border-slate-200 bg-white text-slate-800'
            } ${editable ? 'cursor-pointer hover:border-slate-300' : ''}`}
        >
            <UserAvatar
                backgroundId={player.avatar}
                iconId={player.avatar_icon}
                profile={{username: player.username}}
                size="xs"
                className="ring-0"
            />
            <span className="max-w-24 truncate">{player.username}</span>
            {teamIndex == null && editable && <span className="text-[10px] text-slate-400">tap</span>}
        </button>
    );

    const dropZone = (teamIndex, children, className) => (
        <div
            key={teamIndex ?? 'unassigned'}
            onDragOver={(e) => editable && e.preventDefault()}
            onDrop={() => editable && selected != null && onMove(selected, teamIndex)}
            onClick={() => editable && selected != null && onMove(selected, teamIndex)}
            className={className}
        >
            {children}
        </div>
    );

    return (
        <div className="mt-6">
            {unassigned.length > 0 && dropZone(
                null,
                <>
                    <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Not on a team yet
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {unassigned.map((player) => seat(player, null))}
                    </div>
                </>,
                'rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-3',
            )}

            <div className={`mt-3 grid gap-3 ${teams.length > 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {teams.map((team) => {
                    const tone = toneFor(team.index);
                    const members = state.players.filter((p) => p.team === team.index);
                    return dropZone(
                        team.index,
                        <>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <TeamNameField team={team} editable={editable} onRename={(name) => onRename(team.index, name)}/>
                                <span className="text-[11px] font-bold text-slate-400">{members.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {members.length === 0
                                    ? <span className="text-[13px] text-slate-400">Empty</span>
                                    : members.map((player) => seat(player, team.index))}
                            </div>
                        </>,
                        `rounded-2xl border-2 p-3 transition-colors ${tone.ring} ${tone.soft} ${
                            editable && selected != null ? 'cursor-pointer ring-2 ring-primary-200' : ''
                        }`,
                    );
                })}
            </div>

            {editable && (
                <p className="m-0 mt-2 text-center text-xs text-slate-400">
                    {selected != null
                        ? 'Now tap a team to move them there.'
                        : 'Tap a player, then tap a team. Or drag them across.'}
                </p>
            )}
        </div>
    );
}

function Lobby({state, roomId, onLeave}) {
    const [starting, setStarting] = useState(false);
    const [selected, setSelected] = useState(null);
    const {settings} = state;
    const isTeams = state.mode === 'teams';
    const canSort = isTeams && state.is_host && !settings.random_teams;

    const postTeams = async (payload) => {
        try {
            await api.post(`/api/party/${roomId}/teams/`, payload);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Could not update the teams.');
        }
    };

    const moveTo = (userId, teamIndex) => {
        setSelected(null);
        postTeams({assignments: {[userId]: teamIndex}});
    };

    const rename = (index, name) => {
        const names = (state.teams || []).slice()
            .sort((a, b) => a.index - b.index)
            .map((team) => team.name);
        names[index] = name;
        postTeams({names});
    };

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

            {isTeams ? (
                <TeamSorter
                    state={state}
                    teams={(state.teams || []).slice().sort((a, b) => a.index - b.index)}
                    editable={canSort}
                    selected={selected}
                    onSelect={setSelected}
                    onMove={moveTo}
                    onRename={rename}
                />
            ) : (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    {state.players.map((player) => <PlayerChip key={player.id} player={player}/>)}
                </div>
            )}

            {isTeams && settings.random_teams && (
                <p className="m-0 mt-3 flex items-center justify-center gap-1.5 text-center text-[13px] font-semibold text-slate-400">
                    <Shuffle className="size-3.5"/> Teams are shuffled when the game starts.
                </p>
            )}

            <div className="mt-auto pt-8">
                <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] font-semibold text-slate-400">
                    {isTeams && <><span>{settings.num_teams} teams</span><span>·</span></>}
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

function WagerPhase({state, roomId, secondsLeft}) {
    const info = state.wager || {};
    const maxBet = Math.max(0, info.your_score || 0);
    const [amount, setAmount] = useState(0);
    const [sending, setSending] = useState(false);
    const locked = info.locked;

    const place = async () => {
        setSending(true);
        try {
            await api.post(`/api/party/${roomId}/wager/`, {amount});
        } catch (error) {
            const message = error.response?.data?.error;
            if (message && message !== 'You already placed your bet.') notify.error(message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-5 py-8">
            <div className="text-center">
                <p className="m-0 text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Final question</p>
                <h1 className="m-0 mt-2 font-display text-3xl font-black text-slate-900">Place your bet</h1>
                <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">
                    Win it and your bet pays back double. Lose it and it&apos;s gone.
                    On this question, answering faster earns no extra points.
                </p>
            </div>

            <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-slate-500">Your score</span>
                    <span className="font-mono text-2xl font-black text-slate-900">{maxBet}</span>
                </div>

                {maxBet === 0 ? (
                    <p className="m-0 mt-4 text-center text-sm font-semibold text-slate-500">
                        You have nothing to bet this round — answer correctly to get back in it.
                    </p>
                ) : locked ? (
                    <div className="mt-5 text-center">
                        <p className="m-0 text-sm font-semibold text-slate-500">Your bet is locked in</p>
                        <p className="m-0 mt-1 font-mono text-4xl font-black text-amber-600">{info.your_wager}</p>
                    </div>
                ) : (
                    <>
                        <p className="m-0 mt-5 text-center font-mono text-5xl font-black text-amber-600">{amount}</p>
                        <input
                            type="range"
                            min={0}
                            max={maxBet}
                            step={Math.max(1, Math.round(maxBet / 100))}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            aria-label="Bet amount"
                            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-500"
                        />
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {[
                                ['None', 0],
                                ['¼', Math.floor(maxBet / 4)],
                                ['Half', Math.floor(maxBet / 2)],
                                ['All in', maxBet],
                            ].map(([label, value]) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setAmount(value)}
                                    className={`cursor-pointer rounded-xl border-2 py-2 text-sm font-bold transition-colors ${
                                        amount === value
                                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <Button block size="lg" className="mt-5" loading={sending} onClick={place}>
                            Lock in {amount}
                        </Button>
                    </>
                )}
            </div>

            <div className="mt-6 text-center">
                <p className="m-0 font-mono text-lg font-bold text-slate-700">{fmtClock(secondsLeft)}</p>
                <p className="m-0 mt-1 text-xs font-semibold text-slate-400">
                    {info.waiting_on > 0
                        ? `Waiting on ${info.waiting_on} more ${info.waiting_on === 1 ? 'bet' : 'bets'}…`
                        : 'All bets are in.'}
                    {' '}Unplaced bets count as zero when time runs out.
                </p>
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
            {state.is_final_question && (
                <div className="mb-3 flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2">
                    <span className="text-[13px] font-bold uppercase tracking-wide text-amber-700">Final question</span>
                    <span className="text-[13px] font-semibold text-amber-600">
                        · {state.your_wager} on the line · speed doesn&apos;t count
                    </span>
                </div>
            )}
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

function AnswerSpread({reveal, playerCount}) {
    const [open, setOpen] = useState(false);
    const counts = reveal.distribution || {};
    const gotItRight = counts[reveal.correct_choice] || 0;
    const busiest = Math.max(1, ...CHOICE_LABELS.map((letter) => counts[letter] || 0));

    return (
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-slate-50"
            >
                <BarChart3 className="size-4 shrink-0 text-slate-400"/>
                <span className="flex-1 text-[13px] font-bold text-slate-700">
                    {gotItRight} of {playerCount} got it right
                </span>
                <ChevronDown className={`size-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>

            {open && (
                <div className="space-y-1.5 border-t border-slate-100 px-3.5 py-3">
                    {CHOICE_LABELS.map((letter) => {
                        const count = counts[letter] || 0;
                        const isCorrect = letter === reveal.correct_choice;
                        const isYours = letter === reveal.your_choice;
                        return (
                            <div key={letter} className="flex items-center gap-2.5">
                                <span
                                    className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {letter}
                                </span>
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            isCorrect ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`}
                                        style={{width: `${(count / busiest) * 100}%`}}
                                    />
                                </div>
                                <span className="w-4 text-right text-[11px] font-bold text-slate-500">{count}</span>
                                <span className="w-8 text-[10px] font-bold uppercase text-primary-600">
                                    {isYours ? 'you' : ''}
                                </span>
                            </div>
                        );
                    })}
                    {reveal.skipped > 0 && (
                        <p className="m-0 pt-1 text-[11px] text-slate-400">
                            {reveal.skipped} didn&apos;t answer in time.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function ReviewModal({reveal, onClose}) {
    const review = reveal.review || {};
    return (
        <ModalShell open title="Question review" onClose={onClose} maxWidth="max-w-2xl">
            <div className="text-[15px] leading-relaxed text-slate-900">
                <RenderWithMath text={review.question || ''}/>
            </div>

            <div className="mt-4 space-y-2">
                {(review.choices || []).map((choice, index) => {
                    const letter = CHOICE_LABELS[index];
                    const isCorrect = letter === reveal.correct_choice;
                    const isYourMistake = letter === reveal.your_choice && !reveal.correct;
                    return (
                        <div
                            key={letter}
                            className={`flex items-start gap-3 rounded-2xl border-2 px-3.5 py-2.5 ${
                                isCorrect
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : isYourMistake
                                        ? 'border-rose-300 bg-rose-50'
                                        : 'border-slate-200 bg-white'
                            }`}
                        >
                            <span
                                className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                                    isCorrect
                                        ? 'bg-emerald-500 text-white'
                                        : isYourMistake
                                            ? 'bg-rose-500 text-white'
                                            : 'border-2 border-slate-300 text-slate-500'
                                }`}
                            >
                                {letter}
                            </span>
                            <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-slate-900">
                                <RenderWithMath text={choice}/>
                            </span>
                            {isCorrect && (
                                <span className="shrink-0 text-[10px] font-bold uppercase text-emerald-600">correct</span>
                            )}
                            {isYourMistake && (
                                <span className="shrink-0 text-[10px] font-bold uppercase text-rose-600">your pick</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {review.explanation && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-slate-400">Explanation</p>
                    <div className="mt-1.5 text-sm leading-relaxed text-slate-700">
                        <RenderWithMath text={review.explanation}/>
                    </div>
                </div>
            )}
        </ModalShell>
    );
}

function TeamStandings({teams}) {
    return (
        <div className="space-y-2.5">
            {teams.map((team, rank) => {
                const tone = toneFor(team.index);
                const scored = team.members.filter((m) => m.score > 0);
                return (
                    <div
                        key={team.index}
                        className="party-fade-up rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                        style={{animationDelay: `${rank * 70}ms`}}
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-7 text-center text-lg">
                                {MEDALS[rank] || <span className="text-sm font-bold text-slate-400">{rank + 1}</span>}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-[13px] font-bold ${tone.chip}`}>
                                {team.name}
                            </span>
                            <span className="flex-1"/>
                            <DeltaBadge points={team.last_points}/>
                            <span className="font-mono text-[15px] font-bold text-slate-800">{team.score}</span>
                        </div>

                        {/* Who actually built that score. */}
                        {scored.length > 0 && (
                            <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
                                {scored.map((member) => (
                                    <span
                                        key={member.id}
                                        className={`${tone.bar} border-r border-white last:border-0`}
                                        style={{width: `${(member.score / team.score) * 100}%`}}
                                        title={`${member.username}: ${member.score}`}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="mt-2 space-y-1">
                            {team.members.map((member) => (
                                <div key={member.id} className="flex items-center gap-2 pl-10 text-[13px]">
                                    <UserAvatar
                                        backgroundId={member.avatar}
                                        iconId={member.avatar_icon}
                                        profile={{username: member.username}}
                                        size="xs"
                                        className="ring-0"
                                    />
                                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-600">
                                        {member.username}
                                    </span>
                                    <DeltaBadge points={member.last_points} className="text-[11px]"/>
                                    <span className="font-mono font-bold text-slate-500">{member.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Leaderboard({state, roomId}) {
    const [advancing, setAdvancing] = useState(false);
    const [reviewing, setReviewing] = useState(false);
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
                {reveal.was_final_bet && reveal.wager > 0 && (
                    <p className={`m-0 mt-2 text-sm font-bold ${reveal.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {reveal.correct
                            ? `Your ${reveal.wager} bet paid back double.`
                            : `You lost your ${reveal.wager} bet.`}
                    </p>
                )}
            </div>

            <AnswerSpread reveal={reveal} playerCount={state.players.length}/>

            <button
                type="button"
                onClick={() => setReviewing(true)}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
                <BookOpen className="size-4 text-slate-400"/> Review this question
            </button>

            <div className="mt-5 flex-1 overflow-y-auto">
                {state.mode === 'teams' && state.teams ? (
                    <TeamStandings teams={state.teams}/>
                ) : (
                    <div className="space-y-2">
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
                                <DeltaBadge points={player.last_points}/>
                                <span className="font-mono text-[15px] font-bold text-slate-700">{player.score}</span>
                            </div>
                        ))}
                    </div>
                )}
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

            {reviewing && <ReviewModal reveal={reveal} onClose={() => setReviewing(false)}/>}
        </div>
    );
}

function Podium({state, onExit}) {
    const isTeams = state.mode === 'teams' && Boolean(state.teams);
    // Teams podium the teams; everyone else podiums the players.
    const entries = useMemo(() => (
        isTeams
            ? state.teams.map((team) => ({
                key: `team-${team.index}`,
                label: team.name,
                score: team.score,
                team,
            }))
            : state.players.map((player) => ({
                key: player.id,
                label: player.username,
                score: player.score,
                player,
            }))
    ), [isTeams, state.teams, state.players]);

    const [top1, top2, top3] = entries;
    const rest = entries.slice(3);
    const columns = [
        {entry: top2, place: 2, height: 'h-28', delay: '0.35s', tone: 'bg-slate-200'},
        {entry: top1, place: 1, height: 'h-40', delay: '0.75s', tone: 'bg-amber-200'},
        {entry: top3, place: 3, height: 'h-20', delay: '0s', tone: 'bg-orange-100'},
    ];

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-8">
            <h1 className="m-0 text-center font-display text-3xl font-black text-slate-900">Final results</h1>

            <div className="mt-10 flex items-end justify-center gap-3">
                {columns.map(({entry, place, height, delay, tone}) => entry ? (
                    <div key={place} className="flex w-1/3 max-w-36 flex-col items-center">
                        <div className={`mb-2 text-center ${place === 1 ? 'party-bounce' : ''}`}>
                            {place === 1 && <Crown className="mx-auto mb-1 size-7 fill-amber-400 text-amber-400"/>}
                            {entry.team ? (
                                <span
                                    className={`mx-auto grid size-11 place-items-center rounded-2xl text-lg font-black ${toneFor(entry.team.index).chip}`}
                                >
                                    {entry.label.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <UserAvatar
                                    backgroundId={entry.player.avatar}
                                    iconId={entry.player.avatar_icon}
                                    profile={{username: entry.label}}
                                    size="sm"
                                    className="mx-auto ring-2 ring-slate-200"
                                />
                            )}
                            <p className="m-0 mt-1 max-w-32 truncate text-sm font-bold text-slate-800">{entry.label}</p>
                            <p className="m-0 font-mono text-lg font-black text-slate-900">{entry.score}</p>
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
                    {rest.map((entry, index) => (
                        <div key={entry.key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-slate-800">
                            <span className="w-6 text-center text-sm font-bold text-slate-400">{index + 4}</span>
                            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{entry.label}</span>
                            <span className="font-mono font-bold">{entry.score}</span>
                        </div>
                    ))}
                </div>
            )}

            {isTeams && (
                <div className="mt-8">
                    <p className="m-0 mb-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Who scored what
                    </p>
                    <TeamStandings teams={state.teams}/>
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
    } else if (state.status === 'wager') {
        content = <WagerPhase state={state} roomId={roomId} secondsLeft={secondsLeft}/>;
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
