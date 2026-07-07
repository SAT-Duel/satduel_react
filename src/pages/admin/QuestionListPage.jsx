import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Plus} from 'lucide-react';
import RenderWithMath from '../../components/RenderWithMath';
import withAuth from '../../hoc/withAuth';
import api from '../../components/api';
import {Button, Card, PageContainer, Select, Spinner} from '../../components/ui';

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
                <Button onClick={() => navigate(createUrl)}>
                    <Plus size={18}/> Create Question
                </Button>
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
                            onClick={() => navigate(editUrl(question.id))}
                            className="text-left"
                        >
                            <Card hover className="h-full p-5">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                        ID {question.id}
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
