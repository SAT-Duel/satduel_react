import React, {useEffect, useMemo, useState} from 'react';
import {Clipboard, Eye, ExternalLink, Plus, Trash2} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import Question from '../components/Question';
import withAuth from '../hoc/withAuth';
import {Button, Card, Field, Input, ModalShell, PageContainer, Select, Spinner, Textarea, Toggle} from '../components/ui';
import {notify} from '../utils/notify';
import {tournamentShareUrl} from '../utils/tournamentLinks';

const blankTournament = {
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    duration: '',
    private: true,
};

function blankQuestion() {
    return {
        id: uuidv4(),
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
}

function formatApiTime(value) {
    return new Date(value).toISOString().split('.')[0] + 'Z';
}

function CreateTournamentPage() {
    const [formValues, setFormValues] = useState(blankTournament);
    const [questions, setQuestions] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewQuestion, setPreviewQuestion] = useState(null);
    const [createdTournament, setCreatedTournament] = useState(null);
    const [creating, setCreating] = useState(false);
    const {loading} = useAuth();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const previewData = useMemo(() => {
        if (!previewQuestion) return null;
        return {
            id: previewQuestion.id,
            question: previewQuestion.question || '',
            choices: [
                previewQuestion.choice_a || '',
                previewQuestion.choice_b || '',
                previewQuestion.choice_c || '',
                previewQuestion.choice_d || '',
            ],
            answer: previewQuestion.answer || '',
            explanation: previewQuestion.explanation || '',
        };
    }, [previewQuestion]);

    const updateTournament = (field, value) => {
        setFormValues((current) => ({...current, [field]: value}));
    };

    const addQuestion = () => {
        setQuestions((current) => [...current, blankQuestion()]);
    };

    const removeQuestion = (id) => {
        setQuestions((current) => current.filter((question) => question.id !== id));
    };

    const updateQuestion = (id, field, value) => {
        setQuestions((current) => current.map((question) => (
            question.id === id ? {...question, [field]: value} : question
        )));
    };

    const handlePreview = (question) => {
        setPreviewQuestion(question);
        setPreviewVisible(true);
    };

    const hasIncompleteQuestion = questions.some((question) => (
        !question.question.trim() ||
        !question.choice_a.trim() ||
        !question.choice_b.trim() ||
        !question.choice_c.trim() ||
        !question.choice_d.trim()
    ));

    const copyShareLink = async () => {
        if (!createdTournament) return;
        try {
            await navigator.clipboard.writeText(tournamentShareUrl(createdTournament));
            notify.success('Tournament link copied.');
        } catch {
            notify.error('Could not copy tournament link.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formValues.name.trim() || !formValues.description.trim() || !formValues.start_time || !formValues.end_time || !formValues.duration) {
            notify.warning('Fill in the tournament details first.');
            return;
        }
        if (questions.length === 0) {
            notify.warning('Add at least one question.');
            return;
        }
        if (hasIncompleteQuestion) {
            notify.warning('Finish every question and answer choice before creating the tournament.');
            return;
        }

        const durationInSeconds = Number(formValues.duration) * 60;
        const tournamentData = {
            ...formValues,
            start_time: formatApiTime(formValues.start_time),
            end_time: formatApiTime(formValues.end_time),
            duration: new Date(durationInSeconds * 1000).toISOString().substring(11, 19),
            questions: questions.map(({id, ...question}) => question),
            private: formValues.private,
        };

        try {
            setCreating(true);
            const response = await api.post('api/tournaments/create/', tournamentData);
            setCreatedTournament(response.data);
            notify.success('Tournament created successfully.');
            setFormValues({...blankTournament, private: true});
            setQuestions([]);
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to create tournament.');
        } finally {
            setCreating(false);
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
            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    Tournament Builder
                </div>
                <h1 className="text-3xl font-black text-slate-950">Create New Tournament</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Draft a tournament and preview custom questions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <Card className="p-5 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Tournament Name">
                            <Input value={formValues.name} onChange={(event) => updateTournament('name', event.target.value)}/>
                        </Field>
                        <Field label="Duration (minutes)">
                            <Input
                                type="number"
                                min="1"
                                value={formValues.duration}
                                onChange={(event) => updateTournament('duration', event.target.value)}
                            />
                        </Field>
                        <Field label="Start Time">
                            <Input
                                type="datetime-local"
                                value={formValues.start_time}
                                onChange={(event) => updateTournament('start_time', event.target.value)}
                            />
                        </Field>
                        <Field label="End Time">
                            <Input
                                type="datetime-local"
                                value={formValues.end_time}
                                onChange={(event) => updateTournament('end_time', event.target.value)}
                            />
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Field label="Description">
                            <Textarea rows={4} value={formValues.description} onChange={(event) => updateTournament('description', event.target.value)}/>
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Toggle
                            checked={formValues.private}
                            onChange={(checked) => updateTournament('private', checked)}
                            label="Private Tournament"
                            description="Private tournaments use an invite link. Public tournaments appear on the tournament list."
                        />
                    </div>
                </Card>

                <section>
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h2 className="text-2xl font-black text-slate-950">Questions</h2>
                        <Button type="button" variant="secondary" onClick={addQuestion}>
                            <Plus size={18}/> Add Question
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <Card key={question.id} className="p-5">
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-black text-slate-900">Question {index + 1}</h3>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="secondary" size="sm" onClick={() => handlePreview(question)}>
                                            <Eye size={16}/> Preview
                                        </Button>
                                        <Button type="button" variant="danger" size="sm" onClick={() => removeQuestion(question.id)}>
                                            <Trash2 size={16}/>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Field label="Question Text">
                                        <Textarea rows={3} value={question.question} onChange={(event) => updateQuestion(question.id, 'question', event.target.value)}/>
                                    </Field>
                                    {['a', 'b', 'c', 'd'].map((choice) => (
                                        <Field key={choice} label={`Choice ${choice.toUpperCase()}`}>
                                            <Textarea
                                                rows={1}
                                                value={question[`choice_${choice}`]}
                                                onChange={(event) => updateQuestion(question.id, `choice_${choice}`, event.target.value)}
                                            />
                                        </Field>
                                    ))}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Correct Answer">
                                            <Select value={question.answer} onChange={(event) => updateQuestion(question.id, 'answer', event.target.value)}>
                                                {['A', 'B', 'C', 'D'].map((choice) => (
                                                    <option key={choice} value={choice}>{choice}</option>
                                                ))}
                                            </Select>
                                        </Field>
                                        <Field label="Difficulty">
                                            <Select value={question.difficulty} onChange={(event) => updateQuestion(question.id, 'difficulty', event.target.value)}>
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </Select>
                                        </Field>
                                    </div>
                                    <Field label="Question Type">
                                        <Input value={question.question_type} onChange={(event) => updateQuestion(question.id, 'question_type', event.target.value)}/>
                                    </Field>
                                    <Field label="Explanation">
                                        <Textarea rows={3} value={question.explanation} onChange={(event) => updateQuestion(question.id, 'explanation', event.target.value)}/>
                                    </Field>
                                </div>
                            </Card>
                        ))}

                        {questions.length === 0 && (
                            <Card className="p-6 text-center text-sm font-semibold text-slate-500">
                                No custom questions added yet.
                            </Card>
                        )}
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" loading={creating}>Create Tournament</Button>
                </div>
            </form>

            <ModalShell
                open={previewVisible}
                title="Question Preview"
                onClose={() => setPreviewVisible(false)}
                maxWidth="max-w-4xl"
                footer={<Button variant="secondary" onClick={() => setPreviewVisible(false)}>Close</Button>}
            >
                {previewData && (
                    <Question
                        questionData={previewData}
                        onSubmit={() => {}}
                        status="Blank"
                        questionNumber={1}
                        disabled
                    />
                )}
            </ModalShell>

            <ModalShell
                open={Boolean(createdTournament)}
                title="Tournament created"
                onClose={() => setCreatedTournament(null)}
                footer={(
                    <>
                        <Button type="button" variant="secondary" onClick={copyShareLink}>
                            <Clipboard className="size-4"/> Copy link
                        </Button>
                        <Button to={createdTournament ? `/tournament/${createdTournament.id}` : '/my_tournaments'}>
                            Open tournament <ExternalLink className="size-4"/>
                        </Button>
                    </>
                )}
            >
                {createdTournament && (
                    <div>
                        <p className="m-0 text-sm leading-6 text-slate-500">
                            Share this link with anyone you want to invite.
                        </p>
                        <button
                            type="button"
                            onClick={copyShareLink}
                            className="mt-4 w-full cursor-pointer rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-mono text-sm font-bold text-primary-700 hover:bg-primary-100"
                        >
                            {tournamentShareUrl(createdTournament)}
                        </button>
                        {createdTournament.private && createdTournament.join_code && (
                            <p className="m-0 mt-3 text-sm font-semibold text-slate-500">
                                Join code: <span className="font-mono text-slate-800">{createdTournament.join_code}</span>
                            </p>
                        )}
                    </div>
                )}
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(CreateTournamentPage);
