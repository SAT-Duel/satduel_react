const studyWithSatDuel = {
    slug: 'study-with-sat-duel',
    moduleId: 'math-map',
    title: 'How to Study With SAT Duel',
    eyebrow: 'Orientation',
    minutes: '9 min',
    summary: 'Use lessons, practice questions, and review as one loop instead of three separate tasks.',
    goals: [
        'Run a short study session without drifting.',
        'Review misses by cause, not by feeling.',
        'Know when to move from lessons into mixed practice.',
    ],
    facts: [
        {label: 'Learn', value: '1 page', note: 'read one lesson with formulas and examples'},
        {label: 'Practice', value: '10-15 q', note: 'answer enough questions to expose the pattern'},
        {label: 'Review', value: '3 labels', note: 'concept, setup, or execution'},
        {label: 'Return', value: '1 topic', note: 'study the weakest label next'},
    ],
    sections: [
        {
            heading: 'Use a loop, not a marathon',
            paragraphs: [
                'Reading for an hour feels productive, but SAT Math improves when reading turns into reps. One focused lesson followed by a short practice set is enough to show whether the idea stuck.',
                'Stop the session while you can still review carefully. A rushed review teaches almost nothing.',
            ],
        },
        {
            heading: 'Review the cause of each miss',
            paragraphs: [
                'A miss is useful only after you name why it happened. Use three simple labels: concept, setup, or execution.',
                'Concept means you did not know the math. Setup means you knew the math but built the wrong equation or diagram. Execution means the plan was right, but arithmetic, signs, or reading details broke it.',
            ],
        },
        {
            heading: 'Move from focused to mixed practice',
            paragraphs: [
                'Start focused when a topic is weak. Stay there until the same setup begins to feel familiar.',
                'Then switch to mixed practice. The real SAT will not announce the topic, so your final skill is recognizing the type quickly.',
            ],
        },
    ],
    formulas: [
        {
            label: 'A useful study block',
            math: '\\text{lesson} + \\text{targeted reps} + \\text{miss review} = \\text{improvement}',
            note: 'Skipping the review step turns practice into guessing with a scoreboard.',
        },
        {
            label: 'Review label',
            math: '\\text{miss} \\rightarrow \\{\\text{concept},\\ \\text{setup},\\ \\text{execution}\\}',
            note: 'Use the label to pick the next lesson or practice mode.',
        },
    ],
    strategyCards: [
        {
            title: 'Good review',
            items: ['Redo the question before reading the explanation', 'Write the mistake cause in one phrase', 'Pick the next topic from the repeated cause'],
        },
        {
            title: 'Bad review',
            items: ['Only reading the explanation', 'Calling every miss careless', 'Practicing random questions before fixing the pattern'],
        },
    ],
    adaptiveDemo: {
        title: 'Choose the next move',
        prompt: 'Your last set had several misses. Which pattern sounds closest?',
        options: [
            {
                id: 'setup',
                label: 'Wrong setup',
                result: 'Return to the lesson.',
                advice: 'Setup errors mean the first translation step is weak. Study the concept before doing more reps.',
            },
            {
                id: 'execution',
                label: 'Small errors',
                result: 'Do a short focused set.',
                advice: 'Execution errors improve with slower written work and immediate correction.',
            },
        ],
    },
    quickCheck: {
        prompt: 'A student knows the percent formula but keeps using the wrong original amount. What kind of miss is this?',
        choices: ['Concept', 'Setup', 'Execution', 'Timing only'],
        answer: 1,
        explanation: 'The math idea is known, but the relationship was built with the wrong base. That is a setup miss.',
    },
};

export default studyWithSatDuel;
