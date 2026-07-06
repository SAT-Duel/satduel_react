import React from 'react';
import RenderWithMath from '../RenderWithMath';

function QuestionContent({question}) {
    const splitText = (text) => text.split('\n').slice(0, -1).join('\n');

    return (
        <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-800 sm:p-6">
                <RenderWithMath text={splitText(question.question)}/>
            </div>
        </div>
    );
}

export default QuestionContent;
