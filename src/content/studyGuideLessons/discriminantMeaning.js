const discriminantMeaning = {
    slug: 'discriminant-meaning',
    moduleId: 'quadratic-foundations',
    title: 'Discriminant Meaning',
    eyebrow: 'Advanced Math',
    minutes: '34 min',
    summary: 'The discriminant predicts quadratic behavior before you solve: how many real roots exist, how graphs intersect, which parameters create tangency, and how far apart roots lie.',
    goals: [
        'Calculate the discriminant from a quadratic in zero form.',
        'Connect its sign to real solutions and x-axis intersections.',
        'Solve parameter conditions for two, one, or zero real solutions.',
        'Use advanced discriminant links to rational roots, vertex height, and root spacing.',
    ],
    facts: [
        {label: 'Discriminant', math: 'D=b^2-4ac', note: 'the quantity beneath the quadratic-formula radical'},
        {label: 'Positive', math: 'D>0', note: 'two distinct real solutions'},
        {label: 'Zero', math: 'D=0', note: 'one repeated real solution'},
        {label: 'Negative', math: 'D<0', note: 'no real solutions'},
    ],
    sections: [
        {
            heading: 'Big idea 1: the sign counts real roots',
            paragraphs: [
                'The quadratic formula differs only in whether the square root receives a positive, zero, or negative input. A positive radicand creates two real branches, zero collapses both branches together, and a negative radicand creates no real value.',
                'You usually do not need the roots when a question asks only how many exist. Compute the discriminant and stop.',
            ],
            math: '\\begin{aligned}D&=b^2-4ac\\\\D>0&\\Rightarrow2\\text{ distinct real roots}\\\\D=0&\\Rightarrow1\\text{ repeated real root}\\\\D<0&\\Rightarrow0\\text{ real roots}\\end{aligned}',
        },
        {
            heading: 'Big idea 2: roots are graph intersections',
            paragraphs: [
                'Solutions of a quadratic equation are x-coordinates where its graph meets the x-axis. More generally, intersections of a parabola and another graph become roots after setting the equations equal and moving everything to one side.',
                'A zero discriminant means tangency: the graphs touch at exactly one point because the resulting quadratic has a repeated root.',
            ],
            math: '\\begin{aligned}f(x)&=g(x)\\\\f(x)-g(x)&=0\\\\D&\\text{ counts intersections}\\end{aligned}',
        },
        {
            heading: 'Big idea 3: parameters turn the sign rule into an equation or inequality',
            paragraphs: [
                'When a coefficient contains a parameter, substitute it into the discriminant before solving. Exactly one real solution means an equation; two or zero real solutions create inequalities.',
                'If the parameter is squared, remember that an inequality can produce two outside intervals or one inside interval. State every valid range.',
            ],
            math: '\\begin{aligned}\\text{tangent}&\\Rightarrow D=0\\\\\\text{two intersections}&\\Rightarrow D>0\\end{aligned}',
        },
        {
            heading: 'Big idea 4: the magnitude carries extra information',
            paragraphs: [
                'For rational coefficients, a nonnegative perfect-square discriminant produces rational roots. A nonsquare positive discriminant produces irrational real roots.',
                'The discriminant also connects to vertex height and root spacing. These shortcuts turn some high-difficulty questions into one calculation.',
            ],
            math: '\\begin{aligned}|r_1-r_2|&=\\frac{\\sqrt D}{|a|}\\\\f\\left(-\\frac b{2a}\\right)&=-\\frac D{4a}\\end{aligned}',
        },
    ],
    formulas: [
        {
            label: 'Discriminant', math: 'D=b^2-4ac', note: 'Use signed coefficients only after the equation equals zero.', meaning: 'It measures what remains under the square root in the quadratic formula.', useWhen: 'You need solution type or count without finding the solutions.',
        },
        {
            label: 'Real-root count', math: '\\begin{aligned}D>0&\\Rightarrow2\\\\D=0&\\Rightarrow1\\\\D<0&\\Rightarrow0\\end{aligned}', note: 'The one-root case is a repeated root counted twice algebraically.', meaning: 'The sign determines whether the square root has two real signs, equals zero, or is nonreal.', useWhen: 'A question asks how many real solutions or x-intercepts exist.',
        },
        {
            label: 'Repeated root', math: 'D=0\\Rightarrow x=-\\frac b{2a}', note: 'The repeated root is also the axis and vertex input.', meaning: 'Both plus-or-minus branches collapse to the same value.', useWhen: 'A tangent or exactly-one-solution question asks for the contact input.',
        },
        {
            label: 'Rational-root test', math: '\\begin{aligned}D&\\ge0\\\\D&\\text{ is a perfect square}\\end{aligned}\\Rightarrow\\text{rational roots}', note: 'Assume rational coefficients; clear denominators first if helpful.', meaning: 'The only possible irrationality in the formula comes from the square root.', useWhen: 'A question asks whether roots are rational, irrational, or nonreal.',
        },
        {
            label: 'Distance between roots', math: '|r_1-r_2|=\\frac{\\sqrt D}{|a|}', note: 'This follows by subtracting the two quadratic-formula branches.', meaning: 'Larger positive D spreads the real roots farther apart after accounting for a.', useWhen: 'A high-difficulty question asks for root separation rather than the roots.',
        },
        {
            label: 'Vertex output from D', math: 'k=f\\left(-\\frac b{2a}\\right)=-\\frac D{4a}', note: 'This is the constant outside the square in vertex form.', meaning: 'The discriminant’s sign places an upward parabola’s vertex below, on, or above the x-axis.', useWhen: 'You need the extremum value and D is already known.',
        },
        {
            label: 'Scaling invariance', math: '(a,b,c)\\mapsto(ta,tb,tc)\\Rightarrow D\\mapsto t^2D', note: 'Multiplying an equation by a nonzero constant never changes its roots or D’s sign.', meaning: 'The numerical discriminant changes, but its solution classification does not.', useWhen: 'You clear fractions or compare equivalent equations.',
        },
    ],
    workedExamples: [
        {
            level: 'Foundation', title: 'Count roots without solving', prompt: 'Determine the number of real solutions.', math: '2x^2-3x-5=0',
            steps: [{text: 'Label coefficients.', math: 'a=2,\\quad b=-3,\\quad c=-5'}, {text: 'Compute the discriminant.', math: '\\begin{aligned}D&=(-3)^2-4(2)(-5)\\\\&=9+40=49\\end{aligned}'}, {text: 'Classify its sign.', math: '49>0\\Rightarrow2\\text{ distinct real solutions}'}],
            insight: 'The perfect-square value also tells you the roots will be rational.', trap: 'Subtracting a negative product becomes addition.',
        },
        {
            level: 'Foundation', title: 'Recognize the repeated-root case', prompt: 'Determine the number and value of the real solution.', math: '9x^2+12x+4=0',
            steps: [{text: 'Compute the discriminant.', math: 'D=12^2-4(9)(4)=144-144=0'}, {text: 'Use the repeated-root shortcut.', math: 'x=-\\frac{12}{2(9)}=-\\frac23'}],
            insight: 'The trinomial is the perfect square of three x plus two.', trap: 'A zero discriminant means one distinct real value, not zero solutions.',
        },
        {
            level: 'Core SAT', title: 'Find a parameter for tangency', prompt: 'Find k so the equation has exactly one real solution.', math: 'x^2-6x+k=0',
            steps: [{text: 'Exactly one real solution requires zero discriminant.', math: 'D=(-6)^2-4(1)(k)=0'}, {text: 'Solve for the parameter.', math: '36-4k=0\\Rightarrow k=9'}, {text: 'See the resulting square.', math: 'x^2-6x+9=(x-3)^2'}],
            insight: 'The boundary between two roots and no roots occurs at tangency.', trap: 'Setting k equal to zero is not the one-solution condition.',
        },
        {
            level: 'Core SAT', title: 'Count line-parabola intersections', prompt: 'How many points of intersection do the graphs have?', math: 'y=x^2+2x+5,\\qquad y=4x+1',
            steps: [{text: 'Set the outputs equal.', math: 'x^2+2x+5=4x+1'}, {text: 'Create zero form.', math: 'x^2-2x+4=0'}, {text: 'Compute the discriminant.', math: 'D=(-2)^2-4(1)(4)=-12<0'}, {text: 'Interpret.', math: '0\\text{ real intersections}'}],
            insight: 'Intersection count becomes quadratic solution count after substitution.', trap: 'Do not compute D from coefficients belonging to two separate equations.',
        },
        {
            level: 'Advanced', title: 'Solve a parameter inequality', prompt: 'For which values of m does the equation have two distinct real solutions?', math: 'x^2+mx+16=0',
            steps: [{text: 'Require a positive discriminant.', math: 'm^2-4(1)(16)>0'}, {text: 'Factor the inequality.', math: 'm^2-64>0\\Rightarrow(m-8)(m+8)>0'}, {text: 'Use the outside intervals.', math: 'm<-8\\quad\\text{or}\\quad m>8'}],
            insight: 'A squared parameter often creates two symmetric ranges.', trap: 'The interval between negative eight and eight makes the discriminant negative, not positive.',
        },
        {
            level: 'Advanced', title: 'Find root separation directly', prompt: 'Find the distance between the two real roots.', math: '3x^2-11x+6=0',
            steps: [{text: 'Compute the discriminant.', math: '\\begin{aligned}D&=(-11)^2-4(3)(6)\\\\&=121-72=49\\end{aligned}'}, {text: 'Apply the separation formula.', math: '|r_1-r_2|=\\frac{\\sqrt{49}}{|3|}=\\frac73'}],
            insight: 'Subtracting the full root formulas would simplify to the same result.', trap: 'The root distance is not simply the square root of D unless the leading coefficient has absolute value one.',
        },
    ],
    strategyCards: [
        {title: 'Translate wording into a sign', items: ['Two distinct real solutions: D greater than zero', 'Exactly one real solution or tangent: D equals zero', 'No real solutions: D less than zero']},
        {title: 'For graph intersections', items: ['Set the two outputs equal', 'Move to zero form', 'Use the resulting quadratic’s discriminant']},
        {title: 'For parameter questions', items: ['Insert the parameter into D', 'Solve the required equation or inequality', 'Check endpoints when the condition is strict']},
    ],
    studyTips: [
        {title: 'Stop when the question is answered', summary: 'Do not calculate roots when only their count is requested.', items: ['Compute D', 'Classify its sign', 'Translate the sign into the requested graph or equation language']},
        {title: 'Separate “one” from “at least one”', summary: 'Small wording changes alter the inequality.', items: ['Exactly one: D equals zero', 'At least one real solution: D is greater than or equal to zero', 'At most one real solution: D is less than or equal to zero']},
        {title: 'Use advanced shortcuts selectively', summary: 'Magnitude matters only after sign classification is secure.', items: ['Perfect-square D checks rationality', 'Square root of D over absolute a gives root spacing', 'Negative D over four a gives the vertex output']},
    ],
    adaptiveDemo: {
        title: 'Translate the graph language', prompt: 'A line is tangent to a parabola. What discriminant condition should you impose after setting their equations equal?',
        options: [
            {id: 'zero', label: 'D = 0', result: 'Correct.', advice: 'Tangency means one intersection and therefore one repeated real solution.'},
            {id: 'positive', label: 'D > 0', result: 'That gives two crossings.', advice: 'A positive discriminant produces two distinct intersection inputs.'},
            {id: 'negative', label: 'D < 0', result: 'That gives no contact.', advice: 'A negative discriminant means the graphs never intersect in the real plane.'},
        ],
    },
    quickCheck: {
        prompt: 'How many real solutions does the equation have?', math: '4x^2+4x+7=0',
        choices: ['0', '1', '2', '4'], choiceMath: true, answer: 0,
        explanation: 'The discriminant is sixteen minus four times four times seven, which equals negative ninety-six. A negative discriminant gives no real solutions.',
    },
    practiceSet: {
        title: 'Discriminant meaning from foundation to hard Module 2',
        intro: 'Translate equation and graph language into a discriminant sign, then calculate only what the target needs.',
        questions: [
            {id: 'positive-count', difficulty: 'Foundation', skill: 'Solution count', title: 'Classify a positive discriminant', stem: 'How many distinct real solutions?', math: 'x^2-7x+10=0', choices: ['0', '1', '2', '10'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Compute D.', math: 'D=(-7)^2-4(1)(10)=49-40=9>0'}], trap: 'The value nine is the discriminant, not the number of solutions.', takeaway: 'Positive D means two distinct real roots.'}},
            {id: 'zero-count', difficulty: 'Foundation', skill: 'Solution count', title: 'Classify a zero discriminant', stem: 'How many distinct real solutions?', math: 'x^2+10x+25=0', choices: ['0', '1', '2', '25'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Compute D.', math: 'D=10^2-4(1)(25)=0'}], trap: 'Zero D gives one repeated real root, not zero roots.', takeaway: 'The plus and minus branches coincide when the square root is zero.'}},
            {id: 'negative-count', difficulty: 'Foundation', skill: 'Solution count', title: 'Classify a negative discriminant', stem: 'How many real solutions?', math: '2x^2+x+3=0', choices: ['0', '1', '2', '3'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Compute D.', math: 'D=1^2-4(2)(3)=1-24=-23<0'}], trap: 'A quadratic equation need not have real roots.', takeaway: 'Negative D means the graph has no x-intercepts.'}},
            {id: 'tangent-parameter', difficulty: 'Core', skill: 'Parameters', title: 'Force one solution', stem: 'For what value of k does the equation have exactly one real solution?', math: 'x^2+8x+k=0', choices: ['8', '16', '32', '64'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Set D equal to zero.', math: '8^2-4k=0\\Rightarrow64=4k\\Rightarrow k=16'}], trap: 'Half of eight is four, and the perfect-square constant is sixteen.', takeaway: 'Exactly one solution is the discriminant boundary D equals zero.'}},
            {id: 'no-real-parameter', difficulty: 'Core', skill: 'Inequality', title: 'Create no real roots', stem: 'Which condition gives no real solutions?', math: 'x^2+6x+k=0', choices: ['k<9', 'k=9', 'k>9', 'k\\le9'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Require negative D.', math: '36-4k<0\\Rightarrow36<4k\\Rightarrow k>9'}], trap: 'At k equals nine, the equation has one repeated real root.', takeaway: 'Strict solution-count language requires strict inequalities.'}},
            {id: 'line-intersections', difficulty: 'Core', skill: 'Graphs', title: 'Compare a line and parabola', stem: 'How many intersection points?', math: 'y=x^2-2x+4,\\qquad y=2x', choices: ['0', '1', '2', '4'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Set equations equal.', math: 'x^2-2x+4=2x\\Rightarrow x^2-4x+4=0'}, {text: 'Compute D.', math: 'D=16-16=0'}], trap: 'The two displayed equations do not imply two intersections.', takeaway: 'A zero discriminant after substitution means the graphs are tangent.'}},
            {id: 'rationality', difficulty: 'Core', skill: 'Root type', title: 'Classify exact roots', stem: 'Which statement is true?', math: '3x^2-5x-1=0', choices: ['Two rational roots', 'Two irrational real roots', 'One repeated rational root', 'No real roots'], answer: 1, explanation: {steps: [{text: 'Compute D.', math: 'D=(-5)^2-4(3)(-1)=37'}, {text: 'Classify.', math: '37>0\\text{ and is not a perfect square}'}], trap: 'A positive integer discriminant does not guarantee rational roots; it must be a perfect square.', takeaway: 'Positive nonsquare D gives two irrational real roots for rational coefficients.'}},
            {id: 'two-root-range', difficulty: 'Advanced', skill: 'Parameter inequality', title: 'Solve an outside-interval condition', stem: 'For which values of p are there two distinct real solutions?', math: 'x^2+px+25=0', choices: ['-10<p<10', 'p<-10\\text{ or }p>10', 'p\\le-10\\text{ or }p\\ge10', 'p=\\pm10'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Require positive D.', math: 'p^2-100>0'}, {text: 'Solve.', math: '|p|>10\\Rightarrow p<-10\\text{ or }p>10'}], trap: 'The endpoints give one repeated root and must be excluded.', takeaway: 'A square greater than a constant produces outside intervals.'}},
            {id: 'root-distance', difficulty: 'Advanced', skill: 'Root spacing', title: 'Use discriminant magnitude', stem: 'What is the distance between the roots?', math: '2x^2-7x+3=0', choices: ['5/4', '2', '5/2', '5'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Compute D.', math: 'D=49-24=25'}, {text: 'Apply the spacing formula.', math: '|r_1-r_2|=\\frac{\\sqrt{25}}{|2|}=\\frac52'}], trap: 'Square root of D alone ignores the leading coefficient.', takeaway: 'Divide the square root of D by absolute a.'}},
            {id: 'vertex-from-d', difficulty: 'Advanced', skill: 'Vertex link', title: 'Find a minimum from D', stem: 'What is the minimum value?', math: 'f(x)=2x^2-12x+7', choices: ['-11', '-7', '7', '11'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Compute D.', math: 'D=(-12)^2-4(2)(7)=144-56=88'}, {text: 'Use the vertex-output link.', math: 'k=-\\frac D{4a}=-\\frac{88}{8}=-11'}], trap: 'The negative sign in the vertex-output formula matters.', takeaway: 'For positive a and positive D, the vertex lies below the x-axis.'}},
            {id: 'tangent-line-slope', difficulty: 'Advanced', skill: 'Tangency', title: 'Find a tangent-line parameter', stem: 'For which positive value of m is the line tangent to the parabola?', math: 'y=mx,\\qquad y=x^2+9', choices: ['3', '6', '9', '18'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Set outputs equal.', math: 'x^2-mx+9=0'}, {text: 'Require D equal to zero.', math: 'm^2-36=0\\Rightarrow m=\\pm6'}, {text: 'Use the positive condition.', math: 'm=6'}], trap: 'Both signs produce tangent lines, but the question requests the positive slope.', takeaway: 'Tangency becomes a zero-discriminant parameter equation.'}},
            {id: 'scaling', difficulty: 'Advanced', skill: 'Equivalent equations', title: 'Track discriminant scaling', stem: 'A quadratic equation has discriminant five. If every term is multiplied by three, what is the new discriminant?', choices: ['5', '15', '45', '75'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'All three coefficients scale by three.', math: 'D_{new}=(3b)^2-4(3a)(3c)=9(b^2-4ac)'}, {text: 'Apply the factor.', math: 'D_{new}=9(5)=45'}], trap: 'The discriminant scales by the square of the equation multiplier, not the multiplier itself.', takeaway: 'Equivalent scaled equations keep the sign of D even though its numerical value changes.'}},
        ],
    },
};

export default discriminantMeaning;
