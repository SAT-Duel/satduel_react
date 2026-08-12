const digitalSatEnglishMap = {
    subject: 'english',
    slug: 'digital-sat-english-map',
    moduleId: 'english-reading-method',
    title: 'The Digital SAT English Map',
    minutes: '18 min',
    summary: 'Use the section’s predictable structure to spend attention where it earns points, move through one-question passages cleanly, and make adaptation less distracting.',
    goals: [
        'Know what resets and what stays predictable from question to question.',
        'Use the domain order and within-module navigation to protect time.',
        'Treat adaptation as background information rather than a live guessing game.',
    ],
    openingCheck: {
        prompt: 'Maya spends nearly three minutes on an early vocabulary question because she assumes every later question will be harder. What is the best correction?',
        choices: [
            'Keep solving in order because Bluebook never allows students to return.',
            'Guess immediately on every vocabulary question because vocabulary is always hardest.',
            'Flag the sticky question, continue collecting points, and return within the same module.',
            'Restart the module so that the adaptive system gives easier questions.',
        ],
        answer: 2,
        explanation: 'Questions are grouped by domain and generally become harder within a skill grouping, but you may move freely inside the current module. One expensive question should not consume time reserved for later grammar and synthesis questions.',
    },
    concepts: [
        {
            heading: 'Every passage is a fresh decision',
            body: [
                'Reading and Writing uses 54 discrete multiple-choice questions across two 32-minute modules. Each question has its own short passage or passage pair, so no later question depends on remembering an earlier text.',
                'That reset is a strategic advantage. After submitting an answer, release the topic and carry forward only the decision process: identify the task, read for that task, predict, and verify.',
            ],
            moves: ['One passage or pair', 'One question', 'One single best answer', 'Then a complete reset'],
        },
        {
            heading: 'The module has a usable order',
            body: [
                'Both modules move through the same broad domain sequence: Craft and Structure, Information and Ideas, Standard English Conventions, then Expression of Ideas. Within most domains, questions are grouped by skill and generally progress from easier to harder.',
                'You do not need to memorize question numbers. Notice the stem and answer-choice shape: vocabulary and purpose questions arrive early; evidence and inference follow; punctuation and grammar come next; transitions and student-notes questions close the module.',
            ],
            moves: ['Craft & Structure', 'Information & Ideas', 'Conventions', 'Expression of Ideas'],
        },
        {
            heading: 'Adaptation changes difficulty, not your job',
            body: [
                'Module 1 contains a broad mix of difficulty. Your performance routes you to a second module whose average difficulty is higher or lower. Operational questions in both modules contribute to the section score.',
                'You cannot reliably reverse-engineer the route while testing, and doing so does not help answer the question in front of you. Work the evidence, protect the clock, and let the scoring system stay invisible.',
            ],
            moves: ['32 minutes', '27 questions', 'About 71 seconds each on average', 'No return after a module ends'],
        },
    ],
    workedExample: {
        skill: 'Section strategy',
        passage: 'Noah reaches a dense inference question with 12 minutes left in Module 1. After 80 seconds, he has eliminated one answer but cannot distinguish the other three. He knows that punctuation, grammar, transitions, and synthesis questions still remain.',
        question: 'Which choice describes Noah’s best next move?',
        prediction: 'Preserve the unanswered later points: flag this question, record the best current guess, and return only if time remains.',
        choices: [
            {text: 'Continue until the inference is solved because leaving the domain lowers the module score.', verdict: 'Too costly', analysis: 'The test scores answers, not persistence within a domain. The remaining questions need time too.'},
            {text: 'Flag the question, choose the best current answer, and move to the later domains.', verdict: 'Best', analysis: 'This protects solvable points and keeps a recoverable answer in place if time expires.'},
            {text: 'Skip every remaining reading question and wait for Module 2.', verdict: 'Overreaction', analysis: 'The later questions include different skills and may be faster. Module 1 operational questions still count.'},
            {text: 'Leave the answer blank so Bluebook knows he was uncertain.', verdict: 'No benefit', analysis: 'There is no penalty for guessing and no scoring credit for signaling uncertainty.'},
        ],
        answer: 1,
        decision: 'Use time as a section resource. A difficult question earns a return flag, not unlimited attention.',
    },
    takeaways: {
        rule: 'Reset after every passage, use the predictable domain sequence, and cap the first visit to a question before it steals later points.',
        highScore: 'For a 700+ scorer, the biggest pacing leak is often not slow reading—it is spending an extra minute proving a choice after the evidence has stopped improving. Mark the exact uncertainty and return with a specific comparison to make.',
        checklist: ['What domain am I in?', 'What does this stem require?', 'Is another 20 seconds likely to change my answer?', 'Can I return within this module?'],
    },
    practiceSet: {
        title: 'Use the map instead of fighting it',
        intro: 'These questions test the section decisions that preserve accuracy across all four domains.',
        questions: [
            {
                id: 'english-map-reset',
                difficulty: 'Foundation',
                skill: 'Discrete questions',
                passage: 'A student finishes a question about a nineteenth-century poem. The next question presents a science passage about coral growth.',
                question: 'Which approach is most effective?',
                choices: ['Carry the poem’s theme into the coral passage.', 'Treat the coral passage as a fresh text with a new task.', 'Assume both questions test the same skill.', 'Skip the science passage unless the poem was answered correctly.'],
                answer: 1,
                explanation: {
                    whyCorrect: 'Each Reading and Writing question is discrete. The topic and evidence reset completely.',
                    choices: ['The previous passage supplies no evidence for the new one.', 'Correct: identify the new stem and read only this text.', 'Adjacent questions can share a domain but not necessarily a skill or answer method.', 'Questions are independent; the prior answer does not unlock the next one.'],
                    takeaway: 'Carry the process forward, never the previous passage.',
                },
            },
            {
                id: 'english-map-order',
                difficulty: 'Core SAT',
                skill: 'Domain sequence',
                passage: 'A student has just completed a cluster of Information and Ideas questions in a module.',
                question: 'Which question type is the student most likely to encounter next?',
                choices: ['A punctuation or grammar question', 'A student-produced numerical response', 'A second question about the same passage', 'A long essay requiring cited sources'],
                answer: 0,
                explanation: {
                    whyCorrect: 'Standard English Conventions follows Information and Ideas in each Reading and Writing module.',
                    choices: ['Correct: punctuation and grammar make up Standard English Conventions.', 'Reading and Writing is entirely four-option multiple choice.', 'Each passage or passage pair supports one discrete question.', 'The standard SAT Reading and Writing section does not contain an essay.'],
                    takeaway: 'Expect Conventions after the reading-focused domains.',
                },
            },
            {
                id: 'english-map-adaptive',
                difficulty: 'Advanced',
                skill: 'Adaptive testing',
                passage: 'Leila performs strongly in the first Reading and Writing module and receives a second module with higher average difficulty.',
                question: 'Which statement is accurate?',
                choices: ['Only Module 2 contributes to her section score.', 'Every Module 2 question must be harder than every Module 1 question.', 'Her operational answers across both modules contribute to the section score.', 'She may return to Module 1 after finishing Module 2.'],
                answer: 2,
                explanation: {
                    whyCorrect: 'The routing changes the average difficulty of Module 2, while operational questions from both modules are scored.',
                    choices: ['Module 1 operational questions also count.', 'Each module contains a mix of difficulty; the average changes.', 'Correct: both modules matter.', 'A completed module is closed and cannot be reopened.'],
                    takeaway: 'Adaptation changes the route, not the value of careful work in either module.',
                },
            },
            {
                id: 'english-map-700',
                difficulty: '700+ Lens',
                skill: 'Time allocation',
                passage: 'With nine minutes left, Andre is choosing between two plausible answers on the last Craft and Structure question. He can name the exact phrase separating the choices but has reread it twice without gaining new evidence. Several later questions remain unseen.',
                question: 'Which action best protects Andre’s score?',
                choices: ['Reread until one choice feels more familiar.', 'Flag the question, keep his evidence-based lean, and continue.', 'Change to the longer answer because hard questions favor detail.', 'Leave it blank and begin Module 2 early.'],
                answer: 1,
                explanation: {
                    whyCorrect: 'Andre has reached diminishing returns and still has unseen opportunities. A flagged, evidence-based lean preserves both.',
                    choices: ['Familiarity is not new textual evidence.', 'Correct: move once additional time is no longer improving the comparison.', 'Length does not determine correctness.', 'He cannot begin the next module early, and blank answers gain nothing.'],
                    takeaway: 'High scorers should recognize diminishing returns, not merely recognize question types.',
                },
            },
        ],
    },
    reflection: {
        prompt: 'Write your personal first-pass limit: after ___ seconds without new evidence, I will flag, keep my best answer, and move on.',
        steps: ['Choose a realistic limit between 60 and 90 seconds.', 'Name the later domain where you most want to preserve time.', 'On your next timed set, record whether a return changed the answer.'],
    },
};

export default digitalSatEnglishMap;

