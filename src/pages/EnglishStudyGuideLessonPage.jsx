import React, {useEffect, useMemo, useState} from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Lightbulb,
    RotateCcw,
    Target,
    X,
} from 'lucide-react';
import {Link} from 'react-router-dom';
import SEO from '../components/SEO';
import {PageContainer} from '../components/ui';

const LETTERS = ['A', 'B', 'C', 'D'];

function SectionHeading({eyebrow, title, description}) {
    return (
        <header className="border-b border-slate-200 pb-3">
            <p className="m-0 text-xs font-black uppercase tracking-[0.14em] text-primary-600">{eyebrow}</p>
            <h2 className="m-0 mt-1 font-display text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
            {description && <p className="m-0 mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
        </header>
    );
}

function AnswerChoices({choices, answer, picked, onPick, disabled = false}) {
    return (
        <div className="grid gap-2.5">
            {choices.map((choice, index) => {
                const answered = picked !== null && picked !== undefined;
                const correct = answered && index === answer;
                const wrong = answered && picked === index && index !== answer;
                return (
                    <button
                        key={`${index}-${choice}`}
                        type="button"
                        disabled={disabled || answered}
                        onClick={() => onPick(index)}
                        className={[
                            'flex min-h-12 w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold leading-6 transition-colors',
                            correct ? 'border-emerald-400 bg-emerald-50 text-emerald-950' : '',
                            wrong ? 'border-rose-300 bg-rose-50 text-rose-950' : '',
                            !correct && !wrong ? 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50/40' : '',
                            answered ? 'cursor-default' : 'cursor-pointer',
                        ].join(' ')}
                    >
                        <span className={[
                            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-black',
                            correct ? 'bg-emerald-600 text-white' : '',
                            wrong ? 'bg-rose-500 text-white' : '',
                            !correct && !wrong ? 'bg-slate-100 text-slate-500' : '',
                        ].join(' ')}>
                            {correct ? <Check className="size-3.5"/> : wrong ? <X className="size-3.5"/> : LETTERS[index]}
                        </span>
                        <span>{choice}</span>
                    </button>
                );
            })}
        </div>
    );
}

function OpeningCheck({check}) {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;
    return (
        <section id="diagnose" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="1 · Diagnose" title="Start with a decision" description="Choose before reading the lesson. The point is to expose your current instinct, not to perform."/>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <p className="m-0 font-serif text-lg font-bold leading-8 text-slate-950">{check.prompt}</p>
                <div className="mt-4">
                    <AnswerChoices choices={check.choices} answer={check.answer} picked={picked} onPick={setPicked}/>
                </div>
                {answered && (
                    <div aria-live="polite" className="mt-4 border-t border-slate-200 pt-4">
                        <p className={`m-0 text-sm font-black ${picked === check.answer ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {picked === check.answer ? 'Good decision.' : 'Recalibrate here.'}
                        </p>
                        <p className="m-0 mt-1 text-sm leading-7 text-slate-700">{check.explanation}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function Concepts({concepts}) {
    return (
        <section id="learn" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="2 · Learn the lens" title="Build the decision process" description="English improves when a broad idea becomes a small action you can repeat under time pressure."/>
            <div className="space-y-8">
                {concepts.map((concept, index) => (
                    <section key={concept.heading} className="grid gap-3 sm:grid-cols-[36px_minmax(0,1fr)]">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-sm font-black text-primary-700">{index + 1}</span>
                        <div>
                            <h3 className="m-0 text-lg font-black text-slate-950">{concept.heading}</h3>
                            <div className="mt-2 space-y-2">
                                {concept.body.map((paragraph) => <p key={paragraph} className="m-0 text-base leading-8 text-slate-700">{paragraph}</p>)}
                            </div>
                            <ul className="m-0 mt-3 flex flex-wrap gap-2 p-0" aria-label={`${concept.heading} key moves`}>
                                {concept.moves.map((move) => <li key={move} className="list-none rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">{move}</li>)}
                            </ul>
                        </div>
                    </section>
                ))}
            </div>
        </section>
    );
}

function ChoiceAudit({example}) {
    const [revealed, setRevealed] = useState(false);
    return (
        <section id="example" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="3 · See the reasoning" title="Predict, then audit all four" description="The worked example shows why the best answer wins—and the exact defect in every tempting alternative."/>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-500">{example.skill}</p>
                </div>
                <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
                    <p className="m-0 font-serif text-lg leading-8 text-slate-900">{example.passage}</p>
                    <p className="m-0 font-black leading-7 text-slate-950">{example.question}</p>
                    {!revealed ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <p className="m-0 text-sm font-black text-amber-950">Pause before the choices</p>
                            <p className="m-0 mt-1 text-sm leading-6 text-amber-900">Say the answer’s job or likely meaning in your own words.</p>
                            <button type="button" onClick={() => setRevealed(true)} className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">
                                <Eye className="size-4"/> Reveal prediction and audit
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
                                <p className="m-0 text-xs font-black uppercase tracking-wide text-primary-700">Prediction</p>
                                <p className="m-0 mt-1 text-sm leading-7 text-slate-800">{example.prediction}</p>
                            </div>
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                                {example.choices.map((choice, index) => (
                                    <div key={choice.text} className={`p-4 ${index === example.answer ? 'bg-emerald-50/70' : 'bg-white'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-black ${index === example.answer ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{LETTERS[index]}</span>
                                            <div>
                                                <p className="m-0 text-sm font-bold leading-6 text-slate-950">{choice.text}</p>
                                                <p className={`m-0 mt-1 text-xs font-black uppercase tracking-wide ${index === example.answer ? 'text-emerald-700' : 'text-rose-600'}`}>{choice.verdict}</p>
                                                <p className="m-0 mt-1 text-sm leading-6 text-slate-600">{choice.analysis}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="m-0 flex items-start gap-2 text-sm leading-7 text-slate-700"><Lightbulb className="mt-1 size-4 shrink-0 text-amber-500"/><span><strong className="text-slate-950">Decision:</strong> {example.decision}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function KeepTheRule({takeaways}) {
    return (
        <section id="rule" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="4 · Keep the rule" title="Compress what you learned"/>
            <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-4 sm:px-5">
                <p className="m-0 text-xs font-black uppercase tracking-wide text-primary-700">The rule</p>
                <p className="m-0 mt-1 font-serif text-lg font-bold leading-8 text-slate-950">{takeaways.rule}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-amber-700">700+ refinement</p>
                    <p className="m-0 mt-2 text-sm leading-7 text-amber-950">{takeaways.highScore}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-500">Before you commit</p>
                    <ul className="m-0 mt-2 space-y-2 p-0">
                        {takeaways.checklist.map((item) => <li key={item} className="flex list-none gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600"/>{item}</li>)}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function PracticeSet({set}) {
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const question = set.questions[index];
    const picked = answers[question.id];
    const answered = picked !== undefined;
    const completed = Object.keys(answers).length;

    const choose = (choiceIndex) => setAnswers((current) => ({...current, [question.id]: choiceIndex}));
    const reset = () => setAnswers((current) => {
        const next = {...current};
        delete next[question.id];
        return next;
    });

    return (
        <section id="practice" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="5 · Practice" title={set.title} description={set.intro}/>
            <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-500">
                <span>{completed} of {set.questions.length} answered</span>
                <div className="flex gap-1.5" aria-hidden="true">
                    {set.questions.map((item, itemIndex) => <span key={item.id} className={`h-1.5 w-8 rounded-full ${answers[item.id] !== undefined ? 'bg-emerald-500' : itemIndex === index ? 'bg-primary-500' : 'bg-slate-200'}`}/>)}
                </div>
            </div>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="m-0 text-xs font-black uppercase tracking-wide text-primary-700">{question.difficulty} · {question.skill}</p>
                    <p className="m-0 text-xs font-black text-slate-500">Question {index + 1} / {set.questions.length}</p>
                </div>
                {question.notes ? (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                        <p className="m-0 text-xs font-black uppercase tracking-wide text-slate-500">Student notes</p>
                        <ul className="m-0 mt-2 space-y-1.5 pl-5 text-sm leading-6 text-slate-700">{question.notes.map((note) => <li key={note}>{note}</li>)}</ul>
                    </div>
                ) : (
                    <p className="m-0 mt-4 border-l-2 border-slate-300 pl-4 font-serif text-base leading-8 text-slate-900">{question.passage}</p>
                )}
                <p className="m-0 mt-5 font-black leading-7 text-slate-950">{question.question}</p>
                <div className="mt-4"><AnswerChoices choices={question.choices} answer={question.answer} picked={picked} onPick={choose}/></div>
                {answered && (
                    <div aria-live="polite" className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                        <p className={`m-0 text-sm font-black ${picked === question.answer ? 'text-emerald-700' : 'text-rose-700'}`}>{picked === question.answer ? 'Correct—and here is why.' : `The best answer is ${LETTERS[question.answer]}.`}</p>
                        <p className="m-0 text-sm leading-7 text-slate-700">{question.explanation.whyCorrect}</p>
                        <div className="grid gap-2">
                            {question.explanation.choices.map((reason, choiceIndex) => (
                                <div key={`${question.id}-${choiceIndex}`} className={`flex gap-3 rounded-lg px-3 py-2 text-sm leading-6 ${choiceIndex === question.answer ? 'bg-emerald-50 text-emerald-950' : 'bg-white text-slate-600'}`}>
                                    <span className="font-black">{LETTERS[choiceIndex]}</span><span>{reason}</span>
                                </div>
                            ))}
                        </div>
                        <p className="m-0 rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700"><strong className="text-slate-950">Transfer:</strong> {question.explanation.takeaway}</p>
                        <button type="button" onClick={reset} className="inline-flex cursor-pointer items-center gap-2 text-xs font-black text-slate-500 hover:text-primary-700"><RotateCcw className="size-3.5"/> Try this question again</button>
                    </div>
                )}
            </article>
            <div className="flex items-center justify-between gap-3">
                <button type="button" disabled={index === 0} onClick={() => setIndex((current) => current - 1)} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 disabled:cursor-default disabled:opacity-40"><ChevronLeft className="size-4"/> Previous</button>
                <button type="button" disabled={index === set.questions.length - 1} onClick={() => setIndex((current) => current + 1)} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 disabled:cursor-default disabled:opacity-40">Next <ChevronRight className="size-4"/></button>
            </div>
        </section>
    );
}

function Reflection({reflection}) {
    return (
        <section id="reflect" className="scroll-mt-8 space-y-5">
            <SectionHeading eyebrow="6 · Reflect" title="Make it transferable" description="A lesson is finished when you can name what you will do differently on the next unseen text."/>
            <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
                <Target className="size-5 text-primary-300"/>
                <p className="m-0 mt-3 font-serif text-lg font-bold leading-8">{reflection.prompt}</p>
                <ol className="m-0 mt-4 space-y-2 pl-5 text-sm leading-6 text-slate-300">{reflection.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            </div>
        </section>
    );
}

export default function EnglishStudyGuideLessonPage({lesson, module, moduleNumber, pageIndex}) {
    const [activeSection, setActiveSection] = useState('diagnose');
    const sections = useMemo(() => [
        ['diagnose', 'Diagnose'], ['learn', 'Learn the lens'], ['example', 'See the reasoning'],
        ['rule', 'Keep the rule'], ['practice', 'Practice'], ['reflect', 'Reflect'],
    ], []);
    const previous = module.pages[pageIndex - 1];
    const next = module.pages[pageIndex + 1];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id));
        }, {rootMargin: '-15% 0px -70% 0px'});
        sections.forEach(([id]) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });
        return () => observer.disconnect();
    }, [sections, lesson.slug]);

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO title={`${lesson.title} | SAT English Study Guide`} description={lesson.summary} path={`/study_guides/${lesson.slug}`} noindex/>
            <PageContainer maxWidth="max-w-7xl">
                <Link to="/study_guides?subject=english" className="mb-4 inline-flex items-center gap-2 text-sm font-black text-slate-500 no-underline hover:text-primary-700"><ArrowLeft className="size-4"/> English study guide</Link>
                <header className="border-y border-slate-200 py-6 sm:py-8">
                    <div className="max-w-4xl">
                        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-black uppercase tracking-wide text-primary-700">
                            <span>Module {moduleNumber}: {module.title}</span>
                            <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="size-3.5"/> {lesson.minutes}</span>
                            <span className="text-amber-700">Foundation → 700+</span>
                        </p>
                        <h1 className="m-0 mt-3 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{lesson.title}</h1>
                        <p className="m-0 mt-3 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{lesson.summary}</p>
                        <ul className="m-0 mt-5 grid gap-2 p-0 sm:grid-cols-3">
                            {lesson.goals.map((goal) => <li key={goal} className="flex list-none gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600"/>{goal}</li>)}
                        </ul>
                    </div>
                </header>

                <div className="mt-7 grid gap-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center lg:gap-12">
                    <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
                        <p className="m-0 flex items-center gap-2 text-sm font-black text-slate-950"><BookOpen className="size-4 text-primary-600"/> Lesson path</p>
                        <nav className="mt-3 border-l border-slate-200" aria-label="Lesson sections">
                            {sections.map(([id, label], index) => <a key={id} href={`#${id}`} className={`block border-l-2 px-3 py-2 text-sm font-bold no-underline transition-colors ${activeSection === id ? '-ml-px border-primary-500 bg-primary-50 text-primary-800' : '-ml-px border-transparent text-slate-500 hover:text-slate-950'}`}>{index + 1}. {label}</a>)}
                        </nav>
                    </aside>

                    <main className="min-w-0 space-y-12 rounded-2xl border border-slate-200 bg-white px-5 py-7 sm:px-9 sm:py-10">
                        <OpeningCheck key={`${lesson.slug}-check`} check={lesson.openingCheck}/>
                        <Concepts concepts={lesson.concepts}/>
                        <ChoiceAudit key={`${lesson.slug}-audit`} example={lesson.workedExample}/>
                        <KeepTheRule takeaways={lesson.takeaways}/>
                        <PracticeSet key={`${lesson.slug}-practice`} set={lesson.practiceSet}/>
                        <Reflection reflection={lesson.reflection}/>

                        <nav className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2" aria-label="Lesson navigation">
                            {previous ? <Link to={`/study_guides/${previous.slug}`} className="group rounded-xl border border-slate-200 p-4 no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="flex items-center gap-1 text-xs font-black uppercase tracking-wide text-slate-500"><ChevronLeft className="size-3.5"/> Previous lesson</span><span className="mt-1 block font-black text-slate-950">{previous.title}</span></Link> : <div/>}
                            {next ? <Link to={`/study_guides/${next.slug}`} className="group rounded-xl border border-slate-200 p-4 text-right no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="flex items-center justify-end gap-1 text-xs font-black uppercase tracking-wide text-slate-500">Next lesson <ArrowRight className="size-3.5"/></span><span className="mt-1 block font-black text-slate-950">{next.title}</span></Link> : <Link to="/study_guides?subject=english" className="rounded-xl border border-slate-200 p-4 text-right no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="text-xs font-black uppercase tracking-wide text-slate-500">Module complete</span><span className="mt-1 block font-black text-slate-950">Return to curriculum</span></Link>}
                        </nav>
                    </main>
                </div>
            </PageContainer>
        </div>
    );
}
