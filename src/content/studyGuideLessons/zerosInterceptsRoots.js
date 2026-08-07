const zerosInterceptsRoots = {
    slug: 'zeros-intercepts-and-roots',
    moduleId: 'quadratic-graphs',
    title: 'Zeros, Intercepts, and Roots',
    eyebrow: 'Advanced Math',
    minutes: '35 min',
    summary: 'Connect zeros, roots, solutions, and x-intercepts, then use factors, multiplicity, signs, and root relationships without doing unnecessary algebra.',
    goals: [
        'Translate among zeros, roots, solutions, and x-intercepts.',
        'Find roots efficiently from standard, factored, and vertex form.',
        'Interpret repeated roots, multiplicity, and signs between roots.',
        'Use the factor theorem and Vieta relationships to reconstruct or transform roots.',
    ],
    facts: [
        {label: 'Zero or root', math: 'f(r)=0', note: 'r is an input value'},
        {label: 'x-intercept', math: '(r,0)', note: 'the matching point on the graph'},
        {label: 'Repeated root', math: '(x-r)^2', note: 'the graph touches the axis at r'},
        {label: 'Root midpoint', math: '\\frac{r_1+r_2}{2}', note: 'the axis of symmetry when two real roots exist'},
    ],
    sections: [
        {
            heading: 'Big idea 1: four phrases, one zero-output event',
            paragraphs: [
                'A zero or root is an input that makes a function equal zero. A solution of a quadratic equation is that same input. An x-intercept is the corresponding point on the graph, so it must include both coordinates.',
                'Keep value and point language separate. If a root is three, the x-intercept is the ordered pair with horizontal coordinate three and vertical coordinate zero.',
            ],
            math: 'f(r)=0\\Longleftrightarrow r\\text{ is a zero/root}\\Longleftrightarrow (r,0)\\text{ is an x-intercept}',
        },
        {
            heading: 'Big idea 2: factors encode roots and multiplicity',
            paragraphs: [
                'The factor theorem says that r is a root exactly when x minus r is a factor. The sign inside a factor reverses: x plus five produces the root negative five.',
                'An odd multiplicity makes the graph cross the x-axis; an even multiplicity makes it touch and turn. For quadratics, a double root is also the vertex and the only x-intercept.',
            ],
            math: 'f(r)=0\\Longleftrightarrow (x-r)\\mid f(x),\\qquad a(x-r)^2\\Rightarrow\\text{multiplicity }2',
        },
        {
            heading: 'Big idea 3: roots divide the number line into sign intervals',
            paragraphs: [
                'For an upward-opening quadratic with two distinct roots, the graph is below the x-axis between the roots and above it outside them. A downward-opening quadratic reverses those signs.',
                'You can justify the pattern by testing one input in each interval or by tracking the signs of the two factors. A repeated root does not change the sign because its squared factor stays nonnegative.',
            ],
            math: 'a>0,\\ r_1<r_2\\Rightarrow\\begin{cases}f(x)>0,&x<r_1\\text{ or }x>r_2\\\\f(x)<0,&r_1<x<r_2\\end{cases}',
        },
        {
            heading: 'Big idea 4: use relationships before solving individual roots',
            paragraphs: [
                'Standard-form coefficients reveal the sum and product of the roots. These Vieta relationships answer many advanced questions without the quadratic formula.',
                'If a function input is transformed, map the old roots through the same input rule. If g of x equals f of x minus four, then each graph feature, including every root, moves four units right.',
            ],
            math: 'r_1+r_2=-\\frac ba,\\qquad r_1r_2=\\frac ca,\\qquad f(u)=0\\Rightarrow f(x-h)=0\\text{ at }x=u+h',
        },
    ],
    formulas: [
        {label: 'Zero and intercept link', math: 'f(r)=0\\Longleftrightarrow (r,0)\\text{ is an x-intercept}', note: 'The root is a number; the intercept is a point.', meaning: 'Both describe where the output becomes zero.', useWhen: 'The wording switches between equations and graphs.'},
        {label: 'Factor theorem', math: 'f(r)=0\\Longleftrightarrow (x-r)\\text{ is a factor of }f(x)', note: 'The factor sign is opposite the root sign.', meaning: 'Division by x minus r leaves remainder zero exactly at a root.', useWhen: 'You need to test a proposed root or build factors.'},
        {label: 'Factored roots', math: 'a(x-r_1)(x-r_2)=0\\Rightarrow x=r_1\\text{ or }x=r_2', note: 'Use the zero-product property.', meaning: 'A product is zero when at least one factor is zero.', useWhen: 'The equation is already factored or factors easily.'},
        {label: 'Repeated root', math: 'a(x-r)^2=0\\Rightarrow x=r\\text{ with multiplicity }2', note: 'The graph touches rather than crosses.', meaning: 'Both factors become zero at the same input.', useWhen: 'The discriminant is zero or a factor repeats.'},
        {label: 'Root sum and product', math: 'r_1+r_2=-\\frac ba,\\qquad r_1r_2=\\frac ca', note: 'No individual root calculation is required.', meaning: 'The coefficients store symmetric information about the roots.', useWhen: 'A target asks for a sum, product, or expression built from them.'},
        {label: 'Reconstruct from roots', math: 'f(x)=a(x-r_1)(x-r_2)', note: 'Use one additional point to determine a.', meaning: 'The roots fix factor locations but not vertical scale.', useWhen: 'Roots and one function value are given.'},
        {label: 'Root-expression shortcut', math: 'r_1^2+r_2^2=(r_1+r_2)^2-2r_1r_2', note: 'Substitute Vieta values after rewriting.', meaning: 'Symmetric expressions can be computed without solving the quadratic.', useWhen: 'An advanced question targets powers or reciprocals of roots.'},
    ],
    workedExamples: [
        {level: 'Foundation', title: 'Translate a root into an intercept', prompt: 'A quadratic has a zero at negative four. State the corresponding x-intercept.', math: 'r=-4', steps: [{text: 'A zero gives the horizontal coordinate.', math: 'x=-4'}, {text: 'Every x-intercept has zero output.', math: '(-4,0)'}], insight: 'Equation language asks for an input; graph language asks for a point.', trap: 'Do not report the point with coordinates zero and negative four.'},
        {level: 'Foundation/Core', title: 'Read a repeated root', prompt: 'Find the root and describe the graph at its intercept.', math: 'f(x)=-2(x-5)^2', steps: [{text: 'Set the repeated factor equal to zero.', math: 'x=5'}, {text: 'Read the factor power.', math: '5\\text{ has multiplicity }2'}, {text: 'Connect even multiplicity to graph behavior.', math: 'x=5:\\text{ the graph touches and turns}'}], insight: 'A repeated quadratic root is also the vertex input.', trap: 'Multiplicity two still creates only one intercept point.'},
        {level: 'Core SAT', title: 'Choose signs between roots', prompt: 'Determine where the function is negative.', math: 'q(x)=3(x+2)(x-6)', steps: [{text: 'Read and order the roots.', math: '-2<6'}, {text: 'The parabola opens upward.', math: 'a=3>0'}, {text: 'An upward-opening quadratic is below the axis between distinct roots.', math: 'q(x)<0\\text{ for }-2<x<6'}], insight: 'A sign question often needs no expansion and no exact graph.', trap: 'At the endpoints the output is zero, so strict negativity excludes them.'},
        {level: 'Core SAT', title: 'Recover roots from vertex form', prompt: 'Find the x-intercepts.', math: 'p(x)=2(x-1)^2-18', steps: [{text: 'Set the output equal to zero.', math: '2(x-1)^2-18=0'}, {text: 'Isolate the square.', math: '(x-1)^2=9'}, {text: 'Use both square roots.', math: 'x-1=\\pm3\\Rightarrow x=-2,4'}, {text: 'Write the intercept points.', math: '(-2,0),\\ (4,0)'}], insight: 'Vertex form can reveal roots quickly by square-root isolation.', trap: 'Taking only the positive square root loses the symmetric intercept.'},
        {level: 'Advanced', title: 'Reconstruct from roots and a point', prompt: 'A quadratic has roots two and negative five and passes through the point with coordinates one and negative eighteen. Find the equation.', math: 'f(x)=a(x-2)(x+5)', steps: [{text: 'Build factors from the roots.', math: 'f(x)=a(x-2)(x+5)'}, {text: 'Substitute the known point.', math: '-18=a(1-2)(1+5)=-6a'}, {text: 'Solve for the scale.', math: 'a=3'}, {text: 'Write the model.', math: 'f(x)=3(x-2)(x+5)'}], insight: 'Two roots plus one non-root point uniquely determine a quadratic.', trap: 'Do not assume a equals one unless the problem says the quadratic is monic.'},
        {level: 'Advanced', title: 'Transform roots without expanding', prompt: 'The roots of f are negative one and four. Find the roots of g.', math: 'g(x)=2f(3x-6)', steps: [{text: 'The outside factor does not change zeros.', math: 'g(x)=0\\Longleftrightarrow f(3x-6)=0'}, {text: 'Match the inside input to each original root.', math: '3x-6=-1\\text{ or }3x-6=4'}, {text: 'Solve the two linear equations.', math: 'x=\\frac53\\text{ or }x=\\frac{10}{3}'}], insight: 'Map inputs through the transformation; never expand an unknown function.', trap: 'The horizontal scale acts reciprocally, and the shift must be solved from the whole inside expression.'},
    ],
    strategyCards: [
        {title: 'Match the representation', items: ['Factored form: set each factor to zero', 'Vertex form: isolate the square and use both signs', 'Standard form: factor if clean; otherwise use a relationship or the quadratic formula']},
        {title: 'Separate values from points', items: ['Root or zero: write an input value', 'Solution: write the x-value that satisfies the equation', 'x-intercept: write an ordered pair with y-coordinate zero']},
        {title: 'Avoid unnecessary solving', items: ['Use Vieta for root sums and products', 'Use the midpoint for the axis', 'Transform known roots by solving the inside input rule']},
    ],
    studyTips: [
        {title: 'Say the factor aloud', summary: 'Translate x minus r into root r every time.', items: ['x minus seven gives root seven.', 'x plus seven gives root negative seven.', 'A repeated factor repeats the root, not the intercept point.']},
        {title: 'Build a sign chart with one test input', summary: 'Roots split the number line into intervals.', items: ['Mark every distinct real root.', 'Test one easy input in each interval.', 'A simple root changes sign; a double root does not.']},
        {title: 'Rewrite the target before solving', summary: 'Hard root-expression questions usually hide a symmetric shortcut.', items: ['Replace sums and products with Vieta values.', 'Use algebraic identities for squares or reciprocals.', 'Solve individual roots only if the target truly needs them.']},
    ],
    adaptiveDemo: {
        title: 'Pick the shortest root method',
        prompt: 'You need the sum of the roots of a standard-form quadratic. Which method should you try first?',
        options: [
            {id: 'vieta', label: 'Use coefficients', result: 'Best choice: use the root-sum relationship.', advice: 'Negative b divided by a gives the sum without finding either root.'},
            {id: 'factor', label: 'Factor it', result: 'Possible, but only if the factors are obvious.', advice: 'Factoring gives individual roots that the question did not request.'},
            {id: 'formula', label: 'Quadratic formula', result: 'Valid but unnecessarily long.', advice: 'The opposite radical terms cancel, recreating negative b divided by a.'},
        ],
    },
    quickCheck: {prompt: 'Which statement is correct?', math: 'f(x)=3(x+2)^2', choices: ['The graph touches the x-axis at x=-2.', 'The graph crosses the x-axis at x=-2.', 'The graph touches the x-axis at x=2.', 'The graph has two distinct roots.'], answer: 0, explanation: 'The root negative two has even multiplicity two, so the quadratic touches the x-axis there and turns.'},
    practiceSet: {
        title: 'Roots and intercepts from foundation to hard Module 2',
        intro: 'Track factor signs, intercept coordinates, multiplicity, and efficient root relationships.',
        questions: [
            {id: 'root-to-point', difficulty: 'Foundation', skill: 'Vocabulary', title: 'State an intercept', stem: 'A root is seven. Which point is the matching x-intercept?', choices: ['(0,7)', '(7,0)', '(-7,0)', '(0,-7)'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Use the root as the horizontal coordinate and zero as the output.', math: '(7,0)'}], trap: 'An x-intercept has zero as its second coordinate.', takeaway: 'Roots are values; intercepts are points.'}},
            {id: 'factor-signs', difficulty: 'Foundation', skill: 'Factored form', title: 'Reverse factor signs', stem: 'What are the roots?', math: '(x-8)(x+3)=0', choices: ['-8 and 3', '8 and -3', '8 and 3', '-8 and -3'], answer: 1, explanation: {steps: [{text: 'Set each factor to zero.', math: 'x=8\\text{ or }x=-3'}], trap: 'Do not copy the printed signs.', takeaway: 'A factor x minus r creates root r.'}},
            {id: 'double-root', difficulty: 'Foundation', skill: 'Multiplicity', title: 'Identify a repeated root', stem: 'How many distinct x-intercepts does the graph have?', math: 'y=4(x-6)^2', choices: ['0', '1', '2', '4'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'The same factor appears twice.', math: 'x=6\\text{ has multiplicity }2'}, {text: 'It creates one point.', math: '(6,0)'}], trap: 'Multiplicity two does not mean two distinct points.', takeaway: 'A repeated quadratic root is one touching intercept.'}},
            {id: 'negative-interval', difficulty: 'Core', skill: 'Signs', title: 'Find a sign interval', stem: 'On which interval is f negative?', math: 'f(x)=(x+1)(x-9)', choices: ['x<-1', '-1<x<9', 'x>9', 'x<-1 or x>9'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'The roots are negative one and nine and the parabola opens upward.', math: 'a=1>0'}, {text: 'It is below the axis between them.', math: '-1<x<9'}], trap: 'Strict negativity excludes the roots.', takeaway: 'An upward parabola is negative between two distinct roots.'}},
            {id: 'vertex-roots', difficulty: 'Core', skill: 'Vertex form', title: 'Use both square roots', stem: 'What are the zeros?', math: '2(x+4)^2-8=0', choices: ['-6 and -2', '-4 and 4', '-2 and 6', '2 and 6'], answer: 0, explanation: {steps: [{text: 'Isolate the square.', math: '(x+4)^2=4'}, {text: 'Use both signs.', math: 'x+4=\\pm2\\Rightarrow x=-6,-2'}], trap: 'The center is negative four, not positive four.', takeaway: 'Square-root equations usually produce symmetric inputs.'}},
            {id: 'factor-theorem', difficulty: 'Core', skill: 'Factor theorem', title: 'Test a factor', stem: 'If f of negative three equals zero, which expression must be a factor?', choices: ['x-3', 'x+3', '3x-1', '3x+1'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Apply the factor theorem with r equal to negative three.', math: 'x-r=x-(-3)=x+3'}], trap: 'The factor sign is opposite the root sign.', takeaway: 'f(r) equals zero exactly when x minus r is a factor.'}},
            {id: 'scaled-y-intercept', difficulty: 'Core', skill: 'Intercept interpretation', title: 'Evaluate at zero', stem: 'What is the y-coordinate of the y-intercept?', math: 'g(x)=-2(x-4)(x+5)', choices: ['-40', '-18', '18', '40'], choiceMath: true, answer: 3, explanation: {steps: [{text: 'Substitute zero.', math: 'g(0)=-2(-4)(5)=40'}], trap: 'The roots themselves are four and negative five; neither is the y-intercept.', takeaway: 'A y-intercept comes from input zero.'}},
            {id: 'vieta-sum', difficulty: 'Advanced', skill: 'Vieta', title: 'Find a root sum', stem: 'If r and s are the roots, what is r+s?', math: '5x^2+20x-7=0', choices: ['-4', '4', '-7/5', '7/5'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Use the coefficient relationship.', math: 'r+s=-\\frac{20}{5}=-4'}], trap: 'The formula includes a leading negative sign.', takeaway: 'Root sum equals negative b over a.'}},
            {id: 'vieta-expression', difficulty: 'Advanced', skill: 'Root expressions', title: 'Avoid individual roots', stem: 'If r and s are roots, what is r squared plus s squared?', math: 'x^2-6x+5=0', choices: ['16', '26', '31', '36'], choiceMath: true, answer: 1, explanation: {steps: [{text: 'Read the sum and product.', math: 'r+s=6,\\qquad rs=5'}, {text: 'Use the square identity.', math: 'r^2+s^2=(r+s)^2-2rs=36-10=26'}], trap: 'Squaring the sum includes the extra term two r s.', takeaway: 'Rewrite symmetric targets using root sum and product.'}},
            {id: 'other-root', difficulty: 'Advanced', skill: 'Vieta', title: 'Recover one root', stem: 'One root is two. What is the other root?', math: '3x^2-15x+18=0', choices: ['-7', '-3', '3', '7'], choiceMath: true, answer: 2, explanation: {steps: [{text: 'Find the root sum.', math: 'r_1+r_2=-\\frac{-15}{3}=5'}, {text: 'Subtract the known root.', math: 'r_2=5-2=3'}], trap: 'Do not use the constant term as the sum.', takeaway: 'A known root plus Vieta can avoid factoring.'}},
            {id: 'reconstruct-scale', difficulty: 'Advanced', skill: 'Reconstruction', title: 'Build from roots', stem: 'A quadratic has roots negative two and three and f of one equals negative twelve. What is its leading coefficient?', math: 'f(x)=a(x+2)(x-3)', choices: ['-2', '-1/2', '1/2', '2'], choiceMath: true, answer: 3, explanation: {steps: [{text: 'Substitute the known input and output.', math: '-12=a(3)(-2)=-6a'}, {text: 'Solve.', math: 'a=2'}], trap: 'The negative factor value is part of the product.', takeaway: 'One extra point fixes the scale of a root-built quadratic.'}},
            {id: 'transform-roots', difficulty: 'Advanced', skill: 'Transformed roots', title: 'Map an input transformation', stem: 'The roots of f are one and seven. What are the roots of g?', math: 'g(x)=f(2x+3)', choices: ['-1 and 2', '-1 and 5', '2 and 5', '5 and 17'], choiceMath: true, answer: 0, explanation: {steps: [{text: 'Set the inside input equal to each original root.', math: '2x+3=1\\text{ or }2x+3=7'}, {text: 'Solve.', math: 'x=-1\\text{ or }x=2'}], trap: 'Inside transformations act through an equation, not by copying the visible shift.', takeaway: 'Find transformed roots by mapping inputs, not outputs.'}},
        ],
    },
};

export default zerosInterceptsRoots;
