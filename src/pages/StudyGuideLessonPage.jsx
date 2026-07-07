import React, {useState} from 'react';
import {ArrowLeft, BookOpen, CheckCircle2, Clock3, Target} from 'lucide-react';
import {BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import {Link, Navigate, useParams} from 'react-router-dom';
import SEO from '../components/SEO';
import {Button, PageContainer} from '../components/ui';
import {STUDY_GUIDE_LESSON_BY_SLUG} from '../content/studyGuideLessons';
import {STUDY_GUIDE_MODULES} from '../content/studyGuideModules';

function AdaptiveDemo({demo}) {
    const [selectedId, setSelectedId] = useState(demo.options[0].id);
    const selected = demo.options.find((option) => option.id === selectedId) || demo.options[0];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="m-0 text-xs font-black uppercase text-primary-700">Interactive</p>
            <h2 className="m-0 mt-2 font-display text-xl font-black text-slate-950">Adaptive module feel</h2>
            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{demo.prompt}</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Module 1 result">
                {demo.options.map((option) => {
                    const active = option.id === selectedId;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedId(option.id)}
                            className={[
                                'cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-black transition-colors',
                                active
                                    ? 'border-primary-300 bg-primary-50 text-primary-800'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="m-0 font-black text-slate-950">{selected.result}</p>
                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{selected.advice}</p>
            </div>
        </section>
    );
}

function QuickCheck({check}) {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="m-0 text-xs font-black uppercase text-primary-700">Self-check</p>
            <h2 className="m-0 mt-2 text-xl font-black text-slate-950">{check.prompt}</h2>
            <div className="mt-4 grid gap-2">
                {check.choices.map((choice, index) => {
                    const correct = answered && index === check.answer;
                    const wrong = answered && picked === index && index !== check.answer;
                    return (
                        <button
                            key={choice}
                            type="button"
                            onClick={() => setPicked(index)}
                            className={[
                                'cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors',
                                correct ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : '',
                                wrong ? 'border-rose-300 bg-rose-50 text-rose-800' : '',
                                !correct && !wrong ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50' : '',
                            ].join(' ')}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <p className="m-0 mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    {check.explanation}
                </p>
            )}
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
            <PageContainer className="max-w-6xl">
                <div className="mb-5">
                    <Link
                        to="/study_guides"
                        className="inline-flex items-center gap-2 text-sm font-black text-slate-500 no-underline hover:text-primary-700"
                    >
                        <ArrowLeft className="size-4"/> Study guide
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <main className="min-w-0 space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                            <p className="m-0 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
                                <BookOpen className="size-4"/> {lesson.eyebrow}
                            </p>
                            <h1 className="m-0 mt-3 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                                {lesson.title}
                            </h1>
                            <p className="m-0 mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                                {lesson.summary}
                            </p>
                        </section>

                        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {lesson.facts.map((fact) => (
                                <div key={fact.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <p className="m-0 text-xs font-black uppercase text-slate-400">{fact.label}</p>
                                    <p className="m-0 mt-2 text-2xl font-black text-slate-950">{fact.value}</p>
                                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{fact.note}</p>
                                </div>
                            ))}
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">What to know</h2>
                            <div className="mt-5 space-y-6">
                                {lesson.sections.map((section) => (
                                    <section key={section.heading}>
                                        <h3 className="m-0 text-lg font-black text-slate-950">{section.heading}</h3>
                                        <div className="mt-2 space-y-3">
                                            {section.paragraphs.map((paragraph) => (
                                                <p key={paragraph} className="m-0 text-base leading-7 text-slate-600">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                            <h2 className="m-0 font-display text-2xl font-black text-slate-950">Useful formulas</h2>
                            <div className="mt-5 space-y-4">
                                {lesson.formulas.map((formula) => (
                                    <div key={formula.label} className="rounded-xl bg-slate-50 p-4">
                                        <p className="m-0 text-sm font-black text-slate-950">{formula.label}</p>
                                        <div className="overflow-x-auto py-2 text-slate-900">
                                            <BlockMath math={formula.math}/>
                                        </div>
                                        <p className="m-0 text-sm leading-relaxed text-slate-600">{formula.note}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-3 md:grid-cols-3">
                            {lesson.strategyCards.map((card) => (
                                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h2 className="m-0 text-base font-black text-slate-950">{card.title}</h2>
                                    <ul className="m-0 mt-3 space-y-2 p-0">
                                        {card.items.map((item) => (
                                            <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600"/>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <AdaptiveDemo demo={lesson.adaptiveDemo}/>
                        <QuickCheck check={lesson.quickCheck}/>
                    </main>

                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Lesson</p>
                            <div className="mt-3 space-y-3 text-sm text-slate-600">
                                <p className="m-0 flex items-center gap-2">
                                    <Clock3 className="size-4 text-primary-600"/> {lesson.minutes}
                                </p>
                                <p className="m-0 flex items-center gap-2">
                                    <Target className="size-4 text-primary-600"/> Module {moduleNumber}: {module?.title}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Goals</p>
                            <ul className="m-0 mt-3 space-y-3 p-0">
                                {lesson.goals.map((goal) => (
                                    <li key={goal} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600"/>
                                        <span>{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <Button to="/infinite_questions" block size="sm">
                            Practice questions
                        </Button>
                    </aside>
                </div>
            </PageContainer>
        </div>
    );
}
