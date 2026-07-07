import React, {useState} from 'react';
import {ArrowLeft, CheckCircle2, Clock3} from 'lucide-react';
import {BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import {Link, Navigate, useParams} from 'react-router-dom';
import SEO from '../components/SEO';
import {Button, PageContainer} from '../components/ui';
import {STUDY_GUIDE_LESSON_BY_SLUG} from '../content/studyGuideLessons';
import {STUDY_GUIDE_MODULES} from '../content/studyGuideModules';

const NOTE_TONES = {
    blue: 'border-primary-200 bg-primary-50/60 text-primary-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
};

function NoteBox({tone = 'blue', label, title, children}) {
    return (
        <section className={`rounded-xl border-l-4 px-4 py-3 ${NOTE_TONES[tone] || NOTE_TONES.blue}`}>
            {label && <p className="m-0 text-xs font-black uppercase tracking-wide opacity-70">{label}</p>}
            {title && <h2 className="m-0 mt-1 text-base font-black">{title}</h2>}
            <div className="mt-2 text-sm leading-7 text-slate-700">{children}</div>
        </section>
    );
}

function AtAGlance({facts}) {
    if (!facts?.length) return null;

    return (
        <NoteBox tone="slate" label="At a glance" title="Numbers to know">
            <dl className="m-0 divide-y divide-slate-200">
                {facts.map((fact) => (
                    <div key={fact.label} className="grid gap-1 py-2 sm:grid-cols-[130px_1fr]">
                        <dt className="font-black text-slate-900">{fact.label}</dt>
                        <dd className="m-0 text-slate-600">
                            <span className="font-black text-slate-900">{fact.value}</span>
                            {fact.note && <span> - {fact.note}</span>}
                        </dd>
                    </div>
                ))}
            </dl>
        </NoteBox>
    );
}

function FormulaList({formulas}) {
    if (!formulas?.length) return null;

    return (
        <section className="space-y-3">
            <h2 className="m-0 border-b border-slate-200 pb-2 text-xl font-black text-slate-950">Useful formulas</h2>
            {formulas.map((formula) => (
                <NoteBox key={formula.label} tone="blue" label="Rule" title={formula.label}>
                    <div className="overflow-x-auto rounded-lg bg-white/70 py-2 text-slate-950">
                        <BlockMath math={formula.math}/>
                    </div>
                    <p className="m-0 mt-2">{formula.note}</p>
                </NoteBox>
            ))}
        </section>
    );
}

function MethodList({cards}) {
    if (!cards?.length) return null;

    return (
        <section className="space-y-3">
            <h2 className="m-0 border-b border-slate-200 pb-2 text-xl font-black text-slate-950">Decision rules</h2>
            {cards.map((card) => (
                <NoteBox key={card.title} tone="slate" label="Method" title={card.title}>
                    <ul className="m-0 space-y-1.5 p-0">
                        {card.items.map((item) => (
                            <li key={item} className="flex gap-2">
                                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600"/>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </NoteBox>
            ))}
        </section>
    );
}

function AdaptiveDemo({demo}) {
    const [selectedId, setSelectedId] = useState(demo.options[0].id);
    const selected = demo.options.find((option) => option.id === selectedId) || demo.options[0];

    return (
        <NoteBox tone="amber" label="Try it" title={demo.title || 'Choose a path'}>
            <p className="m-0">{demo.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={demo.prompt}>
                {demo.options.map((option) => {
                    const active = option.id === selectedId;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedId(option.id)}
                            className={[
                                'cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-black transition-colors',
                                active
                                    ? 'border-amber-400 bg-white text-amber-950'
                                    : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-white',
                            ].join(' ')}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 rounded-lg bg-white/70 p-3">
                <p className="m-0 font-black text-slate-950">{selected.result}</p>
                <p className="m-0 mt-1">{selected.advice}</p>
            </div>
        </NoteBox>
    );
}

function QuickCheck({check}) {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;

    return (
        <NoteBox tone="emerald" label="Exercise" title={check.prompt}>
            <div className="grid gap-2">
                {check.choices.map((choice, index) => {
                    const correct = answered && index === check.answer;
                    const wrong = answered && picked === index && index !== check.answer;
                    return (
                        <button
                            key={choice}
                            type="button"
                            onClick={() => setPicked(index)}
                            className={[
                                'cursor-pointer rounded-lg border bg-white px-3 py-2 text-left text-sm font-semibold transition-colors',
                                correct ? 'border-emerald-400 text-emerald-900' : '',
                                wrong ? 'border-rose-300 bg-rose-50 text-rose-800' : '',
                                !correct && !wrong ? 'border-emerald-200 text-slate-700 hover:border-emerald-400' : '',
                            ].join(' ')}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <p className="m-0 mt-3 rounded-lg bg-white/70 p-3 text-slate-700">
                    {check.explanation}
                </p>
            )}
        </NoteBox>
    );
}

function PracticeSet({set}) {
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const question = set.questions[index];
    const picked = answers[question.id];
    const answered = picked !== undefined;
    const correct = picked === question.answer;
    const letters = ['A', 'B', 'C', 'D'];

    const pick = (choiceIndex) => {
        setAnswers((current) => ({...current, [question.id]: choiceIndex}));
    };

    return (
        <section className="space-y-3">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-400">Practice set</p>
                    <h2 className="m-0 mt-1 text-xl font-black text-slate-950">{set.title}</h2>
                </div>
                <p className="m-0 text-sm font-black text-slate-500">
                    {index + 1} / {set.questions.length}
                </p>
            </div>

            {set.intro && <p className="m-0 text-base leading-7 text-slate-700">{set.intro}</p>}

            <NoteBox tone="emerald" label={question.skill} title={question.title}>
                <p className="m-0">{question.stem}</p>
                {question.math && (
                    <div className="mt-3 overflow-x-auto rounded-lg bg-white/70 py-2 text-slate-950">
                        <BlockMath math={question.math}/>
                    </div>
                )}

                <div className="mt-3 grid gap-2">
                    {question.choices.map((choice, choiceIndex) => {
                        const isPicked = picked === choiceIndex;
                        const isCorrect = answered && choiceIndex === question.answer;
                        const isWrong = answered && isPicked && !isCorrect;

                        return (
                            <button
                                key={choice}
                                type="button"
                                onClick={() => pick(choiceIndex)}
                                className={[
                                    'flex cursor-pointer gap-3 rounded-lg border bg-white px-3 py-2 text-left text-sm transition-colors',
                                    isCorrect ? 'border-emerald-500 text-emerald-900' : '',
                                    isWrong ? 'border-rose-300 bg-rose-50 text-rose-800' : '',
                                    !isCorrect && !isWrong ? 'border-emerald-200 text-slate-700 hover:border-emerald-400' : '',
                                ].join(' ')}
                            >
                                <span className="font-black">{letters[choiceIndex]}.</span>
                                <span className="font-semibold">{choice}</span>
                            </button>
                        );
                    })}
                </div>

                {answered && (
                    <div className="mt-4 space-y-3 rounded-lg bg-white/75 p-3 text-slate-700">
                        <p className={`m-0 font-black ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {correct ? 'Correct.' : 'Not quite.'}
                        </p>
                        <div>
                            <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-400">Clean solution</p>
                            <ol className="m-0 mt-1 space-y-1 pl-5">
                                {question.explanation.steps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ol>
                        </div>
                        {question.explanation.trap && (
                            <div>
                                <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-400">Common trap</p>
                                <p className="m-0 mt-1">{question.explanation.trap}</p>
                            </div>
                        )}
                        <div>
                            <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-400">Takeaway</p>
                            <p className="m-0 mt-1">{question.explanation.takeaway}</p>
                        </div>
                    </div>
                )}
            </NoteBox>

            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => setIndex((current) => Math.max(0, current - 1))}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 disabled:cursor-default disabled:opacity-40"
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={index === set.questions.length - 1}
                    onClick={() => setIndex((current) => Math.min(set.questions.length - 1, current + 1))}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 disabled:cursor-default disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </section>
    );
}

export default function StudyGuideLessonPage() {
    const {slug} = useParams();
    const lesson = STUDY_GUIDE_LESSON_BY_SLUG[slug];

    if (!lesson) {
        return <Navigate to="/study_guides" replace/>;
    }

    const module = STUDY_GUIDE_MODULES.find((item) => item.id === lesson.moduleId);
    const moduleNumber = STUDY_GUIDE_MODULES.findIndex((item) => item.id === lesson.moduleId) + 1;

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO
                title={`${lesson.title} | SAT Math Study Guide`}
                description={lesson.summary}
                path={`/study_guides/${lesson.slug}`}
                noindex
            />
            <PageContainer className="max-w-5xl">
                <Link
                    to="/study_guides"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-black text-slate-500 no-underline hover:text-primary-700"
                >
                    <ArrowLeft className="size-4"/> Study guide
                </Link>

                <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-5 py-6 text-slate-700 sm:px-10 sm:py-9">
                    <header className="border-b border-slate-200 pb-5">
                        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-black uppercase tracking-wide text-slate-500">
                            <span>Module {moduleNumber}: {module?.title}</span>
                            <span className="inline-flex items-center gap-1">
                                <Clock3 className="size-3.5"/> {lesson.minutes}
                            </span>
                        </p>
                        <h1 className="m-0 mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                            {lesson.title}
                        </h1>
                        <p className="m-0 mt-3 text-base leading-7 text-slate-600">{lesson.summary}</p>
                    </header>

                    <div className="mt-6 space-y-7">
                        <NoteBox label="Learning goals" title="By the end, you should be able to:">
                            <ul className="m-0 space-y-1.5 p-0">
                                {lesson.goals.map((goal) => (
                                    <li key={goal} className="flex gap-2">
                                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600"/>
                                        <span>{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </NoteBox>

                        <AtAGlance facts={lesson.facts}/>

                        <section className="space-y-6">
                            {lesson.sections.map((section) => (
                                <section key={section.heading} className="space-y-2">
                                    <h2 className="m-0 border-b border-slate-200 pb-2 text-xl font-black text-slate-950">
                                        {section.heading}
                                    </h2>
                                    {section.paragraphs.map((paragraph) => (
                                        <p key={paragraph} className="m-0 text-base leading-8 text-slate-700">
                                            {paragraph}
                                        </p>
                                    ))}
                                </section>
                            ))}
                        </section>

                        <FormulaList formulas={lesson.formulas}/>
                        <MethodList cards={lesson.strategyCards}/>
                        <AdaptiveDemo demo={lesson.adaptiveDemo}/>
                        <QuickCheck check={lesson.quickCheck}/>
                        {lesson.practiceSet && <PracticeSet set={lesson.practiceSet}/>}

                        <div className="border-t border-slate-200 pt-5">
                            <Button to="/infinite_questions" size="sm">
                                Practice questions
                            </Button>
                        </div>
                    </div>
                </article>
            </PageContainer>
        </div>
    );
}
