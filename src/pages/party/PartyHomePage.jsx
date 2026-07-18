import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Crown, PartyPopper, Play, Smartphone, Trophy, Users} from 'lucide-react';
import {Button, PageContainer} from '../../components/ui';
import {useAuth} from '../../context/AuthContext';
import api from '../../components/api';
import {notify} from '../../utils/notify';

const SUBJECTS = [
    ['math', 'Math'],
    ['english', 'English'],
    ['mixed', 'Mix'],
];
const DIFFICULTIES = [
    ['easy', 'Easy', 'Levels 1–3'],
    ['medium', 'Medium', 'Levels 2–4'],
    ['hard', 'Hard', 'Levels 3–5'],
];
const TIMER_OPTIONS = [30, 45, 60, 90, 120];

const STEPS = [
    {
        icon: PartyPopper,
        title: 'Create a room',
        text: 'One person hosts: pick the subject, difficulty, number of questions, and how long everyone gets per question.',
    },
    {
        icon: Smartphone,
        title: 'Friends join with the code',
        text: 'The host gets a 6-digit code. Everyone else taps "Join room", types it in on their phone, and appears in the lobby.',
    },
    {
        icon: Play,
        title: 'Answer fast, score big',
        text: 'When the host hits start, everyone sees the same question. Correct answers earn 500–1000 points — the faster you lock in, the more you get.',
    },
    {
        icon: Trophy,
        title: 'Leaderboard and podium',
        text: 'After each question the standings pop up, and the host advances to the next one. The game ends on the podium with the top three players.',
    },
];

