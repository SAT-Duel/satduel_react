import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Check, Crown, HelpCircle, PartyPopper, Play, Smartphone, Trophy, Users} from 'lucide-react';
import {Button, ModalShell, PageContainer, Toggle} from '../../components/ui';
import {useAuth} from '../../context/AuthContext';
import api from '../../components/api';
import {notify} from '../../utils/notify';
import {PARTY_MODES} from './modes';

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
const TEAM_COUNTS = [
    ['2', '2 teams'],
    ['3', '3 teams'],
    ['4', '4 teams'],
];
const TIMER_OPTIONS = [30, 45, 60, 90, 120];
const TIME_LIMIT_OPTIONS = [[300, '5 min'], [600, '10 min'], [900, '15 min']];
const MAX_LIVES = 5;

// Mirrors party_lives_cap on the server: a fixed-length game scales the cap to
// the question count so hearts stay scarce enough to be worth something.
const livesCap = (lastStanding, numQuestions) =>
    lastStanding ? MAX_LIVES : Math.max(1, Math.ceil(Math.sqrt(Math.max(1, numQuestions))));

const HOW_IT_WORKS = [
    {
        icon: PartyPopper,
        title: 'Pick a mode and host a room',
        text: 'One person hosts: choose a game mode, then set the subject, difficulty, number of questions, and how long everyone gets.',
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
        text: 'After each question the standings pop up, with the answer spread and a full review of the question. The game ends on the podium.',
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

function StepBar({step}) {
    const labels = ['Select mode', 'Room settings'];
    return (
        <div className="mb-6 flex items-center gap-2">
            {labels.map((label, index) => {
                const number = index + 1;
                const done = step > number;
                const active = step === number;
                return (
                    <React.Fragment key={label}>
                        <div className="flex items-center gap-2">
                            <span
                                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                                    done
                                        ? 'bg-primary-600 text-white'
                                        : active
                                            ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-400'
                                            : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                                {done ? <Check className="size-4"/> : number}
                            </span>
                            <span
                                className={`text-[13px] font-bold ${
                                    active ? 'text-slate-900' : 'text-slate-400'
                                }`}
                            >
                                {label}
                            </span>
                        </div>
                        {number < labels.length && (
                            <span
                                className={`h-0.5 min-w-4 flex-1 rounded-full ${
                                    done ? 'bg-primary-500' : 'bg-slate-200'
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function ModeCard({mode, selected, onSelect, onDetails}) {
    const {Art} = mode;
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onSelect}
                disabled={!mode.available}
                className={`w-full cursor-pointer overflow-hidden rounded-3xl border-2 p-4 text-left shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${
                    selected ? mode.cardOn : mode.card
                } ${mode.available ? 'hover:-translate-y-0.5 hover:shadow-md' : ''}`}
            >
                <div className={`mx-auto h-20 w-full max-w-44 ${mode.text}`}>
                    <Art/>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{mode.name}</span>
                    {selected && <Check className={`size-4 ${mode.text}`}/>}
                    {!mode.available && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Soon
                        </span>
                    )}
                </div>
                <p className="m-0 mt-0.5 pr-6 text-[13px] leading-snug text-slate-500">{mode.tagline}</p>
            </button>
            <button
                type="button"
                onClick={onDetails}
                aria-label={`How ${mode.name} works`}
                title={`How ${mode.name} works`}
                className="absolute right-3 top-3 grid size-7 cursor-pointer place-items-center rounded-full bg-white/70 text-slate-400 backdrop-blur transition-colors hover:bg-white hover:text-slate-700"
            >
                <HelpCircle className="size-4"/>
            </button>
        </div>
    );
}

function ModeDetailModal({mode, onClose, onPick}) {
    if (!mode) return null;
    const {Art} = mode;
    return (
        <ModalShell
            open
            title={mode.name}
            onClose={onClose}
            footer={
                mode.available ? (
                    <Button onClick={onPick}>Play {mode.name}</Button>
                ) : (
                    <span className="text-sm font-semibold text-slate-400">Coming soon</span>
                )
            }
        >
            <div className={`mx-auto h-24 w-full max-w-52 ${mode.text}`}>
                <Art/>
            </div>
            <p className="mt-3 text-[15px] font-semibold text-slate-800">{mode.summary}</p>
            <ul className="mt-3 space-y-2 pl-0">
                {mode.how.map((line) => (
                    <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                        <span className={`mt-1.5 size-1.5 shrink-0 rounded-full bg-current ${mode.text}`}/>
                        <span>{line}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-slate-400">Best for</p>
                <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">{mode.bestFor}</p>
            </div>
        </ModalShell>
    );
}

function PartyHomePage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const premium = Boolean(user?.is_premium);
    const playerCap = premium ? 50 : 6;
    const questionCap = premium ? 50 : 20;

    const [view, setView] = useState('menu'); // menu | create | join
    const [step, setStep] = useState(1); // 1 = pick mode, 2 = room settings
    const [detailMode, setDetailMode] = useState(null);
    const [busy, setBusy] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [settings, setSettings] = useState({
        mode: 'classic',
        max_players: 6,
        num_questions: 10,
        seconds_per_question: 90,
        subject: 'mixed',
        difficulty: 'medium',
        num_teams: 2,
        random_teams: true,
        lives: 3,
        last_standing: true,
        time_limit: 600,
    });
    const set = (key) => (value) => setSettings((s) => ({...s, [key]: value}));
    const heartCap = livesCap(settings.last_standing, settings.num_questions);

    const pickMode = (key) => {
        setSettings((s) => ({
            ...s,
            mode: key,
            // Teams need one player per team; Jeopardy needs a question before the bet.
            max_players: key === 'teams' ? Math.max(s.max_players, s.num_teams) : s.max_players,
            num_questions: key === 'jeopardy' ? Math.max(s.num_questions, 2) : s.num_questions,
        }));
        setStep(2);
        setDetailMode(null);
    };

    const openCreate = () => {
        setView('create');
        setStep(1);
    };

    const createRoom = async () => {
        setBusy(true);
        try {
            // Lowering the question count can pull the heart cap under the
            // current pick, so send what the stepper is actually showing.
            const {data} = await api.post('/api/party/create/', {
                ...settings,
                lives: Math.min(settings.lives, heartCap),
            });
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
                    A live SAT quiz for you and your friends. One phone each — pick a game mode and go.
                </p>
            </div>

            {view === 'menu' && (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={openCreate}
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
                            {HOW_IT_WORKS.map(({icon: Icon, title, text}, index) => (
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
                        onClick={() => (step === 2 ? setStep(1) : setView('menu'))}
                        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft className="size-4"/> Back
                    </button>

                    <StepBar step={step}/>

                    {step === 1 ? (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold text-slate-900">Choose a game mode</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Tap the <HelpCircle className="inline size-3.5 align-[-2px] text-slate-400"/> on any card
                                to see how it plays.
                            </p>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {PARTY_MODES.map((mode) => (
                                    <ModeCard
                                        key={mode.key}
                                        mode={mode}
                                        selected={settings.mode === mode.key}
                                        onSelect={() => pickMode(mode.key)}
                                        onDetails={() => setDetailMode(mode)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold text-slate-900">Room settings</h2>

                            <div className="mt-5 space-y-5">
                                {settings.mode === 'teams' && (
                                    <>
                                        <div>
                                            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                How many teams?
                                            </span>
                                            <SegmentedControl
                                                options={TEAM_COUNTS}
                                                value={String(settings.num_teams)}
                                                onChange={(value) => setSettings((s) => ({
                                                    ...s,
                                                    num_teams: Number(value),
                                                    max_players: Math.max(s.max_players, Number(value)),
                                                }))}
                                            />
                                        </div>
                                        <Toggle
                                            checked={settings.random_teams}
                                            onChange={set('random_teams')}
                                            label="Shuffle teams automatically"
                                            description={
                                                settings.random_teams
                                                    ? 'Players are split evenly at random when you start the game.'
                                                    : 'You sort players into teams yourself in the lobby.'
                                            }
                                        />
                                    </>
                                )}
                                {settings.mode === 'survival' && (
                                    <>
                                        <div>
                                            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                How does it end?
                                            </span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    [true, 'Last one standing', 'Play until one player is left'],
                                                    [false, 'Fixed questions', 'Most hearts at the end wins'],
                                                ].map(([value, label, hint]) => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => setSettings((s) => ({
                                                            ...s,
                                                            last_standing: value,
                                                            // The cap moves with the mode, so pull hearts back into range.
                                                            lives: Math.min(s.lives, livesCap(value, s.num_questions)),
                                                        }))}
                                                        className={`cursor-pointer rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
                                                            settings.last_standing === value
                                                                ? 'border-primary-400 bg-primary-50 text-primary-800'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <span className="block text-sm font-bold">{label}</span>
                                                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">{hint}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <StepperInput
                                            label="Hearts each"
                                            hint={settings.last_standing
                                                ? `up to ${MAX_LIVES}`
                                                : `up to ${heartCap} for ${settings.num_questions} questions`}
                                            value={Math.min(settings.lives, heartCap)}
                                            onChange={set('lives')}
                                            min={1}
                                            max={heartCap}
                                        />
                                    </>
                                )}
                                <StepperInput
                                    label="Max players"
                                    hint={premium ? 'up to 50' : (
                                        <span className="inline-flex items-center gap-1">
                                            up to 6 · <Crown className="size-3 text-amber-500"/> 50 with Premium
                                        </span>
                                    )}
                                    value={settings.max_players}
                                    onChange={set('max_players')}
                                    min={settings.mode === 'teams' ? settings.num_teams : 2}
                                    max={playerCap}
                                />
                                {settings.mode === 'goldrush' ? (
                                    <div>
                                        <div className="mb-1.5 flex items-baseline justify-between">
                                            <span className="text-sm font-semibold text-slate-700">Game length</span>
                                            <span className="text-[11px] text-slate-400">
                                                {premium ? '100-question pool' : (
                                                    <span className="inline-flex items-center gap-1">
                                                        30-question pool · <Crown className="size-3 text-amber-500"/> 100 with Premium
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {TIME_LIMIT_OPTIONS.map(([seconds, label]) => (
                                                <button
                                                    key={seconds}
                                                    type="button"
                                                    onClick={() => set('time_limit')(seconds)}
                                                    className={`cursor-pointer rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                                                        settings.time_limit === seconds
                                                            ? 'border-primary-400 bg-primary-50 text-primary-800'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <StepperInput
                                            label="Number of questions"
                                            hint={premium ? 'up to 50' : (
                                                <span className="inline-flex items-center gap-1">
                                                    up to 20 · <Crown className="size-3 text-amber-500"/> 50 with Premium
                                                </span>
                                            )}
                                            value={settings.num_questions}
                                            onChange={set('num_questions')}
                                            // Final Jeopardy needs a normal question before the bet.
                                            min={settings.mode === 'jeopardy' ? 2 : 1}
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
                                    </>
                                )}
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
                        </>
                    )}
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

            <ModeDetailModal
                mode={detailMode}
                onClose={() => setDetailMode(null)}
                onPick={() => pickMode(detailMode.key)}
            />
        </PageContainer>
    );
}

export default PartyHomePage;
