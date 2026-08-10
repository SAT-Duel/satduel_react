import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, CheckCircle2, ChevronDown, Target, XCircle} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../../components/api';
import RenderWithMath from '../../components/RenderWithMath';
import {Button, Card, PageContainer, Spinner} from '../../components/ui';

function ScoreCard({label, score, detail, tone = 'primary'}) {
    const colors = tone === 'cyan' ? 'bg-cyan-50 text-cyan-700' : 'bg-primary-50 text-primary-700';
    return (
        <Card className="p-5 text-center">
            <p className="m-0 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            <p className="m-0 mt-2 font-display text-4xl font-black text-slate-950">{score}</p>
            {detail && <p className={`mx-auto mb-0 mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-black ${colors}`}>{detail}</p>}
        </Card>
    );
}

function ReviewQuestion({item, number}) {
    const [open, setOpen] = useState(false);
    const subject = item.phase.startsWith('english') ? 'Reading & Writing' : 'Math';
    return (
        <Card className="overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex w-full cursor-pointer items-center gap-3 bg-white p-4 text-left"
            >
                {item.correct ? (
                    <CheckCircle2 className="size-7 shrink-0 text-emerald-500"/>
                ) : (
                    <XCircle className="size-7 shrink-0 text-rose-500"/>
                )}
                <div className="min-w-0 flex-1">
                    <p className="m-0 font-black text-slate-900">Question {number}</p>
                    <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">
                        {subject} · {item.phase.endsWith('_a') ? 'Module 1' : 'Module 2'}
                        {item.correct ? ' · Correct' : ' · Review this one'}
                    </p>
                </div>
                <ChevronDown className={`size-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`}/>
            </button>
            {open && (
                <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
                    <div className="text-sm leading-7 text-slate-800"><RenderWithMath text={item.question}/></div>
                    {item.response_type !== 'student_produced' && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {item.choices.map((choice, index) => {
                                const letter = 'ABCD'[index];
                                const correct = item.answer?.toUpperCase() === letter;
                                const selected = item.user_answer?.toUpperCase() === letter;
                                return (
                                    <div key={letter} className={`rounded-xl border px-3 py-2 text-sm ${
                                        correct ? 'border-emerald-300 bg-emerald-50' : selected ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
                                    }`}>
                                        <span className="mr-2 font-black">{letter}.</span><RenderWithMath text={choice}/>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {item.response_type === 'student_produced' && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <p className="m-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><span className="font-black">Your response:</span> {item.user_answer || 'Blank'}</p>
                            <p className="m-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><span className="font-black">Accepted:</span> {item.answer}</p>
                        </div>
                    )}
                    <div className="mt-4 rounded-xl border border-primary-100 bg-white p-4 text-sm leading-6 text-slate-700">
                        <p className="m-0 mb-1 font-black text-primary-700">Explanation</p>
                        <RenderWithMath text={item.explanation}/>
                    </div>
                </div>
            )}
        </Card>
    );
}

function AdaptiveTestResultPage() {
    const {attemptId} = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get(`/api/practice-tests/attempts/${attemptId}/result/`)
            .then((response) => setResult(response.data))
            .catch((requestError) => setError(requestError.response?.data?.error || 'This score could not be loaded.'));
    }, [attemptId]);

    const questions = useMemo(() => {
        if (!result) return [];
        if (filter === 'missed') return result.questions.filter((question) => !question.correct);
        return result.questions;
    }, [filter, result]);

    if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4"><p className="font-bold text-rose-700">{error}</p><Button onClick={() => navigate('/practice_test')}>Back to practice tests</Button></div>;
    if (!result) return <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm font-bold text-slate-500"><Spinner/> Calculating your score report…</div>;
    const fullTest = result.test_type === 'full';
    const typeLabel = fullTest ? 'Full SAT' : result.test_type === 'english' ? 'Reading & Writing' : 'Math';
    const routeScore = fullTest
        ? `${result.selected_routes.english} / ${result.selected_routes.math}`
        : result.selected_routes[result.test_type];

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
            <PageContainer maxWidth="max-w-5xl">
                <Button variant="ghost" className="mb-5 px-0" onClick={() => navigate('/practice_test')}><ArrowLeft className="size-4"/> Practice tests</Button>
                <Card className="overflow-hidden">
                    <div className="sat-score-strip h-2 border-0"/>
                    <div className="p-6 text-center sm:p-8">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><Target className="size-7"/></div>
                        <p className="m-0 mt-4 text-xs font-black uppercase tracking-[0.16em] text-primary-600">{typeLabel} practice test complete</p>
                        <h1 className="m-0 mt-1 font-display text-3xl font-black text-slate-950">{result.test_name}</h1>
                        <p className="m-0 mt-5 font-display text-7xl font-black text-slate-950">
                            {result.total_score}<span className="ml-2 text-xl text-slate-400">/ {result.maximum_score}</span>
                        </p>
                        <p className="m-0 mt-2 text-sm font-bold text-slate-500">Estimated score range {result.score_low}–{result.score_high}</p>
                        <p className="mx-auto mb-0 mt-3 max-w-2xl text-xs leading-5 text-slate-400">
                            This range reflects statistical uncertainty. The reported score uses fixed SAT-aligned item difficulty, and all {result.total} questions count.
                        </p>
                    </div>
                </Card>

                <div className={`mt-4 grid gap-4 ${fullTest ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                    {result.reading_writing_score != null && (
                        <ScoreCard label="Reading & Writing" score={result.reading_writing_score} detail={`${result.reading_writing.correct}/${result.reading_writing.total} correct`}/>
                    )}
                    {result.math_score != null && (
                        <ScoreCard label="Math" score={result.math_score} detail={`${result.math.correct}/${result.math.total} correct`} tone="cyan"/>
                    )}
                    <ScoreCard label="Adaptive route" score={routeScore} detail={fullTest ? 'English / Math' : typeLabel}/>
                </div>

                <section className="mt-10">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Question review</h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">Open any item to see its credited answer and explanation.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                ['all', `All ${result.questions.length}`],
                                ['missed', 'Missed'],
                            ].map(([value, label]) => (
                                <button key={value} type="button" onClick={() => setFilter(value)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-black ${filter === value ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        {questions.map((question) => (
                            <ReviewQuestion key={question.id} item={question} number={result.questions.indexOf(question) + 1}/>
                        ))}
                    </div>
                </section>
            </PageContainer>
        </div>
    );
}

export default AdaptiveTestResultPage;
