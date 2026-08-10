import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {Check, ChevronLeft, ChevronRight, ListChecks, Plus, X} from 'lucide-react';
import RenderWithMath from '../../components/RenderWithMath';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Button, Card, Field, Input, PageContainer, Select, Spinner} from '../../components/ui';
import {QUESTION_SOURCES, questionSourceLabel} from '../../utils/questionSource';
import {notify} from '../../utils/notify';

const questionTypesBySubject = {
    english: [
        'Cross-Text Connections',
        'Text Structure and Purpose',
        'Words in Context',
        'Rhetorical Synthesis',
        'Transitions',
        'Central Ideas and Details',
        'Command of Evidence',
        'Inferences',
        'Boundaries',
        'Form, Structure, and Sense',
    ],
    math: [
        'Linear equations in one variable',
        'Linear functions',
        'Linear equations in two variables',
        'Systems of two linear equations in two variables',
        'Linear inequalities in one or two variables',
        'Equivalent expressions',
        'Nonlinear equations in one variable and systems of equations in two variables',
        'Nonlinear functions',
        'Ratios, rates, proportional relationships, and units',
        'Percentages',
        'One-variable data: distributions and measures of center and spread',
        'Two-variable data: models and scatterplots',
        'Probability and conditional probability',
        'Inference from sample statistics and margin of error',
        'Evaluating statistical claims: observational studies and experiments',
        'Area and volume',
        'Lines, angles, and triangles',
        'Right triangles and trigonometry',
        'Circles',
    ],
};

const difficulties = ['1', '2', '3', '4', '5'];

function cleanSubject(value) {
    return value === 'math' ? 'math' : 'english';
}

function returnTo(pathname, search) {
    return encodeURIComponent(`${pathname}${search}`);
}

