import React, {useState} from 'react';
import {
    BookOpen,
    Calculator,
    CircleDot,
    Compass,
    Flame,
    FunctionSquare,
    LineChart,
    Lock,
    Play,
    Sigma,
    Target,
    Triangle,
} from 'lucide-react';
import SEO from '../components/SEO';
import {Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';

const MODULES = [
    {
        id: 'math-map',
        status: 'draft',
        domain: 'Orientation',
        title: 'The Digital SAT Math Map',
        summary: 'Understand the Math section format, domain weights, question types, and how to use practice data.',
        icon: Compass,
        accent: 'bg-primary-100 text-primary-700',
        time: '12 min',
        pages: [
            {
                title: 'How Digital SAT Math Works',
                summary: 'The Math section has two adaptive modules, calculator access throughout, and both multiple-choice and student-produced response questions.',
            },
            {
                title: 'The Four Math Domains',
                summary: 'Algebra and Advanced Math are the highest-frequency domains, while Data Analysis and Geometry/Trig appear in smaller but important clusters.',
            },
            {
                title: 'How to Study With SAT Duel',
                summary: 'Use each guide page as a short concept lesson, then answer a checkpoint and finish with targeted practice questions.',
            },
        ],
        checkpoint: {
            prompt: 'On the Digital SAT, which Math setup is current?',
            choices: [
                'One no-calculator module and one calculator module',
                'Two Math modules with calculator allowed throughout',
                'One long 80-minute Math section',
                'Only multiple-choice questions',
            ],
            answer: 1,
            explanation: 'The current Digital SAT Math section has two modules, and calculator use is allowed throughout.',
        },
        desmos: {
            title: 'Desmos warm-up',
            prompt: 'Graph y = 2x + 3, then change 3 to -1 and describe what moved.',
        },
    },
    {
        id: 'linear-equations',
        status: 'draft',
        domain: 'Algebra',
        title: 'Linear Equations and Systems',
        summary: 'Solve equations and systems cleanly, then connect each algebra step to a graph or word problem.',
        icon: Sigma,
        accent: 'bg-cyan-100 text-cyan-700',
        time: '35 min',
        pages: [
            {
                title: 'One-Variable Equations',
                summary: 'Move terms with discipline so simple equations, fractions, and parentheses do not create avoidable mistakes.',
            },
            {
                title: 'Systems as Intersections',
                summary: 'Treat a system as two relationships that meet at one solution, whether you solve by algebra or graphing.',
            },
            {
                title: 'Substitution vs. Elimination',
                summary: 'Choose substitution when one variable is already isolated and elimination when coefficients line up naturally.',
            },
            {
                title: 'Linear Word Problems',
                summary: 'Translate rates, totals, and constraints into equations before worrying about the arithmetic.',
            },
        ],
        checkpoint: {
            prompt: 'If 3x + 7 = 22, what is x?',
            choices: ['3', '5', '7', '15'],
            answer: 1,
            explanation: 'Subtract 7 from both sides to get 3x = 15, then divide by 3. x = 5.',
        },
        desmos: {
            title: 'Intersection lab',
            prompt: 'Graph y = 3x + 7 and y = 22; the x-coordinate of the intersection is the solution.',
        },
    },
    {
        id: 'linear-functions',
        status: 'draft',
        domain: 'Algebra',
        title: 'Linear Functions and Slope',
        summary: 'Read slope, intercepts, and tables as real rates instead of memorized graph vocabulary.',
        icon: LineChart,
        accent: 'bg-emerald-100 text-emerald-700',
        time: '32 min',
        pages: [
            {
                title: 'Slope as Rate of Change',
                summary: 'Use change in y over change in x to connect graphs, tables, and real-world units.',
            },
            {
                title: 'Intercepts as Starting Values',
                summary: 'Interpret y-intercepts and x-intercepts as meaningful values in a model, not just points on a graph.',
            },
            {
                title: 'Tables to Equations',
                summary: 'Find constant change in a table and convert it into a linear equation.',
            },
            {
                title: 'Parallel and Perpendicular Lines',
                summary: 'Use slope relationships to recognize line geometry quickly on coordinate-plane questions.',
            },
        ],
        checkpoint: {
            prompt: 'A line passes through (0, 4) and (2, 10). What is its slope?',
            choices: ['2', '3', '4', '6'],
            answer: 1,
            explanation: 'Slope is change in y divided by change in x: (10 - 4) / (2 - 0) = 3.',
        },
        desmos: {
            title: 'Slope slider',
            prompt: 'Graph y = ax + 4 and use a slider for a to see how steepness changes.',
        },
    },
    {
        id: 'advanced-functions',
        status: 'outline',
        domain: 'Advanced Math',
        title: 'Quadratics, Exponentials, and Nonlinear Forms',
        summary: 'Move between forms of nonlinear expressions so you can choose the fastest path on test day.',
        icon: FunctionSquare,
        accent: 'bg-amber-100 text-amber-700',
        time: '55 min',
        pages: [
            {
                title: 'Quadratic Forms',
                summary: 'Connect standard, factored, and vertex form to the specific feature each form reveals.',
            },
            {
                title: 'Zeros and Graphs',
                summary: 'Use roots, intercepts, and vertex information to understand what a quadratic graph is saying.',
            },
            {
                title: 'Exponential Growth and Decay',
                summary: 'Recognize repeated multiplication, percent change, and growth factors in context.',
            },
            {
                title: 'Equivalent Expressions',
                summary: 'Factor, expand, and simplify expressions to expose the SAT answer choice that matches.',
            },
            {
                title: 'Function Notation',
                summary: 'Read f(x), inputs, outputs, and compositions as instructions rather than symbols to fear.',
            },
        ],
    },
    {
        id: 'data-analysis',
        status: 'outline',
        domain: 'Problem-Solving and Data Analysis',
        title: 'Ratios, Percentages, Units, and Data',
        summary: 'Strip real-world questions down to units, comparisons, and data relationships.',
        icon: Target,
        accent: 'bg-rose-100 text-rose-700',
        time: '45 min',
        pages: [
            {
                title: 'Ratios and Unit Conversion',
                summary: 'Track units through each step so conversion problems become mechanical.',
            },
            {
                title: 'Percent Change',
                summary: 'Separate percent of, percent more, and percent less before choosing an operation.',
            },
            {
                title: 'Tables and Conditional Percentages',
                summary: 'Use row, column, and total counts to avoid mixing up the denominator.',
            },
            {
                title: 'Summary Statistics',
                summary: 'Interpret mean, median, range, and spread as descriptions of a data set.',
            },
            {
                title: 'Scatterplots and Models',
                summary: 'Read trend, association, and model fit without overclaiming what the graph proves.',
            },
        ],
    },
    {
        id: 'geometry-trig',
        status: 'outline',
        domain: 'Geometry and Trigonometry',
        title: 'Geometry and Right-Triangle Trig',
        summary: 'Keep diagrams organized and use formulas only after identifying the structure of the figure.',
        icon: Triangle,
        accent: 'bg-violet-100 text-violet-700',
        time: '50 min',
        pages: [
            {
                title: 'Angles, Lines, and Triangles',
                summary: 'Use parallel lines, triangle sums, and similarity to fill in missing measures.',
            },
            {
                title: 'Circles',
                summary: 'Connect radius, diameter, circumference, area, arcs, sectors, and circle equations.',
            },
            {
                title: 'Area and Volume',
                summary: 'Match the shape to the correct formula and watch for unit changes.',
            },
            {
                title: 'Coordinate Geometry',
                summary: 'Use distance, midpoint, slope, and equations to turn geometry into algebra.',
            },
            {
                title: 'Right-Triangle Trig',
                summary: 'Use sine, cosine, and tangent as side-ratio tools for right triangles.',
            },
        ],
    },
    {
        id: 'desmos-strategy',
        status: 'outline',
        domain: 'Strategy',
        title: 'Desmos and Calculator Tactics',
        summary: 'Use the graphing calculator intentionally without letting it slow down questions that algebra can finish faster.',
        icon: Calculator,
        accent: 'bg-slate-100 text-slate-700',
        time: '30 min',
        pages: [
            {
                title: 'When Graphing Beats Algebra',
                summary: 'Use Desmos for intersections, visual comparisons, and messy equations where graphing is faster.',
            },
            {
                title: 'Tables and Answer Testing',
                summary: 'Use table values to test answer choices and confirm function behavior quickly.',
            },
            {
                title: 'Regression and Data Caution',
                summary: 'Use calculator tools for models while still checking whether the interpretation makes sense.',
            },
            {
                title: 'Calculator Traps',
                summary: 'Avoid spending thirty seconds graphing a question that one clean algebra step would finish.',
            },
        ],
    },
    {
        id: 'mixed-rounds',
        status: 'outline',
        domain: 'Review',
        title: 'Mixed Review and Finish Rounds',
        summary: 'Turn topic knowledge into test behavior through mixed sets, timing practice, and mistake review.',
        icon: Flame,
        accent: 'bg-orange-100 text-orange-700',
        time: '60 min',
        pages: [
            {
                title: 'Mixed 10-Question Sets',
                summary: 'Practice switching topics quickly, because the real test does not label each question for you.',
            },
            {
                title: 'Error Log Review',
                summary: 'Categorize misses by cause so your next session attacks the right weakness.',
            },
            {
                title: 'Timing Without Rushing',
                summary: 'Learn when to skip, estimate, or solve fully based on question difficulty and remaining time.',
            },
            {
                title: 'Hard Module 2 Survival',
                summary: 'Use structure, answer choices, and calculator checks to stay calm on harder second-module questions.',
            },
            {
                title: 'Full-Test Handoff',
                summary: 'Move from SAT Duel practice into a Bluebook practice test when your weak domains are stable.',
            },
        ],
    },
];

function ModuleButton({module, active, locked, onClick}) {
    const Icon = module.icon;
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'w-full cursor-pointer rounded-xl border px-3 py-3 text-left transition-colors',
                active
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50',
            ].join(' ')}
        >
            <div className="flex items-start gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${module.accent}`}>
                    <Icon className="size-4.5"/>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-black text-slate-950">{module.title}</span>
                        {locked && <Lock className="size-3.5 shrink-0 text-slate-400"/>}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                        {module.domain} · {module.pages.length} pages
                    </span>
                </span>
            </div>
        </button>
    );
}

