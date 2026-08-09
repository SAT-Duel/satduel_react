import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, Check, ChevronLeft, ChevronRight, ClipboardList, Copy, Eye, Save, Sparkles} from 'lucide-react';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import AnswerSection from '../../components/PracticeTest/AnswerSection';
import QuestionContent from '../../components/PracticeTest/QuestionContent';
import withAuth from '../../hoc/withAuth';
import {Button, Card, Field, Input, ModalShell, PageContainer, Select, Spinner, Textarea} from '../../components/ui';
import {notify} from '../../utils/notify';

const routeOptions = [
    {value: 'A', label: 'A · Module 1', description: 'Routing module with a broad mix of easy, medium, and hard questions.'},
    {value: 'B', label: 'B · Easier Module 2', description: 'Adaptive second module with a lower average difficulty, while remaining mixed.'},
    {value: 'C', label: 'C · Harder Module 2', description: 'Adaptive second module with a higher average difficulty, while retaining accessible questions.'},
];

const subjectMeta = {
    english: {label: 'Reading & Writing', questions: 27, minutes: 32},
    math: {label: 'Math', questions: 22, minutes: 35},
};

function parseModelOutput(raw, expectedCount) {
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
    if (questions.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} questions, but found ${questions.length}.`);
    }
    const required = ['question', 'answer', 'difficulty', 'question_type', 'explanation'];
    questions.forEach((question, index) => {
        const missing = required.filter((field) => !(field in question));
        if (missing.length) throw new Error(`Question ${index + 1} is missing: ${missing.join(', ')}`);
    });
    return questions;
}

function QuestionPreview({question, index}) {
    const multipleChoice = question.response_type !== 'student_produced';
    return (
        <details className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 text-sm font-black text-slate-800">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                    {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{question.question_type}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Difficulty {question.difficulty}</span>
                <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs text-cyan-700">
                    {multipleChoice ? 'Multiple choice' : 'Student-produced'}
                </span>
            </summary>
            <div className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">
                <RenderWithMath text={question.question}/>
                {multipleChoice && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {'abcd'.split('').map((letter) => (
                            <div
                                key={letter}
                                className={`rounded-xl border px-3 py-2 ${
                                    question.answer?.toUpperCase() === letter.toUpperCase()
                                        ? 'border-emerald-300 bg-emerald-50'
                                        : 'border-slate-200'
                                }`}
                            >
                                <span className="mr-2 font-black uppercase">{letter}.</span>
                                <RenderWithMath text={question[`choice_${letter}`] || ''}/>
                            </div>
                        ))}
                    </div>
                )}
                {!multipleChoice && (
                    <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-800">
                        Accepted response: {question.answer}
                    </p>
                )}
                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
                    <span className="font-black text-slate-500">Explanation: </span>
                    <RenderWithMath text={question.explanation}/>
                </div>
            </div>
        </details>
    );
}

function PracticeTestGeneratorPage() {
    const [subject, setSubject] = useState('english');
    const [route, setRoute] = useState('A');
    const [prompt, setPrompt] = useState('');
    const [pasted, setPasted] = useState('');
    const [questions, setQuestions] = useState([]);
    const [moduleName, setModuleName] = useState('');
    const [modules, setModules] = useState([]);
    const [building, setBuilding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [previewModule, setPreviewModule] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewAnswers, setPreviewAnswers] = useState({});
    const [previewReview, setPreviewReview] = useState([]);
    const meta = subjectMeta[subject];
    const selectedRoute = routeOptions.find((option) => option.value === route);

    useEffect(() => {
        api.get('/api/admin/practice-test-generation/modules/')
            .then((response) => setModules(response.data.modules || []))
            .catch(() => notify.error('Failed to load saved test modules.'));
    }, []);

    const summary = useMemo(() => {
        if (!questions.length) return null;
        const difficulties = questions.map((question) => Number(question.difficulty) || 0);
        return {
            studentProduced: questions.filter((question) => question.response_type === 'student_produced').length,
            average: (difficulties.reduce((total, difficulty) => total + difficulty, 0) / questions.length).toFixed(1),
        };
    }, [questions]);

    const resetDraft = (nextSubject = subject, nextRoute = route) => {
        setSubject(nextSubject);
        setRoute(nextRoute);
        setPrompt('');
        setPasted('');
        setQuestions([]);
        setModuleName('');
    };

    const openPreview = async (module) => {
        setPreviewModule({...module, questions: null});
        setPreviewIndex(0);
        setPreviewAnswers({});
        setPreviewReview([]);
        try {
            const response = await api.get(`/api/admin/practice-test-generation/modules/${module.id}/`);
            setPreviewModule(response.data.module);
        } catch (error) {
            setPreviewModule(null);
            notify.error(error.response?.data?.error || 'Failed to load this module preview.');
        }
    };

    const closePreview = () => {
        setPreviewModule(null);
        setPreviewIndex(0);
        setPreviewAnswers({});
        setPreviewReview([]);
    };

    const previewQuestion = previewModule?.questions?.[previewIndex];
    const testingQuestion = previewQuestion ? {
        ...previewQuestion,
        choices: 'abcd'.split('').map((letter) => previewQuestion[`choice_${letter}`] || ''),
    } : null;
    const hasSeparateContext = testingQuestion?.question?.includes('\n');

    const buildPrompt = async () => {
        try {
            setBuilding(true);
            setPasted('');
            setQuestions([]);
            const response = await api.post('/api/admin/practice-test-generation/prompt/', {subject, route});
            setPrompt(response.data.prompt);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to build the module prompt.');
        } finally {
            setBuilding(false);
        }
    };

    const copyPrompt = async () => {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const parseQuestions = () => {
        try {
            setQuestions(parseModelOutput(pasted, meta.questions));
            notify.success(`Parsed a complete ${meta.questions}-question module.`);
        } catch (error) {
            notify.error(error.message);
        }
    };

    const saveModule = async () => {
        if (!moduleName.trim()) {
            notify.warning('Give this module a name.');
            return;
        }
        try {
            setSaving(true);
            const response = await api.post('/api/admin/practice-test-generation/modules/', {
                name: moduleName.trim(), subject, route, questions,
            });
            setModules((current) => [response.data.module, ...current]);
            notify.success(`Saved ${response.data.module.name}.`);
            setQuestions([]);
            setPasted('');
            setPrompt('');
            setModuleName('');
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to save this module.');
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
                    AI Practice Test Generator
                </div>
                <h1 className="text-3xl font-black text-slate-950">Build a Full SAT Module</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Build a research-backed prompt, paste it into ChatGPT or Claude, review the complete module,
                    then name and save it. Its questions stay isolated from normal practice and every other module.
                </p>
            </div>

            <Card className="mb-6 p-5 sm:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Section">
                        <Select value={subject} onChange={(event) => resetDraft(event.target.value, route)}>
                            <option value="english">Reading & Writing</option>
                            <option value="math">Math</option>
                        </Select>
                    </Field>
                    <Field label="Adaptive module">
                        <Select value={route} onChange={(event) => resetDraft(subject, event.target.value)}>
                            {routeOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Select>
                    </Field>
                </div>
                <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="m-0 font-black text-slate-900">{meta.questions} questions · {meta.minutes} minutes</p>
                        <p className="m-0 mt-1 text-sm leading-6 text-slate-500">{selectedRoute.description}</p>
                    </div>
                    <Button onClick={buildPrompt} loading={building} className="shrink-0">
                        <Sparkles size={18}/> Build detailed prompt
                    </Button>
                </div>
            </Card>

            {prompt && (
                <Card className="mb-6 p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="m-0 text-xs font-black uppercase tracking-[0.14em] text-primary-600">Step 1</p>
                            <h2 className="m-0 mt-1 text-lg font-black text-slate-950">Copy the prompt into an AI</h2>
                        </div>
                        <Button variant="secondary" onClick={copyPrompt}>
                            {copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy prompt'}
                        </Button>
                    </div>
                    <Textarea rows={10} readOnly value={prompt} className="font-mono text-xs"/>

                    <div className="mb-3 mt-6">
                        <p className="m-0 text-xs font-black uppercase tracking-[0.14em] text-primary-600">Step 2</p>
                        <h2 className="m-0 mt-1 text-lg font-black text-slate-950">Paste the complete JSON reply</h2>
                    </div>
                    <Textarea
                        rows={10}
                        value={pasted}
                        onChange={(event) => setPasted(event.target.value)}
                        placeholder={`Paste the ${meta.questions}-question JSON array here`}
                        className="font-mono text-xs"
                    />
                    <div className="mt-3 flex justify-end">
                        <Button variant="secondary" onClick={parseQuestions} disabled={!pasted.trim()}>
                            Parse and review module
                        </Button>
                    </div>
                </Card>
            )}

            {questions.length > 0 && summary && (
                <section className="mb-8">
                    <Card className="mb-4 p-5 sm:p-6">
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                            <Field label="Module name">
                                <Input
                                    value={moduleName}
                                    onChange={(event) => setModuleName(event.target.value)}
                                    placeholder={`e.g. ${meta.label} Route ${route} · Form 1`}
                                    maxLength={120}
                                />
                            </Field>
                            <Button onClick={saveModule} loading={saving} disabled={!moduleName.trim()}>
                                <Save size={18}/> Save isolated module
                            </Button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                            <span className="rounded-full bg-primary-50 px-3 py-1.5 text-primary-700">{questions.length} questions</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">Every question is scored</span>
                            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-cyan-700">Average difficulty {summary.average}</span>
                            {subject === 'math' && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                                    {summary.studentProduced} student-produced
                                </span>
                            )}
                        </div>
                        <p className="m-0 mt-3 text-xs leading-5 text-slate-500">
                            Saving runs the strict server validator. Expand any question below to inspect its content, key, and explanation.
                        </p>
                    </Card>
                    <div className="space-y-2">
                        {questions.map((question, index) => (
                            <QuestionPreview key={index} question={question} index={index}/>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <div className="mb-3 flex items-center gap-2">
                    <ClipboardList className="size-5 text-primary-600"/>
                    <h2 className="m-0 text-xl font-black text-slate-950">Saved modules</h2>
                </div>
                {modules.length ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {modules.map((module) => (
                            <Card key={module.id} className="p-4">
                                <p className="m-0 font-black text-slate-900">{module.name}</p>
                                <p className="m-0 mt-2 text-sm text-slate-500">
                                    {subjectMeta[module.subject]?.label} · Route {module.route} · {module.question_count} questions
                                </p>
                                {module.assigned_test && (
                                    <p className="m-0 mt-2 text-xs font-bold text-emerald-600">Used in {module.assigned_test.name}</p>
                                )}
                                <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => openPreview(module)}>
                                    <Eye className="size-4"/> Preview test interface
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-6 text-center text-sm text-slate-500">No generated modules saved yet.</Card>
                )}
            </section>

            <ModalShell
                open={Boolean(previewModule)}
                title={previewModule?.name || 'Module preview'}
                onClose={closePreview}
                maxWidth="max-w-6xl"
                footer={previewModule?.questions && (
                    <div className="flex w-full gap-3 sm:justify-end">
                        <Button
                            variant="secondary"
                            className="min-w-0 flex-1 sm:flex-none"
                            onClick={() => setPreviewIndex((current) => Math.max(0, current - 1))}
                            disabled={previewIndex === 0}
                        >
                            <ChevronLeft className="size-4"/> Previous
                        </Button>
                        <Button
                            className="min-w-0 flex-1 sm:flex-none"
                            onClick={() => setPreviewIndex((current) => Math.min(previewModule.questions.length - 1, current + 1))}
                            disabled={previewIndex === previewModule.questions.length - 1}
                        >
                            Next <ChevronRight className="size-4"/>
                        </Button>
                    </div>
                )}
            >
                {!previewModule?.questions ? (
                    <div className="flex min-h-72 items-center justify-center gap-3 text-sm font-bold text-slate-500">
                        <Spinner/> Loading module preview…
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
                            <div>
                                <p className="m-0 text-xs font-black uppercase tracking-[0.12em] text-primary-500">
                                    {subjectMeta[previewModule.subject]?.label} · {previewModule.route === 'A' ? 'Module 1' : 'Module 2'}
                                </p>
                                <p className="m-0 mt-0.5 font-display text-lg font-black text-slate-950">Student interface preview</p>
                            </div>
                            <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-black text-primary-700">
                                Question {previewIndex + 1} of {previewModule.questions.length}
                            </span>
                        </div>
                        {testingQuestion && (
                            <div className={`mx-auto grid ${hasSeparateContext ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
                                {hasSeparateContext && (
                                    <section className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
                                        <QuestionContent question={testingQuestion}/>
                                    </section>
                                )}
                                <section className="bg-white">
                                    <AnswerSection
                                        question={testingQuestion}
                                        currentQuestion={previewIndex + 1}
                                        selectedAnswer={previewAnswers}
                                        setSelectedAnswer={setPreviewAnswers}
                                        reviewQuestions={previewReview}
                                        setReviewQuestions={setPreviewReview}
                                    />
                                </section>
                            </div>
                        )}
                    </div>
                )}
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(PracticeTestGeneratorPage, true);
