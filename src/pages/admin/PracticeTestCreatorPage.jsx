import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, BarChart3, CheckCircle2, Layers3, Plus} from 'lucide-react';
import api from '../../components/api';
import withAuth from '../../hoc/withAuth';
import {Button, Card, Field, Input, PageContainer, Select} from '../../components/ui';
import {notify} from '../../utils/notify';

const slots = [
    ['english_a', 'Reading & Writing · Module A', 'Broad routing module'],
    ['english_b', 'Reading & Writing · Module B', 'Easier second module'],
    ['english_c', 'Reading & Writing · Module C', 'Harder second module'],
    ['math_a', 'Math · Module A', 'Broad routing module'],
    ['math_b', 'Math · Module B', 'Easier second module'],
    ['math_c', 'Math · Module C', 'Harder second module'],
];

const emptySelection = Object.fromEntries(slots.map(([field]) => [field, '']));
const testTypes = {
    full: {label: 'Full SAT', subjects: ['english', 'math'], score: 1600},
    english: {label: 'Reading & Writing only', subjects: ['english'], score: 800},
    math: {label: 'Math only', subjects: ['math'], score: 800},
};

function PracticeTestCreatorPage() {
    const [tests, setTests] = useState([]);
    const [modules, setModules] = useState([]);
    const [name, setName] = useState('');
    const [testType, setTestType] = useState('full');
    const [selection, setSelection] = useState(emptySelection);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            const response = await api.get('/api/admin/practice-tests/');
            setTests(response.data.tests || []);
            setModules(response.data.modules || []);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to load practice tests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const available = useMemo(() => modules.filter((module) => !module.assigned_test), [modules]);
    const activeSlots = useMemo(
        () => slots.filter(([field]) => testTypes[testType].subjects.includes(field.split('_')[0])),
        [testType],
    );
    const ready = name.trim() && activeSlots.every(([field]) => selection[field]);

    const createTest = async () => {
        try {
            setSaving(true);
            const response = await api.post('/api/admin/practice-tests/', {
                name: name.trim(),
                test_type: testType,
                ...Object.fromEntries(activeSlots.map(([field]) => [field, Number(selection[field])])),
            });
            notify.success(`${response.data.test.name} is now live on the Practice Tests page.`);
            setName('');
            setSelection(emptySelection);
            await load();
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to create this practice test.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageContainer className="min-h-screen max-w-6xl py-6 sm:py-8">
            <Button to="/admin" variant="ghost" className="mb-4 px-0">
                <ArrowLeft size={18}/> Back to Admin Tools
            </Button>

            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    Practice Test Creator
                </div>
                <h1 className="text-3xl font-black text-slate-950">Assemble an Adaptive Test</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Build a full-length or single-subject test with one A, B, and C module per included section.
                    Published modules are locked, so another test can never serve the same questions.
                </p>
            </div>

            <Card className="mb-8 overflow-hidden">
                <div className="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 md:grid-cols-2 sm:p-6">
                    <Field label="Test format">
                        <Select value={testType} onChange={(event) => setTestType(event.target.value)}>
                            {Object.entries(testTypes).map(([value, meta]) => (
                                <option key={value} value={value}>{meta.label} · scored out of {meta.score}</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Practice test name">
                        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. SAT Duel Practice Test 1" maxLength={120}/>
                    </Field>
                </div>
                <div className="grid gap-4 p-5 md:grid-cols-2 sm:p-6">
                    {activeSlots.map(([field, label, description]) => {
                        const [subject, route] = field.split('_');
                        const options = available.filter((module) => module.subject === subject && module.route === route.toUpperCase());
                        return (
                            <Field key={field} label={label} hint={description}>
                                <Select
                                    value={selection[field]}
                                    onChange={(event) => setSelection((current) => ({...current, [field]: event.target.value}))}
                                    disabled={loading}
                                >
                                    <option value="">{options.length ? 'Select an unused module' : 'No unused module available'}</option>
                                    {options.map((module) => (
                                        <option key={module.id} value={module.id}>{module.name} · {module.question_count} questions</option>
                                    ))}
                                </Select>
                            </Field>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="m-0 text-xs font-bold text-slate-500">
                        Students see this {testTypes[testType].label.toLowerCase()} test immediately. Every delivered question counts toward its {testTypes[testType].score}-point score.
                    </p>
                    <Button onClick={createTest} disabled={!ready} loading={saving} className="shrink-0">
                        <Plus size={18}/> Create and publish
                    </Button>
                </div>
            </Card>

            <div className="mb-3 flex items-center gap-2">
                <Layers3 className="size-5 text-primary-600"/>
                <h2 className="m-0 text-xl font-black text-slate-950">Published tests</h2>
            </div>
            {tests.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                    {tests.map((test) => (
                        <Card key={test.id} className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="m-0 font-display text-xl font-black text-slate-950">{test.name}</p>
                                    <p className="m-0 mt-1 text-xs font-bold text-slate-400">
                                        {testTypes[test.test_type]?.label} · {test.question_count} questions · {test.duration_minutes} minutes · /{test.maximum_score}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                                    <CheckCircle2 className="size-3.5"/> Live
                                </span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="rounded-2xl bg-primary-50 p-3">
                                    <p className="m-0 font-display text-2xl font-black text-primary-700">{test.completion_count}</p>
                                    <p className="m-0 mt-0.5 text-xs font-black uppercase text-primary-500">Students completed</p>
                                </div>
                                <div className="rounded-2xl bg-cyan-50 p-3">
                                    <p className="m-0 font-display text-2xl font-black text-cyan-700">{test.calibration_count}<span className="text-sm text-cyan-500"> / 500</span></p>
                                    <p className="m-0 mt-0.5 flex items-center gap-1 text-xs font-black uppercase text-cyan-600"><BarChart3 className="size-3.5"/> Valid calibration</p>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-1.5 text-xs text-slate-500 sm:grid-cols-2">
                                {slots.filter(([field]) => test.modules[field]).map(([field, label]) => (
                                    <p key={field} className="m-0 truncate"><span className="font-black text-slate-700">{label}:</span> {test.modules[field].name}</p>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-sm text-slate-500">No practice tests have been assembled yet.</Card>
            )}
        </PageContainer>
    );
}

export default withAuth(PracticeTestCreatorPage, true);
