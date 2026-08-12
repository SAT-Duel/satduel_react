const predictBeforePick = {
    subject: 'english',
    slug: 'predict-before-you-pick',
    moduleId: 'english-reading-method',
    title: 'Predict Before You Pick',
    minutes: '22 min',
    summary: 'Form a compact answer from the text before the choices compete for your attention, then match meaning rather than wording.',
    goals: ['Build a prediction that fits the question family.', 'Choose the right level of detail for a useful prediction.', 'Compare choices to an evidence-based target instead of to one another.'],
    openingCheck: {
        prompt: 'Before opening the choices on a transition question, Priya decides that the second sentence will present an exception to the first. What has Priya gained?',
        choices: ['A reason to choose any negative-sounding word', 'A testable logical relationship for evaluating each choice', 'Permission to ignore the sentences themselves', 'Proof that the answer must be “however”'],
        answer: 1,
        explanation: 'A prediction supplies the relationship—exception or contrast—without overcommitting to one word. Several transitions can express contrast, so grammar and nuance still matter.',
    },
    concepts: [
        { heading: 'Prediction creates an independent target', body: ['Answer choices are written to feel plausible. Predicting first lets the passage define success before distractors offer easier stories.', 'A prediction can be a few words: “unexpected contrast,” “supports the river hypothesis,” or “introduces the study’s limitation.” It is a decision standard, not a full essay.'], moves: ['Read the task', 'Locate controlling evidence', 'State the answer in plain language', 'Open and test the choices'] },
        { heading: 'Predict the right kind of thing', body: ['For main idea, predict the central claim plus its frame. For function, predict the sentence’s role. For inference, complete the logic using only what must follow. For vocabulary, substitute a plain word. For transitions, name the relationship.', 'A mismatched prediction can be accurate yet useless. “The passage discusses a telescope” will not solve a question asking why the telescope example appears.'], moves: ['Claim', 'Role', 'Logical completion', 'Plain synonym', 'Relationship'] },
        { heading: 'Aim for the Goldilocks resolution', body: ['“Something about disagreement” is too vague to reject sophisticated traps. Rewriting an entire paragraph is too slow. Include the detail that separates plausible choices: what changes, for whom, under what condition, or for what purpose.', 'Then match meaning rather than copied words. Correct choices often paraphrase the text; distractors often recycle its vocabulary into the wrong relationship.'], moves: ['Specific enough to separate', 'Short enough to remember', 'Open to valid paraphrase', 'Anchored to evidence'] },
    ],
    workedExample: {
        skill: 'Function prediction',
        passage: 'Some seed banks store duplicate collections at distant sites. A flood, fire, or equipment failure can damage a local collection. By maintaining copies under separate conditions, a seed bank reduces the chance that one event will erase all stored material from a crop variety.',
        question: 'What is the main function of the second sentence in the text as a whole?',
        prediction: 'It names the risk that the duplicate-storage practice is designed to solve.',
        choices: [
            { text: 'It lists the conditions seeds require in storage.', verdict: 'Topic overlap', analysis: 'The sentence lists threats to a collection, not storage requirements.' },
            { text: 'It identifies a problem that explains the value of storing copies in different places.', verdict: 'Best', analysis: 'This closely matches the predicted role.' },
            { text: 'It argues that seed banks should stop maintaining local collections.', verdict: 'Reversal', analysis: 'The passage supports backup copies, not abandoning local sites.' },
            { text: 'It presents evidence that crop varieties are becoming less diverse.', verdict: 'Unsupported', analysis: 'No trend in crop diversity is reported.' },
        ],
        answer: 1,
        decision: 'The prediction names a role—problem that motivates a solution—so repeated words cannot impersonate the answer.',
    },
    takeaways: {
        rule: 'Before judging choices, state the answer’s required meaning in one short phrase anchored to the controlling evidence.',
        highScore: 'Prediction is not stubbornness. If no choice matches, return to the passage and revise the prediction; do not force a choice to fit. Strong readers update their model when the text proves it incomplete.',
        checklist: ['What type of answer am I predicting?', 'Which evidence controls it?', 'What detail separates the likely choices?', 'Am I matching meaning, not vocabulary?'],
    },
    practiceSet: {
        title: 'Build the target before seeing the traps',
        intro: 'For each item, pause after the question and say a prediction aloud before opening the choices.',
        questions: [
            { id: 'predict-main', difficulty: 'Foundation', skill: 'Central idea', passage: 'For decades, residents assumed the stone channels near Aruku were irrigation ditches. Archaeologist Nia Bell mapped their slopes and found that many channels ran uphill from ancient fields. Bell argues that the channels instead marked ceremonial walking routes connecting hilltop shrines.', question: 'Which choice best states the main idea?', choices: ['All ancient irrigation systems carried water uphill.', 'Bell’s mapping supports a ceremonial interpretation of channels once thought to be for irrigation.', 'Aruku’s residents built shrines only on hills.', 'Modern residents still use the channels as walking routes.'], answer: 1, explanation: { whyCorrect: 'It captures the old view, Bell’s evidence, and the revised interpretation.', choices: ['The passage says the uphill slope weighs against irrigation.', 'Correct: full claim and frame.', '“Only” is unsupported and misses the reinterpretation.', 'Present-day use is not discussed.'], takeaway: 'A main-idea prediction should include the passage’s change or tension, not merely its topic.' } },
            { id: 'predict-function', difficulty: 'Core', skill: 'Text structure', passage: 'Early maps of the seafloor showed broad ridges but little detail. In the 1950s, sonar surveys revealed that a deep valley runs along the center of many ridges. This discovery helped scientists recognize that new crust forms where sections of the seafloor pull apart.', question: 'What is the function of the second sentence?', choices: ['It provides a discovery that helped change scientists’ understanding of the ridges.', 'It proves that early maps were intentionally inaccurate.', 'It describes how sonar equipment is manufactured.', 'It gives an example of crust being destroyed.'], answer: 0, explanation: { whyCorrect: 'The detail bridges the limited early maps and the later scientific interpretation.', choices: ['Correct: discovery leading to revised understanding.', 'No intention is mentioned.', 'Manufacture is outside the passage.', 'The final sentence describes new crust forming.'], takeaway: 'Predict function as “what this part does to the passage’s reasoning.”' } },
            { id: 'predict-transition', difficulty: 'Advanced', skill: 'Transitions', passage: 'Many desert plants open their stomata at night, limiting daytime water loss. ______ this strategy does not eliminate water stress during unusually long droughts.', question: 'Which choice completes the text with the most logical transition?', choices: ['For example,', 'Similarly,', 'Nevertheless,', 'Therefore,'], answer: 2, explanation: { whyCorrect: 'The second sentence limits the benefit stated in the first, creating a concession or contrast.', choices: ['The second sentence is not an example of opening stomata.', 'It does not present a similar benefit.', 'Correct: benefit despite limitation.', 'The limitation is not a result of the strategy.'], takeaway: 'Predict the relationship—benefit, yet limitation—before choosing the connector.' } },
            { id: 'predict-700', difficulty: '700+ Lens', skill: 'Inference', passage: 'Literary scholar Ezra Cole notes that the narrator of the novel repeatedly calls the town square “unchanged,” yet each description quietly adds a new commercial sign or demolished house. Cole argues that this pattern is deliberate.', question: 'Which choice most logically completes Cole’s argument?', choices: ['The narrator’s repeated claim of stability is complicated by details that reveal gradual transformation.', 'The town square remains physically identical throughout the novel.', 'Commercial signs are the novel’s only symbols of change.', 'The narrator deliberately demolishes houses while claiming the square is unchanged.'], answer: 0, explanation: { whyCorrect: 'It reconciles the repeated word “unchanged” with accumulating evidence of change.', choices: ['Correct: the prediction needs both asserted stability and observed transformation.', 'The descriptions contradict physical identity.', '“Only” exceeds the evidence.', 'The narrator describes events; the narrator is not identified as causing them.'], takeaway: 'A high-resolution prediction preserves tension instead of flattening one side of it.' } },
        ],
    },
    reflection: { prompt: 'Write three prediction stems you can reuse: “The answer should show…,” “This sentence’s job is…,” and “The relationship is….”', steps: ['Fill each stem using a question you answered today.', 'Check whether your phrase could eliminate at least two choices.', 'Shorten it without losing the separating detail.'] },
};

export default predictBeforePick;
