import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BookOpen, Calculator, ArrowRight} from 'lucide-react';
import {Button, Card, PageContainer, Spinner} from '../components/ui';
import PracticeQuestionCard from '../components/practice/PracticeQuestionCard';
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
        <PracticeQuestionCard
            question={question}
            questionNumber={index + 1}
            totalQuestions={total}
            selectedChoice={selected}
            onSelectChoice={setSelected}
            onSubmit={submit}
            submitOnSelect
            status={result || 'Blank'}
            checking={checking}
            primaryAction={() => onAnswered(result === 'correct', question.difficulty)}
            primaryActionLabel={index + 1 === total ? 'See my result' : 'Next question'}
        />
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
