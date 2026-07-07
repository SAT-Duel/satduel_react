import React, {useMemo, useState} from 'react';
import {
    ArrowRight,
    BookOpenCheck,
    Calculator,
    CheckCircle2,
    CircleDot,
    Compass,
    Flame,
    FunctionSquare,
    LineChart,
    Lock,
    Play,
    Route,
    Sigma,
    Target,
    Triangle,
} from 'lucide-react';
import SEO from '../components/SEO';
import {Button, Card, PageContainer} from '../components/ui';

const MODULES = [
    {
        id: 'math-map',
        status: 'ready',
        domain: 'Orientation',
        title: 'The Digital SAT Math Map',
        short: 'Format, scoring signals, and how to study.',
        icon: Compass,
        accent: 'bg-primary-100 text-primary-700',
        time: '12 min',
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
            prompt: 'Open the calculator and graph y = 2x + 3. Drag the graph mentally: what changes if the 3 becomes -1?',
        },
        lessons: [
            'What the two adaptive Math modules feel like',
            'Multiple choice vs. student-produced response questions',
            'How to use SAT Duel: read, checkpoint, graph lab, practice set',
            'When to use Desmos and when mental algebra is faster',
        ],
    },
    {
        id: 'linear-equations',
        status: 'ready',
        domain: 'Algebra',
        title: 'Linear Equations and Systems',
        short: 'Solve, substitute, eliminate, and interpret.',
        icon: Sigma,
        accent: 'bg-cyan-100 text-cyan-700',
        time: '35 min',
        checkpoint: {
            prompt: 'If 3x + 7 = 22, what is x?',
            choices: ['3', '5', '7', '15'],
            answer: 1,
            explanation: 'Subtract 7 from both sides to get 3x = 15, then divide by 3. x = 5.',
        },
        desmos: {
            title: 'Intersection lab',
            prompt: 'Graph y = 3x + 7 and y = 22. The x-coordinate of the intersection is the solution.',
        },
        lessons: [
            'One-variable equations and expression discipline',
            'Systems as intersections',
            'Choosing substitution vs. elimination',
            'Word problems that hide linear relationships',
        ],
    },
    {
        id: 'linear-functions',
        status: 'ready',
        domain: 'Algebra',
        title: 'Linear Functions and Slope',
        short: 'Rates, intercepts, tables, and graphs.',
        icon: LineChart,
        accent: 'bg-emerald-100 text-emerald-700',
        time: '32 min',
        checkpoint: {
            prompt: 'A line passes through (0, 4) and (2, 10). What is its slope?',
            choices: ['2', '3', '4', '6'],
            answer: 1,
            explanation: 'Slope is change in y divided by change in x: (10 - 4) / (2 - 0) = 3.',
        },
        desmos: {
            title: 'Slope slider',
            prompt: 'Graph y = ax + 4 and use a slider for a. Watch how the steepness changes.',
        },
        lessons: [
            'Slope as rate of change',
            'Intercepts as starting values',
            'Reading linear models from tables',
            'Parallel and perpendicular line traps',
        ],
    },
    {
        id: 'advanced-functions',
        status: 'outline',
        domain: 'Advanced Math',
        title: 'Quadratics, Exponentials, and Nonlinear Forms',
        short: 'Factor, expand, complete the square, and compare growth.',
        icon: FunctionSquare,
        accent: 'bg-amber-100 text-amber-700',
        time: '55 min',
        lessons: [
            'Quadratic forms: standard, factored, vertex',
            'Zeros, vertex, and graph interpretation',
            'Exponential growth and decay',
            'Polynomial expressions and equivalent forms',
            'Rational and radical expression cleanup',
        ],
    },
    {
        id: 'data-analysis',
        status: 'outline',
        domain: 'Problem-Solving and Data Analysis',
        title: 'Ratios, Percentages, Units, and Data',
        short: 'Translate real-world context into clean math.',
        icon: Target,
        accent: 'bg-rose-100 text-rose-700',
        time: '45 min',
        lessons: [
            'Rates and unit conversion',
            'Percent change vs. percent of',
            'Two-way tables and conditional percentages',
            'Mean, median, range, and standard deviation intuition',
            'Scatterplots, trend lines, and model fit',
        ],
    },
    {
        id: 'geometry-trig',
        status: 'outline',
        domain: 'Geometry and Trigonometry',
        title: 'Geometry and Right-Triangle Trig',
        short: 'Angles, circles, area, volume, and sine/cosine basics.',
        icon: Triangle,
        accent: 'bg-violet-100 text-violet-700',
        time: '50 min',
        lessons: [
            'Lines, angles, triangles, and similarity',
            'Circle equations, arcs, sectors, and tangents',
            'Area and volume formulas as shortcuts',
            'Right-triangle trigonometry',
            'Coordinate geometry and distance',
        ],
    },
    {
        id: 'desmos-strategy',
        status: 'outline',
        domain: 'Strategy',
        title: 'Desmos and Calculator Tactics',
        short: 'Use graphing without becoming calculator-dependent.',
        icon: Calculator,
        accent: 'bg-slate-100 text-slate-700',
        time: '30 min',
        lessons: [
            'When graphing beats algebra',
            'Solving systems by intersection',
            'Testing answer choices with tables',
            'Regression and scatterplot caution',
            'Calculator traps that waste time',
        ],
    },
    {
        id: 'mixed-rounds',
        status: 'outline',
        domain: 'Review',
        title: 'Mixed Review and Boss Rounds',
        short: 'SAT-style blends, timing, and final review loops.',
        icon: Flame,
        accent: 'bg-orange-100 text-orange-700',
        time: '60 min',
        lessons: [
            'Mixed 10-question practice sets',
            'Error log review',
            'Timing without rushing',
            'Module 2 hard-question survival',
            'Full test handoff plan',
        ],
    },
];

