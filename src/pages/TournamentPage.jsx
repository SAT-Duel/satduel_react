import React from 'react';
import {ArrowRight, BarChart3, Clock3, ShieldCheck, Trophy, Users} from 'lucide-react';
import {Button, Card, PageContainer} from '../components/ui';

const FEATURES = [
    {
        title: '1. Join',
        description: 'Pick a public tournament from the list, or enter a join code from a teacher or friend.',
        icon: Trophy,
    },
    {
        title: '2. Answer',
        description: 'Everyone gets the same questions and the same clock. Once you start, the timer keeps running.',
        icon: Clock3,
    },
    {
        title: '3. Score',
        description: 'Correct answers score points; earlier correct answers break ties. Watch the leaderboard update as people finish.',
        icon: ShieldCheck,
    },
];

const BENEFITS = [
    ['Same questions for everyone', 'Rankings are fair — no one gets an easier set.'],
    ['Ties go to the faster player', 'If two people have equal scores, the one who answered correctly sooner ranks higher.'],
    ['Review when you finish', 'Your answers and the correct ones are saved, so you can go over what you missed.'],
    ['Private rounds', 'Anyone can create a tournament and share its code — handy for classes and study groups.'],
];

function TournamentPage() {
    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)]">
            <section className="sat-arena-surface border-b border-slate-200">
                <PageContainer className="py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="m-0 font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                            How tournaments work
                        </h1>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            Everyone answers the same timed question set. Highest score wins — ties go to whoever answered correctly first.
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
                        <h2 className="m-0 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Before you join
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            The timer starts when you open the questions and doesn't pause — join when you have the full round free. You can review every question after you finish.
                        </p>
                    </div>

                    <Card className="sat-arena-card overflow-hidden">
                        <div className="sat-duel-lanes bg-slate-950 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <span className="font-black">A typical round</span>
                                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-black text-emerald-200">
                                    Example
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
