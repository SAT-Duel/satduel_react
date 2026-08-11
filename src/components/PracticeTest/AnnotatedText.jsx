import React, {useRef} from 'react';
import RenderWithMath from '../RenderWithMath';
import {annotationSegments, selectedTextRange} from '../../utils/practiceTestAnnotations';

const HIGHLIGHTER_CURSOR = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2228%22 viewBox=%220 0 28 28%22%3E%3Cpath fill=%22%23facc15%22 stroke=%22%23111827%22 stroke-width=%221.5%22 d=%22m5 19 4 4 14-14-4-4L5 19Zm0 0-1 5 5-1%22/%3E%3C/svg%3E") 4 24, text';

const colors = {
    yellow: 'bg-yellow-200',
    blue: 'bg-blue-200',
    pink: 'bg-pink-200',
};

export default function AnnotatedText({text, field, marks = [], highlighterActive, onCreate, onOpen, className = ''}) {
    const root = useRef(null);

    const finishSelection = () => {
        if (!highlighterActive) return;
        const selection = window.getSelection();
        if (!selection?.rangeCount || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        if (!root.current?.contains(range.commonAncestorContainer)) return;
        const selected = selection.toString();
        const before = document.createRange();
        before.selectNodeContents(root.current);
        before.setEnd(range.startContainer, range.startOffset);
        const offsets = selectedTextRange(text, selected, before.toString().length);
        if (!offsets) return;
        const rect = range.getBoundingClientRect();
        onCreate({...offsets, field, rect});
        selection.removeAllRanges();
    };

    return (
        <span
            ref={root}
            onMouseUp={finishSelection}
            className={`${className} ${highlighterActive ? 'select-text' : ''}`}
            style={highlighterActive ? {cursor: HIGHLIGHTER_CURSOR} : undefined}
        >
            {annotationSegments(text, marks, field).map((segment, index) => (
                segment.mark ? (
                    <mark
                        key={segment.mark.id || index}
                        className={`${colors[segment.mark.color] || colors.yellow} cursor-pointer rounded-sm px-0.5 text-inherit`}
                        style={{textDecoration: segment.mark.underline === 'none' ? 'none' : `underline ${segment.mark.underline} 2px`}}
                        onClick={(event) => {
                            event.stopPropagation();
                            onOpen(segment.mark, event.currentTarget.getBoundingClientRect());
                        }}
                    >
                        <RenderWithMath text={segment.text}/>
                    </mark>
                ) : <RenderWithMath key={index} text={segment.text}/>
            ))}
        </span>
    );
}