const ROADMAP = [
    {
        unit: 'Unit 1',
        title: 'Algebra Core',
        weight: 'High frequency',
        modules: ['Linear equations', 'Systems', 'Linear functions', 'Inequalities'],
    },
    {
        unit: 'Unit 2',
        title: 'Advanced Math',
        weight: 'High frequency',
        modules: ['Quadratics', 'Functions', 'Equivalent expressions', 'Exponential models'],
    },
    {
        unit: 'Unit 3',
        title: 'Data and Modeling',
        weight: 'Medium frequency',
        modules: ['Rates', 'Percentages', 'Tables', 'Statistics', 'Scatterplots'],
    },
    {
        unit: 'Unit 4',
        title: 'Geometry and Trig',
        weight: 'Medium frequency',
        modules: ['Triangles', 'Circles', 'Area and volume', 'Coordinate geometry', 'Right-triangle trig'],
    },
    {
        unit: 'Unit 5',
        title: 'SAT Duel Review Loop',
        weight: 'Every week',
        modules: ['Desmos tactics', 'Mistake patterns', 'Mixed rounds', 'Timed finishers'],
    },
];

const OFFICIAL_DOMAINS = [
    {label: 'Algebra', range: '13-15', focus: 'Linear equations, systems, inequalities, and linear functions'},
    {label: 'Advanced Math', range: '13-15', focus: 'Quadratics, nonlinear functions, expressions, and models'},
    {label: 'Problem-Solving and Data Analysis', range: '5-7', focus: 'Ratios, percentages, units, statistics, and scatterplots'},
    {label: 'Geometry and Trigonometry', range: '5-7', focus: 'Shapes, circles, area, volume, coordinate geometry, and right triangles'},
];

