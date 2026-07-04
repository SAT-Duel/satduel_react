import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BookOpen, Calculator, ArrowRight, CheckCircle2, XCircle} from 'lucide-react';
import {Button, Card, PageContainer, Spinner} from '../components/ui';
import RenderWithMath from '../components/RenderWithMath';
import {useAuth} from '../context/AuthContext';

const baseUrl = import.meta.env.VITE_API_URL;

// Question types per subject; the diagnostic samples one question from each.
const SUBJECTS = {
    english: {
        label: 'Reading & Writing',
        icon: BookOpen,
        types: ['Words in Context', 'Central Ideas and Details', 'Boundaries'],
    },
    math: {
        label: 'Math',
        icon: Calculator,
        types: ['Algebra', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry'],
    },
};

async function fetchDiagnosticQuestions(subjectKey) {
    const {types} = SUBJECTS[subjectKey];
    const results = await Promise.all(
        types.map((type) =>
            axios.get(`${baseUrl}/api/filter_questions/`, {
                params: {type, random: 'true', page_size: 1, page: 1},
            })
        )
    );
    return results
        .map((r) => r.data.questions?.[0])
        .filter(Boolean);
}

// Rough score-range estimate from 3 questions. Deliberately framed as a range;
// three questions can only ever be a ballpark.
function estimateRange(answers) {
    let score = 380;
    answers.forEach(({correct, difficulty}) => {
        if (correct) score += 60 + 20 * (difficulty || 3);
    });
    const low = Math.max(200, Math.min(720, score - 60));
    const high = Math.min(800, score + 80);
    return [Math.round(low / 10) * 10, Math.round(high / 10) * 10];
}

function SubjectPicker({onPick, loading}) {
    return (
        <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Quick diagnostic
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-slate-600">
                Three questions, about two minutes. Pick a section:
            </p>

            <div className="mx-auto mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
                {Object.entries(SUBJECTS).map(([key, {label, icon: Icon}]) => (
                    <button
                        key={key}
                        onClick={() => onPick(key)}
                        disabled={loading}
                        className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-primary-400 hover:shadow-md disabled:opacity-50"
                    >
                        <Icon className="mx-auto size-10 text-primary-600 transition-transform group-hover:scale-110"/>
                        <p className="mt-4 text-lg font-bold text-slate-900">{label}</p>
                    </button>
                ))}
            </div>

            {loading && (
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
                    <Spinner/> Loading questions…
                </div>
            )}

            <div className="mt-12">
                <Button to="/register" variant="secondary" size="lg" block className="mx-auto max-w-lg">
                    Skip the diagnostic — just create my account
                </Button>
            </div>
        </div>
    );
}

function QuestionStep({question, index, total, onAnswered}) {
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState(null); // 'correct' | 'incorrect'
    const [checking, setChecking] = useState(false);

    const choiceLabels = ['A', 'B', 'C', 'D'];

    const submit = async (choiceText) => {
        if (result || checking) return;
        setSelected(choiceText);
        setChecking(true);
        try {
            const resp = await axios.post(`${baseUrl}/api/check_answer/`, {
                question_id: question.id,
                selected_choice: choiceText,
            });
            setResult(resp.data.result);
        } catch {
            setResult('incorrect');
        } finally {
            setChecking(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <p className="m-0 text-sm font-semibold text-slate-500">
                    Question {index + 1} of {total}
                </p>
                <div className="flex gap-1.5">
                    {Array.from({length: total}).map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 w-8 rounded-full ${i <= index ? 'bg-primary-500' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>
            </div>

            <Card className="p-6 sm:p-8">
                <div className="text-[16px] leading-relaxed text-slate-800">
                    <RenderWithMath text={question.question}/>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    {question.choices.map((choice, i) => {
                        const isSelected = selected === choice;
                        let style = 'border-slate-200 bg-white hover:border-primary-400';
                        if (result && isSelected) {
                            style = result === 'correct'
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-rose-400 bg-rose-50';
                        } else if (result) {
                            style = 'border-slate-200 bg-white opacity-60';
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => submit(choice)}
                                disabled={!!result || checking}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${style}`}
                            >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                    {choiceLabels[i]}
                                </span>
                                <span className="text-[15px] text-slate-800">
                                    <RenderWithMath text={choice}/>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {result && (
                    <div className="mt-6 flex items-center justify-between">
                        <span className={`flex items-center gap-1.5 font-semibold ${
                            result === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                            {result === 'correct'
                                ? <><CheckCircle2 className="size-5"/> Correct!</>
                                : <><XCircle className="size-5"/> Not quite.</>}
                        </span>
                        <Button onClick={() => onAnswered(result === 'correct', question.difficulty)}>
                            {index + 1 === total ? 'See my result' : 'Next question'}
                            <ArrowRight className="size-4"/>
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

function ResultStep({answers, subjectKey, user}) {
    const [low, high] = estimateRange(answers);
    const correct = answers.filter((a) => a.correct).length;
    const label = SUBJECTS[subjectKey].label;

    return (
        <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-600">
                Diagnostic complete
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                You got {correct} of {answers.length} right
            </h1>

            <Card className="mx-auto mt-8 max-w-md p-8">
                <p className="m-0 text-sm font-semibold text-slate-500">
                    Estimated {label} range
                </p>
                <p className="m-0 mt-2 font-display text-5xl font-bold text-primary-600">
                    {low}–{high}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                    Based on 3 questions — a real practice test will pin this down.
                </p>
            </Card>

            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
                {user ? (
                    <>
                        <Button to="/trainer" size="lg" block>
                            Start practicing <ArrowRight className="size-5"/>
                        </Button>
                        <Button to="/practice_test" variant="secondary" block>
                            Take a full practice test
                        </Button>
                    </>
                ) : (
                    <>
                        <Button to="/register" size="lg" block>
                            Create a free account to keep improving <ArrowRight className="size-5"/>
                        </Button>
                        <p className="text-sm text-slate-500">
                            Save your progress, unlock daily practice and tournaments.{' '}
                            <Link to="/login" className="font-semibold text-primary-600">
                                Already have an account?
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

function DiagnosticPage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [phase, setPhase] = useState('pick'); // pick | quiz | result
    const [subjectKey, setSubjectKey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickSubject = async (key) => {
        setLoading(true);
        setSubjectKey(key);
        try {
            const qs = await fetchDiagnosticQuestions(key);
            if (!qs.length) {
                navigate('/register');
                return;
            }
            setQuestions(qs);
            setPhase('quiz');
        } catch {
            navigate('/register');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswered = (correct, difficulty) => {
        const next = [...answers, {correct, difficulty}];
        setAnswers(next);
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setPhase('result');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
            <PageContainer className="max-w-3xl">
                {phase === 'pick' && <SubjectPicker onPick={pickSubject} loading={loading}/>}
                {phase === 'quiz' && questions[current] && (
                    <QuestionStep
                        key={questions[current].id}
                        question={questions[current]}
                        index={current}
                        total={questions.length}
                        onAnswered={handleAnswered}
                    />
                )}
                {phase === 'result' && (
                    <ResultStep answers={answers} subjectKey={subjectKey} user={user}/>
                )}
            </PageContainer>
        </div>
    );
}

export default DiagnosticPage;
