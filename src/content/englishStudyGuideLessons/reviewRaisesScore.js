const reviewRaisesScore = {
    subject: 'english', slug: 'review-that-raises-your-score', moduleId: 'english-reading-method',
    title: 'Review That Raises Your Score', minutes: '25 min',
    summary: 'Turn every miss and uncertain correct answer into a specific diagnosis, a reusable decision rule, and a scheduled retest.',
    goals: ['Classify the decision that broke down.', 'Reconstruct the answer before rereading explanations.', 'Write transfer rules that change future behavior.'],
    openingCheck: {
        prompt: 'Leo records only “careless mistake” after choosing an overbroad inference. Why is this review weak?',
        choices: ['He should copy the entire passage instead.', 'The label does not identify the failed decision or a future correction.', 'Only wrong grammar answers should be reviewed.', 'An overbroad answer is always caused by low vocabulary.'],
        answer: 1,
        explanation: '“Careless” describes frustration, not mechanism. Useful review might say: “Choice issue—accepted ‘all communities’ when the study sampled two; check population words before committing.”',
    },
    concepts: [
        { heading: 'Review the decision, not your personality', body: ['A miss usually comes from one of five places: task recognition, text comprehension, prediction, choice evaluation, or timing. “Bad at reading” is too large to repair; “answered topic instead of function” is trainable.', 'Also review lucky correct answers. If you could not explain the final elimination, the process remains unstable.'], moves: ['Task', 'Text', 'Prediction', 'Choices', 'Timing'] },
        { heading: 'Reconstruct before consuming', body: ['Hide the choices and explanation. Restate the task, identify the controlling evidence, and predict again. This reveals whether your mental model changed or you are merely recognizing the displayed answer.', 'Then compare every option. For the correct choice, explain why it fulfills the task. For your choice, name the first unsupported word or broken relationship.'], moves: ['Hide answer', 'Redo from evidence', 'Audit all four', 'Compare old and new reasoning'] },
        { heading: 'Compress the lesson into a transfer rule', body: ['A useful rule begins with a trigger and ends with an action: “When a study reports an association, I will reject causal verbs unless the design isolates a cause.” It is brief enough to recall during the test and specific enough to change a decision.', 'Retest the item later without notes, then use the same rule on a new item. Memory plus transfer—not rereading—is the proof of learning.'], moves: ['When I see…', 'I will…', 'Because…', 'Retest after a delay'] },
    ],
    workedExample: {
        skill: 'Error-log reconstruction',
        passage: 'Question: A study of two ponds finds more dragonfly species in the pond with greater plant cover. The study did not manipulate plant cover. Student choice: “Greater plant cover causes dragonfly diversity to increase in all ponds.” Correct choice: “In the studied ponds, greater plant cover was associated with higher dragonfly diversity.”',
        question: 'Which review note will most improve the student’s next decision?',
        prediction: 'Name a choice-evaluation error involving causation and scope, then define a repeatable check.',
        choices: [
            { text: '“I need to read more carefully.”', verdict: 'Too vague', analysis: 'It names no cue or new action.' },
            { text: '“Choice issue: I upgraded an observed association to causation and two ponds to all ponds. Before choosing, I will circle causal and universal words and demand matching evidence.”', verdict: 'Best', analysis: 'It diagnoses both overextensions and supplies a trigger-action rule.' },
            { text: '“Dragonflies are difficult topics for me.”', verdict: 'Misdiagnosed', analysis: 'No biological background was needed.' },
            { text: '“Next time I will avoid the longest answer.”', verdict: 'False shortcut', analysis: 'Answer length did not cause the error.' },
        ],
        answer: 1,
        decision: 'The best review produces a rule you could use on moths, markets, poems, or any other topic.',
    },
    takeaways: {
        rule: 'Diagnose the failed decision, reconstruct the reasoning, write a trigger-action rule, and prove it through delayed retrieval plus a new example.',
        highScore: 'For 700+ scorers, track uncertainty quality. A correct answer reached through weak elimination belongs in the log. Your last 50 points often live in repeatable near-misses, not obvious errors.',
        checklist: ['Where did the process first break?', 'Can I solve it with choices hidden?', 'Why does every choice win or fail?', 'What exact cue will trigger my new action?', 'When will I retest?'],
    },
    practiceSet: {
        title: 'Diagnose the process', intro: 'These scenarios ask you to choose the review action most likely to transfer.',
        questions: [
            { id: 'review-task', difficulty: 'Foundation', skill: 'Task diagnosis', passage: 'A student misses a function question after selecting a choice that accurately summarizes the underlined sentence but never states what the sentence does in the passage.', question: 'Which error category and correction best fit?', choices: ['Task: translate “function” into “role” before reading deeply.', 'Text: memorize every detail in the passage.', 'Timing: answer every function question in ten seconds.', 'Vocabulary: learn a synonym for “sentence.”'], answer: 0, explanation: { whyCorrect: 'The student understood content but answered summary instead of role.', choices: ['Correct: it targets the first failed decision.', 'More detail does not fix the task mismatch.', 'Speed would amplify the same error.', 'The word “sentence” was not the barrier.'], takeaway: 'Diagnose the earliest broken step.' } },
            { id: 'review-reconstruct', difficulty: 'Core', skill: 'Retrieval practice', passage: 'After missing an inference question, a student immediately reads the explanation three times and feels that the answer is obvious.', question: 'What should the student do next?', choices: ['Move on because recognition proves mastery.', 'Hide the choices and explanation, then reconstruct the inference from the passage.', 'Memorize the correct option’s letter.', 'Replace the missed question with an unrelated grammar drill.'], answer: 1, explanation: { whyCorrect: 'Reconstruction tests whether the student can generate the reasoning rather than recognize it.', choices: ['Feeling familiar is not independent retrieval.', 'Correct: recreate task, evidence, and prediction.', 'Letters have no transferable value.', 'The diagnosis points to inference, not grammar.'], takeaway: 'Explanations support learning only after you attempt retrieval.' } },
            { id: 'review-rule', difficulty: 'Advanced', skill: 'Transfer rule', passage: 'A student repeatedly chooses answers using the passage’s exact words even when those words are placed in a reversed cause-and-effect relationship.', question: 'Which transfer rule is strongest?', choices: ['Choose paraphrases instead of repeated words.', 'Never choose an answer that quotes the passage.', 'When a choice repeats passage language, verify who causes what before giving vocabulary overlap any credit.', 'Read every passage twice.'], answer: 2, explanation: { whyCorrect: 'It uses a visible trigger and targets the actual relationship error without banning valid quoted language.', choices: ['Paraphrase alone does not guarantee correct logic.', 'Exact wording can appear in correct answers.', 'Correct: trigger plus decisive action.', 'Extra reading is broad and may repeat the same mistake.'], takeaway: 'Good rules are conditional, specific, and behavior-changing.' } },
            { id: 'review-700', difficulty: '700+ Lens', skill: 'Uncertain corrects', passage: 'A student answers a difficult Words in Context item correctly but had narrowed the choices to two and guessed because both “sounded formal.”', question: 'How should the student review it?', choices: ['Do not log it because the score report marks it correct.', 'Log only the unfamiliar words from the wrong choices.', 'Re-solve by substituting each finalist into the sentence and comparing its logical fit, then record the distinction that decides the answer.', 'Assume formal tone is a reliable tiebreaker because it worked once.'], answer: 2, explanation: { whyCorrect: 'The correct result hid an unstable process; contextual substitution and a recorded distinction make it repeatable.', choices: ['Outcome alone cannot reveal process quality.', 'Definitions may help, but they do not resolve contextual logic by themselves.', 'Correct: reconstruct and capture the decisive nuance.', 'One lucky result does not validate a shortcut.'], takeaway: 'Track fragile correct answers before they become future misses.' } },
        ],
    },
    reflection: { prompt: 'Create one review entry now: Error type → decisive evidence → why my choice failed → transfer rule → retest date.', steps: ['Use a real missed or uncertain item.', 'Write one sentence per field.', 'Schedule a no-notes retest in 2–3 days.', 'Find one new question where the same rule applies.'] },
};

export default reviewRaisesScore;