const DETAILED_OUTLINE = [
    {
        title: '1. Orientation: How SAT Math Is Built',
        domain: 'Setup',
        objective: 'Students understand the two-module format, the four College Board domains, and how SAT Duel turns studying into a loop.',
        lessons: ['Two adaptive Math modules', 'Calculator allowed throughout', 'Multiple choice vs. grid-in strategy', 'How to read score-domain feedback'],
        interactions: ['One format checkpoint', 'Mini diagnostic handoff', 'Desmos warm-up graph'],
    },
    {
        title: '2. Algebra Core',
        domain: 'Algebra',
        objective: 'Make linear work automatic: equations, systems, slopes, inequalities, and word-problem translation.',
        lessons: ['One-variable equations', 'Systems by substitution/elimination', 'Slope and intercept meaning', 'Linear inequalities and constraints'],
        interactions: ['Equation checkpoint after each lesson', 'Desmos intersection lab', '10-question Algebra practice set'],
    },
    {
        title: '3. Advanced Math',
        domain: 'Advanced Math',
        objective: 'Build fluency with equivalent forms so students can choose the fastest representation.',
        lessons: ['Quadratic forms and zeros', 'Completing the square', 'Exponential growth/decay', 'Rational/radical cleanup', 'Function notation'],
        interactions: ['Form-matching checkpoints', 'Quadratic slider lab', 'Mixed nonlinear practice set'],
    },
    {
        title: '4. Data, Units, and Modeling',
        domain: 'Problem-Solving and Data Analysis',
        objective: 'Train students to strip word problems down to units, rates, tables, and clean comparisons.',
        lessons: ['Percent change vs. percent of', 'Ratios and unit conversion', 'Two-way tables', 'Mean/median/spread', 'Scatterplot trend lines'],
        interactions: ['Table interpretation checkpoint', 'Regression caution lab', 'Context-heavy practice set'],
    },
    {
        title: '5. Geometry and Trig',
        domain: 'Geometry and Trigonometry',
        objective: 'Keep formulas visual and fast, with special attention to triangles, circles, and coordinate setups.',
        lessons: ['Similarity and angle chasing', 'Circle equations and sectors', 'Area/volume shortcuts', 'Distance/midpoint', 'Sine, cosine, tangent'],
        interactions: ['Diagram checkpoint', 'Circle/line graph lab', 'Formula-recall quick round'],
    },
    {
        title: '6. SAT Duel Finish Loop',
        domain: 'Review',
        objective: 'Convert knowledge into test behavior: timing, error review, and domain-targeted practice.',
        lessons: ['When to use Desmos', 'When algebra is faster', 'Hard Module 2 tactics', 'Mistake-log patterns', 'Full test handoff'],
        interactions: ['Mixed review boss round', 'Error-log reflection', 'Bluebook practice-test plan'],
    },
];

function ModuleButton({module, active, onClick}) {
    const Icon = module.icon;
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'w-full cursor-pointer rounded-2xl border p-4 text-left transition-all',
                active
                    ? 'border-primary-300 bg-primary-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50',
            ].join(' ')}
        >
            <div className="flex items-start gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${module.accent}`}>
                    <Icon className="size-5"/>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-black text-slate-950">{module.title}</span>
                        {module.status !== 'ready' && <Lock className="size-3.5 shrink-0 text-slate-400"/>}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">{module.domain} · {module.time}</span>
                </span>
            </div>
        </button>
    );
}

