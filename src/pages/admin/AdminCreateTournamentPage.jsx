import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Plus, Search, Trash2} from 'lucide-react';
import axios from 'axios';
import RenderWithMath from '../../components/RenderWithMath';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Button, Card, Field, Input, ModalShell, PageContainer, Select, Textarea, Toggle} from '../../components/ui';
import {notify} from '../../utils/notify';

const questionTypes = [
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
];

const difficulties = ['1', '2', '3', '4', '5'];

const initialTournament = {
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    duration: '',
    private: false,
};

function QuestionCard({question, selected, onClick, action}) {
    return (
        <button type="button" onClick={onClick} className="text-left">
            <Card
                hover
                className={[
                    'h-full p-4',
                    selected ? 'border-primary-400 bg-primary-50/60 ring-2 ring-primary-100' : '',
                ].join(' ')}
            >
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        ID {question.id}
                    </span>
                    {action}
                </div>
                <div className="line-clamp-5 text-sm leading-6 text-slate-700">
                    <RenderWithMath text={question.question}/>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                    <span className="rounded-full bg-white px-2.5 py-1">Difficulty {question.difficulty || 'N/A'}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">{question.question_type || 'Uncategorized'}</span>
                </div>
            </Card>
        </button>
    );
}

function formatApiTime(value) {
    return new Date(value).toISOString().split('.')[0] + 'Z';
}

