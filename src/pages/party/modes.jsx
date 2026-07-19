import React from 'react';

/**
 * Party game modes: artwork, copy, and the settings each one cares about.
 *
 * Art is inline SVG so it themes with the card accent and ships no assets.
 * Gradient ids are namespaced per mode — two cards on screen would otherwise
 * fight over the same defs id and both render with the first one's colors.
 */

function ClassicArt() {
    return (
        <svg viewBox="0 0 140 84" fill="none" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id="party-art-classic" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.9"/>
                </linearGradient>
            </defs>
            {[
                {x: 26, h: 30}, {x: 54, h: 52}, {x: 82, h: 40}, {x: 110, h: 22},
            ].map(({x, h}) => (
                <rect key={x} x={x - 9} y={70 - h} width="18" height={h} rx="5"
                      fill="url(#party-art-classic)"/>
            ))}
            <path d="M14 70h116" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5"
                  strokeLinecap="round"/>
            <path d="M52 8l-13 22h11l-3 16 14-23H50l2-15z" fill="currentColor"/>
            <circle cx="110" cy="26" r="3" fill="currentColor" fillOpacity="0.45"/>
            <circle cx="26" cy="30" r="2.5" fill="currentColor" fillOpacity="0.3"/>
        </svg>
    );
}

function TeamsArt() {
    return (
        <svg viewBox="0 0 140 84" fill="none" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id="party-art-teams-l" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.85"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="party-art-teams-r" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.25"/>
                </linearGradient>
            </defs>
            <path d="M10 14h46v42l-23-11-23 11z" fill="url(#party-art-teams-l)"/>
            <path d="M84 14h46v42l-23-11-23 11z" fill="url(#party-art-teams-r)"/>
            <circle cx="24" cy="30" r="5" fill="currentColor" fillOpacity="0.55"/>
            <circle cx="42" cy="30" r="5" fill="currentColor" fillOpacity="0.55"/>
            <circle cx="98" cy="30" r="5" fill="currentColor" fillOpacity="0.45"/>
            <circle cx="116" cy="30" r="5" fill="currentColor" fillOpacity="0.45"/>
            <path d="M64 34l6-6m0 0l6 6m-6-6v22" stroke="currentColor" strokeOpacity="0.5"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70 68h0" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        </svg>
    );
}

function SurvivalArt() {
    const heart = 'M0 8c0-4 3-7 7-7 3 0 5 2 6 4 1-2 3-4 6-4 4 0 7 3 7 7 0 8-9 13-13 16C9 21 0 16 0 8z';
    return (
        <svg viewBox="0 0 140 84" fill="none" className="h-full w-full" aria-hidden="true">
            <g transform="translate(18 26)" fill="currentColor" fillOpacity="0.9">
                <path d={heart}/>
            </g>
            <g transform="translate(58 26)" fill="currentColor" fillOpacity="0.6">
                <path d={heart}/>
            </g>
            {/* The third heart is cracking — the mode's whole premise in one glyph. */}
            <g transform="translate(98 26)">
                <path d={heart} fill="currentColor" fillOpacity="0.16"/>
                <path d={heart} stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5"
                      strokeDasharray="4 3" fill="none"/>
                <path d="M13 2l-4 9h6l-5 10" stroke="currentColor" strokeOpacity="0.75"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
            <path d="M16 68h108" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5"
                  strokeLinecap="round"/>
        </svg>
    );
}

function JeopardyArt() {
    return (
        <svg viewBox="0 0 140 84" fill="none" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id="party-art-jeopardy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                </linearGradient>
            </defs>
            {/* Spotlight cone over the final wager. */}
            <path d="M70 0L104 74H36z" fill="url(#party-art-jeopardy)"/>
            {[0, 1, 2].map((i) => (
                <ellipse key={i} cx="70" cy={62 - i * 9} rx="22" ry="7"
                         fill="currentColor" fillOpacity={0.25 + i * 0.2}/>
            ))}
            <text x="70" y="30" textAnchor="middle" fill="currentColor"
                  fontSize="20" fontWeight="800" fontFamily="inherit">×2</text>
            <circle cx="28" cy="18" r="2.5" fill="currentColor" fillOpacity="0.4"/>
            <circle cx="114" cy="24" r="2" fill="currentColor" fillOpacity="0.3"/>
        </svg>
    );
}

