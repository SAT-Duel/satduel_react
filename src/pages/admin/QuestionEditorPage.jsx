import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {AlertTriangle, ArrowLeft, Eye, Save, Trash2} from 'lucide-react';
import api from '../../components/api';
import Question from '../../components/Question';
import withAuth from '../../hoc/withAuth';
import {Button, Card, Field, Input, ModalShell, PageContainer, Select, Spinner, Textarea} from '../../components/ui';
import {notify} from '../../utils/notify';

const blankQuestion = {
    question: '',
    choice_a: '',
    choice_b: '',
    choice_c: '',
    choice_d: '',
    answer: 'A',
    difficulty: '1',
    question_type: '',
    explanation: '',
};

function QuestionEditorPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useState(blankQuestion);
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
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

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await api.delete(`/api/delete_question/${id}`);
            notify.success(`Question ${id} deleted permanently`);
            setDeleteVisible(false);
            navigate(returnTo);
        } catch (error) {
            console.error('Error deleting question:', error);
            notify.error('Failed to delete question');
            setDeleting(false);
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

                    <Field label="Explanation">
                        <Textarea
                            rows={12}
                            value={values.explanation}
                            onChange={(event) => updateValue('explanation', event.target.value)}
                        />
                    </Field>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                        {id && (
                            <Button type="button" variant="danger" onClick={() => setDeleteVisible(true)}>
                                <Trash2 size={18}/> Delete
                            </Button>
                        )}
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

            <ModalShell
                open={deleteVisible}
                title={`Delete question ${id}?`}
                onClose={() => setDeleteVisible(false)}
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => setDeleteVisible(false)} disabled={deleting}>
                            Keep Question
                        </Button>
                        <Button variant="danger" loading={deleting} onClick={handleDelete}>
                            <Trash2 size={18}/> Delete Permanently
                        </Button>
                    </>
                )}
            >
                <div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-600"/>
                    <div className="text-sm leading-6 text-rose-900">
                        <p className="font-black">This erases the question from the database. It cannot be undone.</p>
                        <p className="mt-2">Deleting it also removes everything attached to it:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                            <li>student practice attempts for this question</li>
                            <li>saved and tracked copies in student accounts</li>
                            <li>open question reports</li>
                            <li>its slot in tournaments, duel rooms, and class problem sets</li>
                        </ul>
                        <p className="mt-2">
                            To take it out of circulation without losing history, edit the question instead.
                        </p>
                    </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {values.question || 'No question text.'}
                </p>
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(QuestionEditorPage, true);
