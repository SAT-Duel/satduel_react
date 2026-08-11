export function applyAnnotation(marks, next) {
    return [...marks.filter((mark) => (
        mark.field !== next.field || mark.end <= next.start || mark.start >= next.end
    )), next].sort((left, right) => left.start - right.start);
}

export function annotationSegments(text, marks, field) {
    const relevant = marks
        .filter((mark) => mark.field === field && mark.start >= 0 && mark.end <= text.length && mark.end > mark.start)
        .sort((left, right) => left.start - right.start);
    const segments = [];
    let cursor = 0;
    relevant.forEach((mark) => {
        if (mark.start < cursor) return;
        if (mark.start > cursor) segments.push({text: text.slice(cursor, mark.start), mark: null});
        segments.push({text: text.slice(mark.start, mark.end), mark});
        cursor = mark.end;
    });
    if (cursor < text.length) segments.push({text: text.slice(cursor), mark: null});
    return segments;
}

export function selectedTextRange(text, selectedText, offsetHint = 0) {
    const selection = selectedText.trim();
    if (!selection) return null;
    const starts = [];
    let match = text.indexOf(selection);
    while (match >= 0) {
        starts.push(match);
        match = text.indexOf(selection, match + 1);
    }
    const start = starts.sort((left, right) => Math.abs(left - offsetHint) - Math.abs(right - offsetHint))[0];
    return start == null ? null : {start, end: start + selection.length};
}
