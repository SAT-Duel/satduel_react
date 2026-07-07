const howDigitalSatMathWorks = {
    slug: 'how-digital-sat-math-works',
    moduleId: 'math-map',
    title: 'How Digital SAT Math Works',
    eyebrow: 'Orientation',
    minutes: '8 min',
    summary: 'A clear map of the Math section: timing, adaptive modules, calculator access, and how to treat each question.',
    goals: [
        'Know the Math section structure before you start practicing.',
        'Understand what adaptive modules mean without overthinking them.',
        'Use the clock as a guide, not a panic trigger.',
    ],
    facts: [
        {label: 'Math time', value: '70 min', note: 'Two 35-minute modules'},
        {label: 'Questions', value: '44', note: '22 questions per module'},
        {label: 'Calculator', value: 'Allowed', note: 'Available throughout Math'},
        {label: 'Answers', value: 'MCQ + typed', note: 'Most are multiple choice; some ask you to type a number'},
    ],
    sections: [
        {
            heading: 'The section is predictable',
            paragraphs: [
                'Digital SAT Math always comes in two equal modules. Each module mixes Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry/Trigonometry.',
                'The test does not label the topic for you. Your first job is to recognize the question type, then choose the shortest reliable method.',
            ],
        },
        {
            heading: 'Adaptive does not mean mysterious',
            paragraphs: [
                'Module 1 contains a broad mix of easy, medium, and hard questions. Your performance there affects whether Module 2 leans easier or harder.',
                'You cannot control the algorithm while testing. You can control accuracy, pacing, and whether you move on when a question is eating time.',
            ],
        },
        {
            heading: 'Calculator access changes the strategy',
            paragraphs: [
                'Because a calculator is allowed throughout Math, the real skill is deciding when it helps. Graphing is excellent for intersections, checking answer choices, and visualizing functions.',
                'Algebra is still faster for many questions. If one clean equation step finishes the problem, do that instead of opening a graph.',
            ],
        },
    ],
    formulas: [
        {
            label: 'Average pace',
            math: '\\frac{70\\text{ minutes}}{44\\text{ questions}}\\approx1.6\\text{ minutes per question}',
            note: 'This is an average, not a rule. Some questions should take 25 seconds; hard ones may take 2 minutes.',
        },
        {
            label: 'A better timing rule',
            math: '\\text{easy points first} + \\text{return to hard questions}',
            note: 'Mark a sticky question and move. Coming back with fresh eyes is often faster.',
        },
    ],
    strategyCards: [
        {
            title: 'When to solve by algebra',
            items: ['The equation is simple', 'The answer choices are symbolic', 'Graphing would take longer than one clean step'],
        },
        {
            title: 'When to use the graphing calculator',
            items: ['You need an intersection', 'A function comparison is visual', 'You want to test answer choices quickly'],
        },
        {
            title: 'When to estimate or skip',
            items: ['You are stuck after one minute', 'The arithmetic is getting messy', 'The question is clearly a hard Module 2 time sink'],
        },
    ],
    adaptiveDemo: {
        title: 'Module 2 outcomes',
        prompt: 'Choose a Module 1 result to see the likely Module 2 feel.',
        options: [
            {
                id: 'steady',
                label: 'Mixed result',
                result: 'Module 2 likely stays more moderate.',
                advice: 'Collect the questions you know, then use extra time on the hardest ones.',
            },
            {
                id: 'strong',
                label: 'Strong result',
                result: 'Module 2 likely contains harder questions.',
                advice: 'Harder does not mean impossible. Expect more structure, parameters, and multi-step setup.',
            },
        ],
    },
    quickCheck: {
        prompt: 'You are 90 seconds into a question and still do not have a setup. What is the best next move?',
        choices: [
            'Keep grinding because every question must be solved in order.',
            'Mark it, choose a reasonable guess if needed, and move to the next question.',
            'Open the calculator for every remaining question.',
            'Assume Module 2 is too hard and slow down.',
        ],
        answer: 1,
        explanation: 'The SAT rewards total correct answers. Protect time for questions you can solve cleanly, then return if time remains.',
    },
};

export default howDigitalSatMathWorks;
