import React from 'react';
import AnnotatedText from './AnnotatedText';

export default function QuestionContent({question, marks, highlighterActive, onCreateMark, onOpenMark}) {
    const passage = question.question.split('\n').slice(0, -1).join('\n');
    return (
        <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
            <p className="m-0 whitespace-pre-wrap font-serif text-lg leading-[1.75] text-slate-950 sm:text-[21px]">
                <AnnotatedText
                    text={passage}
                    field="passage"
                    marks={marks}
                    highlighterActive={highlighterActive}
                    onCreate={onCreateMark}
                    onOpen={onOpenMark}
                />
            </p>
        </div>
    );
}
