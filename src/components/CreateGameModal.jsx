import React, {useState} from 'react';
import {Clock, Hash, Lock, Users, X} from 'lucide-react';
import {Alert, Button, Field, Input} from './ui';
import api from './api';

function CreateGameModal({visible, onClose, onGameCreated}) {
    const [values, setValues] = useState({
        max_players: 2,
        question_number: 10,
        battle_duration: 600,
        password: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!visible) return null;

    const updateValue = (field, value) => {
        setValues((current) => ({...current, [field]: value}));
    };

    const handleCreateGame = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                max_players: Number(values.max_players),
                question_number: Number(values.question_number),
                battle_duration: Number(values.battle_duration),
                password: values.password,
            };
            const response = await api.post('/api/games/create/', payload);
            onGameCreated(response.data.game_id);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create room.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
            <form onSubmit={handleCreateGame} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="m-0 text-2xl font-bold text-slate-900">Create duel room</h2>
                        <p className="m-0 mt-1 text-sm text-slate-500">Invite friends into a shared SAT question room.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Close create room"
                    >
                        <X className="size-5"/>
                    </button>
                </div>

                {error && <div className="mb-4"><Alert>{error}</Alert></div>}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Players">
                        <div className="relative">
                            <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                            <Input
                                type="number"
                                min="2"
                                max="10"
                                value={values.max_players}
                                onChange={(event) => updateValue('max_players', event.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </Field>
                    <Field label="Questions">
                        <div className="relative">
                            <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                            <Input
                                type="number"
                                min="1"
                                max="100"
                                value={values.question_number}
                                onChange={(event) => updateValue('question_number', event.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </Field>
                    <Field label="Duration (seconds)">
                        <div className="relative">
                            <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                            <Input
                                type="number"
                                min="60"
                                max="3600"
                                value={values.battle_duration}
                                onChange={(event) => updateValue('battle_duration', event.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </Field>
                    <Field label="Password">
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                            <Input
                                type="password"
                                value={values.password}
                                onChange={(event) => updateValue('password', event.target.value)}
                                placeholder="Optional"
                                className="pl-9"
                            />
                        </div>
                    </Field>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving}>
                        Create room
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateGameModal;
