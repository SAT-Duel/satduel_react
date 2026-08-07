const linearInequalities = {
    slug: 'linear-inequalities',
    moduleId: 'linear-equations',
    title: 'Linear Inequalities',
    eyebrow: 'Algebra',
    minutes: '20 min',
    summary: 'An inequality is solved like an equation until a negative multiplication or division reverses the order.',
    goals: [
        'Solve one-step, multi-step, and compound linear inequalities.',
        'Know exactly when the inequality symbol must flip.',
        'Translate words and number-line endpoints into inequality notation.',
    ],
    facts: [
        {label: 'Main skill', value: 'isolate x', note: 'the answer is usually a range, not one number'},
        {label: 'Flip rule', value: 'negative only', note: 'reverse the sign after multiplying or dividing by a negative'},
        {label: 'Open endpoint', value: '< or >', note: 'the boundary value is not included'},
        {label: 'Closed endpoint', value: '\u2264 or \u2265', note: 'the boundary value is included'},
    ],
    sections: [
        {
            heading: 'Big idea 1: an inequality describes many answers',
            paragraphs: [
                'An equation such as x = 4 names one value. An inequality such as x > 4 names every value greater than 4. That is why the final answer is a region on a number line.',
                'A strict sign, < or >, leaves the endpoint open. A sign that includes equality, \u2264 or \u2265, uses a closed endpoint because the boundary itself is allowed.',
            ],
        },
        {
            heading: 'Big idea 2: flip only for a negative scale change',
            paragraphs: [
                'Adding or subtracting the same value on both sides does not reverse the order. Multiplying or dividing both sides by a positive value does not reverse it either.',
                'Multiplying or dividing by a negative value does reverse the order. For example, 2 < 5 becomes -2 > -5. Forgetting this flip is the most common inequality error on the SAT.',
            ],
        },
        {
            heading: 'Big idea 3: test a value when the direction feels wrong',
            paragraphs: [
                'After solving, choose an easy number from your claimed region and plug it into the original inequality. If you got x > -3, test x = 0. If you got x < -3, test x = -4.',
                'This quick check catches a flipped direction, but remember that one test value does not check whether an endpoint should be open or closed. Read the original sign for that detail.',
            ],
        },
    ],
    formulas: [
        {
            label: 'Order-preserving moves',
            math: 'a<b \\Rightarrow a+c<b+c \\quad \\text{and, for } c>0,\\quad ac<bc',
            note: 'Addition, subtraction, and multiplication or division by a positive value keep the direction.',
        },
        {
            label: 'Negative flip rule',
            math: 'a<b \\quad \\text{and}\\quad c<0 \\Rightarrow ac>bc',
            note: 'The sign flips because multiplying by a negative reflects both values across zero.',
        },
        {
            label: 'Compound inequality',
            math: 'a<x\\le b',
            note: 'Read this as two conditions at once: x is greater than a and no greater than b.',
        },
    ],
    strategyCards: [
        {
            title: 'Solve without guessing the direction',
            items: ['Simplify each side first', 'Move variable terms and constants as usual', 'Flip the sign only on the line where you divide or multiply by a negative'],
        },
        {
            title: 'Translate common SAT language',
            items: ['At least means greater than or equal to', 'At most or no more than means less than or equal to', 'More than and fewer than use strict signs'],
        },
    ],
    adaptiveDemo: {
        title: 'Predict the direction',
        prompt: 'Which step changes the inequality symbol?',
        options: [
            {
                id: 'subtract',
                label: 'Subtract 5',
                result: 'The direction stays the same.',
                advice: 'From 5 - 2x < 11, subtracting 5 gives -2x < 6. Addition and subtraction never trigger the flip rule.',
            },
            {
                id: 'divide-negative',
                label: 'Divide by -2',
                result: 'This step flips < to >.',
                advice: 'Dividing -2x < 6 by -2 gives x > -3. Write the new sign during the division step so you do not forget it.',
            },
        ],
    },
    quickCheck: {
        prompt: 'Which phrase translates to x \u2264 12?',
        choices: [
            'x is at least 12.',
            'x is more than 12.',
            'x is at most 12.',
            'x is less than 12, but not equal to it.',
        ],
        answer: 2,
        explanation: 'At most sets an upper limit and allows the endpoint, so x can be 12 or any smaller value.',
    },
    practiceSet: {
        title: 'Classic SAT inequality traps',
        intro: 'Watch the direction, the endpoint, and words such as at least. Answer first, then read the trap note.',
        questions: [
            {
                id: 'one-step-boundary',
                skill: 'One step',
                title: 'Keep the strict endpoint',
                stem: 'Which inequality is equivalent to the one shown?',
                math: 'x+5<12',
                choices: ['x < 7', 'x \u2264 7', 'x > 7', 'x < 17'],
                answer: 0,
                explanation: {
                    steps: ['Subtract 5 from both sides: x < 7.', 'The original sign is strict, so 7 is not included.'],
                    trap: 'Changing < to \u2264 adds x = 7 even though 7 + 5 is not less than 12.',
                    takeaway: 'Adding or subtracting does not change the sign or the endpoint type.',
                },
            },
            {
                id: 'negative-division',
                skill: 'Flip rule',
                title: 'Divide by a negative',
                stem: 'Which inequality is equivalent to the one shown?',
                math: '-3x\\ge12',
                choices: ['x \u2265 -4', 'x \u2264 -4', 'x \u2265 4', 'x \u2264 4'],
                answer: 1,
                explanation: {
                    steps: ['Divide both sides by -3.', 'Reverse \u2265 to \u2264: x \u2264 -4.'],
                    trap: 'The answer x \u2265 -4 keeps the old direction after division by a negative.',
                    takeaway: 'A negative division changes both the signs of the numbers and the inequality direction.',
                },
            },
            {
                id: 'two-step-negative',
                skill: 'Signs',
                title: 'Do not flip too early',
                stem: 'Solve the inequality.',
                math: '2-5x<17',
                choices: ['x < -3', 'x > -3', 'x < 3', 'x > 3'],
                answer: 1,
                explanation: {
                    steps: ['Subtract 2: -5x < 15.', 'Divide by -5 and flip the sign: x > -3.'],
                    trap: 'Subtracting 2 does not flip the sign. Dividing by -5 does.',
                    takeaway: 'Attach the flip to the exact negative multiplication or division that causes it.',
                },
            },
            {
                id: 'variables-both-sides',
                skill: 'Both sides',
                title: 'Collect variable terms first',
                stem: 'Solve the inequality.',
                math: '4(x-1)\\le2x+6',
                choices: ['x \u2264 1', 'x \u2265 1', 'x \u2264 5', 'x \u2265 5'],
                answer: 2,
                explanation: {
                    steps: ['Distribute: 4x - 4 \u2264 2x + 6.', 'Subtract 2x: 2x - 4 \u2264 6.', 'Add 4 and divide by 2: x \u2264 5.'],
                    trap: 'Moving 4 across the inequality as -4 reverses the needed operation. Add 4 to both sides instead.',
                    takeaway: 'Positive division leaves the direction unchanged.',
                },
            },
            {
                id: 'fraction-group',
                skill: 'Fractions',
                title: 'Clear a positive denominator',
                stem: 'Solve the inequality.',
                math: '\\frac{x+1}{3}>2',
                choices: ['x > 5', 'x > 7', 'x < 5', 'x \u2265 5'],
                answer: 0,
                explanation: {
                    steps: ['Multiply both sides by positive 3: x + 1 > 6.', 'Subtract 1: x > 5.'],
                    trap: 'Multiplying by positive 3 does not flip the sign.',
                    takeaway: 'Only the sign of the multiplier matters, not the presence of a fraction.',
                },
            },
            {
                id: 'compound',
                skill: 'Compound',
                title: 'Apply each move to all three parts',
                stem: 'Solve the compound inequality.',
                math: '-2<3x+4\\le10',
                choices: ['-2 < x \u2264 2', '-6 < x \u2264 6', '-2 \u2264 x < 2', '2 < x \u2264 6'],
                answer: 0,
                explanation: {
                    steps: ['Subtract 4 from all three parts: -6 < 3x \u2264 6.', 'Divide all three parts by 3: -2 < x \u2264 2.'],
                    trap: 'Changing only the middle and right parts breaks the compound inequality.',
                    takeaway: 'Treat a compound inequality like a three-part balance.',
                },
            },
            {
                id: 'at-most',
                skill: 'Translation',
                title: 'Read the limiting phrase',
                stem: 'A suitcase may weigh at most 18 kilograms. If w is its weight, which inequality represents the rule?',
                choices: ['w < 18', 'w \u2264 18', 'w > 18', 'w \u2265 18'],
                answer: 1,
                explanation: {
                    steps: ['At most means 18 is the greatest allowed value.', 'Because exactly 18 is allowed, w \u2264 18.'],
                    trap: 'The strict sign w < 18 incorrectly rejects a suitcase weighing exactly 18 kilograms.',
                    takeaway: 'At most and no more than include equality.',
                },
            },
            {
                id: 'graph-endpoint',
                skill: 'Number line',
                title: 'Match the endpoint and direction',
                stem: 'A number line has a closed dot at -1 and is shaded to the right. Which inequality does it show?',
                choices: ['x < -1', 'x \u2264 -1', 'x > -1', 'x \u2265 -1'],
                answer: 3,
                explanation: {
                    steps: ['A closed dot includes -1, so equality is allowed.', 'Shading right means values greater than -1: x \u2265 -1.'],
                    trap: 'The direction of the arrow tells which values are included; it is not determined by where the dot sits on the page.',
                    takeaway: 'Closed means equality; right means greater.',
                },
            },
            {
                id: 'no-solution',
                skill: 'Special case',
                title: 'A false statement means no values',
                stem: 'What is the solution set?',
                math: '3x+2<3x-1',
                choices: ['x < -1', 'x > -1', 'All real numbers', 'No solution'],
                answer: 3,
                explanation: {
                    steps: ['Subtract 3x from both sides: 2 < -1.', 'This statement is always false, so no value of x works.'],
                    trap: 'When x cancels, do not invent x < -1 from the remaining constant.',
                    takeaway: 'A false constant statement gives no solution.',
                },
            },
            {
                id: 'all-real',
                skill: 'Special case',
                title: 'A true statement means every value',
                stem: 'What is the solution set?',
                math: '2(x+3)\\ge2x+5',
                choices: ['x \u2265 1', 'x \u2264 1', 'All real numbers', 'No solution'],
                answer: 2,
                explanation: {
                    steps: ['Distribute: 2x + 6 \u2265 2x + 5.', 'Subtract 2x: 6 \u2265 5.', 'The statement is always true, so every real x works.'],
                    trap: 'The constants do not turn into a boundary for x after the variable cancels.',
                    takeaway: 'A true constant statement gives all real numbers.',
                },
            },
        ],
    },
};

export default linearInequalities;
