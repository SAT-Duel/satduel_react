import React from 'react';
import {Link} from 'react-router-dom';
import {
    ArrowRight,
    BookOpenCheck,
    Calculator,
    CheckCircle2,
    CircleDot,
    Flame,
    LineChart,
    PartyPopper,
    Share2,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';
import SEO, {
    articleJsonLd,
    breadcrumbJsonLd,
    faqJsonLd,
    organizationJsonLd,
    seoMeta,
    softwareAppJsonLd,
} from '../../components/SEO';
import {Button, Card, PageContainer} from '../../components/ui';

const GUIDE_PAGES = {
    digitalSatPractice: {
        eyebrow: 'Digital SAT practice',
        heading: 'Practice for the Digital SAT without turning it into a worksheet marathon.',
        intro: 'SAT Duel gives you focused reps, quick feedback, and visible progress. Start with a short diagnostic, then keep practicing one question at a time.',
        cta: 'Try the free diagnostic',
        secondaryCta: 'Create a free account',
        icon: Zap,
        accent: 'text-primary-700 bg-primary-100',
        bullets: [
            'Adaptive practice questions for Math and Reading and Writing',
            'Practice Elo that moves as you answer real questions',
            'Free daily practice with Premium topic selection when you need focused drills',
        ],
        sections: [
            {
                title: 'Why one-question practice works',
                text: 'A full test is useful, but it is not always the best daily habit. Short reps lower the friction to start and make mistakes easier to review.',
            },
            {
                title: 'How SAT Duel tracks progress',
                text: 'Your practice rating changes as you answer questions. That gives you a simple signal: are today’s questions getting easier, harder, or more precise?',
            },
            {
                title: 'Where to start',
                text: 'Take the two-minute diagnostic first. It gives a quick estimate, then points you toward practice instead of leaving you with a static score.',
            },
        ],
        faq: [
            {
                question: 'Is SAT Duel free to start?',
                answer: 'Yes. You can create an account and practice for free each day. Premium unlocks unlimited practice and topic selection.',
            },
            {
                question: 'Does SAT Duel replace full-length practice tests?',
                answer: 'No. Full-length tests are still useful. SAT Duel is built for daily reps, targeted review, and keeping momentum between tests.',
            },
        ],
        related: ['satMath', 'satReadingWriting', 'scoreGuide'],
    },
    satReadingWriting: {
        eyebrow: 'Reading and Writing',
        heading: 'Build Reading and Writing skill one passage, sentence, and choice at a time.',
        intro: 'Digital SAT Reading and Writing rewards careful reading, precise grammar, and quick recognition of question type. SAT Duel helps you practice those pieces without losing the thread.',
        cta: 'Practice Reading and Writing',
        secondaryCta: 'Take the diagnostic',
        icon: BookOpenCheck,
        accent: 'text-cyan-700 bg-cyan-100',
        bullets: [
            'Words in Context, transitions, command of evidence, and grammar practice',
            'Short explanations that focus on why the right answer wins',
            'Topic selection for students who want targeted Premium drills',
        ],
        sections: [
            {
                title: 'Read the question before the choices',
                text: 'Most misses come from answering the vibe of the sentence instead of the task. SAT Duel keeps each prompt focused so the skill is easier to name.',
            },
            {
                title: 'Review wrong answers as patterns',
                text: 'A single miss is not the story. Repeated misses in transitions, boundaries, or evidence questions tell you exactly what to drill next.',
            },
            {
                title: 'Keep the session short enough to repeat',
                text: 'Ten thoughtful questions every day usually beats one heroic cram session that you never want to repeat.',
            },
        ],
        faq: [
            {
                question: 'What Reading and Writing topics can I practice?',
                answer: 'SAT Duel includes Digital SAT-style Reading and Writing categories such as vocabulary, transitions, grammar, evidence, and information synthesis.',
            },
            {
                question: 'Can I choose exact Reading and Writing topics?',
                answer: 'Free practice serves a mixed set. Premium lets you choose specific topics for more focused drills.',
            },
        ],
        related: ['wordsInContext', 'digitalSatPractice', 'scoreGuide'],
    },
    satMath: {
        eyebrow: 'SAT Math',
        heading: 'Turn SAT Math practice into a cleaner feedback loop.',
        intro: 'SAT Math improvement comes from spotting the problem type, choosing the right setup, and checking the answer without wasting motion. SAT Duel makes those reps easier to repeat.',
        cta: 'Practice SAT Math',
        secondaryCta: 'Start with a diagnostic',
        icon: Calculator,
        accent: 'text-emerald-700 bg-emerald-100',
        bullets: [
            'Algebra, advanced math, problem solving, data analysis, and geometry practice',
            'Adaptive practice that gets more useful as your rating changes',
            'A fast way to keep Math warm between full-length practice tests',
        ],
        sections: [
            {
                title: 'Name the problem type first',
                text: 'Before calculating, decide whether you are solving a linear equation, reading a graph, comparing functions, or translating a word problem.',
            },
            {
                title: 'Use mistakes as a map',
                text: 'The best Math review is not rereading every formula. It is finding the two or three question types that keep costing points.',
            },
            {
                title: 'Practice under light pressure',
                text: 'SAT Duel keeps questions short and scored, so you feel enough pressure to focus without turning every session into a full test.',
            },
        ],
        faq: [
            {
                question: 'Does SAT Duel include calculator and no-calculator style Math?',
                answer: 'SAT Duel focuses on Digital SAT-style Math practice. The Digital SAT allows calculator use throughout the Math section, so the key is choosing the right setup, not memorizing an old section split.',
            },
            {
                question: 'How should I use SAT Duel for SAT Math?',
                answer: 'Start with mixed practice, watch your misses, then use topic selection to drill the areas that show up repeatedly.',
            },
        ],
        related: ['digitalSatPractice', 'satReadingWriting', 'scoreGuide'],
    },
    wordsInContext: {
        eyebrow: 'Words in Context',
        heading: 'Vocabulary on the Digital SAT is really context reading.',
        intro: 'You do not need to memorize an endless word list to improve. For Words in Context, the surrounding sentence usually tells you what job the word must do.',
        cta: 'Drill vocabulary questions',
        secondaryCta: 'See all practice',
        icon: CircleDot,
        accent: 'text-amber-700 bg-amber-100',
        bullets: [
            'Practice questions built around sentence logic rather than flashcard guessing',
            'Look for contrast words, cause and effect, and tone clues',
            'Review explanations that show why tempting choices fail',
        ],
        sections: [
            {
                title: 'The blank has a job',
                text: 'Ask what the missing word must do in the sentence. Does it agree, contrast, intensify, weaken, or explain?',
            },
            {
                title: 'Tone matters',
                text: 'Many choices are close in dictionary meaning but wrong in tone. The SAT often rewards the word that fits the author’s attitude.',
            },
            {
                title: 'Do not overtrust familiar words',
                text: 'A familiar word can be a trap when the sentence calls for a precise relationship. Context beats recognition.',
            },
        ],
        faq: [
            {
                question: 'Should I memorize SAT vocabulary lists?',
                answer: 'Some vocabulary study can help, but Words in Context questions are mostly about using sentence clues. Practice should train that habit.',
            },
            {
                question: 'Is Words in Context part of SAT Reading and Writing?',
                answer: 'Yes. Words in Context appears in the Reading and Writing section of the Digital SAT.',
            },
        ],
        related: ['satReadingWriting', 'digitalSatPractice', 'scoreGuide'],
    },
    scoreGuide: {
        eyebrow: 'Score guide',
        heading: 'A better SAT score usually comes from a tighter practice loop.',
        intro: 'The students who improve fastest do not just answer more questions. They diagnose, drill, review, and repeat with enough consistency for the pattern to change.',
        cta: 'Get a score estimate',
        secondaryCta: 'Start practicing',
        icon: LineChart,
        accent: 'text-primary-700 bg-primary-100',
        bullets: [
            'Use diagnostics to estimate your current level',
            'Practice targeted skills instead of guessing what to study',
            'Track your streak and practice rating to keep the habit alive',
        ],
        sections: [
            {
                title: 'Step 1: get a baseline',
                text: 'A baseline tells you where to start. SAT Duel’s quick diagnostic is not a full official score, but it gives you a fast signal.',
            },
            {
                title: 'Step 2: drill the repeat misses',
                text: 'If transitions or systems of equations keep appearing in your mistakes, do not hide them inside mixed practice forever. Drill them.',
            },
            {
                title: 'Step 3: retest under real conditions',
                text: 'Use full-length official practice tests to check endurance and timing. Use SAT Duel between tests to keep the daily loop moving.',
            },
        ],
        faq: [
            {
                question: 'How quickly can I improve my SAT score?',
                answer: 'It depends on your starting point, schedule, and weak areas. A consistent practice loop usually matters more than one long cram session.',
            },
            {
                question: 'What should I do after a diagnostic?',
                answer: 'Review the misses, identify the topic pattern, then practice those skills before taking another full-length test.',
            },
        ],
        related: ['digitalSatPractice', 'satMath', 'satReadingWriting'],
    },
    partyGame: {
        eyebrow: 'Party mode',
        heading: 'The SAT, but it plays like a game show with your friends.',
        intro: 'Host a room, put the six-digit code on the board, and everyone joins from their own phone. Real Digital SAT questions, live scoreboard, twenty players at once — the studying happens on the way.',
        cta: 'Create a party room',
        ctaTo: '/party',
        secondaryCta: 'Create a free account',
        icon: PartyPopper,
        accent: 'text-emerald-700 bg-emerald-100',
        panelEyebrow: 'How party mode works',
        panelTitle: 'One code. Everyone plays.',
        loop: [
            {icon: PartyPopper, label: 'Host', text: 'Start a room in one tap.'},
            {icon: Share2, label: 'Share', text: 'Read out the 6-digit code.'},
            {icon: Zap, label: 'Play', text: 'Everyone answers together.'},
            {icon: Trophy, label: 'Rank', text: 'Live scoreboard each round.'},
        ],
        bullets: [
            'Up to 20 players in one room, joining from any phone or laptop',
            'Four game modes, including team play and a gold-rush wager round',
            'Real Digital SAT Math and Reading and Writing questions, not trivia',
        ],
        sections: [
            {
                title: 'Made for classrooms and group chats',
                text: 'Teachers use it as a warm-up, study groups use it on a call, and friends use it instead of a review session nobody wants to run. Nothing to install and no setup beyond a room code.',
            },
            {
                title: 'Competition does the motivating',
                text: 'A scoreboard that updates after every question keeps a group engaged far longer than a worksheet does. Students end up answering more questions in twenty minutes than they would alone in an hour.',
            },
            {
                title: 'The questions are the real thing',
                text: 'Party rounds pull from the same Digital SAT question bank as regular practice, so a game night still counts as studying. Every answer is explained afterwards.',
            },
        ],
        faq: [
            {
                question: 'Is this like Kahoot but for the SAT?',
                answer: 'Very close. You host a room, players join with a code from their own device, and everyone answers the same question at the same time with a live scoreboard. The difference is that every question is real Digital SAT practice with a full explanation afterward.',
            },
            {
                question: 'How many people can play at once?',
                answer: 'Up to 20 players in a single room. Everyone joins with the same six-digit code from a phone, tablet, or laptop.',
            },
            {
                question: 'Is the SAT party game free?',
                answer: 'Yes. Hosting and joining a party room are free. You only need a free SAT Duel account.',
            },
            {
                question: 'Can teachers use it with a class?',
                answer: 'Yes. Put the join code on the board, have students join from their own devices, and run a round as a warm-up or review. Team mode splits the class into groups.',
            },
        ],
        related: ['tournaments', 'digitalSatPractice', 'studyGuide'],
    },
    tournaments: {
        eyebrow: 'Tournaments',
        heading: 'Run an SAT competition for your class, club, or whole school.',
        intro: 'Create a tournament, share one join link, and watch a live leaderboard as students work through the same set of Digital SAT questions on their own schedule.',
        cta: 'Browse tournaments',
        ctaTo: '/tournaments',
        secondaryCta: 'Create a free account',
        icon: Trophy,
        accent: 'text-amber-700 bg-amber-100',
        panelEyebrow: 'How tournaments work',
        panelTitle: 'One link. Live standings.',
        loop: [
            {icon: Trophy, label: 'Create', text: 'Set the questions and window.'},
            {icon: Share2, label: 'Invite', text: 'Share one join link.'},
            {icon: Zap, label: 'Compete', text: 'Students answer anytime.'},
            {icon: LineChart, label: 'Track', text: 'Standings update live.'},
        ],
        bullets: [
            'One join link for the whole group, no accounts to set up in advance',
            'Asynchronous by design, so students compete across different schedules',
            'A live leaderboard that ranks by score and accuracy as answers land',
        ],
        sections: [
            {
                title: 'Better than assigning a worksheet',
                text: 'A tournament gives a deadline, a scoreboard, and a reason to finish. Students who ignore practice sets will often finish a tournament because their friends are on the same board.',
            },
            {
                title: 'Works for clubs and whole schools',
                text: 'Run a small bracket for an SAT club or open one to an entire grade. The leaderboard scales either way, and you can see who is participating at a glance.',
            },
            {
                title: 'Every round is still practice',
                text: 'Tournament questions come from the same Digital SAT bank as everything else, with explanations available after the round. The competition is the wrapper, not a substitute.',
            },
        ],
        faq: [
            {
                question: 'Can I run an SAT competition for my school?',
                answer: 'Yes. Create a tournament, share the join link with students, and the leaderboard tracks everyone automatically. There is no limit on how many students can join a public tournament.',
            },
            {
                question: 'Do students have to compete at the same time?',
                answer: 'No. Tournaments are asynchronous. Students answer whenever they want inside the tournament window, and the leaderboard updates as results come in.',
            },
            {
                question: 'Is it free to create a tournament?',
                answer: 'Yes. Creating and joining tournaments is free with a SAT Duel account.',
            },
        ],
        related: ['partyGame', 'digitalSatPractice', 'studyGuide'],
    },
    studyGuide: {
        eyebrow: 'Study guides',
        heading: 'The whole Digital SAT, explained in the order you should learn it.',
        intro: 'Short lessons that build on each other across Math and Reading and Writing, so you always know what to study next instead of guessing which video to watch.',
        cta: 'Open the study guides',
        ctaTo: '/study_guides',
        secondaryCta: 'Create a free account',
        icon: BookOpenCheck,
        accent: 'text-primary-700 bg-primary-100',
        panelEyebrow: "What's inside",
        panelTitle: 'Lessons in the right order.',
        loop: [
            {icon: BookOpenCheck, label: 'Learn', text: 'Read one short lesson.'},
            {icon: Zap, label: 'Apply', text: 'Practice that exact skill.'},
            {icon: CheckCircle2, label: 'Check', text: 'Review what you missed.'},
            {icon: Flame, label: 'Advance', text: 'Move to the next lesson.'},
        ],
        bullets: [
            'Math lessons covering algebra, advanced math, data analysis, and geometry',
            'Reading and Writing lessons on question types, evidence, and grammar',
            'Each lesson is short enough to finish and immediately practice',
        ],
        sections: [
            {
                title: 'Ordered, not a pile of links',
                text: 'Most SAT material is a search result away, but nothing tells you what to read first. These lessons are sequenced into modules so each one assumes only what came before it.',
            },
            {
                title: 'Built to be used next to practice',
                text: 'Every lesson maps onto skills you will meet in practice questions. Read the lesson, then drill the same skill while it is fresh.',
            },
            {
                title: 'Short on purpose',
                text: 'A lesson you finish beats a chapter you abandon. Each one covers a single idea and takes a few minutes.',
            },
        ],
        faq: [
            {
                question: 'Is the SAT study guide free?',
                answer: 'The Reading and Writing lessons and the opening Math lessons are free with an account. The full Math library is part of Premium.',
            },
            {
                question: 'What does the study guide cover?',
                answer: 'The Digital SAT Math domains — algebra, advanced math, problem solving and data analysis, and geometry and trigonometry — plus Reading and Writing question types, evidence, and grammar.',
            },
            {
                question: 'Where should I start?',
                answer: 'Take the free diagnostic first. It points you at the weakest area, and you can start with that module instead of reading front to back.',
            },
        ],
        related: ['digitalSatPractice', 'satMath', 'satReadingWriting'],
    },
};

const RELATED_LABELS = {
    digitalSatPractice: 'Digital SAT Practice',
    satReadingWriting: 'Reading and Writing',
    satMath: 'SAT Math',
    wordsInContext: 'Words in Context',
    scoreGuide: 'Score Improvement Guide',
    partyGame: 'SAT Party Game',
    tournaments: 'SAT Tournaments',
    studyGuide: 'SAT Study Guide',
};

function GuideCard({section}) {
    return (
        <Card hover className="sat-arena-card p-6">
            <h2 className="m-0 font-display text-xl font-black text-slate-950">{section.title}</h2>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-slate-600">{section.text}</p>
        </Card>
    );
}

// The four-step loop under the hero. Practice guides share the default; feature
// pages (party, tournaments, study guides) describe their own loop instead.
const DEFAULT_LOOP = [
    {icon: Target, label: 'Diagnose', text: 'Find your starting level.'},
    {icon: Zap, label: 'Practice', text: 'Answer one focused question.'},
    {icon: CheckCircle2, label: 'Review', text: 'Learn why the answer works.'},
    {icon: Flame, label: 'Repeat', text: 'Keep the streak alive.'},
];

function PracticeLoop({steps = DEFAULT_LOOP}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({icon: Icon, label, text}) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <Icon className="size-5"/>
                    </div>
                    <p className="m-0 mt-4 font-display text-lg font-black text-slate-950">{label}</p>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                </div>
            ))}
        </div>
    );
}

