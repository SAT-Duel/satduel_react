export const FREE_DUEL_EMOJIS = [
    '👍', '🔥', '😂', '😮', '🎉', '💀', '👀', '🧠', '💪', '😎',
    '🤔', '😭', '🫡', '🚀', '⚡', '🎯', '🏆', '🤝', '😅', '🙃',
    '😤', '🥳', '🤯', '👏', '✨', '😈', '🐐', '✅', '❌', '🫠',
];

export const PREMIUM_DUEL_EMOJIS = ['🤡', '👎', '🗑️', '💩', '🤓', '🥱', '😏', '🤬', '🥶', '🥴'];
export const DUEL_EMOJIS = [...FREE_DUEL_EMOJIS, ...PREMIUM_DUEL_EMOJIS];

export const DEFAULT_DUEL_EMOTES = FREE_DUEL_EMOJIS.slice(0, 4);
