const textualContract = {
    subject: 'english',
    slug: 'the-textual-contract',
    moduleId: 'english-reading-method',
    title: 'The Textual Contract',
    minutes: '22 min',
    summary: 'Choose only what the text earns: the right subject, direction, scope, and certainty—with no credit for answers that are merely reasonable in real life.',
    goals: [
        'Separate direct textual support from outside plausibility.',
        'Check subject, direction, scope, and certainty before accepting a choice.',
        'Handle subtle 700+ answers that differ mainly in strength or reach.',
    ],
    openingCheck: {
        prompt: 'A passage reports that one rooftop garden attracted more bee species than one nearby conventional roof. Which conclusion does the text support?',
        choices: [
            'Rooftop gardens always increase citywide bee populations.',
            'In this comparison, the garden roof hosted a greater variety of bee species.',
            'Conventional roofs are harmful to every pollinator species.',
            'The garden roof caused the neighborhood’s ecosystem to recover.',
        ],
        answer: 1,
        explanation: 'The supported choice preserves the study’s measured outcome and limited comparison. The other choices expand one observation into universal or causal claims.',
    },
    concepts: [
        {
            heading: 'The passage sets a contract',
            body: [
                'On the SAT, an answer is correct because the words on the screen authorize it. Your experience can help you understand a topic, but it cannot supply missing evidence. A sensible claim with no textual support is still wrong.',
                'Treat the passage as a closed evidence system. Ask, “What could I underline that pays for every meaningful word in this answer?”',
            ],
            moves: ['No outside facts', 'No charitable assumptions', 'No stronger claim than the evidence', 'Every key word gets a receipt'],
        },
        {
            heading: 'Run the four-part support check',
            body: [
                'First, subject: is the answer about the same person, group, or idea? Second, direction: does it preserve increase versus decrease, agreement versus disagreement, or cause versus effect? Third, scope: does it stay within the population, period, and condition studied? Fourth, certainty: does the text say may, suggests, or proves?',
                'Most tempting distractors pass two or three checks. The right answer must pass all four.',
            ],
            moves: ['Subject', 'Direction', 'Scope', 'Certainty'],
        },
        {
            heading: 'Inference means required, not imaginable',
            body: [
                'An inference joins facts the passage already gives. It may be unstated, but it should become difficult to deny once those facts are combined. If you need a new event, motive, or scientific mechanism, the inference is too ambitious.',
                'At higher difficulty, two choices may point in the correct direction. Prefer the one whose strength and scope most closely match the evidence.',
            ],
            moves: ['Combine stated facts', 'Use the smallest logical bridge', 'Reject new stories', 'Match the passage’s confidence'],
        },
    ],
    workedExample: {
        skill: 'Scope and certainty',
        passage: 'Researchers placed identical clay tiles at three depths in one coastal bay. After six months, the shallow tiles supported more algal species than the deepest tiles. The researchers note that light levels differed by depth, but they did not isolate light from temperature or water movement.',
        question: 'Which conclusion is best supported by the text?',
        prediction: 'The study found an association between depth and algal variety in this bay, but it did not establish which environmental factor caused it.',
        choices: [
            { text: 'Greater light exposure causes higher algal diversity in every coastal habitat.', verdict: 'Too strong', analysis: 'The study did not isolate light, establish causation, or sample every habitat.' },
            { text: 'In the sampled bay, tile depth was associated with differences in the number of algal species observed.', verdict: 'Best', analysis: 'This keeps the setting, outcome, and noncausal relationship intact.' },
            { text: 'Temperature had no effect on the organisms growing on the tiles.', verdict: 'Unsupported', analysis: 'Temperature was not isolated, so its effect remains unknown.' },
            { text: 'Deep-water tiles cannot support algae.', verdict: 'Contradicted', analysis: 'The deepest tiles supported fewer species, not zero algae.' },
        ],
        answer: 1,
        decision: 'Choose the claim the study earned, not the grander claim the topic makes tempting.',
    },
    takeaways: {
        rule: 'Accept a choice only when its subject, direction, scope, and certainty are all paid for by the passage.',
        highScore: 'When two choices seem supported, compare their strongest word. “Some,” “often,” “primarily,” and “proves” carry different evidence costs. The correct answer is not automatically timid; it is exactly as strong as the text permits.',
        checklist: ['Same subject?', 'Same logical direction?', 'Same boundaries?', 'Same level of confidence?'],
    },
    practiceSet: {
        title: 'Make every answer show its receipt',
        intro: 'Move from direct support to increasingly fine distinctions in scope and certainty.',
        questions: [
            {
                id: 'contract-foundation', difficulty: 'Foundation', skill: 'Direct support',
                passage: 'A library extended its Friday hours for eight weeks. During that period, average Friday attendance rose from 84 visitors to 113 visitors. Attendance on other weekdays was not measured.',
                question: 'Which statement is supported by the text?',
                choices: ['The extended hours coincided with higher average Friday attendance.', 'The library became more popular on every weekday.', 'Longer hours always cause attendance to rise.', 'Exactly 29 new people visited every Friday.'],
                answer: 0,
                explanation: { whyCorrect: 'It reports the measured Friday pattern without turning correlation into causation.', choices: ['Correct: same period, measure, and certainty.', 'Other weekdays were not measured.', 'The passage does not establish a universal cause.', 'The averages differ by 29, but that does not identify 29 distinct people each Friday.'], takeaway: 'Keep the answer inside the measurement.' },
            },
            {
                id: 'contract-inference', difficulty: 'Core', skill: 'Inference',
                passage: 'Historian Laleh Moradi found that a merchant’s 1784 ledger used two ink colors. Entries in black ink appear throughout the year, while blue-ink entries appear only after October. Chemical analysis dates both inks to the eighteenth century.',
                question: 'Which conclusion is most reasonably inferred?',
                choices: ['The merchant disliked blue ink before October.', 'At least some entries were made using a different ink later in the recorded year.', 'Every blue entry was written by a second merchant.', 'The ledger was forged in the nineteenth century.'],
                answer: 1,
                explanation: { whyCorrect: 'The timing and two verified inks together support a later change in writing material.', choices: ['A preference is not stated or required.', 'Correct: it makes the smallest bridge between the given facts.', 'Ink color does not identify the writer.', 'The chemical dating points to the eighteenth century, not a later forgery.'], takeaway: 'A sound inference connects facts without inventing a motive or actor.' },
            },
            {
                id: 'contract-evidence', difficulty: 'Advanced', skill: 'Command of evidence',
                passage: 'A researcher proposes that brief exposure to the scent of a familiar food improves autobiographical recall in adults.',
                question: 'Which finding, if true, would most directly support the proposal?',
                choices: ['Participants rated familiar scents as more pleasant than unfamiliar scents.', 'After familiar-food scents, participants recalled more specific personal events than they did after an odorless control.', 'Some foods used in the study were more common in one region than another.', 'Participants could name most of the familiar foods from scent alone.'],
                answer: 1,
                explanation: { whyCorrect: 'It directly compares the proposed condition with a control on the exact outcome: autobiographical recall.', choices: ['Pleasantness is adjacent to, but not evidence of, recall.', 'Correct: condition, comparison, and measured outcome align.', 'Regional frequency does not test the proposed effect.', 'Identifying a scent is not recalling a personal event.'], takeaway: 'Direct evidence must touch both the proposed cause or condition and the claimed outcome.' },
            },
            {
                id: 'contract-700', difficulty: '700+ Lens', skill: 'Calibrated claim',
                passage: 'In three laboratory trials, a ceramic coating reduced heat loss from identical water containers more than two commercially available coatings did. The researchers caution that outdoor wind and repeated freezing may affect coating performance and were not simulated.',
                question: 'Which conclusion best reflects the results and limitation?',
                choices: ['The ceramic coating is the most effective insulation available for all outdoor uses.', 'The ceramic coating will probably fail whenever temperatures fall below freezing.', 'Under the tested laboratory conditions, the ceramic coating outperformed the two comparison coatings, though its outdoor performance remains uncertain.', 'Because the study omitted wind, its laboratory measurements provide no information about coating performance.'],
                answer: 2,
                explanation: { whyCorrect: 'It preserves the observed advantage while limiting it to tested conditions and acknowledging the open question.', choices: ['“Most effective,” “available,” and “all” outrun the study.', 'The limitation creates uncertainty, not evidence of failure.', 'Correct: neither exaggerates nor erases the result.', 'A limitation narrows a result; it does not make the measured comparison meaningless.'], takeaway: 'The precise answer can state a real result and a real limitation at the same time.' },
            },
        ],
    },
    reflection: {
        prompt: 'Find the strongest word in an answer you recently missed. What exact evidence would that word have required?',
        steps: ['Underline the costly word.', 'Name the missing comparison, population, or causal test.', 'Rewrite the choice at the strength the passage actually supports.'],
    },
};

export default textualContract;