function QuestionListPage() {
    const [questions, setQuestions] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [bulkField, setBulkField] = useState('source');
    const [bulkValue, setBulkValue] = useState('');
    const [bulkSourceOther, setBulkSourceOther] = useState('');
    const [bulkSaving, setBulkSaving] = useState(false);
    const pageSize = 15;
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedSubject = cleanSubject(searchParams.get('subject'));
    const topicOptions = questionTypesBySubject[selectedSubject];
    const requestedType = searchParams.get('type') || 'any';
    const selectedType = requestedType === 'any' || topicOptions.includes(requestedType) ? requestedType : 'any';
    const requestedDifficulty = searchParams.get('difficulty') || 'any';
    const selectedDifficulty = requestedDifficulty === 'any' || difficulties.includes(requestedDifficulty) ? requestedDifficulty : 'any';
    const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((Number(total) || 0) / pageSize)),
        [total]
    );
    const selected = useMemo(() => Object.values(selectedQuestions), [selectedQuestions]);
    const shared = useMemo(() => {
        const same = (valueFor) => selected.length > 0 && new Set(selected.map(valueFor)).size === 1;
        return {
            source: same((question) => `${question.source}|${question.source_other || ''}`),
            question_type: same((question) => question.question_type || ''),
            difficulty: same((question) => String(question.difficulty || '')),
        };
    }, [selected]);
    const currentBulkValue = selected[0]?.[bulkField] == null ? '' : String(selected[0][bulkField]);
    const bulkChanged = bulkField === 'source'
        ? bulkValue !== currentBulkValue
            || (bulkValue === 'other' && bulkSourceOther.trim() !== (selected[0]?.source_other || ''))
        : bulkValue !== currentBulkValue;
    const allOnPageSelected = questions.length > 0 && questions.every((question) => selectedQuestions[question.id]);

    useEffect(() => {
        if (!selected.length) return;
        if (!shared[bulkField]) {
            setBulkField(['source', 'question_type', 'difficulty'].find((field) => shared[field]) || '');
        }
    }, [bulkField, selected.length, shared]);

    useEffect(() => {
        if (!bulkField || !selected.length) {
            setBulkValue('');
            setBulkSourceOther('');
            return;
        }
        setBulkValue(currentBulkValue);
        setBulkSourceOther(bulkField === 'source' ? selected[0]?.source_other || '' : '');
    }, [bulkField, currentBulkValue, selected]);

    const fetchQuestions = useCallback(async () => {
        const queryParams = new URLSearchParams({
            type: selectedType || 'any',
            difficulty: selectedDifficulty || 'any',
            page: currentPage || 1,
            page_size: pageSize,
            random: false,
            subject: selectedSubject,
        }).toString();

        try {
            setLoading(true);
            const response = await api.get(`api/filter_questions/?${queryParams}`);
            setQuestions(response.data.questions || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, selectedDifficulty, selectedSubject, selectedType]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchQuestions();
    }, [fetchQuestions]);

    const updateFilters = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => next.set(key, value));
        setSearchParams(next);
    };

    const goToPage = (page) => {
        updateFilters({page: String(Math.min(Math.max(page, 1), totalPages))});
    };

    const toggleBulkMode = () => {
        setBulkMode((enabled) => {
            if (enabled) setSelectedQuestions({});
            return !enabled;
        });
    };

    const toggleQuestion = (question) => {
        setSelectedQuestions((current) => {
            const next = {...current};
            if (next[question.id]) delete next[question.id];
            else next[question.id] = question;
            return next;
        });
    };

    const togglePage = () => {
        setSelectedQuestions((current) => {
            const next = {...current};
            questions.forEach((question) => {
                if (allOnPageSelected) delete next[question.id];
                else next[question.id] = question;
            });
            return next;
        });
    };

    const applyBulkUpdate = async () => {
        if (!bulkField || !bulkValue || !shared[bulkField]) return;
        if (bulkField === 'source' && bulkValue === 'other' && !bulkSourceOther.trim()) {
            notify.warning('Describe the other question source.');
            return;
        }
        const label = bulkField === 'question_type' ? 'type' : bulkField;
        if (!window.confirm(`Change ${label} for ${selected.length} selected question${selected.length === 1 ? '' : 's'}?`)) return;

        try {
            setBulkSaving(true);
            const response = await api.post('/api/admin/questions/bulk_update/', {
                question_ids: selected.map((question) => question.id),
                field: bulkField,
                value: bulkValue,
                source_other: bulkSourceOther.trim(),
            });
            notify.success(`Updated ${response.data.updated} question${response.data.updated === 1 ? '' : 's'}.`);
            setSelectedQuestions({});
            await fetchQuestions();
        } catch (error) {
            notify.error(error.response?.data?.error || 'Bulk update failed.');
        } finally {
            setBulkSaving(false);
        }
    };

    const editUrl = (questionId) => `/admin/edit_question/${questionId}?returnTo=${returnTo(location.pathname, location.search)}`;
    const createUrl = `/admin/create_question?returnTo=${returnTo(location.pathname, location.search)}`;

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                        Admin Bank
                    </div>
                    <h1 className="text-3xl font-black text-slate-950">Questions</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Filter, preview, and open questions for editing.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant={bulkMode ? 'secondary' : 'ghost'} onClick={toggleBulkMode}>
                        {bulkMode ? <X size={18}/> : <ListChecks size={18}/>} {bulkMode ? 'Exit bulk edit' : 'Bulk edit'}
                    </Button>
                    <Button onClick={() => navigate(createUrl)}>
                        <Plus size={18}/> Create Question
                    </Button>
                </div>
            </div>

            <Card className="mb-6 p-4">
                <div className="grid gap-3 md:grid-cols-[160px_1fr_180px]">
                    <Select
                        value={selectedSubject}
                        onChange={(event) => updateFilters({subject: event.target.value, type: 'any', page: '1'})}
                    >
                        <option value="english">English</option>
                        <option value="math">Math</option>
                    </Select>
                    <Select
                        value={selectedType}
                        onChange={(event) => updateFilters({type: event.target.value, page: '1'})}
                    >
                        <option value="any">Any Type</option>
                        {topicOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                    <Select
                        value={selectedDifficulty}
                        onChange={(event) => updateFilters({difficulty: event.target.value, page: '1'})}
                    >
                        <option value="any">Any Difficulty</option>
                        {difficulties.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                    </Select>
                </div>
            </Card>

            {bulkMode && (
                <Card className="mb-6 border-primary-200 bg-primary-50/40 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="m-0 text-sm font-black text-slate-900">{selected.length} selected</p>
                            <p className="m-0 mt-1 text-xs text-slate-500">Each update changes one shared field only.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={togglePage} disabled={!questions.length}>
                                {allOnPageSelected ? 'Deselect page' : 'Select this page'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedQuestions({})} disabled={!selected.length}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {selected.length > 0 && (
                        <>
                            <div className="mt-4 grid gap-3 lg:grid-cols-[180px_1fr_auto] lg:items-end">
                                <Field label="Field to change">
                                    <Select value={bulkField} onChange={(event) => setBulkField(event.target.value)}>
                                        {!bulkField && <option value="">No shared fields</option>}
                                        <option value="source" disabled={!shared.source}>Source{shared.source ? '' : ' — mixed'}</option>
                                        <option value="question_type" disabled={!shared.question_type}>Type{shared.question_type ? '' : ' — mixed'}</option>
                                        <option value="difficulty" disabled={!shared.difficulty}>Difficulty{shared.difficulty ? '' : ' — mixed'}</option>
                                    </Select>
                                </Field>

                                {bulkField === 'source' && (
                                    <div className={`grid gap-3 ${bulkValue === 'other' ? 'sm:grid-cols-2' : ''}`}>
                                        <Field label="New source">
                                            <Select value={bulkValue} onChange={(event) => setBulkValue(event.target.value)}>
                                                {QUESTION_SOURCES.map((source) => (
                                                    <option key={source.value} value={source.value}>{source.label}</option>
                                                ))}
                                            </Select>
                                        </Field>
                                        {bulkValue === 'other' && (
                                            <Field label="Other source">
                                                <Input
                                                    value={bulkSourceOther}
                                                    onChange={(event) => setBulkSourceOther(event.target.value)}
                                                    placeholder="e.g. Teacher-authored set"
                                                    maxLength={255}
                                                />
                                            </Field>
                                        )}
                                    </div>
                                )}

                                {bulkField === 'question_type' && (
                                    <Field label="New type">
                                        <Select value={bulkValue} onChange={(event) => setBulkValue(event.target.value)}>
                                            {Object.entries(questionTypesBySubject).map(([subject, types]) => (
                                                <optgroup key={subject} label={subject === 'math' ? 'Math' : 'English'}>
                                                    {types.map((type) => <option key={type} value={type}>{type}</option>)}
                                                </optgroup>
                                            ))}
                                        </Select>
                                    </Field>
                                )}

                                {bulkField === 'difficulty' && (
                                    <Field label="New difficulty">
                                        <Select value={bulkValue} onChange={(event) => setBulkValue(event.target.value)}>
                                            {difficulties.map((difficulty) => (
                                                <option key={difficulty} value={difficulty}>{difficulty}</option>
                                            ))}
                                        </Select>
                                    </Field>
                                )}

                                <Button onClick={applyBulkUpdate} loading={bulkSaving} disabled={!bulkField || !shared[bulkField] || !bulkChanged}>
                                    Apply to {selected.length}
                                </Button>
                            </div>
                            {!Object.values(shared).every(Boolean) && (
                                <p className="m-0 mt-3 text-xs font-semibold text-slate-500">
                                    Fields marked “mixed” are unavailable because the selected questions do not share the same current value.
                                </p>
                            )}
                        </>
                    )}
                </Card>
            )}

            {loading ? (
                <Card className="flex min-h-72 items-center justify-center">
                    <Spinner/>
                </Card>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {questions.map((question) => (
                        <button
                            key={question.id}
                            type="button"
                            onClick={() => bulkMode ? toggleQuestion(question) : navigate(editUrl(question.id))}
                            aria-pressed={bulkMode ? Boolean(selectedQuestions[question.id]) : undefined}
                            className="text-left"
                        >
                            <Card hover className={`h-full p-5 ${selectedQuestions[question.id] ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                                        selectedQuestions[question.id]
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {selectedQuestions[question.id] && <Check size={13}/>} ID {question.id}
                                    </span>
                                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
                                        Difficulty {question.difficulty || 'N/A'}
                                    </span>
                                </div>
                                <div className="line-clamp-6 text-sm leading-6 text-slate-700">
                                    <RenderWithMath text={question.question}/>
                                </div>
                                <dl className="mt-5 grid gap-2 text-sm">
                                    <div>
                                        <dt className="font-black text-slate-400">Type</dt>
                                        <dd className="text-slate-700">{question.question_type || 'Uncategorized'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-black text-slate-400">Source</dt>
                                        <dd className="text-slate-700">
                                            {questionSourceLabel(question.source, question.source_other)}
                                        </dd>
                                    </div>
                                </dl>
                            </Card>
                        </button>
                    ))}
                </div>
            )}

            {!loading && questions.length === 0 && (
                <Card className="mt-4 p-8 text-center">
                    <p className="font-semibold text-slate-600">No questions matched those filters.</p>
                </Card>
            )}

            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
                <p className="text-sm font-semibold text-slate-500">
                    Page {currentPage} of {totalPages} · {total} total questions
                </p>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                        <ChevronLeft size={16}/> Previous
                    </Button>
                    <Button variant="secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                        Next <ChevronRight size={16}/>
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
}

export default withAuth(QuestionListPage, true);
