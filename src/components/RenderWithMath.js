import React from 'react';
import styled from 'styled-components';
import {BlockMath, InlineMath} from 'react-katex';
import 'katex/dist/katex.min.css';

const FormattedText = styled.span`
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
`;

const Underlined = styled.span`
    text-decoration: underline;
`;

const Italicized = styled.span`
    font-style: italic;
`;

const Bold = styled.span`
    font-weight: bold;
`;

const FormattedTextRenderer = ({text}) => {
    const regex = /(\$\$.*?\$\$|\$.*?\$|\\underline{.*?}|\\textit{.*?}|\\textbf{.*?}|\n)/s;
    if (!text) {
        return null;
    }

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                if (part === '\n') {
                    return <br key={index}/>;
                } else if (part.startsWith('$$') && part.endsWith('$$')) {
                    return <BlockMath key={index} math={part.slice(2, -2)}/>;
                } else if (part.startsWith('$') && part.endsWith('$')) {
                    return <InlineMath key={index} math={part.slice(1, -1)}/>;
                } else if (part.startsWith('\\underline{') && part.endsWith('}')) {
                    return <Underlined key={index}>{part.slice(11, -1)}</Underlined>;
                } else if (part.startsWith('\\textit{') && part.endsWith('}')) {
                    return <Italicized key={index}>{part.slice(8, -1)}</Italicized>;
                } else if (part.startsWith('\\textbf{') && part.endsWith('}')) {
                    return <Bold key={index}>{part.slice(8, -1)}</Bold>;
                }
                return <FormattedText key={index}>{part}</FormattedText>;
            })}
        </>
    );
};

export default FormattedTextRenderer;
