const readTaskBeforeText = {
    subject: 'english',
    slug: 'read-the-task-before-the-text',
    moduleId: 'english-reading-method',
    title: 'Read the Task Before the Text',
    minutes: '20 min',
    summary: 'Translate the question stem into a precise job so you read for the answer the test requires instead of trying to understand everything equally.',
    goals: [
        'Recognize the output demanded by recurring SAT question stems.',
        'Read the same passage differently when the task changes.',
        'Avoid solving a harder, broader question than the one asked.',
    ],
    openingCheck: {
        prompt: 'A question asks for the function of one sentence. Jordan writes a full summary of the passage and then chooses the option that repeats the sentence’s topic. What should Jordan change first?',
        choices: ['Read the passage faster.', 'Define the sentence’s role in the passage before looking for an answer.', 'Memorize more facts about the passage topic.', 'Always choose the shortest function answer.'],
        answer: 1,
        explanation: 'A function question asks what the selected text does—not merely what it discusses. Translating the stem first prevents Jordan from answering a different question.',
    },
    concepts: [
        {
            heading: 'The stem names the required output',
            body: [
                'Before reading deeply, identify the noun the answer must supply. A central-idea question needs the passage-wide claim. A function question needs a role. A transition question needs a logical relationship. A conventions question needs a grammatically valid boundary or form.',
                'This translation shrinks the task. Instead of asking, “What does everything mean?” ask, “What exact thing must I produce?”',
            ],
            moves: ['Main idea → claim + frame', 'Function → role in context', 'Inference → must be true', 'Transition → relationship', 'Conventions → sentence structure'],
        },
        {
            heading: 'Read with a lens, not a blindfold',
            body: [
                'Looking at the stem first does not mean ignoring the passage. It means choosing an attention lens. For vocabulary, inspect the sentence logic around the blank or target word. For function, connect the selected sentence to what comes before and after. For evidence, locate the claim and ask what result would change confidence in it.',
                'The text remains the authority; the stem tells you which part of that authority matters most.',
            ],
            moves: ['Glance at stem', 'Translate the job', 'Read the relevant text', 'Answer only that job'],
        },
        {
            heading: 'Question families have recognizable language',
            body: [
                'College Board uses consistent stem patterns. “Most logical and precise word” signals Words in Context. “Function of the underlined portion” signals Text Structure and Purpose. “Most logically completes the text” often signals an inference. “Uses information from the notes to accomplish the goal” signals Rhetorical Synthesis.',
                'Recognizing the family should change your first move, not trigger a memorized answer trick.',
            ],
            moves: ['Name the family', 'State the job in your words', 'Choose the matching decision process'],
        },
    ],
    workedExample: {
        skill: 'Text Structure and Purpose',
        passage: 'Community seed libraries allow gardeners to borrow seeds and later return seeds harvested from the plants they grow. Some organizers worry that seeds from accidentally cross-pollinated plants could make a collection less predictable. To address that concern, several libraries label varieties that cross-pollinate easily and offer short isolation guides to gardeners. These steps preserve the open, collaborative model while improving the reliability of returned seeds.',
        question: 'Which choice best describes the function of the second sentence in the text as a whole?',
        prediction: 'It introduces a problem with seed sharing that the next sentence answers with practical safeguards.',
        choices: [
            {text: 'It explains why most gardeners refuse to return seeds.', verdict: 'Unsupported', analysis: 'The text never says most gardeners refuse; it describes a risk involving cross-pollination.'},
            {text: 'It identifies a concern that motivates the safeguards described next.', verdict: 'Best', analysis: 'The concern is introduced, then directly answered by labels and isolation guides.'},
            {text: 'It proves that seed libraries cannot maintain predictable collections.', verdict: 'Too strong', analysis: 'The final sentences show that organizers can improve reliability without abandoning the model.'},
            {text: 'It contrasts community seed libraries with commercial seed suppliers.', verdict: 'Out of scope', analysis: 'Commercial suppliers never appear in the passage.'},
        ],
        answer: 1,
        decision: 'Function = relationship to surrounding ideas. Here the sentence is a problem that sets up a solution.',
    },
    takeaways: {
        rule: 'Turn the stem into a one-line job before reading: “I need the claim,” “I need this sentence’s role,” or “I need the relationship.”',
        highScore: 'At 700+, wrong answers often answer a nearby question correctly. A choice may summarize the underlined sentence but fail to state its function, or describe a real detail but fail to supply the main idea.',
        checklist: ['What answer-shaped noun does the stem request?', 'Which lines control that answer?', 'Am I answering this task or a nearby one?', 'Does the choice use the right level of scope?'],
    },
    practiceSet: {
        title: 'Let the task control the reading',
        intro: 'Each passage rewards a different lens. Translate the stem before solving.',
        questions: [
            {
                id: 'task-main-idea',
                difficulty: 'Foundation',
                skill: 'Central Ideas and Details',
                passage: 'Architects designing schools in hot climates have begun using shaded courtyards as shared learning spaces. The courtyards reduce direct sunlight while allowing air to circulate between classrooms. In several schools, teachers also use the spaces for science observations and group projects.',
                question: 'Which choice best states the main idea of the text?',
                choices: ['All schools in hot climates should eliminate indoor classrooms.', 'Shaded courtyards can cool school spaces and support instruction.', 'Science observations are the most effective form of group work.', 'Architects prefer courtyards because they are inexpensive to build.'],
                answer: 1,
                explanation: {
                    whyCorrect: 'The answer combines the two passage-wide functions: climate control and learning use.',
                    choices: ['The text describes courtyards as shared spaces, not replacements for all classrooms.', 'Correct: it captures both the cooling and instructional roles.', 'This narrows the passage to one example.', 'The passage never discusses construction cost.'],
                    takeaway: 'A main idea keeps the central claim and its essential frame—not every detail.',
                },
            },
            {
                id: 'task-function',
                difficulty: 'Core SAT',
                skill: 'Text Structure and Purpose',
                passage: 'Historian Lena Cho expected shipping records to show that a small port declined after a larger harbor opened nearby. Instead, the records showed a rise in local shipments. Cho then examined cargo lists and found that the small port had shifted from overseas trade to distributing goods among nearby towns.',
                question: 'Which choice best describes the function of the second sentence?',
                choices: ['It presents a finding that challenges Cho’s initial expectation.', 'It lists the goods most often shipped through the port.', 'It explains why the larger harbor was unsuccessful.', 'It summarizes Cho’s final explanation for the port’s growth.'],
                answer: 0,
                explanation: {
                    whyCorrect: 'The second sentence overturns the expectation in the first and motivates the later investigation.',
                    choices: ['Correct: “Instead” marks a result contrary to the prediction.', 'No goods are listed in that sentence.', 'The larger harbor’s success is not evaluated.', 'The final explanation appears in the third sentence, not the second.'],
                    takeaway: 'For function, connect the target sentence backward and forward.',
                },
            },
            {
                id: 'task-transition',
                difficulty: 'Advanced',
                skill: 'Transitions',
                passage: 'Early maps of the ocean floor relied mainly on depth measurements collected along ship routes. ______ modern sonar can gather continuous data across wide areas, revealing features that isolated measurements often missed.',
                question: 'Which choice completes the text with the most logical transition?',
                choices: ['For example,', 'By contrast,', 'Similarly,', 'Therefore,'],
                answer: 1,
                explanation: {
                    whyCorrect: 'The second sentence contrasts broad, continuous modern data with isolated early measurements.',
                    choices: ['The modern method is not merely one example of the early method.', 'Correct: the methods differ in coverage and continuity.', 'The sentences emphasize difference, not similarity.', 'The modern method is not presented as a consequence caused by early maps.'],
                    takeaway: 'A transition question asks for the relationship between ideas, not the most familiar connector.',
                },
            },
            {
                id: 'task-synthesis',
                difficulty: '700+ Lens',
                skill: 'Rhetorical Synthesis',
                notes: [
                    'Biologist Amara Singh studied two urban moth populations.',
                    'Population A lived near white concrete buildings; 68% of sampled moths had pale wings.',
                    'Population B lived near dark brick warehouses; 71% of sampled moths had dark wings.',
                    'Singh cautioned that the study did not measure survival rates.',
                ],
                question: 'The student wants to present a specific result that suggests an association between wing color and local surroundings without claiming causation. Which choice most effectively uses the notes?',
                choices: [
                    'Singh proved that building color causes urban moths to change their wing color.',
                    'Urban moths can have either pale or dark wings, and Singh studied two populations.',
                    'Pale wings were more common near white concrete buildings, whereas dark wings were more common near dark brick warehouses.',
                    'Because Singh did not measure survival, the two moth populations had identical survival rates.',
                ],
                answer: 2,
                explanation: {
                    whyCorrect: 'It reports both specific results and uses comparison without claiming that surroundings caused the difference.',
                    choices: ['“Proved” and “causes” exceed the observational notes.', 'This is accurate but does not present the requested specific association.', 'Correct: it selects the relevant percentages’ pattern without overstating it.', 'Not measuring survival cannot establish identical survival.'],
                    takeaway: 'Rhetorical synthesis begins with the goal: content, scope, and level of certainty all have to match.',
                },
            },
        ],
    },
    reflection: {
        prompt: 'Choose one stem you often misread. Rewrite it as: “My answer must name ______, using evidence from ______.”',
        steps: ['Name the output, such as role, claim, relationship, or boundary.', 'Name the controlling part of the text.', 'Use that sentence before your next five questions of the same type.'],
    },
};

export default readTaskBeforeText;

