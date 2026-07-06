import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Timer} from 'lucide-react';
import {Alert, Button, Card, Field, Input, PageContainer, Select} from '../../components/ui';

const timerOptions = [
    {key: 'bullet', label: 'Bullet', seconds: 60, helper: '1 min'},
    {key: 'blitz', label: 'Blitz', seconds: 180, helper: '3 min'},
    {key: 'rapid', label: 'Rapid', seconds: 300, helper: '5 min'},
    {key: 'marathon', label: 'Marathon', seconds: 600, helper: '10 min'},
    {key: 'custom', label: 'Custom', seconds: null, helper: 'Your pace'},
];

function PowerSprintHome() {
    const [difficulty, setDifficulty] = useState('3');
    const [timerSetting, setTimerSetting] = useState('rapid');
    const [customMinutes, setCustomMinutes] = useState(5);
    const [customSeconds, setCustomSeconds] = useState(0);
    const navigate = useNavigate();

    const getPresetTime = (preset) => {
        const option = timerOptions.find((item) => item.key === preset);
        return option?.seconds || 300;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const gameSettings = {
            difficulty,
            timer: timerSetting === 'custom'
                ? Number(customMinutes) * 60 + Number(customSeconds)
                : getPresetTime(timerSetting),
        };
        navigate('/power_sprint', {state: {gameSettings}});
    };

    return (
        <PageContainer className="flex min-h-screen max-w-2xl items-center py-8">
            <Card className="w-full p-5 sm:p-8">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                        <Timer size={26}/>
                    </div>
                    <h1 className="text-3xl font-black text-slate-950">PowerSprint Settings</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Pick a difficulty and timer, then race the clock.
                    </p>
                </div>

                <Alert type="error">
                    This feature is still under development and may feel rough.
                </Alert>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <Field label="Difficulty">
                        <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                            <option value="1">Easy</option>
                            <option value="3">Medium</option>
                            <option value="5">Hard</option>
                        </Select>
                    </Field>

                    <Field label="Timer Setting">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {timerOptions.map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => setTimerSetting(option.key)}
                                    className={[
                                        'rounded-2xl border-2 px-4 py-3 text-left transition-colors',
                                        timerSetting === option.key
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200',
                                    ].join(' ')}
                                >
                                    <span className="block font-black">{option.label}</span>
                                    <span className="text-sm text-slate-500">{option.helper}</span>
                                </button>
                            ))}
                        </div>
                    </Field>

                    {timerSetting === 'custom' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Minutes">
                                <Input
                                    type="number"
                                    value={customMinutes}
                                    onChange={(event) => setCustomMinutes(Number(event.target.value))}
                                    min="0"
                                    max="59"
                                />
                            </Field>
                            <Field label="Seconds">
                                <Input
                                    type="number"
                                    value={customSeconds}
                                    onChange={(event) => setCustomSeconds(Number(event.target.value))}
                                    min="0"
                                    max="59"
                                />
                            </Field>
                        </div>
                    )}

                    <Button type="submit" size="lg" block>Start Game</Button>
                </form>
            </Card>
        </PageContainer>
    );
}

export default PowerSprintHome;
