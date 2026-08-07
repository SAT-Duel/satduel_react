const quadraticFormula = {
    slug: 'the-quadratic-formula',
    moduleId: 'quadratic-foundations',
    title: 'The Quadratic Formula',
    eyebrow: 'Advanced Math',
    minutes: '36 min',
    summary: 'The quadratic formula solves every quadratic equation. Accuracy comes from standardizing first, carrying coefficient signs, and simplifying exact answers before using decimals.',
    goals: [
        'Put any quadratic equation into zero-equals-standard form.',
        'Substitute signed coefficients into the quadratic formula accurately.',
        'Simplify radical solutions and choose exact or approximate form appropriately.',
        'Use the formula on nonfactorable, parameterized, and quadratic-in-form equations.',
    ],
    facts: [
        {label: 'Required setup', math: 'ax^2+bx+c=0', note: 'identify coefficients only after one side is zero'},
        {label: 'Numerator', math: '-b\\pm\\sqrt{b^2-4ac}', note: 'the opposite of b comes before both branches'},
        {label: 'Denominator', math: '2a', note: 'the entire numerator is divided by this'},
        {label: 'Answer form', math: '\\text{exact first}', note: 'approximate only when context or choices require it'},
    ],
    sections: [
        {
            heading: 'Big idea 1: the formula expects a zero equation',
            paragraphs: [
                'The letters a, b, and c are coefficients of one side only after the other side equals zero. Moving terms can change their signs, so label the coefficients after rearranging rather than before.',
                'If every coefficient shares a common factor, divide it out first. The solutions stay the same and the arithmetic becomes smaller.',
            ],
            math: 'ax^2+bx+c=0,\\qquad a\\ne0',
        },
        {
            heading: 'Big idea 2: parentheses protect negative coefficients',
            paragraphs: [
                'Substitute the signed value of each coefficient into a written template. If b is negative, then negative b becomes positive; however, b squared is positive regardless of the sign.',
                'Keep the entire numerator grouped over twice a. Splitting the fraction incorrectly is one of the most common calculator-entry errors.',
            ],
            math: 'b=-7\\Rightarrow-b=7,\\qquad b^2=(-7)^2=49',
        },
        {
            heading: 'Big idea 3: exact form preserves information',
            paragraphs: [
                'A radical answer is exact. A decimal is rounded and should usually wait until the final step. Simplify the radical by extracting its largest perfect-square factor and reduce any common factor across the whole numerator and denominator.',
                'On multiple-choice questions, exact structure often matches an option immediately and avoids rounding uncertainty.',
            ],
            math: '\\sqrt{72}=\\sqrt{36\\cdot2}=6\\sqrt2',
        },
        {
            heading: 'Big idea 4: solving both branches does not mean keeping both',
            paragraphs: [
                'The plus-or-minus creates two algebraic candidates when the radical is positive. A context can reject one candidate because time, length, or another quantity cannot be negative.',
                'For a disguised quadratic, solve first for the repeated expression and then finish every resulting equation. One plus-or-minus stage can lead to as many as four real x-values.',
            ],
            math: 'u=x^2\\Rightarrow u=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\Rightarrow x=\\pm\\sqrt u',
        },
    ],
    formulas: [
        {
            label: 'Quadratic formula', math: 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}', note: 'Use the coefficients from ax squared plus bx plus c equals zero.', meaning: 'The two branches give every solution of a quadratic, including repeated or nonreal solutions.', useWhen: 'Factoring is difficult, coefficients are messy, or an exact general solution is required.',
        },
        {
            label: 'Coefficient labeling', math: 'ax^2+bx+c=0\\Rightarrow(a,b,c)', note: 'Include each coefficient’s sign and use zero for a missing term.', meaning: 'The formula depends on position and sign, not merely the visible numbers.', useWhen: 'Before every substitution into the formula.',
        },
        {
            label: 'Radical extraction', math: '\\sqrt{mn}=\\sqrt m\\sqrt n\\quad(m,n\\ge0)', note: 'Choose m as the largest perfect-square factor you can spot.', meaning: 'A perfect-square factor leaves the radical as an integer multiplier.', useWhen: 'The quantity under the square root is not already square-free.',
        },
        {
            label: 'Reduce the full fraction', math: '\\frac{pu\\pm pv}{pw}=\\frac{u\\pm v}{w},\\qquad p\\ne0', note: 'A common factor must divide every term in the numerator and the denominator.', meaning: 'Factoring a shared multiplier preserves both solution branches.', useWhen: 'The simplified radical and negative b share a factor with twice a.',
        },
        {
            label: 'Exact-to-decimal workflow', math: 'x_{\\pm}=\\frac{-b\\pm\\sqrt D}{2a}\\longrightarrow x_{\\pm}\\approx\\text{decimal}', note: 'Round once at the end and to the precision requested.', meaning: 'Exact form prevents accumulated rounding error.', useWhen: 'A context, graph, or decimal answer choice requires an approximation.',
        },
        {
            label: 'Root-sum check', math: 'x_1+x_2=-\\frac ba', note: 'This checks the sign and scale of the two formula outputs.', meaning: 'The plus and minus radicals cancel when the roots are added.', useWhen: 'You want a quick verification or only the sum is requested.',
        },
        {
            label: 'Root-product check', math: 'x_1x_2=\\frac ca', note: 'A negative product means the real roots have opposite signs.', meaning: 'The product follows from the constant-to-leading coefficient ratio.', useWhen: 'You want a second verification or only a symmetric root expression is requested.',
        },
    ],
    workedExamples: [
        {
            level: 'Foundation', title: 'Apply the formula to a nonfactorable quadratic', prompt: 'Solve exactly.', math: 'x^2-4x-1=0',
            steps: [{text: 'Label signed coefficients.', math: 'a=1,\\quad b=-4,\\quad c=-1'}, {text: 'Substitute.', math: 'x=\\frac{-(-4)\\pm\\sqrt{(-4)^2-4(1)(-1)}}{2(1)}'}, {text: 'Simplify.', math: 'x=\\frac{4\\pm\\sqrt{20}}2=\\frac{4\\pm2\\sqrt5}{2}=2\\pm\\sqrt5'}],
            insight: 'The formula succeeds even though no integer factor pair works.', trap: 'The product four times one times negative one is negative, so subtracting it increases the radicand.',
        },
        {
            level: 'Foundation', title: 'Divide out a common factor first', prompt: 'Solve the equation.', math: '6x^2+18x-24=0',
            steps: [{text: 'Divide every term by six.', math: 'x^2+3x-4=0'}, {text: 'Use the formula or factor.', math: 'x=\\frac{-3\\pm\\sqrt{9+16}}2=\\frac{-3\\pm5}{2}'}, {text: 'Evaluate both branches.', math: 'x=1\\quad\\text{or}\\quad x=-4'}],
            insight: 'Simplifying the equation before substitution produces smaller, safer arithmetic.', trap: 'Dividing only some terms changes the equation.',
        },
        {
            level: 'Core SAT', title: 'Standardize before labeling coefficients', prompt: 'Solve exactly.', math: '3x^2+5=7x',
            steps: [{text: 'Move every term to one side.', math: '3x^2-7x+5=0'}, {text: 'Label and substitute.', math: 'a=3,\\ b=-7,\\ c=5\\Rightarrow x=\\frac{7\\pm\\sqrt{49-60}}6'}, {text: 'The radicand is negative.', math: 'x=\\frac{7\\pm i\\sqrt{11}}6'}],
            insight: 'The equation has no real solutions, but the formula still describes its complex solutions.', trap: 'Using positive seven as b before rearranging gives the wrong formula.',
        },
        {
            level: 'Core SAT', title: 'Simplify the radical and fraction', prompt: 'Solve exactly.', math: '2x^2-8x+1=0',
            steps: [{text: 'Substitute into the formula.', math: 'x=\\frac{8\\pm\\sqrt{64-8}}4=\\frac{8\\pm\\sqrt{56}}4'}, {text: 'Extract the perfect square.', math: '\\sqrt{56}=2\\sqrt{14}'}, {text: 'Reduce the common factor.', math: 'x=\\frac{8\\pm2\\sqrt{14}}4=2\\pm\\frac{\\sqrt{14}}2'}],
            insight: 'Both terms in the numerator must share the factor before reduction.', trap: 'Reducing eight over four while leaving the radical over four creates an inconsistent fraction unless written carefully.',
        },
        {
            level: 'Applied', title: 'Reject an impossible contextual root', prompt: 'A height model reaches ground level when h equals zero. Find the positive time.', math: 'h(t)=-5t^2+20t+25',
            steps: [{text: 'Set height to zero and divide by negative five.', math: 't^2-4t-5=0'}, {text: 'Solve.', math: 't=\\frac{4\\pm\\sqrt{16+20}}2=\\frac{4\\pm6}{2}=5,-1'}, {text: 'Use the time constraint.', math: 't=5'}],
            insight: 'The negative root may describe the extended mathematical model but not time after launch.', trap: 'Do not discard a negative root until the context—not preference—makes it impossible.',
        },
        {
            level: 'Advanced', title: 'Solve a quadratic in x squared', prompt: 'Find all real solutions.', math: 'x^4-5x^2+3=0',
            steps: [{text: 'Substitute a repeated expression.', math: 'u=x^2\\Rightarrow u^2-5u+3=0'}, {text: 'Apply the quadratic formula in u.', math: 'u=\\frac{5\\pm\\sqrt{25-12}}2=\\frac{5\\pm\\sqrt{13}}2'}, {text: 'Both u-values are positive, so take both square roots of each.', math: 'x=\\pm\\sqrt{\\frac{5+\\sqrt{13}}2},\\qquad x=\\pm\\sqrt{\\frac{5-\\sqrt{13}}2}'}],
            insight: 'A quadratic in x squared can yield four real x-values.', trap: 'Stopping after solving for u does not answer a question asking for x.',
        },
    ],
    strategyCards: [
        {title: 'Before substitution', items: ['Make one side zero', 'Divide out a common factor', 'Write a, b, and c with their signs']},
        {title: 'During substitution', items: ['Put negative coefficients in parentheses', 'Square all of b', 'Keep the entire numerator over twice a']},
        {title: 'After solving', items: ['Simplify radicals before decimals', 'Evaluate both plus-or-minus branches', 'Check context and verify root sum or product when useful']},
    ],
    studyTips: [
        {title: 'Use a coefficient box', summary: 'A small setup line prevents most formula mistakes.', items: ['Write the zero equation', 'Record the signed triple', 'Substitute from the triple rather than rereading the equation']},
        {title: 'Enter the calculator with parentheses', summary: 'Calculator syntax must match the fraction bar.', items: ['Wrap the full numerator', 'Wrap twice a in the denominator', 'Calculate each plus-or-minus branch separately']},
        {title: 'Know when not to use the formula', summary: 'A universal method is not always the shortest method.', items: ['Factor when clean integer structure is visible', 'Use root sum or product when that is the only target', 'Graph only when an approximation or intersection is requested']},
    ],
    adaptiveDemo: {
        title: 'Choose the safest first line', prompt: 'You are given two x squared plus nine equals seven x. What should you write first?',
        options: [
            {id: 'zero', label: '2x² − 7x + 9 = 0', result: 'Correct.', advice: 'Now the signed coefficients are two, negative seven, and nine.'},
            {id: 'label', label: 'a = 2, b = 7, c = 9', result: 'The sign of b is premature and wrong.', advice: 'Move seven x left before labeling coefficients.'},
            {id: 'divide', label: 'Divide by x', result: 'Unsafe.', advice: 'Dividing by x can lose the solution x equals zero in equations where it is valid.'},
        ],
    },
    quickCheck: {
        prompt: 'Which expression gives the solutions?', math: '2x^2+5x-3=0',
        choices: ['(-5\\pm\\sqrt{49})/4', '(5\\pm\\sqrt{49})/4', '(-5\\pm\\sqrt{1})/4', '(-5\\pm\\sqrt{49})/2'], choiceMath: true, answer: 0,
        explanation: 'Use negative five plus or minus the square root of twenty-five minus four times two times negative three, all over four. The radicand is forty-nine.',
    },
    practiceSet: {
        title: 'Quadratic formula from foundation to hard Module 2',
        intro: 'The difficulty comes from setup, signs, simplification, and knowing what the question actually asks—not from memorizing one more formula.',
        questions: [
            {id: 'identify-coefficients', difficulty: 'Foundation', skill: 'Setup', title: 'Label signed coefficients', stem: 'Which coefficient triple is correct?', math: '4x^2-9x+2=0', choices: ['(4,-9,2)', '(4,9,2)', '(-4,9,-2)', '(2,-9,4)'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Match each term to standard order.', math: 'a=4,\\quad b=-9,\\quad c=2'}], trap: 'The subtraction sign belongs to b.', takeaway: 'Record coefficients with signs and in descending-power order.'}},
            {id: 'basic-formula', difficulty: 'Foundation', skill: 'Exact solutions', title: 'Substitute into the formula', stem: 'What are the solutions?', math: 'x^2-2x-2=0', choices: ['1\\pm\\sqrt3', '-1\\pm\\sqrt3', '2\\pm\\sqrt2', '-2\\pm\\sqrt2'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Substitute.', math: 'x=\\frac{2\\pm\\sqrt{4+8}}2=\\frac{2\\pm2\\sqrt3}{2}=1\\pm\\sqrt3'}], trap: 'Negative b is positive two because b itself is negative two.', takeaway: 'Carry the sign of b before applying the leading negative.'}},
            {id: 'missing-linear', difficulty: 'Foundation', skill: 'Missing coefficient', title: 'Use zero for a missing term', stem: 'What are the real solutions?', math: '3x^2-12=0', choices: ['-2,2', '-4,4', '0,4', 'No real solutions'], answer: 0, explanation: {steps: [{text: 'The missing linear coefficient is zero.', math: 'a=3,\\ b=0,\\ c=-12'}, {text: 'Solve directly or by formula.', math: 'x^2=4\\Rightarrow x=\\pm2'}], trap: 'A missing x-term does not mean the constant is zero.', takeaway: 'Use b equal to zero when the linear term is absent.'}},
            {id: 'rearrange', difficulty: 'Core', skill: 'Standardization', title: 'Move terms before labeling', stem: 'What is the larger solution?', math: 'x^2+3=4x', choices: ['1', '2', '3', '4'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Standardize.', math: 'x^2-4x+3=0'}, {text: 'Solve.', math: 'x=\\frac{4\\pm\\sqrt{16-12}}2=\\frac{4\\pm2}2=1,3'}], trap: 'Treating positive four as b ignores its sign after moving left.', takeaway: 'Coefficient labels come after zero form.'}},
            {id: 'simplify-radical', difficulty: 'Core', skill: 'Radicals', title: 'Simplify the exact answer', stem: 'Which is the simplified positive solution?', math: 'x^2-6x+3=0', choices: ['3+\\sqrt6', '3+2\\sqrt6', '6+\\sqrt6', '6+2\\sqrt6'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Apply the formula.', math: 'x=\\frac{6\\pm\\sqrt{36-12}}2=\\frac{6\\pm\\sqrt{24}}2'}, {text: 'Simplify.', math: '\\sqrt{24}=2\\sqrt6\\Rightarrow x=3\\pm\\sqrt6'}], trap: 'The factor two from the radical also divides by the denominator two.', takeaway: 'Simplify the radical, then reduce the whole fraction.'}},
            {id: 'gcf-first', difficulty: 'Core', skill: 'Efficiency', title: 'Shrink coefficients first', stem: 'What is the product of the solutions?', math: '10x^2-40x-50=0', choices: ['-50', '-5', '4', '5'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Divide by ten.', math: 'x^2-4x-5=0'}, {text: 'Use the product shortcut.', math: 'x_1x_2=\\frac ca=-5'}], trap: 'The raw constant negative fifty is not the product unless a equals one.', takeaway: 'The root product is c divided by a and is unchanged after common-factor reduction.'}},
            {id: 'context-positive', difficulty: 'Core', skill: 'Context', title: 'Choose the valid branch', stem: 'A rectangle has width x and length x plus three. Its area is forty. What is the width?', math: 'x(x+3)=40', choices: ['5', '8', '-5', '-8'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Create zero form.', math: 'x^2+3x-40=0'}, {text: 'Solve.', math: 'x=5\\quad\\text{or}\\quad x=-8'}, {text: 'Use the length constraint.', math: 'x=5'}], trap: 'Both values solve the equation, but a physical width cannot be negative.', takeaway: 'Context filters algebraic candidates.'}},
            {id: 'root-sum', difficulty: 'Advanced', skill: 'Shortcut', title: 'Do not solve unnecessarily', stem: 'If r and s are the solutions, what is r plus s?', math: '7x^2+3x-11=0', choices: ['-11/7', '-3/7', '3/7', '11/7'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Use the root-sum relationship.', math: 'r+s=-\\frac ba=-\\frac37'}], trap: 'The formula’s negative sign applies to b.', takeaway: 'Symmetric root targets often need no square root calculation.'}},
            {id: 'root-square-sum', difficulty: 'Advanced', skill: 'Symmetric roots', title: 'Combine coefficient shortcuts', stem: 'If r and s are the solutions, what is r squared plus s squared?', math: 'x^2-6x+2=0', choices: ['14', '32', '34', '38'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Find sum and product.', math: 'r+s=6,\\quad rs=2'}, {text: 'Use an identity.', math: 'r^2+s^2=(r+s)^2-2rs=36-4=32'}], trap: 'Squaring the sum includes an extra two r s term.', takeaway: 'Coefficient relationships can answer advanced root expressions without solving.'}},
            {id: 'quadratic-in-form', difficulty: 'Advanced', skill: 'Substitution', title: 'Count all real x-values', stem: 'How many real solutions does the equation have?', math: 'x^4-10x^2+9=0', choices: ['1', '2', '3', '4'], choiceMath: true, answer: 3, explanation: {steps: [{text: 'Let u equal x squared.', math: 'u^2-10u+9=0\\Rightarrow u=1,9'}, {text: 'Solve both x-squared equations.', math: 'x=\\pm1,\\pm3'}], trap: 'Two u-values each produce two real x-values.', takeaway: 'Finish the substitution all the way back to the requested variable.'}},
            {id: 'fraction-coefficients', difficulty: 'Advanced', skill: 'Fractions', title: 'Clear denominators first', stem: 'What is the positive solution?', math: '\\frac12x^2-\\frac32x-2=0', choices: ['1', '4', '-1', '-4'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Multiply the entire equation by two.', math: 'x^2-3x-4=0'}, {text: 'Solve.', math: '(x-4)(x+1)=0\\Rightarrow x=4,-1'}], trap: 'Multiplying only the fractional terms leaves the equation unequal.', takeaway: 'Clear all denominators before choosing a solving method.'}},
            {id: 'parameter-root', difficulty: 'Advanced', skill: 'Parameters', title: 'Use a known solution efficiently', stem: 'One solution is two. What is k?', math: '3x^2+kx-10=0', choices: ['-7', '-1', '1', '7'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Substitute the known root directly.', math: '3(2)^2+2k-10=0'}, {text: 'Solve.', math: '12+2k-10=0\\Rightarrow2k=-2\\Rightarrow k=-1'}], trap: 'The quadratic formula is valid but turns a linear parameter question into unnecessary work.', takeaway: 'When a root is known, direct substitution is fastest.'}},
        ],
    },
};

export default quadraticFormula;