export default function SEOGuidePage({pageKey}) {
    const key = GUIDE_PAGES[pageKey] ? pageKey : 'digitalSatPractice';
    // Title, description, path and OG card live in src/seo/routes.js so the
    // runtime tags match what scripts/prerender.mjs writes for crawlers.
    const page = {...GUIDE_PAGES[key], ...seoMeta(key)};
    const Icon = page.icon;
    const structuredData = [
        organizationJsonLd(),
        softwareAppJsonLd(),
        articleJsonLd({
            title: page.title,
            description: page.description,
            path: page.path,
        }),
        breadcrumbJsonLd([
            {name: 'Home', path: '/'},
            {name: page.title, path: page.path},
        ]),
        faqJsonLd(page.faq),
    ];

    return (
        <div>
            <SEO seoKey={key} structuredData={structuredData}/>

            <section className="sd-hero-bg overflow-hidden border-b border-[var(--sd-line)]">
                <PageContainer className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${page.accent}`}>
                            <Icon className="size-4"/> {page.eyebrow}
                        </span>
                        <h1 className="m-0 mt-5 max-w-3xl font-display text-4xl font-black leading-tight text-[var(--sd-text)] sm:text-5xl">
                            {page.heading}
                        </h1>
                        <p className="m-0 mt-5 max-w-2xl text-lg leading-relaxed text-[var(--sd-mut)]">
                            {page.intro}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button to={page.ctaTo || '/diagnostic'} size="lg">
                                {page.cta} <ArrowRight className="size-5"/>
                            </Button>
                            <Button to="/register" variant="secondary" size="lg">
                                {page.secondaryCta}
                            </Button>
                        </div>
                    </div>

                    <Card className="sat-arena-card overflow-hidden rounded-[1.75rem] bg-white/95">
                        <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
                            <p className="m-0 text-xs font-black uppercase text-cyan-200">{page.panelEyebrow || 'SAT Duel loop'}</p>
                            <p className="m-0 mt-1 font-display text-xl font-black">{page.panelTitle || 'Short reps. Clear feedback.'}</p>
                        </div>
                        <div className="space-y-4 p-5">
                            {page.bullets.map((bullet) => (
                                <div key={bullet} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                                        <CheckCircle2 className="size-4"/>
                                    </span>
                                    <p className="m-0 text-sm font-semibold leading-relaxed text-slate-700">{bullet}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </PageContainer>
            </section>

            <section className="py-12 sm:py-16">
                <PageContainer>
                    <PracticeLoop steps={page.loop}/>

                    <div className="mt-10 grid gap-4 lg:grid-cols-3">
                        {page.sections.map((section) => (
                            <GuideCard key={section.title} section={section}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="border-y border-[var(--sd-line)] bg-[var(--sd-bg2)] py-12">
                <PageContainer className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-start">
                    <div>
                        <p className="m-0 text-sm font-black uppercase text-[var(--sd-violet-lbl)]">Quick answers</p>
                        <h2 className="m-0 mt-2 font-display text-3xl font-black text-[var(--sd-text)]">
                            Common questions before you start.
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {page.faq.map((item) => (
                            <Card key={item.question} className="p-5">
                                <h3 className="m-0 text-lg font-black text-slate-950">{item.question}</h3>
                                <p className="m-0 mt-2 text-[15px] leading-relaxed text-slate-600">{item.answer}</p>
                            </Card>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="bg-slate-950 py-12 text-white">
                <PageContainer>
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="m-0 text-sm font-black uppercase text-cyan-200">Keep exploring</p>
                            <h2 className="m-0 mt-2 font-display text-3xl font-black">More SAT Duel guides</h2>
                        </div>
                        <Button to="/diagnostic" size="lg">Start free <ArrowRight className="size-5"/></Button>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {page.related.map((key) => {
                            const related = GUIDE_PAGES[key];
                            return (
                                <Link
                                    key={key}
                                    to={related.path}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 no-underline transition-colors hover:bg-white/10"
                                >
                                    <span className="text-sm font-black text-white">{RELATED_LABELS[key]}</span>
                                    <span className="mt-2 block text-sm leading-relaxed text-slate-300">{related.description}</span>
                                </Link>
                            );
                        })}
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}
