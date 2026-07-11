import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import SEO, {organizationJsonLd, softwareAppJsonLd, websiteJsonLd} from '../components/SEO';
import '../styles/landing.css';
import novaQuill from '../assets/avatars/pixel/nova-quill.png';
import emberAbacus from '../assets/avatars/pixel/ember-abacus.png';
import echoFencer from '../assets/avatars/pixel/echo-fencer.png';
import orbitScout from '../assets/avatars/pixel/orbit-scout.png';
import prismPage from '../assets/avatars/pixel/prism-page.png';
import slateSentinel from '../assets/avatars/pixel/slate-sentinel.png';

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

const fmt = (n) => `0:${String(Math.min(n, 99)).padStart(2, '0')}`;

// decorative looping countdown (hero + duel mocks)
function useLoopTimer(start, resetAt) {
    const [t, setT] = useState(start);
    useEffect(() => {
        const id = setInterval(() => setT((v) => (v <= resetAt ? start : v - 1)), 1000);
        return () => clearInterval(id);
    }, [start, resetAt]);
    return t;
}

const MONO = 'sd-mono font-bold';

function Eyebrow({color = '#7C5CF0', children}) {
    return (
        <span className={`${MONO} text-xs tracking-[0.12em]`} style={{color}}>
            {children}
        </span>
    );
}

function H2({className = '', children}) {
    return (
        <h2 className={`sd-display m-0 mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-[var(--sd-text)] sm:text-[44px] ${className}`}>
            {children}
        </h2>
    );
}

function PrimaryCta({to = '/register', children, className = ''}) {
    return (
        <Link
            to={to}
            className={`inline-block rounded-xl bg-[#7C5CF0] px-[30px] py-[15px] text-base font-bold text-white no-underline shadow-[0_6px_20px_rgba(124,92,240,0.4)] transition-colors hover:bg-[#9678FF] ${className}`}
        >
            {children}
        </Link>
    );
}

function OutlineCta({href = '#demo', children, className = ''}) {
    return (
        <a
            href={href}
            className={`inline-block rounded-xl border-[1.5px] border-[var(--sd-line3)] px-[30px] py-[15px] text-base font-bold text-[var(--sd-body)] no-underline transition-colors hover:border-[#A78BFA] hover:text-[var(--sd-text)] ${className}`}
        >
            {children}
        </a>
    );
}

const panelCls = 'rounded-2xl border border-[var(--sd-line2)] bg-[var(--sd-panel)]';
const paperCls = 'overflow-hidden rounded-2xl border border-[#E4E1D6] bg-[#F7F5EF]';

function CardHeader({label, children}) {
    return (
        <div className="flex items-center justify-between bg-[#131B2C] px-[18px] py-3">
            <span className={`${MONO} text-[11px] tracking-[0.08em] text-[#C0B0FA]`}>{label}</span>
            {children}
        </div>
    );
}

