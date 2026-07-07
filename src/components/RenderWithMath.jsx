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

const BulletPoint = styled.li`
    margin-left: 20px;
    list-style-type: disc;
`;

// Inline SVG figures ([svg]...[/svg] blocks, AI-generated then admin-reviewed).
// Reject anything with scripting/embedding capability before injecting.
const isSafeSvg = (svg) =>
    /^<svg[\s>]/i.test(svg.trim()) &&
    !/<\s*(script|foreignObject|image|use|animate|a)\b|\bon\w+\s*=|href\s*=|javascript:/i.test(svg);

const SvgFigure = ({markup}) => {
    if (!isSafeSvg(markup)) return null;
    return (
        <span
            style={{display: 'block', maxWidth: '360px', margin: '12px auto'}}
            dangerouslySetInnerHTML={{__html: markup}}
        />
    );
};

const FormattedTextRenderer = ({text}) => {
    const regex = /(\[svg\].*?\[\/svg\]|\$\$.*?\$\$|\$.*?\$|\\underline{.*?}|\\textit{.*?}|\\textbf{.*?}|\n|\*.*?\n)/s;
    if (!text) {
        return null;
    }

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                if (part === '\n') {
                    return <br key={index}/>;
                } else if (part.startsWith('[svg]') && part.endsWith('[/svg]')) {
                    return <SvgFigure key={index} markup={part.slice(5, -6)}/>;
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
                } else if (part.startsWith('***')) {
                    return <BulletPoint key={index}>{part.slice(3)}</BulletPoint>;
                }
                return <FormattedText key={index}>{part}</FormattedText>;
            })}
        </>
    );
};

export default FormattedTextRenderer;
