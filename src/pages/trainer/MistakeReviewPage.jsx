import React, {useState} from 'react';
import {CheckCircle2, History, Target, XCircle} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import QuestionSession from '../../components/PracticeTest/QuestionSession';
import {Button, Card, PageContainer} from '../../components/ui';
import withAuth from '../../hoc/withAuth';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

function MistakeReviewResults({results, returnTo, returnLabel}) {
    const correct = results.filter((result) => result.correct).length;

    return (
        <div className="min-h-screen bg-primary-50/60 py-10 sm:py-16">
            <PageContainer maxWidth="max-w-3xl">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-primary-700">
                        <Target className="size-4"/> Mistake review complete
                    </span>
                    <h1 className="m-0 mt-4 font-display text-3xl font-black text-slate-950 sm:text-4xl">
                        You reviewed {results.length} {results.length === 1 ? 'question' : 'questions'}
                    </h1>
                    <p className="m-0 mt-2 text-slate-600">These results are for review only and did not change your stats.</p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                    {[
                        ['Correct', correct, 'text-emerald-700'],
                        ['Incorrect', results.length - correct, 'text-rose-700'],
                        ['Total', results.length, 'text-primary-700'],
                    ].map(([label, value, tone]) => (
                        <Card key={label} className="p-4 text-center sm:p-5">
                            <p className={`m-0 font-display text-2xl font-black sm:text-3xl ${tone}`}>{value}</p>
                            <p className="m-0 mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                        </Card>
                    ))}
                </div>

                <Card className="mt-5 overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                        <h2 className="m-0 font-display text-xl font-black text-slate-950">Question results</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {results.map((result, index) => {
                            const Icon = result.correct ? CheckCircle2 : XCircle;
                            return (
                                <div key={result.question.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                                    <div className="min-w-0">
                                        <p className="m-0 font-bold text-slate-900">
                                            Question {index + 1}
                                            <span className="ml-2 text-sm font-semibold text-slate-400">
                                                {result.question.question_type || 'Practice'}
                                            </span>
                                        </p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">
                                            Your answer: {result.selectedAnswer || 'No answer'} · Correct answer: {result.question.correct_choice_label || '—'}
                                        </p>
                                    </div>
                                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black ${
                                        result.correct
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-rose-200 bg-rose-50 text-rose-700'
                                    }`}>
                                        <Icon className="size-4"/>
                                        {result.correct ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <Button to={returnTo}>
                        <History className="size-4"/> {returnLabel}
                    </Button>
                </div>
            </PageContainer>
        </div>
    );
}

function MistakeReviewPage() {
    const location = useLocation();
    const questions = location.state?.questions || [];
    const label = location.state?.label || 'Mistake review';
    // Saved-question reviews reuse this page, so they come back with their own
    // return target instead of being dropped on the history page.
    const fromSaved = location.state?.returnTo === '/saved-questions';
    const returnTo = fromSaved ? '/saved-questions' : '/practice-history';
    const returnLabel = fromSaved ? 'Return to saved' : 'Return to history';
    const [results, setResults] = useState(null);

    if (!questions.length) {
        return (
            <div className="grid min-h-screen place-items-center bg-primary-50/60 px-4">
                <Card className="max-w-md px-6 py-10 text-center">
                    <History className="mx-auto size-9 text-primary-300"/>
                    <h1 className="m-0 mt-4 font-display text-2xl font-black text-slate-950">No mistakes loaded</h1>
                    <p className="m-0 mt-2 text-slate-600">Start a mistake review from your practice history.</p>
                    <Button to="/practice-history" className="mt-6">Return to history</Button>
                </Card>
            </div>
        );
    }

    if (results) return <MistakeReviewResults results={results} returnTo={returnTo} returnLabel={returnLabel}/>;

    return (
        <QuestionSession
            questions={questions}
            variant="mistakes"
            eyebrow="Reviewing mistakes"
            title={label}
            statusLabel="Review only · stats unchanged"
            sessionLabel="Mistake review"
            navigationTitle="Mistake review questions"
            reviewDescription="Check unanswered or marked mistakes before finishing your review."
            onSubmit={(selectedAnswers) => setResults(questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[index + 1];
                const selectedChoice = question.choices[CHOICE_LABELS.indexOf(selectedAnswer)];
                return {
                    question,
                    selectedAnswer,
                    correct: Boolean(selectedAnswer) && selectedChoice === question.correct_answer,
                };
            }))}
        />
    );
}

export default withAuth(MistakeReviewPage);
