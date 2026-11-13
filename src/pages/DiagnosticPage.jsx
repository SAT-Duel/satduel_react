import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {ArrowRight, BookOpen, Calculator, CheckCircle2, XCircle} from 'lucide-react';
import {Button, Card, PageContainer, Spinner} from '../components/ui';
import PracticeQuestionCard from '../components/practice/PracticeQuestionCard';
import {useAuth} from '../context/AuthContext';
import SEO, {breadcrumbJsonLd, softwareAppJsonLd} from '../components/SEO';

const baseUrl = import.meta.env.VITE_API_URL;

// Skills per subject, grouped by College Board domain. The names are the
// exact `question_type` values in the question bank. The diagnostic draws one
// question from each of three domains, so three questions span the section
// instead of landing on one corner of it.
const SUBJECTS = {
    english: {
        label: 'Reading & Writing',
        icon: BookOpen,
        domains: [
            ['Words in Context', 'Text Structure and Purpose', 'Cross-Text Connections'],
            ['Central Ideas and Details', 'Command of Evidence', 'Inferences'],
            ['Boundaries', 'Form, Structure, and Sense'],
            ['Transitions', 'Rhetorical Synthesis'],
        ],
    },
    math: {
        label: 'Math',
        icon: Calculator,
        domains: [
            [
                'Linear equations in one variable', 'Linear functions', 'Linear equations in two variables',
                'Systems of two linear equations in two variables', 'Linear inequalities in one or two variables',
            ],
            [
                'Equivalent expressions', 'Nonlinear functions',
                'Nonlinear equations in one variable and systems of equations in two variables',
            ],
            [
                'Ratios, rates, proportional relationships, and units', 'Percentages',
                'One-variable data: distributions and measures of center and spread',
                'Two-variable data: models and scatterplots', 'Probability and conditional probability',
                'Inference from sample statistics and margin of error',
                'Evaluating statistical claims: observational studies and experiments',
            ],
            ['Area and volume', 'Lines, angles, and triangles', 'Right triangles and trigonometry', 'Circles'],
        ],
    },
};

const QUESTION_COUNT = 3;

const shuffled = (list) => [...list].sort(() => Math.random() - 0.5);

// One random question from the first skill in the domain that has any. The
// `subject` param matters: the endpoint defaults to English, which is how the
// Math diagnostic used to miss the whole Math bank.
async function fetchFromDomain(subjectKey, skills) {
    for (const type of shuffled(skills)) {
        const response = await axios.get(`${baseUrl}/api/filter_questions/`, {
            params: {subject: subjectKey, type, random: 'true', page_size: 1, page: 1},
        });
        const question = response.data.questions?.[0];
        if (question) return question;
    }
    return null;
}

async function fetchDiagnosticQuestions(subjectKey) {
    const domains = shuffled(SUBJECTS[subjectKey].domains).slice(0, QUESTION_COUNT);
    const questions = await Promise.all(domains.map((skills) => fetchFromDomain(subjectKey, skills)));
    // Easiest first, so the opening question is not the hardest of the three.
    return questions.filter(Boolean).sort((a, b) => Number(a.difficulty) - Number(b.difficulty));
}

// Three questions cannot predict a section score, so the result is a plain
// level plus the skills behind it, never a number on the 200-800 scale.
function levelFor(correct, total) {
    if (correct === total) {
        return {title: 'Strong start', text: 'You handled all three. Harder questions will show where the ceiling is.'};
    }
    if (correct >= total - 1) {
        return {title: 'Solid base', text: 'Most of it landed. The skill you missed is a good first target.'};
    }
    return {title: 'Room to grow', text: 'A few gaps showed up. Short, steady practice on these skills moves fast.'};
}

function SubjectPicker({onPick, loading}) {
    return (
        <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-[var(--sd-text)] sm:text-4xl">
                Quick diagnostic
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-[var(--sd-mut)]">
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
                <div className="mt-8 flex items-center justify-center gap-2 text-[var(--sd-dim)]">
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
            primaryAction={() => onAnswered(result === 'correct', question.question_type)}
            primaryActionLabel={index + 1 === total ? 'See my result' : 'Next question'}
        />
    );
}

function ResultStep({answers, subjectKey, user}) {
    const correct = answers.filter((a) => a.correct).length;
    const level = levelFor(correct, answers.length);
    const label = SUBJECTS[subjectKey].label;

    return (
        <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--sd-violet-lbl)]">
                Diagnostic complete
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-[var(--sd-text)] sm:text-4xl">
                You got {correct} of {answers.length} right
            </h1>

            <Card className="mx-auto mt-8 max-w-md p-6 text-left sm:p-8">
                <p className="m-0 text-sm font-semibold text-slate-500">
                    {label} snapshot
                </p>
                <p className="m-0 mt-1 font-display text-3xl font-bold text-primary-600 sm:text-4xl">
                    {level.title}
                </p>
                <p className="m-0 mt-2 text-[15px] leading-6 text-slate-600">{level.text}</p>

                <ul className="m-0 mt-5 list-none space-y-2.5 border-t border-slate-100 p-0 pt-5">
                    {answers.map(({correct: gotIt, skill}, index) => (
                        <li key={`${skill}-${index}`} className="flex items-start gap-2.5 text-[15px] leading-6 text-slate-700">
                            {gotIt
                                ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true"/>
                                : <XCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true"/>}
                            <span>
                                <span className="font-semibold text-slate-900">{skill}</span>
                                <span className="text-slate-500"> · {gotIt ? 'correct' : 'missed'}</span>
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="m-0 mt-5 text-sm leading-5 text-slate-500">
                    Three questions can’t predict a score. A full practice test gives you a real one.
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
                        <p className="text-sm text-[var(--sd-dim)]">
                            Save your progress, unlock daily practice and tournaments.{' '}
                            <Link to="/login" className="font-semibold text-[var(--sd-violet-lbl)]">
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

    const handleAnswered = (correct, skill) => {
        const next = [...answers, {correct, skill}];
        setAnswers(next);
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setPhase('result');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] py-12 sm:py-16">
            <SEO
                seoKey="diagnostic"
                structuredData={[
                    softwareAppJsonLd(),
                    breadcrumbJsonLd([
                        {name: 'Home', path: '/'},
                        {name: 'Free Digital SAT Diagnostic', path: '/diagnostic'},
                    ]),
                ]}
            />
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
