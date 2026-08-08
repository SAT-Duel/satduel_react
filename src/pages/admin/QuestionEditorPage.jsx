import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, Eye, Save} from 'lucide-react';
import api from '../../components/api';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import {Button, Card, Field, Input, ModalShell, PageContainer, Select, Spinner, Textarea} from '../../components/ui';
import {notify} from '../../utils/notify';
import {QUESTION_SOURCES} from '../../utils/questionSource';

const blankQuestion = {
    question: '',
    choice_a: '',
    choice_b: '',
    choice_c: '',
    choice_d: '',
    answer: 'A',
    difficulty: '1',
    question_type: '',
    source: 'sat_question_bank',
    source_other: '',
    explanation: '',
};

function QuestionEditorPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useState(blankQuestion);
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const returnTo = useMemo(() => {
        const path = new URLSearchParams(location.search).get('returnTo') || '/admin/questions';
        return path.startsWith('/admin/questions') ? path : '/admin/questions';
    }, [location.search]);

    const updateValue = (field, value) => {
        setValues((current) => ({...current, [field]: value}));
    };

    const fetchQuestion = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/get_question/${id}`);
            setValues({
                question: response.data.question || '',
                choice_a: response.data.choice_a || '',
                choice_b: response.data.choice_b || '',
                choice_c: response.data.choice_c || '',
                choice_d: response.data.choice_d || '',
                answer: response.data.answer || 'A',
                difficulty: String(response.data.difficulty || '1'),
                question_type: response.data.question_type || '',
                source: response.data.source || 'sat_question_bank',
                source_other: response.data.source_other || '',
                explanation: response.data.explanation || '',
            });
        } catch (error) {
            console.error('Error fetching question:', error);
            notify.error('Failed to fetch question data');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchQuestion();
    }, [fetchQuestion, id]);

    const previewData = useMemo(() => ({
        id: id || 'new',
        question: values.question,
        choices: [values.choice_a, values.choice_b, values.choice_c, values.choice_d],
        answer: values.answer,
        explanation: values.explanation,
    }), [id, values]);

    const validate = () => {
        const requiredFields = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'answer', 'difficulty'];
        return requiredFields.every((field) => String(values[field] || '').trim());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (values.source === 'other' && !values.source_other.trim()) {
            notify.warning('Describe the other question source.');
            return;
        }
        if (!validate()) {
            notify.warning('Fill in the required question fields first.');
            return;
        }

        try {
            setSaving(true);
            const response = id
                ? await api.post(`/api/edit_question/${id}`, values)
                : await api.post('/api/create_question/', values);

            if (response.data.status === 'success') {
                notify.success(`Question ${id ? 'updated' : 'created'} successfully`);
                navigate(id ? `/admin/edit_question/${id}${location.search}` : returnTo);
            } else {
                notify.error(`Failed to ${id ? 'update' : 'create'} question`);
            }
        } catch (error) {
            console.error(`Error ${id ? 'updating' : 'creating'} question:`, error);
            notify.error(`Failed to ${id ? 'update' : 'create'} question`);
        } finally {
            setSaving(false);
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
        <PageContainer className="min-h-screen max-w-4xl py-6 sm:py-8">
            <Button to={returnTo} variant="ghost" className="mb-4 px-0">
                <ArrowLeft size={18}/> Return to Question List
            </Button>

            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    Admin Editor
                </div>
                <h1 className="text-3xl font-black text-slate-950">{id ? 'Edit Question' : 'Create Question'}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Supports SAT Duel markup: LaTeX math with $...$, plus underline, italics, and bold helpers.
                </p>
            </div>

            <Card className="p-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="Question">
                        <Textarea
                            rows={14}
                            value={values.question}
                            onChange={(event) => updateValue('question', event.target.value)}
                        />
                    </Field>

                    {['a', 'b', 'c', 'd'].map((choice) => (
                        <Field key={choice} label={`Choice ${choice.toUpperCase()}`}>
                            <Textarea
                                rows={2}
                                value={values[`choice_${choice}`]}
                                onChange={(event) => updateValue(`choice_${choice}`, event.target.value)}
                            />
                        </Field>
                    ))}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Answer">
                            <Select value={values.answer} onChange={(event) => updateValue('answer', event.target.value)}>
                                {['A', 'B', 'C', 'D'].map((choice) => (
                                    <option key={choice} value={choice}>{choice}</option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Difficulty">
                            <Select value={values.difficulty} onChange={(event) => updateValue('difficulty', event.target.value)}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </Select>
                        </Field>
                    </div>

                    <Field label="Question Type">
                        <Input
                            value={values.question_type}
                            onChange={(event) => updateValue('question_type', event.target.value)}
                        />
                    </Field>

                    <div className={`grid gap-4 ${values.source === 'other' ? 'sm:grid-cols-2' : ''}`}>
                        <Field label="Source">
                            <Select value={values.source} onChange={(event) => updateValue('source', event.target.value)}>
                                {QUESTION_SOURCES.map((source) => (
                                    <option key={source.value} value={source.value}>{source.label}</option>
                                ))}
                            </Select>
                        </Field>
                        {values.source === 'other' && (
                            <Field label="Other source">
                                <Input
                                    value={values.source_other}
                                    onChange={(event) => updateValue('source_other', event.target.value)}
                                    placeholder="e.g. Teacher-authored set"
                                    maxLength={255}
                                />
                            </Field>
                        )}
                    </div>

                    <Field label="Explanation">
                        <Textarea
                            rows={12}
                            value={values.explanation}
                            onChange={(event) => updateValue('explanation', event.target.value)}
                        />
                    </Field>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setPreviewVisible(true)}>
                            <Eye size={18}/> Preview
                        </Button>
                        <Button type="submit" loading={saving}>
                            <Save size={18}/> Save
                        </Button>
                    </div>
                </form>
            </Card>

            <ModalShell
                open={previewVisible}
                title="Question Preview"
                onClose={() => setPreviewVisible(false)}
                maxWidth="max-w-4xl"
                footer={<Button variant="secondary" onClick={() => setPreviewVisible(false)}>Close</Button>}
            >
                <Question
                    questionData={previewData}
                    onSubmit={() => {}}
                    status="Blank"
                    questionNumber={1}
                    disabled
                />
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(QuestionEditorPage, true);