export const PARTY_MODES = [
    {
        key: 'classic',
        name: 'Classic',
        tagline: 'Fastest correct answer wins.',
        Art: ClassicArt,
        available: true,
        // Tailwind needs literal class names, so each mode carries its own.
        text: 'text-primary-600',
        card: 'border-primary-200 bg-gradient-to-br from-primary-50 to-white',
        cardOn: 'border-primary-500 bg-gradient-to-br from-primary-100 to-primary-50 ring-2 ring-primary-200',
        summary: 'Everyone races the same question. A Kahoot-style free-for-all.',
        how: [
            'Every player sees the same question at the same time.',
            'Correct answers score 500–1000 points — lock in faster, score higher.',
            'Standings pop up after each question, and the game ends on a podium.',
        ],
        bestFor: 'Any group. The one to start with if nobody has played before.',
    },
    {
        key: 'teams',
        name: 'Teams',
        tagline: 'Two to four squads, one score.',
        Art: TeamsArt,
        available: true,
        text: 'text-violet-600',
        card: 'border-violet-200 bg-gradient-to-br from-violet-50 to-white',
        cardOn: 'border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 ring-2 ring-violet-200',
        summary: 'Players split into squads. Every point feeds the team total.',
        how: [
            'Pick 2–4 teams. Shuffle them randomly, or sort everyone by hand in the lobby.',
            'The host can rename any team before the game starts.',
            'Scoring works exactly like Classic — points just roll up to the team.',
            'The leaderboard ranks teams, and expands to show who contributed what.',
        ],
        bestFor: 'Bigger rooms and classrooms. Nobody feels singled out for a wrong answer.',
    },
    {
        key: 'survival',
        name: 'Survival',
        tagline: 'Miss too many and you are out.',
        Art: SurvivalArt,
        available: true,
        text: 'text-rose-600',
        card: 'border-rose-200 bg-gradient-to-br from-rose-50 to-white',
        cardOn: 'border-rose-500 bg-gradient-to-br from-rose-100 to-rose-50 ring-2 ring-rose-200',
        summary: 'Everyone starts with hearts. A wrong answer costs one.',
        how: [
            'Each player starts with the same number of hearts.',
            'A wrong answer — or letting the clock run out — costs a heart.',
            'Last one standing: lose all your hearts and you are out, and the final survivor wins.',
            'Fixed questions: nobody is knocked out, and whoever has the most hearts at the end wins.',
            'Points still tick up in the background and settle any tie.',
        ],
        bestFor: 'Late in a party, when you want the room watching one screen.',
    },
    {
        key: 'jeopardy',
        name: 'Final Jeopardy',
        tagline: 'Bet it all on the last question.',
        Art: JeopardyArt,
        available: true,
        text: 'text-amber-600',
        card: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
        cardOn: 'border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 ring-2 ring-amber-200',
        summary: 'Classic rules, until the last question turns into a wager.',
        how: [
            'Plays exactly like Classic right up to the final question.',
            'Before that question, everyone secretly bets part of their score.',
            'Get it right and your bet is paid back double. Get it wrong and it is gone.',
            'On the final question only, answering faster earns no extra points — take your time.',
            'Nobody is ever mathematically out of it, so the room stays in until the end.',
        ],
        bestFor: 'Groups where one person would otherwise run away with it.',
    },
];

export const MODES_BY_KEY = Object.fromEntries(PARTY_MODES.map((mode) => [mode.key, mode]));