function TimerChip({children, className = ''}) {
    return (
        <span className={`${MONO} rounded-lg border border-[rgba(233,188,79,0.4)] px-2.5 py-1 text-sm text-[#E9BC4F] ${className}`}>
            {children}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* hero collage                                                        */
/* ------------------------------------------------------------------ */

const HERO_CHOICES = [
    {key: 'A', text: 'celebrated'},
    {key: 'B', text: 'dismissed', correct: true},
    {key: 'C', text: 'duplicated'},
    {key: 'D', text: 'funded'},
];

function HeroQuestionCard({timer}) {
    return (
        <div className={`${paperCls} w-full max-w-[400px] shadow-[var(--sd-shadow)] lg:absolute lg:left-1/2 lg:top-0 lg:z-[3] lg:w-[400px] lg:-translate-x-1/2`}>
            <CardHeader label="R&W · WORDS IN CONTEXT">
                <TimerChip>{fmt(timer)}</TimerChip>
            </CardHeader>
            <div className="p-[18px]">
                <p className="m-0 text-sm font-medium leading-[1.55] text-[#131B2C]">
                    Marie Tharp’s detailed maps of the ocean floor were initially ______ by many of her colleagues, but they later became central to the theory of plate tectonics.
                </p>
                <div className="mt-3.5 flex flex-col gap-2">
                    {HERO_CHOICES.map((c) => c.correct ? (
                        <div key={c.key} className="flex items-center justify-between rounded-[10px] border-[1.5px] border-[#2FBF71] bg-[#EAF9F1] px-3 py-[9px]">
                            <span className="flex items-center gap-2.5">
                                <span className="grid size-6 place-items-center rounded-full bg-[#2FBF71] text-xs font-bold text-white">{c.key}</span>
                                <span className="text-[13.5px] font-semibold text-[#131B2C]">{c.text}</span>
                            </span>
                            <span className={`${MONO} text-[11px] text-[#1E9A5A]`}>CORRECT</span>
                        </div>
                    ) : (
                        <div key={c.key} className="flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#E4E1D6] bg-white px-3 py-[9px] opacity-60 first:opacity-100">
                            <span className="grid size-6 place-items-center rounded-full border-2 border-[#B9BFCB] text-[11px] font-bold text-[#5A6376]">{c.key}</span>
                            <span className="text-[13.5px] text-[#131B2C]">{c.text}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3.5 flex gap-2">
                    <span className={`${MONO} rounded-md border border-[#BFE8D2] bg-[#EAF9F1] px-2 py-1 text-[11px] text-[#1E9A5A]`}>+12 RATING</span>
                    <span className={`${MONO} rounded-md border border-[#EDDCAE] bg-[#FBF3DF] px-2 py-1 text-[11px] text-[#B4771E]`}>+3 SPEED BONUS</span>
                </div>
            </div>
        </div>
    );
}

const DUEL_SEGMENTS = ['#2FBF71', '#2FBF71', '#E85D5D', '#2FBF71', '#2FBF71', '#2FBF71', 'live', 'idle', 'idle', 'idle'];

function HeroDuelCard() {
    return (
        <div className={`${panelCls} absolute -left-1.5 top-[88px] z-[4] hidden w-[248px] -rotate-4 p-3.5 shadow-[var(--sd-shadow-sm)] lg:block`}>
            <div className="flex items-center justify-between">
                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-orange-lbl)]`}>LIVE DUEL · Q7/10</span>
                <span className="sd-pulse size-[7px] rounded-full bg-[#F08A3E]"/>
            </div>
            <div className="mt-3 flex items-center gap-2.5 rounded-[10px] border border-[rgba(124,92,240,0.35)] bg-[rgba(124,92,240,0.1)] px-2.5 py-[9px]">
                <img src={novaQuill} alt="" className="image-render-pixel size-8 rounded-lg"/>
                <div className="flex-1">
                    <div className="text-[12.5px] font-bold text-[var(--sd-text)]">ilovemath2026</div>
                    <div className={`${MONO} text-[10px] font-medium text-[var(--sd-dim)]`}>avg 12.4s</div>
                </div>
                <div className="text-right">
                    <div className="sd-display text-[19px] font-bold text-[var(--sd-text)]">7</div>
                    <div className={`${MONO} text-[9.5px] text-[var(--sd-orange-lbl)]`}>STREAK ×3</div>
                </div>
            </div>
            <div className="mt-2 flex items-center gap-2.5 rounded-[10px] border border-[var(--sd-line2)] bg-[var(--sd-track)] px-2.5 py-[9px]">
                <img src={emberAbacus} alt="" className="image-render-pixel size-8 rounded-lg"/>
                <div className="flex-1">
                    <div className="text-[12.5px] font-bold text-[var(--sd-text)]">satslayer</div>
                    <div className={`${MONO} text-[10px] font-medium text-[var(--sd-dim)]`}>avg 18.9s</div>
                </div>
                <div className="text-right">
                    <div className="sd-display text-[19px] font-bold text-[var(--sd-mut2)]">6</div>
                    <div className={`${MONO} text-[9.5px] font-medium text-[var(--sd-dim)]`}>answering…</div>
                </div>
            </div>
            <div className="mt-3 flex gap-[5px]">
                {DUEL_SEGMENTS.map((c, i) => (
                    <span
                        key={i}
                        className={`h-[5px] flex-1 rounded-[3px] ${c === 'live' ? 'sd-pulse' : ''}`}
                        style={{background: c === 'live' ? '#7C5CF0' : c === 'idle' ? 'var(--sd-track)' : c}}
                    />
                ))}
            </div>
        </div>
    );
}

function HeroAiCard() {
    return (
        <div className="absolute -right-1.5 top-[52px] z-[4] hidden w-[262px] rotate-3 rounded-[14px] border border-[#E4E1D6] bg-white p-4 shadow-[var(--sd-shadow-sm)] lg:block">
            <div className="flex items-center justify-between">
                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[#7C5CF0]`}>AI EXPLANATION</span>
                <span className={`${MONO} rounded-[5px] bg-[#FDEDED] px-[7px] py-0.5 text-[10px] text-[#E85D5D]`}>YOU PICKED A</span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-[9px]">
                    <span className={`${MONO} grid size-[18px] flex-none place-items-center rounded-full bg-[#F1EDFE] text-[10px] text-[#7C5CF0]`}>1</span>
                    <p className="m-0 text-xs leading-normal text-[#333B4E]">“But” signals a contrast between the two halves of the sentence.</p>
                </div>
                <div className="flex gap-[9px]">
                    <span className={`${MONO} grid size-[18px] flex-none place-items-center rounded-full bg-[#F1EDFE] text-[10px] text-[#7C5CF0]`}>2</span>
                    <p className="m-0 text-xs leading-normal text-[#333B4E]">“Later became central” means the maps were valued <em>eventually</em> — so the blank must be negative.</p>
                </div>
                <div className="flex gap-[9px] rounded-[9px] border border-[#EDDCAE] bg-[#FDF6E3] p-2">
                    <span className={`${MONO} grid size-[18px] flex-none place-items-center rounded-full bg-[#E9BC4F] text-[10px] text-[#5C4508]`}>3</span>
                    <p className="m-0 text-xs leading-normal text-[#5C4508]"><strong>The step you skipped:</strong> “celebrated” is positive — it ignores the contrast entirely.</p>
                </div>
            </div>
            <div className="mt-3 text-xs font-bold text-[#1E9A5A]">Answer: B — dismissed</div>
        </div>
    );
}

const LEADERBOARD_ROWS = [
    {rank: '#11', avatar: orbitScout, name: 'quietgrinder', score: '1,291', delta: '▲2 +24', up: true},
    {rank: '#12', avatar: echoFencer, name: 'you', score: '1,288', delta: '▲3 +31', up: true, you: true},
    {rank: '#13', avatar: slateSentinel, name: 'geo_metry', score: '1,270', delta: '▼1 −6', up: false},
];

function HeroLeaderboard() {
    return (
        <div className={`${panelCls} absolute bottom-0 left-1/2 z-[5] hidden w-[500px] -translate-x-1/2 px-4 py-3 shadow-[var(--sd-shadow-sm)] lg:block`}>
            <div className="flex items-center justify-between">
                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-gold-lbl)]`}>WEEKLY LEADERBOARD</span>
                <span className={`${MONO} text-[10px] font-medium text-[var(--sd-dim)]`}>resets Sun 11:59pm</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5 text-[12.5px]">
                {LEADERBOARD_ROWS.map((r) => (
                    <div
                        key={r.rank}
                        className={r.you
                            ? 'sd-glow -mx-2 flex items-center gap-2.5 rounded-lg border border-[rgba(124,92,240,0.4)] bg-[rgba(124,92,240,0.14)] px-2 py-[5px]'
                            : 'flex items-center gap-2.5'}
                    >
                        <span className={`${MONO} w-7 ${r.you || r.up ? 'text-[var(--sd-gold-lbl)]' : 'text-[var(--sd-dim)]'}`}>{r.rank}</span>
                        <img src={r.avatar} alt="" className="image-render-pixel size-[22px] rounded-[5px]"/>
                        <span className={`flex-1 font-semibold ${r.you ? 'font-bold text-[var(--sd-text)]' : 'text-[var(--sd-body)]'}`}>{r.name}</span>
                        <span className={`${MONO} font-medium ${r.you ? 'text-[var(--sd-text)]' : 'text-[var(--sd-mut2)]'}`}>{r.score}</span>
                        <span className={`${MONO} w-16 text-right text-[11px] ${r.up ? 'text-[var(--sd-green-lbl)]' : 'text-[#E85D5D]'}`}>{r.delta}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Hero() {
    const heroTimer = useLoopTimer(27, 8);
    return (
        <section className="sd-hero-bg relative overflow-hidden px-5 pb-16 pt-14 sm:px-10 lg:pb-24 lg:pt-[72px]">
            <div className="mx-auto grid max-w-[1260px] items-center gap-14 lg:grid-cols-[440px_1fr]">
                <div>
                    <div className={`${MONO} inline-flex items-center gap-2 rounded-full border border-[rgba(124,92,240,0.45)] bg-[rgba(124,92,240,0.12)] px-3 py-1.5 text-xs tracking-[0.08em] text-[var(--sd-violet-lbl)]`}>
                        <span className="sd-pulse size-[7px] rounded-full bg-[#2FBF71]"/>
                        DIGITAL SAT · MATH + READING & WRITING
                    </div>
                    <h1 className="sd-display m-0 mt-[22px] text-[40px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--sd-text)] sm:text-[58px]">
                        Turn Digital SAT practice into a duel.
                    </h1>
                    <p className="m-0 mt-5 max-w-[420px] text-[17.5px] leading-relaxed text-[var(--sd-mut)]">
                        Train with 1,800+ Digital SAT questions, challenge friends in timed rounds, review AI explanations, and track every mistake across Math and Reading & Writing.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3.5">
                        <PrimaryCta>Start Free</PrimaryCta>
                        <OutlineCta>Try a Demo Round</OutlineCta>
                    </div>
                    <div className={`${MONO} mt-9 flex gap-7 text-[12.5px] font-medium text-[var(--sd-dim)]`}>
                        <span><span className="font-bold text-[var(--sd-gold-lbl)]">1,800+</span> questions</span>
                        <span><span className="font-bold text-[var(--sd-green-lbl)]">400+</span> students</span>
                        <span><span className="font-bold text-[#7C5CF0]">$0</span> to start</span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-[400px] lg:h-[640px] lg:min-w-[560px] lg:max-w-none">
                    <HeroQuestionCard timer={heroTimer}/>
                    <HeroDuelCard/>
                    <HeroAiCard/>
                    <HeroLeaderboard/>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* mini demo                                                           */
/* ------------------------------------------------------------------ */

const DEMO_QUESTION = {
    skillLabel: 'MATH · LINEAR EQUATIONS',
    prompt: 'If 3x + 7 = 22, what is the value of 6x + 7?',
    choices: [
        {key: 'A', text: '30'},
        {key: 'B', text: '37'},
        {key: 'C', text: '15'},
        {key: 'D', text: '44'},
    ],
    answer: 'B',
    explanation:
        'You never need x by itself. From 3x + 7 = 22, subtract 7: 3x = 15. Double it: 6x = 30, so 6x + 7 = 37. The step most students skip: noticing 6x is just 2 × 3x — solving x = 5 first works, but costs about 15 extra seconds on the clock.',
};

function MiniDemo() {
    const [picked, setPicked] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const answered = picked !== null;
    const isRight = picked === DEMO_QUESTION.answer;
    const gotSpeedBonus = answered && isRight && elapsed <= 25;

    useEffect(() => {
        if (answered) return undefined;
        const id = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(id);
    }, [answered]);

    return (
        <section id="demo" className="border-y border-[var(--sd-line)] bg-[var(--sd-bg2)] px-5 py-[88px] sm:px-10">
            <div className="mx-auto max-w-[720px]">
                <div className="text-center">
                    <Eyebrow>LIVE ON THIS PAGE</Eyebrow>
                    <H2 className="sm:text-[40px]">Try one round.</H2>
                    <p className="m-0 mt-3 text-base text-[var(--sd-mut)]">One real Digital SAT question. The clock is already running.</p>
                </div>

                <div className={`${paperCls} mt-9 rounded-[18px] shadow-[var(--sd-shadow)]`}>
                    <div className="flex items-center justify-between bg-[#131B2C] px-[22px] py-3.5">
                        <span className={`${MONO} text-xs tracking-[0.08em] text-[#C0B0FA]`}>{DEMO_QUESTION.skillLabel}</span>
                        <div className="flex items-center gap-3">
                            {elapsed >= 6 && (
                                <span className={`${MONO} sd-up text-[11.5px] text-[#F08A3E]`}>Alex answered in 21s</span>
                            )}
                            <TimerChip className="px-3 text-[15px]">{fmt(elapsed)}</TimerChip>
                        </div>
                    </div>
                    <div className="p-5 sm:p-[26px]">
                        <p className="m-0 text-[17px] font-medium leading-relaxed text-[#131B2C]">{DEMO_QUESTION.prompt}</p>
                        <div className="mt-5 flex flex-col gap-2.5">
                            {DEMO_QUESTION.choices.map((c) => {
                                const isAns = c.key === DEMO_QUESTION.answer;
                                const isPick = c.key === picked;
                                let row = 'border-[#E4E1D6] bg-white hover:border-[#7C5CF0]';
                                let bubble = <span className="grid size-7 flex-none place-items-center rounded-full border-2 border-[#B9BFCB] text-[13px] font-bold text-[#5A6376]">{c.key}</span>;
                                if (answered && isAns) {
                                    row = 'border-[#2FBF71] bg-[#EAF9F1]';
                                    bubble = <span className="grid size-7 flex-none place-items-center rounded-full bg-[#2FBF71] text-[13px] font-bold text-white">✓</span>;
                                } else if (answered && isPick) {
                                    row = 'border-[#E85D5D] bg-[#FDEDED]';
                                    bubble = <span className="grid size-7 flex-none place-items-center rounded-full bg-[#E85D5D] text-[13px] font-bold text-white">✕</span>;
                                } else if (answered) {
                                    row = 'border-[#E4E1D6] bg-white opacity-55';
                                }
                                return (
                                    <button
                                        key={c.key}
                                        disabled={answered}
                                        onClick={() => setPicked(c.key)}
                                        className={`flex items-center gap-3 rounded-xl border-2 px-[15px] py-3 text-left transition-colors ${row} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        {bubble}
                                        <span className="text-[15px] font-medium text-[#131B2C]">{c.text}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <div className="sd-up mt-5 rounded-[14px] border border-[#E4E1D6] bg-white p-5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className={`sd-display text-[19px] font-bold ${isRight ? 'text-[#1E9A5A]' : 'text-[#C24040]'}`}>
                                        {isRight ? 'Correct!' : 'Not quite.'}
                                    </span>
                                    <span className={`${MONO} text-xs ${isRight ? 'text-[#1E9A5A]' : 'text-[#C24040]'}`}>
                                        {isRight ? '+12' : '−8'} RATING
                                    </span>
                                    {gotSpeedBonus && (
                                        <span className={`${MONO} rounded-md border border-[#EDDCAE] bg-[#FBF3DF] px-2 py-0.5 text-xs text-[#B4771E]`}>+3 SPEED BONUS</span>
                                    )}
                                </div>
                                <p className="m-0 mt-3.5 text-[14.5px] leading-relaxed text-[#333B4E]">{DEMO_QUESTION.explanation}</p>
                                <Link
                                    to="/register"
                                    className="mt-[18px] inline-block rounded-[10px] bg-[#7C5CF0] px-6 py-3 text-[15px] font-bold text-white no-underline shadow-[0_4px_14px_rgba(124,92,240,0.35)] transition-colors hover:bg-[#9678FF]"
                                >
                                    Create an account to keep dueling
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* product journey                                                     */
/* ------------------------------------------------------------------ */

const ARENA_TILES = [
    {id: 'math', label: 'Math', sub: '900+ questions', span: 'sm:col-span-2'},
    {id: 'rw', label: 'R&W', sub: '900+ questions', span: 'sm:col-span-2'},
    {id: 'quick', label: 'Quick Practice', sub: '10 Q · no setup', span: 'sm:col-span-2'},
    {id: 'module', label: 'Full Module', sub: '27 Q · 32 min', span: 'sm:col-span-3'},
    {id: 'duel', label: 'Duel Mode', sub: '1v1 · 10 Q · live', span: 'sm:col-span-3'},
];

function StepCopy({num, title, children}) {
    return (
        <div>
            <span className={`${MONO} text-[13px] text-[var(--sd-gold-lbl)]`}>{num}</span>
            <h3 className="sd-display m-0 mt-2 text-[30px] font-bold tracking-[-0.02em] text-[var(--sd-text)]">{title}</h3>
            <div className="mt-3.5 flex flex-col gap-3 text-base leading-relaxed text-[var(--sd-mut)]">{children}</div>
        </div>
    );
}

function ArenaTiles() {
    const [arena, setArena] = useState('duel');
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            {ARENA_TILES.map((t) => {
                const sel = arena === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => setArena(t.id)}
                        className={`${t.span} flex cursor-pointer flex-col items-start gap-1.5 rounded-[14px] border-[1.5px] px-4 py-[18px] text-left transition-all hover:-translate-y-0.5 ${
                            sel
                                ? 'border-[#7C5CF0] bg-[rgba(124,92,240,0.14)] shadow-[0_0_0_4px_rgba(124,92,240,0.08)]'
                                : 'border-[var(--sd-line2)] bg-[var(--sd-tile-idle)] hover:border-[rgba(124,92,240,0.6)]'
                        }`}
                    >
                        <span className={`sd-display text-[16.5px] font-bold ${sel ? 'text-[var(--sd-text)]' : 'text-[var(--sd-mut2)]'}`}>{t.label}</span>
                        <span className={`${MONO} text-[10.5px] font-medium ${sel ? 'text-[var(--sd-violet-lbl)]' : 'text-[var(--sd-dim)]'}`}>{t.sub}</span>
                    </button>
                );
            })}
        </div>
    );
}

const RACE_CHOICES = [
    {key: 'A', text: '3.2'},
    {key: 'B', text: '3.5', picked: true},
    {key: 'C', text: '4.1'},
    {key: 'D', text: '4.5'},
];

function RaceClockCard() {
    return (
        <div className={`${paperCls} shadow-[var(--sd-shadow)]`}>
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#131B2C] px-[18px] py-[11px]">
                <span className={`${MONO} text-[11px] tracking-[0.08em] text-[#C0B0FA]`}>MATH · LINEAR EQUATIONS</span>
                <div className="flex items-center gap-2">
                    <span className={`${MONO} rounded-md border border-[rgba(233,188,79,0.5)] bg-[rgba(233,188,79,0.15)] px-2 py-[3px] text-[10.5px] text-[#E9BC4F]`}>HIGHLIGHT</span>
                    <span className={`${MONO} rounded-md border border-[rgba(148,163,184,0.35)] px-2 py-[3px] text-[10.5px] text-[#B9C2D8]`}>DESMOS</span>
                    <span className={`${MONO} rounded-md border border-[rgba(233,188,79,0.4)] px-[9px] py-[3px] text-[13px] text-[#E9BC4F]`}>1:07</span>
                </div>
            </div>
            <div className="grid gap-4 p-[18px] sm:grid-cols-[1fr_170px]">
                <div>
                    <p className="m-0 text-sm leading-[1.65] text-[#131B2C]">
                        A landscaper charges a <mark className="rounded-[3px] bg-[rgba(233,188,79,0.45)] px-0.5">$40 visit fee plus $65 per hour</mark>. If a job costs $268.50, <mark className="rounded-[3px] bg-[rgba(233,188,79,0.45)] px-0.5">how many hours</mark> did it take?
                    </p>
                    <div className="mt-3 flex flex-col gap-[7px]">
                        {RACE_CHOICES.map((c) => (
                            <div
                                key={c.key}
                                className={`flex items-center gap-[9px] rounded-[9px] border-[1.5px] px-[11px] py-[7px] ${c.picked ? 'border-[#7C5CF0] bg-[#F1EDFE]' : 'border-[#E4E1D6] bg-white'}`}
                            >
                                <span className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${c.picked ? 'bg-[#7C5CF0] text-white' : 'border-2 border-[#B9BFCB] text-[#5A6376]'}`}>{c.key}</span>
                                <span className={`text-[13px] text-[#131B2C] ${c.picked ? 'font-semibold' : ''}`}>{c.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* mini Desmos graphing-calculator mock */}
                <div className="min-h-[220px] overflow-hidden rounded-[10px] border border-[#C9CDD8] bg-white">
                    <div className="border-b border-[#E4E1D6] px-2.5 py-1.5">
                        <span className={`${MONO} text-[9.5px] tracking-[0.08em] text-[#8A93A8]`}>DESMOS · GRAPHING</span>
                    </div>
                    <div className={`${MONO} flex flex-col gap-1 border-b border-[#E4E1D6] px-2.5 py-1.5 text-[11px] font-medium`}>
                        <span className="text-[#2D70B3]">y = 40 + 65x</span>
                        <span className="text-[#388C46]">y = 268.50</span>
                    </div>
                    <svg viewBox="0 0 170 120" className="block w-full" aria-hidden="true">
                        <g stroke="#E8EAF0" strokeWidth="1">
                            {[20, 40, 60, 80, 100, 120, 140, 160].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="120"/>)}
                            {[20, 40, 60, 80, 100].map((y) => <line key={y} x1="0" y1={y} x2="170" y2={y}/>)}
                        </g>
                        <line x1="10" y1="0" x2="10" y2="120" stroke="#B9BFCB" strokeWidth="1.5"/>
                        <line x1="0" y1="110" x2="170" y2="110" stroke="#B9BFCB" strokeWidth="1.5"/>
                        <line x1="10" y1="100" x2="160" y2="15" stroke="#2D70B3" strokeWidth="2"/>
                        <line x1="0" y1="43" x2="170" y2="43" stroke="#388C46" strokeWidth="2"/>
                        <circle cx="111" cy="43" r="3.5" fill="#7C5CF0"/>
                        <text x="98" y="34" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#7C5CF0" fontWeight="700">(3.5, 268.5)</text>
                    </svg>
                </div>
            </div>
        </div>
    );
}

function MissCard() {
    return (
        <div className="rounded-2xl border border-[#E4E1D6] bg-white p-[22px] shadow-[var(--sd-shadow)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`${MONO} text-[11px] tracking-[0.1em] text-[#7C5CF0]`}>AI EXPLANATION · SYSTEMS OF EQUATIONS</span>
                <span className={`${MONO} rounded-[5px] bg-[#FDEDED] px-2 py-[3px] text-[10.5px] text-[#E85D5D]`}>YOU PICKED C</span>
            </div>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-[11px] border border-[#F3C6C6] bg-[#FDF4F4] p-3.5">
                    <span className={`${MONO} text-[10px] tracking-[0.08em] text-[#C24040]`}>WHY C IS WRONG</span>
                    <p className="m-0 mt-2 text-[13.5px] leading-[1.55] text-[#333B4E]">C = 24 is the value of <strong>x</strong>. The question asks for <strong>x + y</strong>. Stopping at the first solved variable is the most common trap on this skill.</p>
                </div>
                <div className="rounded-[11px] border border-[#EDDCAE] bg-[#FDF6E3] p-3.5">
                    <span className={`${MONO} text-[10px] tracking-[0.08em] text-[#B4771E]`}>THE STEP YOU SKIPPED</span>
                    <p className="m-0 mt-2 text-[13.5px] leading-[1.55] text-[#333B4E]">Substitute back: y = 40 − 24 = 16, then x + y = <strong>40</strong>. Re-read the question stem before answering.</p>
                </div>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEEBE0] pt-3">
                <span className="text-[13.5px] font-bold text-[#1E9A5A]">Correct answer: B — 40</span>
                <span className={`${MONO} text-[11px] font-medium text-[#8A93A8]`}>saved to your mistake log</span>
            </div>
        </div>
    );
}

const OLD_EXAMS = [
    {label: 'Module 2 · Math', score: '24/27', color: 'text-[var(--sd-green-lbl)]'},
    {label: 'Quick 10 · R&W', score: '7/10', color: 'text-[var(--sd-orange-lbl)]'},
    {label: 'Duel vs satslayer', score: 'W 8–6', color: 'text-[var(--sd-green-lbl)]'},
];
const WEAK_TOPICS = [
    {label: 'Transitions', pct: 52, color: '#E85D5D'},
    {label: 'Circle equations', pct: 64, color: '#F08A3E'},
    {label: 'Word problems', pct: 71, color: '#E9BC4F'},
];

function RematchGrid() {
    return (
        <div className="grid gap-3.5 sm:grid-cols-2">
            <div className={`${panelCls} rounded-[14px] p-4`}>
                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-violet-lbl)]`}>OLD EXAMS</span>
                <div className="mt-3 flex flex-col gap-2 text-[13px]">
                    {OLD_EXAMS.map((e, i) => (
                        <div key={e.label} className={`flex justify-between ${i < OLD_EXAMS.length - 1 ? 'border-b border-[var(--sd-line)] pb-2' : ''}`}>
                            <span className="font-semibold text-[var(--sd-body)]">{e.label}</span>
                            <span className={`${MONO} ${e.color}`}>{e.score}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${panelCls} rounded-[14px] p-4`}>
                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-orange-lbl)]`}>WEAK TOPICS</span>
                <div className="mt-3 flex flex-col gap-2.5">
                    {WEAK_TOPICS.map((t) => (
                        <div key={t.label}>
                            <div className="mb-1 flex justify-between text-[12.5px]">
                                <span className="font-semibold text-[var(--sd-body)]">{t.label}</span>
                                <span className={`${MONO}`} style={{color: t.color}}>{t.pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-[3px] bg-[var(--sd-track)]">
                                <div className="h-1.5 rounded-[3px]" style={{width: `${t.pct}%`, background: t.color}}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${panelCls} flex flex-wrap items-center justify-between gap-3 rounded-[14px] p-4 sm:col-span-2`}>
                <div className="flex items-center gap-3">
                    <span className="sd-display text-[22px] font-bold text-[var(--sd-gold-lbl)]">#12</span>
                    <div>
                        <div className="text-[13px] font-bold text-[var(--sd-body)]">Weekly leaderboard</div>
                        <div className={`${MONO} text-[11px] font-medium text-[var(--sd-green-lbl)]`}>▲3 since Monday</div>
                    </div>
                </div>
                <Link to="/register" className="rounded-[10px] bg-[#F08A3E] px-5 py-2.5 text-sm font-bold text-[#1F1204] no-underline transition-colors hover:bg-[#FF9F58]">
                    Rematch satslayer
                </Link>
            </div>
        </div>
    );
}

function Journey() {
    const step = 'grid items-center gap-10 lg:grid-cols-12 lg:gap-14';
    const copyL = 'lg:col-span-5';
    const visR = 'lg:col-span-7';
    const visL = 'order-2 lg:order-1 lg:col-span-7';
    const copyR = 'order-1 lg:order-2 lg:col-span-5';
    return (
        <section id="journey" className="px-5 pb-10 pt-[104px] sm:px-10">
            <div className="mx-auto max-w-[1160px]">
                <div className="max-w-[640px]">
                    <Eyebrow>HOW A ROUND WORKS</Eyebrow>
                    <H2>From pick to rematch in four moves.</H2>
                </div>

                <div className={`${step} mt-[72px]`}>
                    <div className={copyL}>
                        <StepCopy num="01" title="Pick your arena.">
                            <p className="m-0">Drill one subject, sprint through ten quick questions, sit a full timed module — or challenge a friend to 10 Digital SAT questions in Duel Mode.</p>
                            <p className={`${MONO} m-0 text-[12.5px] font-medium text-[var(--sd-dim)]`}>Tap a tile →</p>
                        </StepCopy>
                    </div>
                    <div className={visR}><ArenaTiles/></div>
                </div>

                <div className={`${step} mt-24`}>
                    <div className={visL}><RaceClockCard/></div>
                    <div className={copyR}>
                        <StepCopy num="02" title="Race the clock.">
                            <p className="m-0">Every question is timed. Pull up the built-in Desmos graphing calculator — the same tool you get on the real Digital SAT — whenever a problem is faster to graph than to grind.</p>
                            <p className="m-0">Answer quickly and cleanly to earn speed bonuses on top of your rating.</p>
                        </StepCopy>
                    </div>
                </div>

                <div className={`${step} mt-24`}>
                    <div className={copyL}>
                        <StepCopy num="03" title="Learn from the miss.">
                            <p className="m-0">AI explanations show the reasoning step you skipped, not just the correct answer — including why the answer you picked looked tempting.</p>
                        </StepCopy>
                    </div>
                    <div className={visR}><MissCard/></div>
                </div>

                <div className={`${step} mt-24 pb-16`}>
                    <div className={visL}><RematchGrid/></div>
                    <div className={copyR}>
                        <StepCopy num="04" title="Rematch or review.">
                            <p className="m-0">Review the exact questions you missed after each round, watch weak topics shrink, and climb the weekly board — or run it back immediately.</p>
                        </StepCopy>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* multiplayer                                                         */
/* ------------------------------------------------------------------ */

function Multiplayer() {
    const duelTimer = useLoopTimer(43, 5);
    return (
        <section id="multiplayer" className="border-y border-[var(--sd-line)] bg-[var(--sd-bg2)] px-5 py-24 sm:px-10">
            <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <Eyebrow color="#F08A3E">DUEL MODE</Eyebrow>
                    <H2 className="sm:text-[42px]">Same 10 questions. One winner.</H2>
                    <p className="m-0 mt-4 text-[16.5px] leading-relaxed text-[var(--sd-mut)]">
                        Race through 10 Digital SAT questions against a live student, or get an instant practice rival when the queue is quiet. Same set, same clock. Accuracy wins, and every completed round moves your duel rating.
                    </p>
                    <PrimaryCta className="mt-7 px-7 py-3.5 text-[15.5px]">Challenge a friend</PrimaryCta>
                </div>

                <div className={`${panelCls} rounded-[18px] p-[22px] shadow-[var(--sd-shadow)] lg:col-span-7`}>
                    <div className="flex items-center justify-between">
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[var(--sd-orange-lbl)]`}>DUEL · QUESTION 8 OF 10</span>
                        <span className={`${MONO} text-base text-[var(--sd-gold-lbl)]`}>{fmt(duelTimer)}</span>
                    </div>
                    <div className="mt-[18px] grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                        <div className="relative rounded-[14px] border-[1.5px] border-[rgba(124,92,240,0.45)] bg-[rgba(124,92,240,0.1)] p-4 text-center">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">🔥</span>
                            <img src={novaQuill} alt="" className="image-render-pixel mx-auto size-[52px] rounded-xl"/>
                            <div className="mt-2 text-sm font-bold text-[var(--sd-text)]">ilovemath2026</div>
                            <div className="sd-display mt-1 text-[34px] font-bold text-[var(--sd-text)]">7</div>
                            <span className={`${MONO} mt-1.5 inline-block rounded-[5px] border border-[rgba(47,191,113,0.35)] bg-[rgba(47,191,113,0.12)] px-[7px] py-0.5 text-[10px] text-[var(--sd-green-lbl)]`}>7/10 ANSWERED</span>
                        </div>
                        <div className="sd-display text-center text-xl font-bold text-[var(--sd-dim)]">VS</div>
                        <div className="rounded-[14px] border-[1.5px] border-[var(--sd-line2)] bg-[var(--sd-track)] p-4 text-center">
                            <img src={emberAbacus} alt="" className="image-render-pixel mx-auto size-[52px] rounded-xl"/>
                            <div className="mt-2 text-sm font-bold text-[var(--sd-text)]">satslayer</div>
                            <div className="sd-display mt-1 text-[34px] font-bold text-[var(--sd-mut2)]">6</div>
                            <span className={`${MONO} mt-1.5 inline-block rounded-[5px] border border-[var(--sd-line2)] px-[7px] py-0.5 text-[10px] font-medium text-[var(--sd-mut2)]`}>6/10 ANSWERED</span>
                        </div>
                    </div>
                    <div className="mt-[18px] flex flex-wrap items-center justify-between gap-2 border-t border-[var(--sd-line)] pt-3.5">
                        <span className={`${MONO} text-[11.5px] font-medium text-[var(--sd-dim)]`}>winner moves up the duel ladder</span>
                        <span className={`${MONO} text-[11.5px] text-[var(--sd-orange-lbl)]`}>results unlock after Q10</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* tournaments (existing feature, new section)                         */
/* ------------------------------------------------------------------ */

const TOURNAMENT_ROWS = [
    {rank: '#1', avatar: prismPage, name: 'circuit_rider', score: '870'},
    {rank: '#2', avatar: orbitScout, name: 'quietgrinder', score: '840'},
    {rank: '#3', avatar: slateSentinel, name: 'geo_metry', score: '810'},
];

function Tournaments() {
    return (
        <section id="tournaments" className="px-5 py-24 sm:px-10">
            <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <div className={`${panelCls} order-2 rounded-[18px] p-[22px] shadow-[var(--sd-shadow)] lg:order-1 lg:col-span-7`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[var(--sd-gold-lbl)]`}>TOURNAMENT · SPRING SCRIMMAGE</span>
                        <span className={`${MONO} flex items-center gap-2 text-[10.5px] text-[var(--sd-green-lbl)]`}>
                            <span className="sd-pulse size-[7px] rounded-full bg-[#2FBF71]"/>LIVE · ENDS IN 2D 4H
                        </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-[13px]">
                        {TOURNAMENT_ROWS.map((r) => (
                            <div key={r.rank} className="flex items-center gap-3 rounded-[10px] border border-[var(--sd-line)] bg-[var(--sd-track)] px-3 py-2.5">
                                <span className={`${MONO} w-7 text-[var(--sd-gold-lbl)]`}>{r.rank}</span>
                                <img src={r.avatar} alt="" className="image-render-pixel size-7 rounded-md"/>
                                <span className="flex-1 font-semibold text-[var(--sd-body)]">{r.name}</span>
                                <span className={`${MONO} text-[var(--sd-mut2)]`}>{r.score} pts</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sd-line)] pt-3.5">
                        <span className={`${MONO} text-[11.5px] font-medium text-[var(--sd-dim)]`}>28 players · same question set for everyone</span>
                        <span className={`${MONO} rounded-md border border-[rgba(124,92,240,0.45)] bg-[rgba(124,92,240,0.12)] px-2.5 py-1 text-[11.5px] text-[var(--sd-violet-lbl)]`}>JOIN CODE · 7K4QX</span>
                    </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-5">
                    <Eyebrow color="#E9BC4F">TOURNAMENTS</Eyebrow>
                    <H2 className="sm:text-[42px]">One question set. A whole bracket of rivals.</H2>
                    <p className="m-0 mt-4 text-[16.5px] leading-relaxed text-[var(--sd-mut)]">
                        Enter a public tournament, or join a private one with a code from a friend or teacher. Everyone races the same questions on the same clock — the board settles who trained hardest. You can spin up your own tournament in under a minute.
                    </p>
                    <PrimaryCta to="/tournaments" className="mt-7 px-7 py-3.5 text-[15.5px]">Browse tournaments</PrimaryCta>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* AI explanations                                                     */
/* ------------------------------------------------------------------ */

function AiExplanations() {
    return (
        <section id="ai" className="border-y border-[var(--sd-line)] bg-[var(--sd-bg2)] px-5 py-[104px] sm:px-10">
            <div className="mx-auto max-w-[1160px]">
                <div className="mx-auto max-w-[680px] text-center">
                    <Eyebrow>AFTER EVERY MISS</Eyebrow>
                    <H2>The explanation shows the step you skipped.</H2>
                    <p className="m-0 mt-3.5 text-[16.5px] leading-relaxed text-[var(--sd-mut)]">
                        Not just the correct answer — the exact reasoning move that separates your pick from the right one.
                    </p>
                </div>

                <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_56px_1fr] lg:gap-0">
                    <div className={`${paperCls} shadow-[var(--sd-shadow)]`}>
                        <div className="flex items-center justify-between bg-[#131B2C] px-[18px] py-[11px]">
                            <span className={`${MONO} text-[11px] tracking-[0.08em] text-[#C0B0FA]`}>R&W · TRANSITIONS</span>
                            <span className={`${MONO} rounded-[5px] border border-[rgba(232,93,93,0.4)] bg-[rgba(232,93,93,0.15)] px-2 py-[3px] text-[10.5px] text-[#E85D5D]`}>MISSED · 0:31</span>
                        </div>
                        <div className="p-[18px]">
                            <p className="m-0 text-sm leading-[1.65] text-[#131B2C]">
                                The city’s new bus lanes cut average commute times by nine minutes. ______, ridership rose 22% within a single quarter.
                            </p>
                            <div className="mt-3 flex flex-col gap-[7px]">
                                <div className="flex items-center justify-between rounded-[9px] border-[1.5px] border-[#E85D5D] bg-[#FDEDED] px-3 py-2">
                                    <span className="flex items-center gap-[9px]">
                                        <span className="grid size-[21px] place-items-center rounded-full bg-[#E85D5D] text-[10px] font-bold text-white">A</span>
                                        <span className="text-[13.5px] text-[#131B2C]">However</span>
                                    </span>
                                    <span className={`${MONO} text-[10px] text-[#C24040]`}>YOUR PICK</span>
                                </div>
                                <div className="flex items-center justify-between rounded-[9px] border-[1.5px] border-[#2FBF71] bg-[#EAF9F1] px-3 py-2">
                                    <span className="flex items-center gap-[9px]">
                                        <span className="grid size-[21px] place-items-center rounded-full bg-[#2FBF71] text-[10px] font-bold text-white">B</span>
                                        <span className="text-[13.5px] font-semibold text-[#131B2C]">As a result</span>
                                    </span>
                                    <span className={`${MONO} text-[10px] text-[#1E9A5A]`}>CORRECT</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden place-items-center lg:grid">
                        <span className="sd-display text-[26px] font-bold text-[#7C5CF0]">→</span>
                    </div>

                    <div className="rounded-2xl border border-[#E4E1D6] bg-white p-5 shadow-[var(--sd-shadow)]">
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[#7C5CF0]`}>AI EXPLANATION</span>
                        <div className="mt-3.5 flex flex-col gap-2.5">
                            <div className="flex gap-2.5">
                                <span className={`${MONO} grid size-5 flex-none place-items-center rounded-full bg-[#F1EDFE] text-[10.5px] text-[#7C5CF0]`}>1</span>
                                <p className="m-0 text-[13.5px] leading-[1.55] text-[#333B4E]">Sentence one is a cause: commutes got faster.</p>
                            </div>
                            <div className="flex gap-2.5">
                                <span className={`${MONO} grid size-5 flex-none place-items-center rounded-full bg-[#F1EDFE] text-[10.5px] text-[#7C5CF0]`}>2</span>
                                <p className="m-0 text-[13.5px] leading-[1.55] text-[#333B4E]">Sentence two is its effect: more people rode the bus. The relationship is cause → effect, not contrast.</p>
                            </div>
                            <div className="flex gap-2.5 rounded-[10px] border border-[#EDDCAE] bg-[#FDF6E3] p-2.5">
                                <span className={`${MONO} grid size-5 flex-none place-items-center rounded-full bg-[#E9BC4F] text-[10.5px] text-[#5C4508]`}>3</span>
                                <p className="m-0 text-[13.5px] leading-[1.55] text-[#5C4508]"><strong>The step you skipped:</strong> you matched “However” to the surprise of a 22% jump — but transitions connect logic, not feelings. Label the relationship first, then pick.</p>
                            </div>
                        </div>
                        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEEBE0] pt-3">
                            <span className={`${MONO} text-[11px] font-medium text-[#8A93A8]`}>added to weak topic: Transitions</span>
                            <Link to="/register" className="text-[13px] font-bold text-[#7C5CF0] no-underline">Drill 5 more like this →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* study guides (existing feature, new section)                        */
/* ------------------------------------------------------------------ */

const GUIDE_CARDS = [
    {
        domain: 'ORIENTATION',
        title: 'Math Map',
        time: '30 MIN',
        summary: 'Know the section format, domain weights, and the study loop before you start grinding questions.',
        pages: ['How Digital SAT Math Works', 'The Four Math Domains', 'How to Study With SAT Duel'],
    },
    {
        domain: 'ALGEBRA',
        title: 'Linear Equations',
        time: '45 MIN',
        summary: 'Build clean equation habits so easy Algebra questions become automatic points.',
        pages: ['One-Variable Equations', 'Linear Inequalities', 'Word Problems to Equations'],
    },
    {
        domain: 'ADVANCED MATH',
        title: 'Quadratics I',
        time: '60 MIN',
        summary: 'Learn what each quadratic form reveals so you stop expanding when factoring would be faster.',
        pages: ['Standard vs. Factored Form', 'The Vertex Form Shortcut', 'Roots Without the Formula'],
    },
];

function StudyGuides() {
    return (
        <section id="guides" className="px-5 py-24 sm:px-10">
            <div className="mx-auto max-w-[1160px]">
                <div className="mx-auto max-w-[680px] text-center">
                    <Eyebrow color="#2FBF71">FREE STUDY GUIDES</Eyebrow>
                    <H2>Learn the concept. Then go drill it.</H2>
                    <p className="m-0 mt-3.5 text-[16.5px] leading-relaxed text-[var(--sd-mut)]">
                        Short, focused guides for Digital SAT Math — each lesson ends by sending you into targeted practice on exactly what you just read.
                    </p>
                </div>

                <div className="mt-12 grid gap-[18px] md:grid-cols-3">
                    {GUIDE_CARDS.map((g) => (
                        <div key={g.title} className={`${panelCls} flex flex-col p-5`}>
                            <div className="flex items-center justify-between">
                                <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-violet-lbl)]`}>{g.domain}</span>
                                <span className={`${MONO} text-[10.5px] font-medium text-[var(--sd-dim)]`}>{g.time}</span>
                            </div>
                            <h3 className="sd-display m-0 mt-2.5 text-[22px] font-bold text-[var(--sd-text)]">{g.title}</h3>
                            <p className="m-0 mt-2 flex-1 text-sm leading-relaxed text-[var(--sd-mut)]">{g.summary}</p>
                            <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--sd-line)] pt-3.5">
                                {g.pages.map((p, i) => (
                                    <div key={p} className="flex items-center gap-2.5 text-[13px]">
                                        <span className={`${MONO} grid size-[18px] flex-none place-items-center rounded-full bg-[rgba(124,92,240,0.14)] text-[9.5px] text-[var(--sd-violet-lbl)]`}>{i + 1}</span>
                                        <span className="font-semibold text-[var(--sd-body)]">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-9 text-center">
                    <PrimaryCta to="/study_guides" className="px-7 py-3.5 text-[15.5px]">Open the study guides</PrimaryCta>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* progress                                                            */
/* ------------------------------------------------------------------ */

const EXAM_HISTORY = [
    {label: 'Full Module · Math', date: 'Jun 28', score: '24/27', color: 'text-[var(--sd-green-lbl)]'},
    {label: 'Full Module · R&W', date: 'Jun 25', score: '21/27', color: 'text-[var(--sd-orange-lbl)]'},
    {label: 'Duel vs mia.k', date: 'Jun 24', score: 'L 6–8', color: 'text-[#E85D5D]'},
    {label: 'Quick 10 · Math', date: 'Jun 24', score: '9/10', color: 'text-[var(--sd-green-lbl)]'},
];

function Progress() {
    return (
        <section id="progress" className="border-y border-[var(--sd-line)] bg-[var(--sd-bg2)] px-5 py-24 sm:px-10">
            <div className="mx-auto max-w-[1160px]">
                <div className="max-w-[640px]">
                    <Eyebrow color="#2FBF71">EVERY MISTAKE, LOGGED</Eyebrow>
                    <H2>Know where the points are leaking.</H2>
                    <p className="m-0 mt-3.5 text-[16.5px] leading-relaxed text-[var(--sd-mut)]">
                        See whether you are losing points from accuracy, pacing, or repeated weak topics — across every round, duel, and full module you’ve ever taken.
                    </p>
                </div>

                <div className="mt-12 grid gap-[18px] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
                    <div className={`${panelCls} p-5`}>
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[var(--sd-violet-lbl)]`}>EXAM HISTORY</span>
                        <div className="mt-3.5 flex flex-col gap-2.5 text-[13.5px]">
                            {EXAM_HISTORY.map((e, i) => (
                                <div key={e.label} className={`grid grid-cols-[1fr_auto_auto] gap-3 ${i < EXAM_HISTORY.length - 1 ? 'border-b border-[var(--sd-line)] pb-2.5' : ''}`}>
                                    <span className="font-semibold text-[var(--sd-body)]">{e.label}</span>
                                    <span className={`${MONO} font-medium text-[var(--sd-dim)]`}>{e.date}</span>
                                    <span className={`${MONO} ${e.color}`}>{e.score}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/register" className="mt-3.5 inline-block text-[13px] font-bold text-[var(--sd-violet-lbl)] no-underline">Reopen any exam →</Link>
                    </div>

                    <div className={`${panelCls} p-5`}>
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[var(--sd-green-lbl)]`}>ACCURACY VS PACING</span>
                        <div className="mt-4">
                            <div className="mb-1 flex justify-between text-[13px]">
                                <span className="font-semibold text-[var(--sd-body)]">Accuracy</span>
                                <span className={`${MONO} text-[var(--sd-green-lbl)]`}>84%</span>
                            </div>
                            <div className="h-2 rounded bg-[var(--sd-track)]"><div className="h-2 w-[84%] rounded bg-[#2FBF71]"/></div>
                        </div>
                        <div className="mt-4">
                            <div className="mb-1 flex justify-between text-[13px]">
                                <span className="font-semibold text-[var(--sd-body)]">Pacing · avg 71s target 65s</span>
                                <span className={`${MONO} text-[var(--sd-orange-lbl)]`}>+6s</span>
                            </div>
                            <div className="h-2 rounded bg-[var(--sd-track)]"><div className="h-2 w-[62%] rounded bg-[#F08A3E]"/></div>
                        </div>
                        <p className="m-0 mt-[18px] text-[13px] leading-[1.55] text-[var(--sd-mut)]">
                            Your misses cluster in the last 5 questions of each module — a pacing problem, not a knowledge problem.
                        </p>
                    </div>

                    <div className={`${panelCls} p-5`}>
                        <span className={`${MONO} text-[11px] tracking-[0.1em] text-[var(--sd-gold-lbl)]`}>RATING & RANK</span>
                        <div className="mt-3.5 flex items-baseline gap-2.5">
                            <span className="sd-display text-[40px] font-bold text-[var(--sd-text)]">1,288</span>
                            <span className={`${MONO} text-[13px] text-[var(--sd-green-lbl)]`}>+31 this week</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <span className={`${MONO} rounded-md border border-[rgba(233,188,79,0.35)] bg-[rgba(233,188,79,0.12)] px-2 py-1 text-[11px] text-[var(--sd-gold-lbl)]`}>RANK #12</span>
                            <span className={`${MONO} rounded-md border border-[rgba(240,138,62,0.35)] bg-[rgba(240,138,62,0.12)] px-2 py-1 text-[11px] text-[var(--sd-orange-lbl)]`}>STREAK 6 DAYS</span>
                        </div>
                        <p className="m-0 mt-[18px] text-[13px] leading-[1.55] text-[var(--sd-mut)]">
                            Every answered question moves your rating. Every duel moves your rank.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* more ways to train (existing features, new section)                 */
/* ------------------------------------------------------------------ */

const TRAIN_TILES = [
    {title: 'Power Sprint', sub: 'PICK A CLOCK · RACK UP ANSWERS', text: 'Set a timer and answer as many questions as you can before it hits zero.'},
    {title: 'SAT Survival', sub: 'HOW LONG CAN YOU LAST?', text: 'Keep answering until you miss. Every run is a new high score to beat.'},
    {title: 'Practice Rivals', sub: 'READY WHEN THE QUEUE IS QUIET', text: 'No one waiting? Match instantly with a rotating SAT Duel rival that answers and reacts in real time.'},
    {title: 'Full Practice Tests', sub: 'FULL TIMED MODULES', text: 'Sit a complete timed module and get a score report you can reopen anytime.'},
    {title: '2-Minute Diagnostic', sub: 'NO SIGNUP NEEDED', text: 'Answer a few questions and get an instant estimate of where you stand.'},
    {title: 'Coin Shop', sub: 'EARN COINS FROM PRACTICE', text: 'Every session earns coins. Spend them on pixel avatars and cosmetics.'},
];

function MoreWaysToTrain() {
    return (
        <section className="px-5 py-24 sm:px-10">
            <div className="mx-auto max-w-[1160px]">
                <div className="max-w-[640px]">
                    <Eyebrow color="#F08A3E">BEYOND THE DUEL</Eyebrow>
                    <H2>Six more ways to grind.</H2>
                </div>
                <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {TRAIN_TILES.map((t) => (
                        <div key={t.title} className={`${panelCls} rounded-[14px] p-5 transition-transform hover:-translate-y-0.5`}>
                            <span className={`${MONO} text-[10.5px] tracking-[0.1em] text-[var(--sd-violet-lbl)]`}>{t.sub}</span>
                            <h3 className="sd-display m-0 mt-2 text-[19px] font-bold text-[var(--sd-text)]">{t.title}</h3>
                            <p className="m-0 mt-1.5 text-sm leading-relaxed text-[var(--sd-mut)]">{t.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* pricing + final CTA                                                 */
/* ------------------------------------------------------------------ */

function Pricing() {
    return (
        <section id="pricing" className="border-t border-[var(--sd-line)] bg-[var(--sd-bg2)] px-5 py-[104px] sm:px-10">
            <div className="mx-auto max-w-[840px]">
                <h2 className="sd-display m-0 text-center text-[32px] font-bold tracking-[-0.02em] text-[var(--sd-text)] sm:text-[42px]">
                    Free to duel. Cheap to go unlimited.
                </h2>
                <div className="mt-12 grid gap-5 md:grid-cols-2">
                    <div className={`${panelCls} rounded-[18px] p-7`}>
                        <span className={`${MONO} text-xs tracking-[0.1em] text-[var(--sd-violet-lbl)]`}>FREE</span>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="sd-display text-[44px] font-bold text-[var(--sd-text)]">$0</span>
                            <span className="text-sm text-[var(--sd-dim)]">forever</span>
                        </div>
                        <div className="mt-5 flex flex-col gap-2.5 text-[14.5px] text-[var(--sd-mut2)]">
                            <span>✓&nbsp;&nbsp;25 questions a day</span>
                            <span>✓&nbsp;&nbsp;Duels and practice tests</span>
                            <span>✓&nbsp;&nbsp;Diagnostic score estimate</span>
                        </div>
                        <Link to="/register" className="mt-[26px] block rounded-[11px] border-[1.5px] border-[var(--sd-line3)] py-[13px] text-center text-[15px] font-bold text-[var(--sd-body)] no-underline transition-colors hover:border-[#A78BFA] hover:text-[var(--sd-text)]">
                            Start Free
                        </Link>
                    </div>
                    <div className={`relative rounded-[18px] border-[1.5px] border-[rgba(233,188,79,0.55)] bg-[var(--sd-panel)] p-7 shadow-[0_0_0_4px_rgba(233,188,79,0.07)]`}>
                        <span className={`${MONO} absolute -top-3 right-[22px] rounded-md bg-[#E9BC4F] px-2.5 py-1 text-[10.5px] tracking-[0.08em] text-[#1F1204]`}>MOST POPULAR</span>
                        <span className={`${MONO} text-xs tracking-[0.1em] text-[var(--sd-gold-lbl)]`}>PREMIUM</span>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="sd-display text-[44px] font-bold text-[var(--sd-text)]">$9.99</span>
                            <span className="text-sm text-[var(--sd-dim)]">per month</span>
                        </div>
                        <div className="mt-5 flex flex-col gap-2.5 text-[14.5px] text-[var(--sd-mut2)]">
                            <span>✓&nbsp;&nbsp;Unlimited practice</span>
                            <span>✓&nbsp;&nbsp;Choose the exact topics you drill</span>
                            <span>✓&nbsp;&nbsp;Everything in Free</span>
                        </div>
                        <Link to="/pricing" className="mt-[26px] block rounded-[11px] bg-[#7C5CF0] py-[13px] text-center text-[15px] font-bold text-white no-underline shadow-[0_6px_20px_rgba(124,92,240,0.4)] transition-colors hover:bg-[#9678FF]">
                            Go Premium
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="border-t border-[var(--sd-line)] px-5 pb-[110px] pt-[72px] sm:px-10">
            <div className="mx-auto max-w-[880px] text-center">
                <div className={`${MONO} flex flex-wrap justify-center gap-x-11 gap-y-4 border-b border-[var(--sd-line)] pb-10 text-[13px] font-medium text-[var(--sd-dim)]`}>
                    <span><span className="text-xl font-bold text-[var(--sd-gold-lbl)]">1,800+</span><br/>SAT-style questions</span>
                    <span><span className="text-xl font-bold text-[var(--sd-green-lbl)]">400+</span><br/>students practicing</span>
                    <span><span className="text-xl font-bold text-[#7C5CF0]">$0</span><br/>to start</span>
                </div>
                <p className={`${MONO} m-0 mt-10 text-[13px] font-medium tracking-[0.06em] text-[var(--sd-dim)]`}>
                    Built for Digital SAT students who hate boring practice.
                </p>
                <h2 className="sd-display m-0 mt-4 text-4xl font-bold tracking-[-0.03em] text-[var(--sd-text)] sm:text-[52px]">
                    Ready for your first duel?
                </h2>
                <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                    <PrimaryCta className="px-[34px] py-4 text-[16.5px]">Start Free</PrimaryCta>
                    <OutlineCta className="px-[34px] py-4 text-[16.5px]">Try a Demo Round</OutlineCta>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

function HomePage() {
    return (
        <div>
            <SEO
                title="SAT Duel - Turn Digital SAT Practice Into a Duel"
                description="Train with 1,800+ Digital SAT questions, challenge friends in timed rounds, review AI explanations, and track every mistake across Math and Reading & Writing."
                path="/"
                structuredData={[organizationJsonLd(), websiteJsonLd(), softwareAppJsonLd()]}
            />
            <Hero/>
            <MiniDemo/>
            <Journey/>
            <Multiplayer/>
            <Tournaments/>
            <AiExplanations/>
            <StudyGuides/>
            <Progress/>
            <MoreWaysToTrain/>
            <Pricing/>
            <FinalCta/>
        </div>
    );
}

export default HomePage;
