import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, Check, Copy, Sparkles, Upload} from 'lucide-react';
import api from '../../components/api';
import withAuth from '../../hoc/withAuth';
import RenderWithMath from '../../components/RenderWithMath';
import {Button, Card, Field, PageContainer, Select, Spinner, Textarea} from '../../components/ui';
import {notify} from '../../utils/notify';

// Mirrors api/generation.py parse_questions: tolerate fences/prose around the JSON array.
function parseModelOutput(raw) {
    let text = raw.trim();
    const fenced = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (fenced) {
        text = fenced[1];
    } else {
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start === -1 || end <= start) throw new Error('No JSON array found in the pasted text.');
        text = text.slice(start, end + 1);
    }
    const questions = JSON.parse(text);
    if (!Array.isArray(questions)) throw new Error('Pasted JSON is not an array.');
    const required = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'answer', 'difficulty', 'question_type', 'explanation'];
    questions.forEach((q, i) => {
        const missing = required.filter((f) => !(f in q));
        if (missing.length) throw new Error(`Question ${i + 1} is missing: ${missing.join(', ')}`);
        q.answer = String(q.answer).toUpperCase();
        if (!'ABCD'.includes(q.answer) || q.answer.length !== 1) throw new Error(`Question ${i + 1} has invalid answer "${q.answer}"`);
        q.difficulty = Math.max(1, Math.min(5, parseInt(q.difficulty, 10) || 3));
    });
    return questions;
}

function DraftCard({draft, selected, onToggle}) {
    const choices = [['A', draft.choice_a], ['B', draft.choice_b], ['C', draft.choice_c], ['D', draft.choice_d]];
    return (
        <Card className={`p-5 ${selected ? '' : 'opacity-50'}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-700">{draft.question_type}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">Difficulty {draft.difficulty}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Answer {draft.answer}</span>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-bold text-slate-600">
                    <input type="checkbox" checked={selected} onChange={onToggle} className="size-4"/>
                    Import
                </label>
            </div>
            <div className="mb-4 text-[15px] leading-7 text-slate-900">
                <RenderWithMath text={draft.question}/>
            </div>
            <div className="mb-4 grid gap-2">
                {choices.map(([letter, text]) => (
                    <div
                        key={letter}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                            letter === draft.answer
                                ? 'border-emerald-300 bg-emerald-50'
                                : 'border-slate-200'
                        }`}
                    >
                        <span className="mr-2 font-black">{letter}.</span>
                        <RenderWithMath text={text}/>
                    </div>
                ))}
            </div>
            <details className="text-sm leading-6 text-slate-600">
                <summary className="cursor-pointer font-bold text-slate-500">Explanation</summary>
                <div className="mt-2"><RenderWithMath text={draft.explanation}/></div>
            </details>
        </Card>
    );
}