function SegmentedControl({options, value, onChange}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {options.map(([key, label, hint]) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    className={`cursor-pointer rounded-xl border-2 px-2 py-2.5 text-center transition-colors ${
                        value === key
                            ? 'border-primary-400 bg-primary-50 text-primary-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                >
                    <span className="block text-sm font-bold">{label}</span>
                    {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
                </button>
            ))}
        </div>
    );
}

function StepperInput({label, hint, value, onChange, min, max}) {
    const clamp = (n) => Math.max(min, Math.min(max, n));
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="text-[11px] text-slate-400">{hint}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(clamp(value - 1))}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-slate-200 bg-white text-lg font-bold text-slate-600 hover:border-slate-300"
                    aria-label={`Decrease ${label}`}
                >
                    −
                </button>
                <input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    min={min}
                    max={max}
                    onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
                    className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white text-center text-base font-bold text-slate-800 outline-none focus:border-primary-400"
                />
                <button
                    type="button"
                    onClick={() => onChange(clamp(value + 1))}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-slate-200 bg-white text-lg font-bold text-slate-600 hover:border-slate-300"
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

function PartyHomePage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const premium = Boolean(user?.is_premium);
    const playerCap = premium ? 50 : 6;
    const questionCap = premium ? 50 : 20;

    const [view, setView] = useState('menu'); // menu | create | join
    const [busy, setBusy] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [settings, setSettings] = useState({
        max_players: 6,
        num_questions: 10,
        seconds_per_question: 90,
        subject: 'mixed',
        difficulty: 'medium',
    });
    const set = (key) => (value) => setSettings((s) => ({...s, [key]: value}));

    const createRoom = async () => {
        setBusy(true);
        try {
            const {data} = await api.post('/api/party/create/', settings);
            navigate(`/party/${data.id}`);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Could not create the room.');
            setBusy(false);
        }
    };

    const joinRoom = async () => {
        if (joinCode.trim().length < 6) return;
        setBusy(true);
        try {
            const {data} = await api.post('/api/party/join/', {code: joinCode.trim()});
            navigate(`/party/${data.id}`);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Could not join that room.');
            setBusy(false);
        }
    };

    return (
        <PageContainer maxWidth="max-w-2xl" className="px-4 py-8 sm:py-12">
            <div className="text-center">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-3xl bg-primary-50">
                    <PartyPopper className="size-8 text-primary-600"/>
                </div>
                <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Party Mode</h1>
                <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-slate-500">
                    A live, Kahoot-style SAT quiz for you and your friends. One phone each — fastest correct answer wins.
                </p>
            </div>

            {view === 'menu' && (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setView('create')}
                            className="group cursor-pointer rounded-3xl border-2 border-primary-200 bg-primary-50/60 p-6 text-left shadow-sm transition-all hover:border-primary-300 active:scale-[0.98] sm:p-7"
                        >
                            <span className="grid size-12 place-items-center rounded-2xl bg-primary-100">
                                <PartyPopper className="size-6 text-primary-600"/>
                            </span>
                            <span className="mt-4 block text-xl font-bold text-slate-900">Create a room</span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-500">
                                Host the game and get a join code to share.
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('join')}
                            className="group cursor-pointer rounded-3xl border-2 border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-primary-300 active:scale-[0.98] sm:p-7"
                        >
                            <span className="grid size-12 place-items-center rounded-2xl bg-primary-50">
                                <Users className="size-6 text-primary-600"/>
                            </span>
                            <span className="mt-4 block text-xl font-bold text-slate-900">Join a room</span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-500">
                                Got a 6-digit code from a friend? Jump in here.
                            </span>
                        </button>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-center font-display text-xl font-bold text-slate-900">How does this work?</h2>
                        <div className="mt-5 space-y-3">
                            {STEPS.map(({icon: Icon, title, text}, index) => (
                                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="relative shrink-0">
                                        <span className="grid size-11 place-items-center rounded-xl bg-primary-50">
                                            <Icon className="size-5 text-primary-600"/>
                                        </span>
                                        <span className="absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary-600 text-[11px] font-bold text-white">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="m-0 text-[15px] font-bold text-slate-900">{title}</p>
                                        <p className="m-0 mt-0.5 text-sm leading-relaxed text-slate-500">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!premium && (
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Free rooms fit up to 6 players and 20 questions.{' '}
                                <a href="/upgrade" className="font-semibold text-primary-600 no-underline">Premium</a>{' '}
                                raises both to 50.
                            </p>
                        )}
                    </div>
                </>
            )}

            {view === 'create' && (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <button
                        type="button"
                        onClick={() => setView('menu')}
                        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft className="size-4"/> Back
                    </button>
                    <h2 className="m-0 font-display text-xl font-bold text-slate-900">Room settings</h2>

                    <div className="mt-5 space-y-5">
                        <StepperInput
                            label="Max players"
                            hint={premium ? 'up to 50' : (
                                <span className="inline-flex items-center gap-1">
                                    up to 6 · <Crown className="size-3 text-amber-500"/> 50 with Premium
                                </span>
                            )}
                            value={settings.max_players}
                            onChange={set('max_players')}
                            min={2}
                            max={playerCap}
                        />
                        <StepperInput
                            label="Number of questions"
                            hint={premium ? 'up to 50' : (
                                <span className="inline-flex items-center gap-1">
                                    up to 20 · <Crown className="size-3 text-amber-500"/> 50 with Premium
                                </span>
                            )}
                            value={settings.num_questions}
                            onChange={set('num_questions')}
                            min={1}
                            max={questionCap}
                        />
                        <div>
                            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Time per question</span>
                            <div className="grid grid-cols-5 gap-2">
                                {TIMER_OPTIONS.map((seconds) => (
                                    <button
                                        key={seconds}
                                        type="button"
                                        onClick={() => set('seconds_per_question')(seconds)}
                                        className={`cursor-pointer rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                                            settings.seconds_per_question === seconds
                                                ? 'border-primary-400 bg-primary-50 text-primary-800'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {seconds}s
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</span>
                            <SegmentedControl options={SUBJECTS} value={settings.subject} onChange={set('subject')}/>
                        </div>
                        <div>
                            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Difficulty</span>
                            <SegmentedControl options={DIFFICULTIES} value={settings.difficulty} onChange={set('difficulty')}/>
                        </div>
                    </div>

                    <Button block size="lg" className="mt-7" loading={busy} onClick={createRoom}>
                        Create room
                    </Button>
                </div>
            )}

            {view === 'join' && (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <button
                        type="button"
                        onClick={() => setView('menu')}
                        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft className="size-4"/> Back
                    </button>
                    <h2 className="m-0 font-display text-xl font-bold text-slate-900">Enter the join code</h2>
                    <p className="mt-1 text-sm text-slate-500">Ask the host for the 6-digit code on their screen.</p>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        maxLength={6}
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                        placeholder="000000"
                        className="mt-5 h-16 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 text-center font-mono text-3xl font-bold tracking-[0.4em] text-slate-900 outline-none placeholder:text-slate-300 focus:border-primary-400"
                    />
                    <Button block size="lg" className="mt-5" loading={busy} disabled={joinCode.length < 6} onClick={joinRoom}>
                        Join room
                    </Button>
                </div>
            )}
        </PageContainer>
    );
}

export default PartyHomePage;
