export const QUESTION_SOURCES = [
    {value: 'sat_question_bank', label: 'SAT Question Bank'},
    {value: 'ai_generated', label: 'AI Generated'},
    {value: 'other', label: 'Other'},
];

export function questionSourceLabel(source, sourceOther = '') {
    if (source === 'other' && sourceOther) return `Other — ${sourceOther}`;
    return QUESTION_SOURCES.find((option) => option.value === source)?.label || 'Other';
}
