import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, Check, Copy, Search, Sparkles, Upload} from 'lucide-react';
import api from '../../components/api';
import withAuth from '../../hoc/withAuth';
import RenderWithMath from '../../components/RenderWithMath';
import {Button, Card, Field, Input, PageContainer, Select, Spinner, Textarea} from '../../components/ui';
import {notify} from '../../utils/notify';
import {QUESTION_SOURCES, questionSourceLabel} from '../../utils/questionSource';

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

function QuestionPreview({question, label}) {
    const choices = [['A', question.choice_a], ['B', question.choice_b], ['C', question.choice_c], ['D', question.choice_d]];
    return (
        <div className={label ? 'min-w-0 rounded-xl border border-slate-200 bg-white p-4' : 'min-w-0'}>
            {label && <div className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>}
            <div className="mb-4 text-[15px] leading-7 text-slate-900">
                <RenderWithMath text={question.question}/>
            </div>
            <div className="grid gap-2">
                {choices.map(([letter, text]) => (
                    <div
                        key={letter}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                            letter === question.answer
                                ? 'border-emerald-300 bg-emerald-50'
                                : 'border-slate-200'
                        }`}
                    >
                        <span className="mr-2 font-black">{letter}.</span>
                        <RenderWithMath text={text}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DraftCard({draft, selected, onToggle, source, sourceOther, duplicate}) {
    return (
        <Card className={`p-5 ${selected ? '' : 'bg-slate-50/60'}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-700">{draft.question_type}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">Difficulty {draft.difficulty}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Answer {draft.answer}</span>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-violet-700">
                        {questionSourceLabel(source, sourceOther)}
                    </span>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-bold text-slate-600">
                    <input type="checkbox" checked={selected} onChange={onToggle} className="size-4"/>
                    Import
                </label>
            </div>
            {duplicate && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-800">
                    <span className="font-black">
                        {duplicate.match === 'near' ? 'Possible duplicate' : 'Duplicate found'}
                    </span>
                    {duplicate.where === 'batch'
                        ? ` — matches draft #${duplicate.draft_index + 1} in this batch.`
                        : duplicate.match === 'near'
                            ? ` — ${Math.round(duplicate.ratio * 100)}% text match with question #${duplicate.question_id}.`
                            : ` — matches question #${duplicate.question_id}.`}
                    {' '}Review both versions below. This draft was unchecked automatically.
                </div>
            )}
            <div className={duplicate ? 'mb-4 grid gap-3 lg:grid-cols-2' : 'mb-4'}>
                <QuestionPreview question={draft} label={duplicate ? 'Import candidate' : null}/>
                {duplicate?.comparison && (
                    <QuestionPreview
                        question={duplicate.comparison}
                        label={duplicate.where === 'batch'
                            ? `Earlier draft #${duplicate.draft_index + 1}`
                            : `Existing question #${duplicate.question_id}`}
                    />
                )}
            </div>
            <details className="text-sm leading-6 text-slate-600">
                <summary className="cursor-pointer font-bold text-slate-500">Explanation</summary>
                <div className="mt-2"><RenderWithMath text={draft.explanation}/></div>
            </details>
        </Card>
    );
}

const mathDomains = new Set([
    'Algebra',
    'Advanced Math',
    'Problem-Solving and Data Analysis',
    'Geometry and Trigonometry',
]);

function domainSubject(domainName) {
    return mathDomains.has(domainName) ? 'math' : 'english';
}

function QuestionGeneratorPage() {
    const [domains, setDomains] = useState([]);
    const [apiStatus, setApiStatus] = useState({anthropic: false, openai: false});
    const [loading, setLoading] = useState(true);

    const [subjectName, setSubjectName] = useState('math');
    const [domainName, setDomainName] = useState('');
    const [skillName, setSkillName] = useState('');
    const [difficulty, setDifficulty] = useState('3');
    const [count, setCount] = useState('5');
    const [source, setSource] = useState('ai_generated');
    const [sourceOther, setSourceOther] = useState('');

    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [pasted, setPasted] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [duplicates, setDuplicates] = useState({});
    const [checkingDuplicates, setCheckingDuplicates] = useState(false);
    const [duplicateCheckDone, setDuplicateCheckDone] = useState(false);
    const [importing, setImporting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/api/admin/generation/taxonomy/')
            .then((res) => {
                setDomains(res.data.domains);
                setApiStatus(res.data.api_status);
                const first = res.data.domains.find((d) => domainSubject(d.name) === 'math') || res.data.domains[0];
                if (first) {
                    setDomainName(first.name);
                    setSkillName(first.skills[0].name);
                }
            })
            .catch(() => notify.error('Failed to load the generation taxonomy'))
            .finally(() => setLoading(false));
    }, []);

    const subjectDomains = useMemo(
        () => domains.filter((d) => domainSubject(d.name) === subjectName),
        [domains, subjectName]
    );
    const domain = useMemo(() => subjectDomains.find((d) => d.name === domainName), [subjectDomains, domainName]);
    const skill = useMemo(() => domain?.skills.find((s) => s.name === skillName), [domain, skillName]);
    const apiConfigured = apiStatus.anthropic || apiStatus.openai;
    const englishSkillNames = useMemo(() => new Set(
        domains
            .filter((item) => domainSubject(item.name) === 'english')
            .flatMap((item) => item.skills.map((itemSkill) => itemSkill.name.toLowerCase()))
    ), [domains]);
    const hasEnglishDrafts = drafts.some((draft) => (
        typeof draft.question_type === 'string'
        && englishSkillNames.has(draft.question_type.trim().toLowerCase())
    ));

    const setSubject = (value) => {
        const first = domains.find((d) => domainSubject(d.name) === value);
        setSubjectName(value);
        setDomainName(first?.name || '');
        setSkillName(first?.skills?.[0]?.name || '');
    };

    const setDraftList = (questions) => {
        setDrafts(questions);
        setSelected(questions.map(() => true));
        setDuplicates({});
        setDuplicateCheckDone(false);
    };

    const handleCheckDuplicates = async () => {
        try {
            setCheckingDuplicates(true);
            const res = await api.post('/api/admin/generation/duplicates/', {questions: drafts});
            const dupes = res.data.duplicates;
            setDuplicates(dupes);
            setSelected((current) => drafts.map((_, i) => (i in dupes ? false : current[i])));
            setDuplicateCheckDone(true);
            const duplicateCount = Object.keys(dupes).length;
            if (duplicateCount) {
                notify.warning(`${duplicateCount} possible duplicate(s) found and unchecked`);
            } else {
                notify.success(`No duplicates found across ${res.data.checked_count} English draft(s)`);
            }
        } catch {
            setDuplicateCheckDone(false);
            notify.error('Duplicate check failed — English drafts cannot be imported yet');
        } finally {
            setCheckingDuplicates(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setPrompt('');
        setPasted('');
        setDrafts([]);
        try {
            const res = await api.post('/api/admin/generation/generate/', {
                skill: skillName,
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
        if (source === 'other' && !sourceOther.trim()) {
            notify.warning('Describe the other question source.');
            return;
        }
        try {
            setImporting(true);
            const res = await api.post('/api/admin/generation/import/', {
                questions: chosen,
                source,
                source_other: sourceOther.trim(),
            });
            notify.success(`Imported ${res.data.created_ids.length} question(s) into the bank`);
            const remainingIndexes = drafts.map((_, i) => i).filter((i) => !selected[i]);
            const remainingDuplicates = {};
            remainingIndexes.forEach((oldIndex, newIndex) => {
                if (duplicates[oldIndex]) remainingDuplicates[newIndex] = duplicates[oldIndex];
            });
            setDrafts(remainingIndexes.map((i) => drafts[i]));
            setSelected(remainingIndexes.map(() => false));
            setDuplicates(remainingDuplicates);
            setDuplicateCheckDone(remainingIndexes.length > 0 && duplicateCheckDone);
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
                <div className="grid gap-4 lg:grid-cols-[160px_1fr_1fr]">
                    <Field label="Subject">
                        <Select value={subjectName} onChange={(e) => setSubject(e.target.value)}>
                            <option value="english">English</option>
                            <option value="math">Math</option>
                        </Select>
                    </Field>
                    <Field label="Domain">
                        <Select
                            value={domainName}
                            disabled={!subjectDomains.length}
                            onChange={(e) => {
                                setDomainName(e.target.value);
                                const d = subjectDomains.find((x) => x.name === e.target.value);
                                setSkillName(d.skills[0].name);
                            }}
                        >
                            {!subjectDomains.length && <option value="">No topics yet</option>}
                            {subjectDomains.map((d) => (
                                <option key={d.name} value={d.name}>{d.name} ({d.share})</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Skill (official College Board name)">
                        <Select
                            value={skillName}
                            disabled={!domain}
                            onChange={(e) => setSkillName(e.target.value)}
                        >
                            {!domain && <option value="">No skills yet</option>}
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
                {!subjectDomains.length && (
                    <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                        English generator topics are not configured yet.
                    </p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
                    <Field label="Source for this batch">
                        <Select value={source} onChange={(e) => setSource(e.target.value)}>
                            {QUESTION_SOURCES.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Select>
                    </Field>
                </div>
                {source === 'other' && (
                    <div className="mt-4">
                        <Field label="Other source">
                            <Input
                                value={sourceOther}
                                onChange={(e) => setSourceOther(e.target.value)}
                                placeholder="e.g. Teacher-authored set"
                                maxLength={255}
                            />
                        </Field>
                    </div>
                )}
                <div className="mt-5 flex justify-end">
                    <Button onClick={handleGenerate} loading={generating} disabled={!skill}>
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-950">
                                Review drafts ({selected.filter(Boolean).length}/{drafts.length} selected
                                {Object.keys(duplicates).length > 0 && `, ${Object.keys(duplicates).length} duplicate`})
                            </h2>
                            {hasEnglishDrafts && (
                                <p className={`mt-1 text-sm ${duplicateCheckDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {duplicateCheckDone
                                        ? 'English duplicate check complete. Flagged drafts stay unchecked unless you override them.'
                                        : 'Run the English duplicate check before importing.'}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {hasEnglishDrafts && (
                                <Button variant="secondary" onClick={handleCheckDuplicates} loading={checkingDuplicates}>
                                    <Search size={18}/> {duplicateCheckDone ? 'Check again' : 'Check duplicates'}
                                </Button>
                            )}
                            <Button
                                onClick={handleImport}
                                loading={importing}
                                disabled={!selected.some(Boolean) || (hasEnglishDrafts && !duplicateCheckDone)}
                            >
                                <Upload size={18}/> Import selected
                            </Button>
                        </div>
                    </div>
                    {drafts.map((draft, i) => (
                        <DraftCard
                            key={i}
                            draft={draft}
                            selected={selected[i]}
                            onToggle={() => setSelected(selected.map((s, j) => (j === i ? !s : s)))}
                            source={source}
                            sourceOther={sourceOther}
                            duplicate={duplicates[i]}
                        />
                    ))}
                </div>
            )}
        </PageContainer>
    );
}

export default withAuth(QuestionGeneratorPage, true);
