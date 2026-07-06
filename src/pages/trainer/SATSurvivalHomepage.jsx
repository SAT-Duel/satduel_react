import React from 'react';
import {Bolt, Flame, Play, Rocket, Trophy} from 'lucide-react';
import {Button, Card, PageContainer} from '../../components/ui';

const rules = [
    {
        icon: Rocket,
        title: 'Progressive Difficulty',
        text: 'Start with easier questions and climb into harder ones as your streak grows.',
    },
    {
        icon: Bolt,
        title: 'Endurance Challenge',
        text: 'Keep answering until a mistake ends the run.',
    },
    {
        icon: Trophy,
        title: 'Skill Mastery',
        text: 'Use the streak format to build focus and pressure tolerance.',
    },
];

function SATSurvivalHomepage() {
    return (
        <PageContainer className="min-h-screen py-8 sm:py-10">
            <Card className="mb-6 overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-rose-600">
                            <Flame size={14}/> Survival Mode
                        </div>
                        <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">SAT Survival</h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                            Build unbreakable knowledge through a question streak that only ends when you miss.
                        </p>
                    </div>
                    <Button to="/sat_survival" size="lg">
                        <Play size={18}/> Start Training
                    </Button>
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                {rules.map(({icon: Icon, title, text}) => (
                    <Card key={title} className="p-5">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                            <Icon size={24}/>
                        </div>
                        <h2 className="text-lg font-black text-slate-950">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                    </Card>
                ))}
            </div>
        </PageContainer>
    );
}

export default SATSurvivalHomepage;