function Checkpoint({checkpoint}) {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;

    if (!checkpoint) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
                <p className="m-0 text-sm font-black text-slate-900">Checkpoint coming soon</p>
                <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">
                    This module will get a short SAT-style question after the lesson draft is written.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
                <CircleDot className="size-4 text-primary-600"/>
                <p className="m-0 text-xs font-black uppercase text-primary-700">Checkpoint</p>
            </div>
            <h3 className="m-0 mt-3 text-base font-black text-slate-950">{checkpoint.prompt}</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {checkpoint.choices.map((choice, index) => {
                    const correct = answered && index === checkpoint.answer;
                    const wrong = answered && picked === index && index !== checkpoint.answer;
                    return (
                        <button
                            key={choice}
                            type="button"
                            onClick={() => setPicked(index)}
                            className={[
                                'cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors',
                                correct ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : '',
                                wrong ? 'border-rose-300 bg-rose-50 text-rose-800' : '',
                                !correct && !wrong ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-primary-300' : '',
                            ].join(' ')}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                    {checkpoint.explanation}
                </div>
            )}
        </div>
    );
}

function DesmosLab({desmos}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="m-0 text-xs font-black uppercase text-slate-400">Desmos lab</p>
                    <h3 className="m-0 mt-1 text-base font-black text-slate-950">{desmos?.title || 'Graph lab coming soon'}</h3>
                    <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">
                        {desmos?.prompt || 'This module will include a guided graphing task where the student changes a parameter and explains what moved.'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                    <Calculator className="size-4"/>
                    {open ? 'Hide graph' : 'Open graph'}
                </button>
            </div>
            {open && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <iframe
                        title="Desmos graphing calculator"
                        src="https://www.desmos.com/calculator?embed"
                        className="h-[360px] w-full border-0"
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
}

function ModuleSection({module, index, locked}) {
    const Icon = module.icon;

    if (locked) {
        return (
            <Card id={`module-${module.id}`} className="scroll-mt-6 overflow-hidden">
                <div className="border-b border-slate-100 bg-white px-5 py-5">
                    <div className="flex gap-3">
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${module.accent}`}>
                            <Icon className="size-5"/>
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Module {index + 1} · {module.domain}</p>
                            <h2 className="m-0 mt-1 font-display text-2xl font-black text-slate-950">{module.title}</h2>
                            <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{module.summary}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 px-5 py-6">
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <Lock className="size-5"/>
                                </span>
                                <div>
                                    <p className="m-0 font-black text-slate-950">Only for Premium members</p>
                                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">
                                        Upgrade to unlock this module, its lesson pages, checkpoints, and graph labs.
                                    </p>
                                </div>
                            </div>
                            <Button to="/upgrade" size="sm" variant="secondary">
                                Upgrade
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card id={`module-${module.id}`} className="scroll-mt-6 overflow-hidden">
            <div className="border-b border-slate-100 bg-white px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${module.accent}`}>
                            <Icon className="size-5"/>
                        </span>
                        <div>
                            <p className="m-0 text-xs font-black uppercase text-primary-700">Module {index + 1} · {module.domain}</p>
                            <h2 className="m-0 mt-1 font-display text-2xl font-black text-slate-950">{module.title}</h2>
                            <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{module.summary}</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase text-slate-500">
                        {module.status === 'draft' ? <Play className="size-3.5"/> : <CircleDot className="size-3.5"/>}
                        {module.status === 'draft' ? 'Drafted' : 'Planned'}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="m-0 font-display text-lg font-black text-slate-950">Pages</h3>
                <div className="mt-4 space-y-3">
                    {module.pages.map((page, index) => (
                        <div key={page.title} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                                {index + 1}
                            </span>
                            <div>
                                <p className="m-0 font-black text-slate-950">{page.title}</p>
                                <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">{page.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                    <Checkpoint checkpoint={module.checkpoint}/>
                    <DesmosLab desmos={module.desmos}/>
                </div>
            </div>
        </Card>
    );
}

export default function StudyGuidePage() {
    const {user} = useAuth();
    const [activeId, setActiveId] = useState(MODULES[0].id);
    const isPremium = Boolean(user?.is_premium);
    const pageCount = MODULES.reduce((total, module) => total + module.pages.length, 0);
    const isLocked = (index) => !isPremium && index >= 3;

    const goToModule = (moduleId) => {
        setActiveId(moduleId);
        document.getElementById(`module-${moduleId}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO
                title="SAT Math Study Guide"
                description="Interactive SAT Math study guide modules with checkpoints, Desmos labs, and practice loops."
                path="/study_guides"
                noindex
            />
            <PageContainer className="max-w-7xl">
                <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="m-0 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
                            <BookOpen className="size-4"/> Study Guide
                        </p>
                        <h1 className="m-0 mt-2 font-display text-3xl font-black text-slate-950 sm:text-4xl">
                            SAT Math
                        </h1>
                        <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                            {MODULES.length} modules and {pageCount} planned pages. The first three modules are free.
                        </p>
                    </div>
                    <Button to="/infinite_questions" size="sm">
                        Practice questions
                    </Button>
                </header>

                <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <Card className="p-3">
                            <div className="px-2 py-2">
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Modules</p>
                            </div>
                            <div className="space-y-1">
                                {MODULES.map((module, index) => (
                                    <ModuleButton
                                        key={module.id}
                                        module={module}
                                        active={module.id === activeId}
                                        locked={isLocked(index)}
                                        onClick={() => goToModule(module.id)}
                                    />
                                ))}
                            </div>
                        </Card>
                    </aside>

                    <main className="space-y-5">
                        {MODULES.map((module, index) => (
                            <ModuleSection
                                key={module.id}
                                module={module}
                                index={index}
                                locked={isLocked(index)}
                            />
                        ))}
                    </main>
                </div>
            </PageContainer>
        </div>
    );
}
