const completingTheSquare = {
    slug: 'completing-the-square',
    moduleId: 'quadratic-foundations',
    title: 'Completing the Square',
    eyebrow: 'Advanced Math',
    minutes: '36 min',
    summary: 'Completing the square turns a quadratic into a shifted square, revealing its vertex and creating a solving method that works even when factoring does not.',
    goals: [
        'Explain why half the linear coefficient is squared.',
        'Complete the square when the leading coefficient is one or not one.',
        'Convert standard form to vertex form without sign errors.',
        'Use the method to solve equations, optimize expressions, and handle parameters.',
    ],
    facts: [
        {label: 'Core move', math: '\\left(\\frac{b}{2}\\right)^2', note: 'when the squared-term coefficient is one'},
        {label: 'Balance rule', math: '+d\\text{ on both sides}', note: 'equations must keep equal value'},
        {label: 'Vertex input', math: '-\\frac{b}{2a}', note: 'the center of the completed square'},
        {label: 'Best use', math: 'a(x-h)^2+k', note: 'reveals extrema, range, and transformations'},
    ],
    sections: [
        {
            heading: 'Big idea 1: build a perfect-square trinomial',
            paragraphs: [
                'Squaring a binomial creates two matching cross products. Therefore the number inside the binomial must be half the coefficient of the linear term when the squared-term coefficient is one.',
                'Adding the square of that half-number creates an exact perfect square. In an equation, add the same amount to both sides; in an expression, add and subtract it within the same side.',
            ],
            math: 'x^2+bx+\\left(\\frac b2\\right)^2=\\left(x+\\frac b2\\right)^2',
        },
        {
            heading: 'Big idea 2: make the squared-term coefficient one first',
            paragraphs: [
                'If the leading coefficient is not one, factor it from the squared and linear terms before using half then square. The coefficient inside the parentheses is the one that gets halved.',
                'A common error is to factor the leading coefficient from the constant too when converting an expression. Keep careful track of which terms are inside the grouped quadratic.',
            ],
            math: 'ax^2+bx=a\\left(x^2+\\frac ba x\\right)',
        },
        {
            heading: 'Big idea 3: completed-square form exposes distance from the axis',
            paragraphs: [
                'The square measures how far an input lies from the axis of symmetry. It reaches its smallest value, zero, at the axis and grows equally on both sides.',
                'That makes maximum and minimum questions nearly automatic. The sign of the outer coefficient tells whether moving away from the axis raises or lowers the output.',
            ],
            math: 'f(x)=a(x-h)^2+k,\\qquad (x-h)^2\\ge0',
        },
        {
            heading: 'Big idea 4: the coefficient shortcut is completed square in disguise',
            paragraphs: [
                'The axis formula and the vertex-output formula come directly from the general completed-square form. High scorers can use them to avoid repeating the full conversion when only the vertex is requested.',
                'Still know the full method: questions may ask for an equivalent expression or a missing constant that creates a perfect square.',
            ],
            math: 'ax^2+bx+c=a\\left(x+\\frac{b}{2a}\\right)^2+\\left(c-\\frac{b^2}{4a}\\right)',
        },
    ],
    formulas: [
        {
            label: 'Perfect-square completion', math: 'x^2+bx+\\left(\\frac b2\\right)^2=\\left(x+\\frac b2\\right)^2',
            note: 'Half the linear coefficient, then square that half.', meaning: 'The added constant makes the first three terms exactly one squared binomial.', useWhen: 'The squared-term coefficient is one.',
        },
        {
            label: 'Complete within an expression', math: 'x^2+bx+c=\\left(x+\\frac b2\\right)^2+c-\\left(\\frac b2\\right)^2',
            note: 'Add and subtract the same number so the expression’s value stays unchanged.', meaning: 'Part becomes a perfect square while the correction remains outside.', useWhen: 'Converting a function or expression to vertex form.',
        },
        {
            label: 'General completed-square form', math: 'ax^2+bx+c=a\\left(x+\\frac{b}{2a}\\right)^2+c-\\frac{b^2}{4a}',
            note: 'Factor a from the variable terms before completing the square.', meaning: 'Every quadratic is a scaled and shifted square.', useWhen: 'The leading coefficient is not one or a general coefficient result is useful.',
        },
        {
            label: 'Vertex from coefficients', math: '(h,k)=\\left(-\\frac{b}{2a},\\ c-\\frac{b^2}{4a}\\right)',
            note: 'The second coordinate also equals the function value at the first.', meaning: 'This is the center and extremum exposed by completing the square.', useWhen: 'Only the vertex is requested and full conversion is unnecessary.',
        },
        {
            label: 'Solve by square roots', math: '(x-h)^2=d\\Rightarrow x=h\\pm\\sqrt d',
            note: 'Use both signs when d is positive.', meaning: 'Two inputs can lie the same distance from the axis.', useWhen: 'Completing the square has isolated one squared binomial.',
        },
        {
            label: 'Real-solution cases after completing', math: '\\begin{cases}d>0&\\Rightarrow2\\text{ real solutions}\\\\d=0&\\Rightarrow1\\text{ real solution}\\\\d<0&\\Rightarrow0\\text{ real solutions}\\end{cases}',
            note: 'A real square cannot equal a negative number.', meaning: 'The right side controls how many real distances from the axis exist.', useWhen: 'You need the number of solutions more than the solutions themselves.',
        },
        {
            label: 'Minimum or maximum value', math: 'a(x-h)^2+k\\begin{cases}\\ge k,&a>0\\\\\\le k,&a<0\\end{cases}',
            note: 'Equality occurs at x equal to h.', meaning: 'The square contributes zero at the vertex and otherwise changes output in the direction of a.', useWhen: 'Optimizing a quadratic expression without calculus.',
        },
    ],
    workedExamples: [
        {
            level: 'Foundation', title: 'Create a perfect square', prompt: 'Find the missing constant and factor the trinomial.', math: 'x^2+10x+\\square',
            steps: [{text: 'Half the linear coefficient.', math: '\\frac{10}{2}=5'}, {text: 'Square that result.', math: '5^2=25'}, {text: 'Write the perfect square.', math: 'x^2+10x+25=(x+5)^2'}],
            insight: 'The inner constant five produces the middle term two times five x.', trap: 'The missing constant is twenty-five, not five.',
        },
        {
            level: 'Foundation', title: 'Convert a monic quadratic', prompt: 'Write the function in vertex form.', math: 'f(x)=x^2-8x+3',
            steps: [{text: 'Add and subtract the completion number.', math: 'x^2-8x+16-16+3'}, {text: 'Factor the perfect square and combine constants.', math: 'f(x)=(x-4)^2-13'}, {text: 'Read the vertex.', math: '(4,-13)'}],
            insight: 'Adding and subtracting sixteen changes the form but not the value.', trap: 'Adding sixteen without subtracting it would create a different function.',
        },
        {
            level: 'Core SAT', title: 'Factor the leading coefficient first', prompt: 'Write the function in vertex form.', math: 'g(x)=2x^2+12x-5',
            steps: [{text: 'Factor two from the variable terms.', math: '2(x^2+6x)-5'}, {text: 'Complete the square inside; half of six is three.', math: '2(x^2+6x+9-9)-5'}, {text: 'Distribute the correction carefully.', math: '2(x+3)^2-18-5=2(x+3)^2-23'}],
            insight: 'The inside correction nine is multiplied by the outside two.', trap: 'Subtracting only nine outside forgets the leading coefficient.',
        },
        {
            level: 'Core SAT', title: 'Solve by completing the square', prompt: 'Solve the equation over the real numbers.', math: 'x^2+6x-7=0',
            steps: [{text: 'Move the constant and add the completion number.', math: 'x^2+6x=7\\Rightarrow x^2+6x+9=16'}, {text: 'Factor and take both square roots.', math: '(x+3)^2=16\\Rightarrow x+3=\\pm4'}, {text: 'Solve both cases.', math: 'x=1\\quad\\text{or}\\quad x=-7'}],
            insight: 'The plus-or-minus represents equal distances on opposite sides of the axis.', trap: 'Using only the positive square root loses one solution.',
        },
        {
            level: 'Advanced', title: 'Find a minimum without converting every term', prompt: 'Find the minimum value of the expression.', math: '3x^2-24x+50',
            steps: [{text: 'Find the vertex input.', math: 'h=-\\frac{-24}{2(3)}=4'}, {text: 'Evaluate the expression there.', math: 'f(4)=3(16)-24(4)+50=2'}, {text: 'The leading coefficient is positive.', math: 'a=3>0\\Rightarrow\\min f=2'}],
            insight: 'The coefficient shortcut is the compressed result of completing the square.', trap: 'Four is the input where the minimum occurs; two is the minimum value.',
        },
        {
            level: 'Advanced', title: 'Force a repeated square with a parameter', prompt: 'Find k so the expression is a perfect square.', math: '4x^2+kx+49',
            steps: [{text: 'The squared outer terms suggest a binomial.', math: '(2x\\pm7)^2=4x^2\\pm28x+49'}, {text: 'Match the possible middle coefficients.', math: 'k=28\\quad\\text{or}\\quad k=-28'}],
            insight: 'Both signs produce a perfect square unless the question imposes a sign condition.', trap: 'Multiplying two and seven gives fourteen, but the middle term contains two cross products.',
        },
    ],
    strategyCards: [
        {title: 'For an expression', items: ['Group the variable terms', 'Add and subtract the completion number on the same side', 'Factor the square and combine the outside constants']},
        {title: 'For an equation', items: ['Move the constant away from the variable terms', 'Add the same completion number to both sides', 'Take both square roots and solve both cases']},
        {title: 'When a is not one', items: ['Factor a from x-squared and x terms first', 'Half the new inside linear coefficient', 'Multiply the inside correction by a when moving it outside']},
    ],
    studyTips: [
        {title: 'Say “half, then square” aloud', summary: 'This order prevents the most common procedural error.', items: ['Half the coefficient attached to x', 'Square the result to find the added constant', 'Use the half-number inside the final binomial']},
        {title: 'Mark the balance type', summary: 'Expressions and equations preserve value differently.', items: ['Expression: add and subtract on one side', 'Equation: add the same amount to both sides', 'Never add a number only once and claim equivalence']},
        {title: 'Separate input from output', summary: 'Vertex questions often ask one but tempt you to report the other.', items: ['The axis value is the vertex input', 'Evaluating there gives the extremum output', 'Read the wording: “where” versus “what value”']},
    ],
    adaptiveDemo: {
        title: 'Choose the right completion number', prompt: 'Inside the parentheses you see x squared plus fourteen x. What do you add?',
        options: [
            {id: '49', label: '49', result: 'Correct.', advice: 'Half of fourteen is seven, and seven squared is forty-nine.'},
            {id: '7', label: '7', result: 'That is the half-number, not the completion number.', advice: 'Seven goes inside the binomial; forty-nine is added to make the trinomial.'},
            {id: '196', label: '196', result: 'That squares too early.', advice: 'First halve fourteen, then square seven.'},
        ],
    },
    quickCheck: {
        prompt: 'Which expression is equivalent?', math: 'x^2+12x+5',
        choices: ['(x+6)^2-31', '(x+6)^2+5', '(x+12)^2-139', '(x-6)^2-31'], choiceMath: true, answer: 0,
        explanation: 'Add and subtract thirty-six: x squared plus twelve x plus thirty-six minus thirty-one equals the square of x plus six minus thirty-one.',
    },
    practiceSet: {
        title: 'Completing the square from foundation to hard Module 2',
        intro: 'Track the balance, the leading coefficient, and whether the question asks for a location or a value.',
        questions: [
            {id: 'missing-positive', difficulty: 'Foundation', skill: 'Perfect square', title: 'Find the completion number', stem: 'What value completes the square?', math: 'x^2+16x+c', choices: ['8', '16', '64', '256'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Half sixteen, then square.', math: 'c=\\left(\\frac{16}{2}\\right)^2=8^2=64'}], trap: 'Eight is the number inside the binomial, not the added constant.', takeaway: 'Half, then square.'}},
            {id: 'missing-negative', difficulty: 'Foundation', skill: 'Perfect square', title: 'Ignore the sign when squaring', stem: 'What value completes the square?', math: 'x^2-18x+c', choices: ['-81', '-9', '9', '81'], choiceMath: true, answer: 3, explanation: {steps: [{text: 'Half negative eighteen and square.', math: 'c=(-9)^2=81'}], trap: 'A squared completion constant is nonnegative.', takeaway: 'The binomial sign is negative, but the added square is positive.'}},
            {id: 'monic-convert', difficulty: 'Foundation', skill: 'Vertex form', title: 'Convert without changing value', stem: 'Which expression is equivalent?', math: 'x^2+4x-6', choices: ['(x+2)^2-10', '(x+2)^2-6', '(x-2)^2-10', '(x+4)^2-22'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Add and subtract four.', math: 'x^2+4x+4-4-6=(x+2)^2-10'}], trap: 'The added four must be offset outside the square.', takeaway: 'Complete the square while preserving the original value.'}},
            {id: 'vertex-identify', difficulty: 'Core', skill: 'Vertex', title: 'Read after converting', stem: 'What is the vertex?', math: 'f(x)=x^2-10x+18', choices: ['(-5,-7)', '(5,-7)', '(-5,7)', '(5,7)'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Complete the square.', math: 'x^2-10x+25-25+18=(x-5)^2-7'}, {text: 'Read the vertex.', math: '(5,-7)'}], trap: 'The inside sign reverses; the outside sign does not.', takeaway: 'Completed-square form makes the vertex visible.'}},
            {id: 'nonmonic-convert', difficulty: 'Core', skill: 'Leading coefficient', title: 'Carry the outside multiplier', stem: 'Which expression is equivalent?', math: '3x^2-18x+4', choices: ['3(x-3)^2-23', '3(x-3)^2-5', '3(x-6)^2-104', '(3x-3)^2-5'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Factor three from variable terms.', math: '3(x^2-6x)+4'}, {text: 'Complete inside and correct outside.', math: '3[(x-3)^2-9]+4=3(x-3)^2-23'}], trap: 'The correction negative nine is multiplied by three.', takeaway: 'Factor the leading coefficient before completing.'}},
            {id: 'solve-square', difficulty: 'Core', skill: 'Solving', title: 'Use both square roots', stem: 'What is the larger solution?', math: 'x^2-8x+7=0', choices: ['1', '4', '7', '9'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Complete the square.', math: 'x^2-8x+16=9\\Rightarrow(x-4)^2=9'}, {text: 'Take both roots.', math: 'x=4\\pm3\\Rightarrow x=1,7'}], trap: 'The axis input four is not itself a solution.', takeaway: 'A positive squared distance usually gives two solutions.'}},
            {id: 'minimum-value', difficulty: 'Core', skill: 'Optimization', title: 'Distinguish where from what', stem: 'What is the minimum value?', math: 'f(x)=2(x+4)^2-11', choices: ['-11', '-4', '2', '11'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'The square is minimized at zero.', math: '2(x+4)^2\\ge0'}, {text: 'Therefore the output is bounded below.', math: 'f(x)\\ge-11'}], trap: 'Negative four is where the minimum occurs, not the minimum output.', takeaway: 'In upward vertex form, k is the minimum value.'}},
            {id: 'maximum-standard', difficulty: 'Advanced', skill: 'Coefficient shortcut', title: 'Find an extremum efficiently', stem: 'What is the maximum value?', math: 'f(x)=-2x^2+16x-19', choices: ['4', '13', '16', '19'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Find the vertex input.', math: 'h=-\\frac{16}{2(-2)}=4'}, {text: 'Evaluate.', math: 'f(4)=-2(16)+64-19=13'}], trap: 'Four is the input location; thirteen is the maximum output.', takeaway: 'Use the axis shortcut, then evaluate once.'}},
            {id: 'parameter-perfect-square', difficulty: 'Advanced', skill: 'Parameters', title: 'Match a squared binomial', stem: 'For what positive value of p is the expression a perfect square?', math: '25x^2+px+16', choices: ['20', '40', '80', '400'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Use the positive-sign square.', math: '(5x+4)^2=25x^2+40x+16'}, {text: 'Match coefficients.', math: 'p=40'}], trap: 'Five times four is only one cross product; the middle term contains two.', takeaway: 'A perfect-square middle coefficient is twice the product of the square roots.'}},
            {id: 'no-real-square', difficulty: 'Advanced', skill: 'Solution count', title: 'Recognize an impossible real square', stem: 'How many real solutions?', math: 'x^2+6x+15=0', choices: ['0', '1', '2', '3'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Complete the square.', math: 'x^2+6x+9=-6\\Rightarrow(x+3)^2=-6'}, {text: 'A real square cannot be negative.', math: '(x+3)^2\\ge0'}], trap: 'Taking the square root of negative six does not give a real number.', takeaway: 'A completed square can reveal the solution count immediately.'}},
            {id: 'vertex-output-formula', difficulty: 'Advanced', skill: 'General formula', title: 'Use the compressed completion', stem: 'What is the minimum value?', math: 'f(x)=4x^2+12x+1', choices: ['-9', '-8', '-7', '1'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Use the vertex-output shortcut.', math: 'k=c-\\frac{b^2}{4a}=1-\\frac{144}{16}=1-9=-8'}], trap: 'The denominator is four times a, not four a squared.', takeaway: 'Completing the square yields k equal to c minus b squared over four a.'}},
            {id: 'translated-square-parameter', difficulty: 'Advanced', skill: 'Coefficient matching', title: 'Read a hidden vertex form', stem: 'The identity holds for every x. What is m plus n?', math: '2x^2-20x+41=2(x-m)^2+n', choices: ['-41', '-9', '-4', '5'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Factor and complete.', math: '2(x^2-10x)+41=2[(x-5)^2-25]+41'}, {text: 'Simplify.', math: '2(x-5)^2-9'}, {text: 'Match parameters.', math: 'm=5,\\quad n=-9,\\quad m+n=-4'}], trap: 'Negative nine is n alone; the question asks for the sum of both parameters.', takeaway: 'After completing the square, match each parameter before combining them.'}},
        ],
    },
};

export default completingTheSquare;
