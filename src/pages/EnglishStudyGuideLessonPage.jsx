import React, {useState} from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Lightbulb,
    RotateCcw,
    X,
} from 'lucide-react';
import {Link} from 'react-router-dom';
import SEO from '../components/SEO';
import {PageContainer} from '../components/ui';

const LETTERS = ['A', 'B', 'C', 'D'];

function SectionHeading({title, description}) {
    return (
        <header>
            <h2 className="m-0 font-display text-2xl font-black tracking-tight text-slate-950">{title}</h2>
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
        <section className="space-y-4">
            <SectionHeading title="Make the call" description="Answer before reading on. Your first instinct is useful evidence."/>
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
        <section className="space-y-5">
            <SectionHeading title="What to notice"/>
            <div className="space-y-7">
                {concepts.map((concept) => (
                    <section key={concept.heading}>
                        <h3 className="m-0 text-lg font-black text-slate-950">{concept.heading}</h3>
                        <div className="mt-2 space-y-2">
                            {concept.body.map((paragraph) => <p key={paragraph} className="m-0 text-base leading-8 text-slate-700">{paragraph}</p>)}
                        </div>
                        <ul className="m-0 mt-3 space-y-1 pl-5 text-sm leading-6 text-slate-600">
                            {concept.moves.map((move) => <li key={move}>{move}</li>)}
                        </ul>
                    </section>
                ))}
            </div>
        </section>
    );
}

function ChoiceAudit({example}) {
    const [revealed, setRevealed] = useState(false);
    return (
        <section className="space-y-4">
            <SectionHeading title="Worked example" description="Predict first, then compare the evidence behind all four choices."/>
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
        <section className="space-y-4">
            <SectionHeading title="Remember this"/>
            <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-4 sm:px-5">
                <p className="m-0 text-xs font-black uppercase tracking-wide text-primary-700">The rule</p>
                <p className="m-0 mt-1 font-serif text-lg font-bold leading-8 text-slate-950">{takeaways.rule}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <p className="m-0 text-sm font-black text-amber-800">For 700+</p>
                    <p className="m-0 mt-1 text-sm leading-7 text-slate-700">{takeaways.highScore}</p>
                </div>
                <div>
                    <p className="m-0 text-sm font-black text-slate-950">Before you commit</p>
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
        <section className="space-y-5">
            <SectionHeading title={set.title} description={set.intro}/>
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

function TransferPrompt({reflection}) {
    return (
        <section className="border-t border-slate-200 pt-6">
            <h2 className="m-0 text-base font-black text-slate-950">Before you move on</h2>
            <p className="m-0 mt-2 text-sm leading-7 text-slate-700">{reflection.prompt}</p>
        </section>
    );
}

export default function EnglishStudyGuideLessonPage({lesson, module, moduleNumber, pageIndex}) {
    const previous = module.pages[pageIndex - 1];
    const next = module.pages[pageIndex + 1];

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO title={`${lesson.title} | SAT English Study Guide`} description={lesson.summary} path={`/study_guides/${lesson.slug}`} noindex/>
            <PageContainer className="max-w-5xl">
                <Link to="/study_guides?subject=english" className="mb-4 inline-flex items-center gap-2 text-sm font-black text-slate-500 no-underline hover:text-primary-700"><ArrowLeft className="size-4"/> English study guide</Link>
                <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-5 py-6 text-slate-700 sm:px-10 sm:py-9">
                    <header className="border-b border-slate-200 pb-4">
                        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-black uppercase tracking-wide text-primary-700">
                            <span>Module {moduleNumber}: {module.title}</span>
                            <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="size-3.5"/> {lesson.minutes}</span>
                        </p>
                        <h1 className="m-0 mt-2 font-serif text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">{lesson.title}</h1>
                    </header>

                    <main className="mt-6 space-y-11">
                        <OpeningCheck key={`${lesson.slug}-check`} check={lesson.openingCheck}/>
                        <Concepts concepts={lesson.concepts}/>
                        <ChoiceAudit key={`${lesson.slug}-audit`} example={lesson.workedExample}/>
                        <KeepTheRule takeaways={lesson.takeaways}/>
                        <PracticeSet key={`${lesson.slug}-practice`} set={lesson.practiceSet}/>
                        <TransferPrompt reflection={lesson.reflection}/>

                        <nav className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2" aria-label="Lesson navigation">
                            {previous ? <Link to={`/study_guides/${previous.slug}`} className="group rounded-xl border border-slate-200 p-4 no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="flex items-center gap-1 text-xs font-black uppercase tracking-wide text-slate-500"><ChevronLeft className="size-3.5"/> Previous lesson</span><span className="mt-1 block font-black text-slate-950">{previous.title}</span></Link> : <div/>}
                            {next ? <Link to={`/study_guides/${next.slug}`} className="group rounded-xl border border-slate-200 p-4 text-right no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="flex items-center justify-end gap-1 text-xs font-black uppercase tracking-wide text-slate-500">Next lesson <ArrowRight className="size-3.5"/></span><span className="mt-1 block font-black text-slate-950">{next.title}</span></Link> : <Link to="/study_guides?subject=english" className="rounded-xl border border-slate-200 p-4 text-right no-underline hover:border-primary-300 hover:bg-primary-50/40"><span className="text-xs font-black uppercase tracking-wide text-slate-500">Module complete</span><span className="mt-1 block font-black text-slate-950">Return to curriculum</span></Link>}
                        </nav>
                    </main>
                </article>
            </PageContainer>
        </div>
    );
}