function DomainCoverageCard() {
    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="m-0 text-sm font-black uppercase text-slate-400">Official SAT Math map</p>
                    <p className="m-0 mt-1 text-sm font-semibold text-slate-600">Question ranges per full Math section.</p>
                </div>
                <span className="sat-answer-bubble inline-flex size-10 items-center justify-center rounded-full bg-white text-sm font-black text-primary-700">
                    4
                </span>
            </div>
            <div className="mt-5 space-y-3">
                {OFFICIAL_DOMAINS.map((domain) => (
                    <div key={domain.label} className="rounded-2xl bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="m-0 text-sm font-black text-slate-950">{domain.label}</p>
                                <p className="m-0 mt-1 text-xs leading-relaxed text-slate-500">{domain.focus}</p>
                            </div>
                            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-black text-primary-700">
                                {domain.range} Qs
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Checkpoint({checkpoint}) {
    const [picked, setPicked] = useState(null);
    const answered = picked !== null;

    if (!checkpoint) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="m-0 text-sm font-black uppercase text-slate-400">Checkpoint template</p>
                <p className="m-0 mt-2 text-[15px] leading-relaxed text-slate-600">
                    This slot will hold a short SAT-style question after the lesson draft is written.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
                <CircleDot className="size-5 text-primary-600"/>
                <p className="m-0 text-sm font-black uppercase text-primary-700">Checkpoint</p>
            </div>
            <h3 className="m-0 mt-3 text-lg font-black text-slate-950">{checkpoint.prompt}</h3>
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
                                'cursor-pointer rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors',
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
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-600">
                    {checkpoint.explanation}
                </div>
            )}
        </div>
    );
}

function DesmosLab({desmos}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
                <div>
                    <p className="m-0 text-xs font-black uppercase text-cyan-200">Desmos lab</p>
                    <h3 className="m-0 mt-1 font-display text-lg font-black">{desmos?.title || 'Graph lab template'}</h3>
                </div>
                <Calculator className="size-6 text-cyan-200"/>
            </div>
            <div className="p-5">
                <p className="m-0 text-sm font-semibold leading-relaxed text-slate-600">
                    {desmos?.prompt || 'This module will include a guided graphing task where the student changes a parameter and explains what moved.'}
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <iframe
                        title="Desmos graphing calculator"
                        src="https://www.desmos.com/calculator?embed"
                        className="h-[360px] w-full border-0"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
}

function RoadmapCard({item}) {
    return (
        <Card className="sat-arena-card p-5">
            <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-black uppercase text-primary-700">{item.unit}</span>
                <span className="text-xs font-black uppercase text-slate-400">{item.weight}</span>
            </div>
            <h3 className="m-0 mt-4 font-display text-xl font-black text-slate-950">{item.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
                {item.modules.map((module) => (
                    <span key={module} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {module}
                    </span>
                ))}
            </div>
        </Card>
    );
}

function OutlineStep({step}) {
    return (
        <Card className="sat-arena-card overflow-hidden">
            <div className="sat-score-strip flex items-center justify-between gap-3 px-5 py-3">
                <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-black uppercase text-primary-800">
                    {step.domain}
                </span>
                <CheckCircle2 className="size-5 text-primary-800"/>
            </div>
            <div className="p-5">
                <h3 className="m-0 font-display text-xl font-black text-slate-950">{step.title}</h3>
                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{step.objective}</p>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-400">Lesson sequence</p>
                        <div className="mt-3 space-y-2">
                            {step.lessons.map((lesson) => (
                                <div key={lesson} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                                    <CircleDot className="size-4 shrink-0 text-primary-500"/>
                                    {lesson}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="m-0 text-xs font-black uppercase text-slate-400">Interactive slots</p>
                        <div className="mt-3 space-y-2">
                            {step.interactions.map((interaction) => (
                                <div key={interaction} className="flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800">
                                    <Play className="size-4 shrink-0"/>
                                    {interaction}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default function StudyGuidePage() {
    const [activeId, setActiveId] = useState(MODULES[0].id);
    const activeModule = useMemo(
        () => MODULES.find((module) => module.id === activeId) || MODULES[0],
        [activeId],
    );
    const completedCount = MODULES.filter((module) => module.status === 'ready').length;

    return (
        <div className="sat-bubble-field min-h-screen py-6 sm:py-8">
            <SEO
                title="SAT Math Study Guide"
                description="Interactive SAT Math study guide modules with checkpoints, Desmos labs, and practice loops."
                path="/study_guides"
                noindex
            />
            <PageContainer className="max-w-7xl">
                <section className="sat-arena-card overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.7fr] lg:p-8">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black uppercase text-white">
                                <BookOpenCheck className="size-4 text-cyan-300"/> Math Study Guide
                            </span>
                            <h1 className="m-0 mt-5 max-w-3xl font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                                Learn the SAT Math map, then practice the exact move.
                            </h1>
                            <p className="m-0 mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                                A Brilliant-style path for SAT Duel: short concept pages, checkpoint questions,
                                Desmos graph labs, and practice handoffs that turn reading into reps.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button to="/infinite_questions">
                                    Practice after reading <ArrowRight className="size-4"/>
                                </Button>
                                <Button to="/sat-math-practice" variant="secondary">
                                    Public Math overview
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center justify-between">
                                <p className="m-0 text-sm font-black uppercase text-slate-400">Beta map</p>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                                    {completedCount}/{MODULES.length} laid out
                                </span>
                            </div>
                            <div className="mt-5 grid grid-cols-4 gap-2">
                                {MODULES.map((module) => (
                                    <button
                                        key={module.id}
                                        type="button"
                                        onClick={() => setActiveId(module.id)}
                                        aria-label={module.title}
                                        className={[
                                            'h-3 cursor-pointer rounded-full transition-colors',
                                            module.id === activeId
                                                ? 'bg-primary-600'
                                                : module.status === 'ready'
                                                    ? 'bg-primary-200 hover:bg-primary-300'
                                                    : 'bg-slate-300 hover:bg-slate-400',
                                        ].join(' ')}
                                    />
                                ))}
                            </div>
                            <div className="mt-6 space-y-3">
                                {[
                                    ['Official domains', 'Algebra, Advanced Math, Data, Geometry/Trig'],
                                    ['Lesson rhythm', 'Concept → checkpoint → Desmos → practice'],
                                    ['Design model', 'Module path + interactive workbench'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl bg-white p-4">
                                        <p className="m-0 text-xs font-black uppercase text-slate-400">{label}</p>
                                        <p className="m-0 mt-1 text-sm font-bold text-slate-800">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <DomainCoverageCard/>
                    <Card className="sat-arena-card p-5">
                        <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                                <Route className="size-5"/>
                            </span>
                            <div>
                                <p className="m-0 text-sm font-black uppercase text-primary-700">Study rhythm</p>
                                <h2 className="m-0 font-display text-2xl font-black text-slate-950">Read less, do more.</h2>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-4">
                            {['Concept', 'Checkpoint', 'Desmos lab', 'Practice reps'].map((step, index) => (
                                <div key={step} className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <span className="sat-answer-bubble inline-flex size-8 items-center justify-center rounded-full bg-white text-xs font-black text-slate-500">
                                        {index + 1}
                                    </span>
                                    <p className="m-0 mt-3 text-sm font-black text-slate-950">{step}</p>
                                </div>
                            ))}
                        </div>
                        <p className="m-0 mt-5 text-sm leading-relaxed text-slate-600">
                            The page borrows the useful parts of interactive learning platforms: a clear path,
                            small lessons, immediate checks, and a workbench where the student manipulates the math.
                        </p>
                    </Card>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3">
                            <div className="px-2 py-2">
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Modules</p>
                                <p className="m-0 mt-1 text-sm font-semibold text-slate-600">Start broad, then drill the high-frequency Math moves.</p>
                            </div>
                            <div className="mt-2 space-y-2">
                                {MODULES.map((module) => (
                                    <ModuleButton
                                        key={module.id}
                                        module={module}
                                        active={module.id === activeId}
                                        onClick={() => setActiveId(module.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="space-y-6">
                        <Card className="sat-arena-card overflow-hidden">
                            <div className="border-b border-slate-200 bg-white p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="m-0 text-sm font-black uppercase text-primary-700">{activeModule.domain}</p>
                                        <h2 className="m-0 mt-2 font-display text-3xl font-black text-slate-950">{activeModule.title}</h2>
                                        <p className="m-0 mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{activeModule.short}</p>
                                    </div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase text-slate-500">
                                        {activeModule.status === 'ready' ? <Play className="size-3.5"/> : <Route className="size-3.5"/>}
                                        {activeModule.status === 'ready' ? 'Interactive draft' : 'Outline'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 xl:grid-cols-[1fr_0.95fr]">
                                <div>
                                    <h3 className="m-0 font-display text-xl font-black text-slate-950">Lesson beats</h3>
                                    <div className="mt-4 space-y-3">
                                        {activeModule.lessons.map((lesson, index) => (
                                            <div key={lesson} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-primary-700">
                                                    {index + 1}
                                                </span>
                                                <p className="m-0 text-sm font-semibold leading-relaxed text-slate-700">{lesson}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Checkpoint checkpoint={activeModule.checkpoint}/>
                            </div>
                        </Card>

                        <DesmosLab desmos={activeModule.desmos}/>

                        <section>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="m-0 text-sm font-black uppercase text-primary-700">Detailed course outline</p>
                                    <h2 className="m-0 mt-2 font-display text-3xl font-black text-slate-950">Math guide structure</h2>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {ROADMAP.map((item) => (
                                    <RoadmapCard key={item.unit} item={item}/>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div>
                                <p className="m-0 text-sm font-black uppercase text-primary-700">Build plan</p>
                                <h2 className="m-0 mt-2 font-display text-3xl font-black text-slate-950">Module-by-module outline</h2>
                                <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                                    This is the content skeleton we can now fill with real explanations, SAT-style examples,
                                    checkpoint items, and graph labs.
                                </p>
                            </div>
                            <div className="mt-4 space-y-4">
                                {DETAILED_OUTLINE.map((step) => (
                                    <OutlineStep key={step.title} step={step}/>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </PageContainer>
        </div>
    );
}
