const fourMathDomains = {
    slug: 'four-math-domains',
    moduleId: 'math-map',
    title: 'The Four Math Domains',
    eyebrow: 'Orientation',
    minutes: '10 min',
    summary: 'SAT Math is easier to study when you know the four buckets the test keeps reusing.',
    goals: [
        'Name the four SAT Math domains.',
        'Know which domains appear most often.',
        'Use a domain label to choose the right study module after a miss.',
    ],
    facts: [
        {label: 'Algebra', value: '13-15', note: 'linear equations, inequalities, functions, and systems'},
        {label: 'Advanced Math', value: '13-15', note: 'quadratics, nonlinear equations, functions, and expressions'},
        {label: 'Data Analysis', value: '5-7', note: 'ratios, percentages, statistics, probability, and models'},
        {label: 'Geometry/Trig', value: '5-7', note: 'triangles, circles, area, volume, coordinate geometry, and trig'},
    ],
    sections: [
        {
            heading: 'A domain is a study label',
            paragraphs: [
                'The SAT will not tell you the domain during the test. The label is for your review after practice.',
                'When you miss a question, first ask: was this Algebra, Advanced Math, Data Analysis, or Geometry/Trig? That one label tells you where to study next.',
            ],
        },
        {
            heading: 'Algebra is the base layer',
            paragraphs: [
                'Algebra questions usually involve linear equations, inequalities, systems, or functions. The work is often short, but small sign errors can ruin easy points.',
                'If a miss involved slope, intercepts, solving for a variable, or two lines meeting, send it to Algebra review.',
            ],
        },
        {
            heading: 'Advanced Math is where hard questions cluster',
            paragraphs: [
                'Advanced Math includes quadratics, exponentials, polynomials, rational expressions, radicals, absolute value, and function notation.',
                'These questions often reward structure. Before expanding everything, ask what form would reveal the target: zero, vertex, factor, input, output, or growth factor.',
            ],
        },
        {
            heading: 'Data and Geometry are smaller but expensive',
            paragraphs: [
                'Problem-Solving and Data Analysis appears less often, but it punishes denominator mistakes. Percent, rate, and table questions are mostly about choosing the right comparison.',
                'Geometry and Trigonometry also appears less often, but weak formula recall or messy diagrams can burn time quickly. Keep diagrams organized before calculating.',
            ],
        },
    ],
    formulas: [
        {
            label: 'High-frequency domains',
            math: '\\text{Algebra} + \\text{Advanced Math} \\approx 26\\text{ to }30\\text{ questions}',
            note: 'Most SAT Math study time should go here until these feel stable.',
        },
        {
            label: 'Smaller domains still matter',
            math: '\\text{Data Analysis} + \\text{Geometry/Trig} \\approx 10\\text{ to }14\\text{ questions}',
            note: 'These are fewer questions, but they are often fast points if the setup is familiar.',
        },
    ],
    strategyCards: [
        {
            title: 'How to label a miss',
            items: ['Look at the main skill, not the story context', 'Write one domain label in your error log', 'Pick the next lesson from that label'],
        },
        {
            title: 'Where to spend study time',
            items: ['Fix Algebra habits first', 'Split Advanced Math into smaller topics', 'Use Data and Geometry review to collect fast points'],
        },
    ],
    adaptiveDemo: {
        title: 'Pick a weak area',
        prompt: 'Choose the domain where your last few misses came from.',
        options: [
            {
                id: 'advanced',
                label: 'Advanced Math',
                result: 'Study in smaller pieces.',
                advice: 'Start with quadratics, then nonlinear functions. Broad review is too fuzzy here.',
            },
            {
                id: 'geometry',
                label: 'Geometry/Trig',
                result: 'Write the diagram facts first.',
                advice: 'Most geometry misses start before the formula: missing equal angles, similar triangles, or units.',
            },
        ],
    },
    quickCheck: {
        prompt: 'A missed question asked for the vertex of a parabola. Which domain should you review?',
        choices: ['Algebra', 'Advanced Math', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry'],
        answer: 1,
        explanation: 'A parabola is a quadratic function, so this belongs in Advanced Math.',
    },
};

export default fourMathDomains;