function QuestionGeneratorPage() {
    const [domains, setDomains] = useState([]);
    const [apiStatus, setApiStatus] = useState({anthropic: false, openai: false});
    const [loading, setLoading] = useState(true);

    const [domainName, setDomainName] = useState('');
    const [skillName, setSkillName] = useState('');
    const [variant, setVariant] = useState('');
    const [difficulty, setDifficulty] = useState('3');
    const [count, setCount] = useState('5');

    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [pasted, setPasted] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [importing, setImporting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/api/admin/generation/taxonomy/')
            .then((res) => {
                setDomains(res.data.domains);
                setApiStatus(res.data.api_status);
                const first = res.data.domains[0];
                setDomainName(first.name);
                setSkillName(first.skills[0].name);
            })
            .catch(() => notify.error('Failed to load the generation taxonomy'))
            .finally(() => setLoading(false));
    }, []);

    const domain = useMemo(() => domains.find((d) => d.name === domainName), [domains, domainName]);
    const skill = useMemo(() => domain?.skills.find((s) => s.name === skillName), [domain, skillName]);
    const apiConfigured = apiStatus.anthropic || apiStatus.openai;

    const setDraftList = (questions) => {
        setDrafts(questions);
        setSelected(questions.map(() => true));
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setPrompt('');
        setPasted('');
        setDrafts([]);
        try {
            const res = await api.post('/api/admin/generation/generate/', {
                skill: skillName,
                variant: variant || null,
                difficulty: Number(difficulty),
                count: Number(count),
            });
            setPrompt(res.data.prompt);
            if (res.data.questions) {
                setDraftList(res.data.questions);
                notify.success(`Generated ${res.data.questions.length} draft question(s)`);
            }
        } catch (error) {
            const data = error.response?.data;
            if (data?.prompt) setPrompt(data.prompt);
            notify.error(data?.error || 'Generation request failed');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyPrompt = async () => {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleParsePasted = () => {
        try {
            setDraftList(parseModelOutput(pasted));
            notify.success('Parsed pasted output into drafts');
        } catch (error) {
            notify.error(error.message);
        }
    };

    const handleImport = async () => {
        const chosen = drafts.filter((_, i) => selected[i]);
        if (!chosen.length) {
            notify.warning('No drafts selected.');
            return;
        }
        try {
            setImporting(true);
            const res = await api.post('/api/admin/generation/import/', {questions: chosen});
            notify.success(`Imported ${res.data.created_ids.length} question(s) into the bank`);
            const remaining = drafts.filter((_, i) => !selected[i]);
            setDraftList(remaining);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    if (loading) {
        return (
            <PageContainer className="flex min-h-screen items-center justify-center">
                <Spinner/>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="min-h-screen max-w-5xl py-6 sm:py-8">
            <Button to="/admin" variant="ghost" className="mb-4 px-0">
                <ArrowLeft size={18}/> Back to Admin Tools
            </Button>

            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    AI Question Generator
                </div>
                <h1 className="text-3xl font-black text-slate-950">Generate SAT Questions</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Pick an official College Board skill, generate draft questions with AI, review them
                    (KaTeX math, tables, and SVG figures render exactly as students will see them), then
                    import the keepers into the question bank.
                </p>
                {!apiConfigured && (
                    <p className="mt-3 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-800">
                        No API key configured (set <code>ANTHROPIC_API_KEY</code> or <code>OPENAI_API_KEY</code> on
                        the server to automate this). Meanwhile: click Generate to build the prompt, copy it into
                        claude.ai or ChatGPT, then paste the model&apos;s JSON reply below.
                    </p>
                )}
            </div>

            <Card className="mb-6 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Domain">
                        <Select
                            value={domainName}
                            onChange={(e) => {
                                setDomainName(e.target.value);
                                const d = domains.find((x) => x.name === e.target.value);
                                setSkillName(d.skills[0].name);
                                setVariant('');
                            }}
                        >
                            {domains.map((d) => (
                                <option key={d.name} value={d.name}>{d.name} ({d.share})</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Skill (official College Board name)">
                        <Select
                            value={skillName}
                            onChange={(e) => {
                                setSkillName(e.target.value);
                                setVariant('');
                            }}
                        >
                            {domain?.skills.map((s) => (
                                <option key={s.name} value={s.name}>
                                    {s.name} — {s.count_in_bank} in bank
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>
                {skill && (
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {skill.blurb} <span className="text-slate-400">(figures: {skill.figures})</span>
                    </p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <Field label="Sub-variant">
                        <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
                            <option value="">Mix (recommended)</option>
                            {skill?.variants.map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Difficulty">
                        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d}</option>)}
                        </Select>
                    </Field>
                    <Field label="How many">
                        <Select value={count} onChange={(e) => setCount(e.target.value)}>
                            {[1, 2, 3, 5, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                        </Select>
                    </Field>
                </div>
                <div className="mt-5 flex justify-end">
                    <Button onClick={handleGenerate} loading={generating}>
                        <Sparkles size={18}/> {apiConfigured ? 'Generate' : 'Build Prompt'}
                    </Button>
                </div>
            </Card>

            {prompt && !apiConfigured && (
                <Card className="mb-6 p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-950">1. Copy this prompt into claude.ai / ChatGPT</h2>
                        <Button variant="secondary" onClick={handleCopyPrompt}>
                            {copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy prompt'}
                        </Button>
                    </div>
                    <Textarea rows={8} readOnly value={prompt} className="font-mono text-xs"/>
                    <h2 className="mb-3 mt-6 text-lg font-black text-slate-950">2. Paste the model&apos;s reply here</h2>
                    <Textarea
                        rows={8}
                        value={pasted}
                        onChange={(e) => setPasted(e.target.value)}
                        placeholder='[{"question": "...", "choice_a": "...", ...}]'
                        className="font-mono text-xs"
                    />
                    <div className="mt-3 flex justify-end">
                        <Button variant="secondary" onClick={handleParsePasted} disabled={!pasted.trim()}>
                            Parse into drafts
                        </Button>
                    </div>
                </Card>
            )}

            {drafts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-950">
                            Review drafts ({selected.filter(Boolean).length}/{drafts.length} selected)
                        </h2>
                        <Button onClick={handleImport} loading={importing}>
                            <Upload size={18}/> Import selected
                        </Button>
                    </div>
                    {drafts.map((draft, i) => (
                        <DraftCard
                            key={i}
                            draft={draft}
                            selected={selected[i]}
                            onToggle={() => setSelected(selected.map((s, j) => (j === i ? !s : s)))}
                        />
                    ))}
                </div>
            )}
        </PageContainer>
    );
}

export default withAuth(QuestionGeneratorPage, true);
