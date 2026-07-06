import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Bot, Gauge, Timer} from 'lucide-react';
import {Button, Card, PageContainer, Select} from '../components/ui';
import {notify} from '../utils/notify';

const bots = [
    {name: 'Easy Bot', score: 1000, speed: 100, solveChance: 50},
    {name: 'Medium Bot', score: 1400, speed: 150, solveChance: 70},
    {name: 'Hard Bot', score: 1800, speed: 200, solveChance: 90},
];

const modes = [
    {name: 'Quick Sprint', questions: 5, time: 5},
    {name: 'Standard Sprint', questions: 10, time: 10},
    {name: 'Extended Sprint', questions: 15, time: 15},
];

function BotTrainingSetup() {
    const [selectedBot, setSelectedBot] = useState('');
    const [selectedMode, setSelectedMode] = useState('');
    const navigate = useNavigate();

    const handleStart = (event) => {
        event.preventDefault();
        if (!selectedBot || !selectedMode) {
            notify.warning('Choose a bot and a training mode first.');
            return;
        }
        navigate('/bot_training/start', {state: {selectedBot, selectedMode}});
    };

    return (
        <PageContainer className="min-h-screen py-8 sm:py-10">
            <Card className="mb-6 p-6 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                            <Bot size={14}/> Bot Training
                        </div>
                        <h1 className="text-4xl font-black text-slate-950">Bot Training Setup</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                            Choose an AI opponent and a sprint format to begin a solo duel.
                        </p>
                    </div>
                </div>
            </Card>

            <form onSubmit={handleStart} className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                                <Gauge size={22}/>
                            </div>
                            <h2 className="text-xl font-black text-slate-950">Select Your AI Opponent</h2>
                        </div>
                        <Select value={selectedBot} onChange={(event) => setSelectedBot(event.target.value)}>
                            <option value="">Choose a bot</option>
                            {bots.map((bot) => (
                                <option key={bot.name} value={bot.name}>
                                    {bot.name} · Score {bot.score} · Speed {bot.speed} · Solve {bot.solveChance}%
                                </option>
                            ))}
                        </Select>
                    </Card>

                    <Card className="p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                                <Timer size={22}/>
                            </div>
                            <h2 className="text-xl font-black text-slate-950">Select Training Mode</h2>
                        </div>
                        <Select value={selectedMode} onChange={(event) => setSelectedMode(event.target.value)}>
                            <option value="">Choose a mode</option>
                            {modes.map((mode) => (
                                <option key={mode.name} value={mode.name}>
                                    {mode.name} · {mode.questions} questions in {mode.time} minutes
                                </option>
                            ))}
                        </Select>
                    </Card>
                </div>

                <div className="flex justify-center">
                    <Button type="submit" size="lg">Start Training</Button>
                </div>
            </form>
        </PageContainer>
    );
}

export default BotTrainingSetup;
