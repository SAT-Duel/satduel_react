import React from 'react';
import {ArrowRight, BarChart3, Clock3, ShieldCheck, Trophy, Users} from 'lucide-react';
import {Button, Card, PageContainer} from '../components/ui';

const FEATURES = [
    {
        title: 'Find a round',
        description: 'Public tournaments sit in one clean arena list. Private rounds stay accessible by code.',
        icon: Trophy,
    },
    {
        title: 'Answer under pressure',
        description: 'The timer gives practice a real test-day edge without hiding the learning goal.',
        icon: Clock3,
    },
    {
        title: 'Compare fairly',
        description: 'Everyone plays the same question set, so leaderboard movement is easy to understand.',
        icon: ShieldCheck,
    },
];

const BENEFITS = [
    ['Competitive focus', 'A tournament should make a practice session feel important enough to finish.'],
    ['Community signal', 'Seeing other students working makes SAT prep feel less isolated.'],
    ['Useful analytics', 'Score, timing, and question history point users back into targeted practice.'],
    ['Low clutter', 'No coins or side systems. The core loop is questions, timing, leaderboard.'],
];

function TournamentPage() {
    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)]">
            <section className="sat-arena-surface border-b border-slate-200">
                <PageContainer className="py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                            <Trophy className="size-4 text-amber-300"/> Tournament mode
                        </span>
                        <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                            Practice with stakes, without adding noise.
                        </h1>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            SAT Duel tournaments turn a timed question set into a shared arena: same questions, same clock, clear leaderboard.
                        </p>
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button to="/tournaments" size="lg">
                                View tournaments <ArrowRight className="size-5"/>
                            </Button>
                            <Button to="/create_tournament" variant="secondary" size="lg">
                                Create private round
                            </Button>
                        </div>
                    </div>
                </PageContainer>
            </section>

            <PageContainer className="py-12 sm:py-16">
                <div className="grid gap-4 md:grid-cols-3">
                    {FEATURES.map(({title, description, icon: Icon}) => (
                        <Card key={title} hover className="sat-arena-card p-5">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                                <Icon className="size-6"/>
                            </div>
                            <h2 className="m-0 mt-5 font-display text-xl font-black text-slate-950">{title}</h2>
                            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
                        </Card>
                    ))}
                </div>

                <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-primary-600">Why it exists</p>
                        <h2 className="m-0 mt-3 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Tournaments are for motivation, not distraction.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            The product should not make students track five currencies. Tournament mode should give them one clear reason to sit down and finish a serious round.
                        </p>
                    </div>

                    <Card className="sat-arena-card overflow-hidden">
                        <div className="sat-duel-lanes bg-slate-950 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <span className="font-black">Weekly Bubble Arena</span>
                                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-black text-emerald-200">
                                    Live
                                </span>
                            </div>
                            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <Users className="mx-auto size-5 text-cyan-200"/>
                                    <p className="m-0 mt-2 font-display text-2xl font-black">42</p>
                                    <p className="m-0 text-[10px] font-black uppercase text-slate-300">players</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <Clock3 className="mx-auto size-5 text-amber-200"/>
                                    <p className="m-0 mt-2 font-display text-2xl font-black">25m</p>
                                    <p className="m-0 text-[10px] font-black uppercase text-slate-300">timer</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <BarChart3 className="mx-auto size-5 text-emerald-200"/>
                                    <p className="m-0 mt-2 font-display text-2xl font-black">10</p>
                                    <p className="m-0 text-[10px] font-black uppercase text-slate-300">questions</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3 p-5 sm:grid-cols-2">
                            {BENEFITS.map(([title, copy]) => (
                                <div key={title} className="rounded-2xl bg-slate-50 p-4">
                                    <p className="m-0 font-black text-slate-900">{title}</p>
                                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{copy}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>
            </PageContainer>
        </div>
    );
}

export default TournamentPage;