function AdminCreateTournamentPage() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('any');
    const [selectedDifficulty, setSelectedDifficulty] = useState('any');
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [formValues, setFormValues] = useState(initialTournament);
    const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [creating, setCreating] = useState(false);
    const pageSize = 15;
    const navigate = useNavigate();

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((Number(total) || 0) / pageSize)),
        [total]
    );

    const updateFormValue = (field, value) => {
        setFormValues((current) => ({...current, [field]: value}));
    };

    const fetchQuestions = useCallback(async () => {
        const baseUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await axios.get(`${baseUrl}/api/filter_questions/`, {
                params: {
                    type: selectedType,
                    difficulty: selectedDifficulty,
                    page: currentPage,
                    page_size: pageSize,
                },
            });
            setQuestions(response.data.questions || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching questions:', error);
            notify.error('Failed to fetch questions');
        }
    }, [currentPage, selectedDifficulty, selectedType]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSelectQuestion = (question) => {
        setSelectedQuestions((current) => (
            current.some((q) => q.id === question.id)
                ? current.filter((q) => q.id !== question.id)
                : [...current, question]
        ));
    };

    const handleCreateTournament = async (event) => {
        event.preventDefault();

        if (!formValues.name.trim() || !formValues.description.trim() || !formValues.start_time || !formValues.end_time || !formValues.duration) {
            notify.warning('Fill in the tournament details first.');
            return;
        }

        if (selectedQuestions.length === 0) {
            notify.warning('Select at least one question.');
            return;
        }

        const durationInSeconds = Number(formValues.duration) * 60;
        const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substring(11, 19);
        const tournamentData = {
            ...formValues,
            start_time: formatApiTime(formValues.start_time),
            end_time: formatApiTime(formValues.end_time),
            duration: formattedDuration,
            question_ids: selectedQuestions.map((q) => q.id),
        };

        try {
            setCreating(true);
            const response = await api.post('api/tournaments/admin_create/', tournamentData);
            const tournament = response.data;

            if (tournament.join_code) {
                setJoinCode(tournament.join_code);
                setJoinCodeModalVisible(true);
            } else {
                notify.success('Tournament created successfully!');
                navigate('/tournaments');
            }
        } catch (error) {
            console.error('Error creating tournament:', error);
            notify.error('Failed to create tournament');
        } finally {
            setCreating(false);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    };

    const closeJoinCodeModal = () => {
        setJoinCodeModalVisible(false);
        navigate('/my_tournaments');
    };

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    Admin Tournament
                </div>
                <h1 className="text-3xl font-black text-slate-950">Create a New Tournament</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create the tournament details, then select the questions that belong in the set.
                </p>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-8">
                <Card className="p-5 sm:p-6">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Tournament Name">
                            <Input
                                value={formValues.name}
                                onChange={(event) => updateFormValue('name', event.target.value)}
                                placeholder="July SAT Duel"
                            />
                        </Field>
                        <Field label="Duration (minutes)">
                            <Input
                                type="number"
                                min="1"
                                value={formValues.duration}
                                onChange={(event) => updateFormValue('duration', event.target.value)}
                                placeholder="30"
                            />
                        </Field>
                        <Field label="Start Time">
                            <Input
                                type="datetime-local"
                                value={formValues.start_time}
                                onChange={(event) => updateFormValue('start_time', event.target.value)}
                            />
                        </Field>
                        <Field label="End Time">
                            <Input
                                type="datetime-local"
                                value={formValues.end_time}
                                onChange={(event) => updateFormValue('end_time', event.target.value)}
                            />
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Field label="Description">
                            <Textarea
                                rows={4}
                                value={formValues.description}
                                onChange={(event) => updateFormValue('description', event.target.value)}
                                placeholder="What students should expect from this tournament"
                            />
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Toggle
                            checked={formValues.private}
                            onChange={(checked) => updateFormValue('private', checked)}
                            label="Private Tournament"
                            description="Private tournaments generate a join code for invited participants."
                        />
                    </div>
                </Card>

                <section>
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950">Select Questions</h2>
                            <p className="mt-1 text-sm text-slate-500">{selectedQuestions.length} selected</p>
                        </div>
                        <Card className="p-3">
                            <div className="grid gap-3 md:grid-cols-[260px_180px_auto]">
                                <Select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                                    <option value="any">Any Type</option>
                                    {questionTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Select>
                                <Select
                                    value={selectedDifficulty}
                                    onChange={(event) => setSelectedDifficulty(event.target.value)}
                                >
                                    <option value="any">Any Difficulty</option>
                                    {difficulties.map((difficulty) => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </Select>
                                <Button type="button" onClick={() => {
                                    setCurrentPage(1);
                                    fetchQuestions();
                                }}>
                                    <Search size={18}/> Search
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {questions.map((question) => {
                            const selected = selectedQuestions.some((q) => q.id === question.id);
                            return (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    selected={selected}
                                    onClick={() => handleSelectQuestion(question)}
                                    action={selected && (
                                        <span className="rounded-full bg-primary-600 px-2.5 py-1 text-xs font-black text-white">
                                            Selected
                                        </span>
                                    )}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
                        <p className="text-sm font-semibold text-slate-500">
                            Page {currentPage} of {totalPages} · {total} total questions
                        </p>
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" size="sm" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                                <ChevronLeft size={16}/> Previous
                            </Button>
                            <Button type="button" variant="secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                                Next <ChevronRight size={16}/>
                            </Button>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-black text-slate-950">Selected Questions</h2>
                    {selectedQuestions.length === 0 ? (
                        <Card className="p-6 text-sm font-semibold text-slate-500">
                            No questions selected yet.
                        </Card>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {selectedQuestions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    selected={false}
                                    onClick={() => setSelectedQuestions((current) => current.filter((q) => q.id !== question.id))}
                                    action={<Trash2 size={18} className="text-rose-500"/>}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={selectedQuestions.length === 0} loading={creating}>
                            <Plus size={18}/> Create Tournament
                        </Button>
                    </div>
                </section>
            </form>

            <ModalShell
                open={joinCodeModalVisible}
                title="Tournament Created"
                onClose={closeJoinCodeModal}
                footer={<Button onClick={closeJoinCodeModal}>Done</Button>}
            >
                <p className="text-sm leading-6 text-slate-500">
                    Share this join code with participants to let them enter the tournament.
                </p>
                <div className="mt-5 rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 px-5 py-6 text-center text-3xl font-black tracking-[0.18em] text-primary-700">
                    {joinCode}
                </div>
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(AdminCreateTournamentPage, true);
