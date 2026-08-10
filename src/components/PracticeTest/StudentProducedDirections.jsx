import React from 'react';
import RenderWithMath from '../RenderWithMath';

const Entry = ({children}) => <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-800">{children}</code>;

const examples = [
    {
        answer: '$3.5$',
        accepted: [<Entry key="3.5">3.5</Entry>, <Entry key="3.50">3.50</Entry>, <Entry key="7/2">7/2</Entry>],
        rejected: [<Entry key="31/2">31/2</Entry>, <Entry key="3 1/2">3 1/2</Entry>],
    },
    {
        answer: '$\\frac{2}{3}$',
        accepted: [<Entry key="2/3">2/3</Entry>, <Entry key=".6666">.6666</Entry>, <Entry key=".6667">.6667</Entry>, <Entry key="0.666">0.666</Entry>, <Entry key="0.667">0.667</Entry>],
        rejected: [<Entry key="0.66">0.66</Entry>, <Entry key=".66">.66</Entry>, <Entry key="0.67">0.67</Entry>, <Entry key=".67">.67</Entry>],
    },
    {
        answer: '$-\\frac{1}{3}$',
        accepted: [<Entry key="-1/3">-1/3</Entry>, <Entry key="-.3333">-.3333</Entry>, <Entry key="-0.333">-0.333</Entry>],
        rejected: [<Entry key="-.33">-.33</Entry>, <Entry key="-0.33">-0.33</Entry>],
    },
];

export default function StudentProducedDirections() {
    return (
        <div className="px-6 py-8 font-serif text-slate-950 sm:px-10 sm:py-10 lg:px-12">
            <h2 className="m-0 text-2xl font-black">Student-produced response directions</h2>
            <ul className="mb-8 mt-6 space-y-1 pl-8 text-lg leading-7 sm:text-xl sm:leading-8">
                <li>If you find <strong>more than one correct answer</strong>, enter only one answer.</li>
                <li>You can enter up to 5 characters for a <strong>positive answer</strong> and up to 6 characters (including the negative sign) for a <strong>negative answer</strong>.</li>
                <li>If your answer is a <strong>fraction</strong> that doesn’t fit in the provided space, enter the decimal equivalent.</li>
                <li>If your answer is a <strong>decimal</strong> that doesn’t fit in the provided space, enter it by truncating or rounding at the fourth digit.</li>
                <li>If your answer is a <strong>mixed number</strong> (such as <RenderWithMath text="$3\frac{1}{2}$"/>), enter it as an improper fraction (7/2) or its decimal equivalent (3.5).</li>
                <li>Don’t enter <strong>symbols</strong> such as a percent sign, comma, or dollar sign.</li>
            </ul>

            <div className="mx-auto max-w-xl">
                <p className="m-0 mb-2 text-center text-lg">Examples</p>
                <table className="w-full table-fixed border-collapse text-center text-base sm:text-lg">
                    <thead>
                        <tr>
                            <th className="w-1/4 border border-slate-700 px-2 py-5 font-normal">Answer</th>
                            <th className="border border-slate-700 px-2 py-5 font-normal">Acceptable ways to<br/>enter answer</th>
                            <th className="border border-slate-700 px-2 py-5 font-normal">Unacceptable: will<br/>NOT receive credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examples.map((example) => (
                            <tr key={example.answer}>
                                <td className="border border-slate-700 px-2 py-8"><RenderWithMath text={example.answer}/></td>
                                <td className="border border-slate-700 px-2 py-8">
                                    <span className="flex flex-col items-center gap-1.5">{example.accepted}</span>
                                </td>
                                <td className="border border-slate-700 px-2 py-8">
                                    <span className="flex flex-col items-center gap-1.5">{example.rejected}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
