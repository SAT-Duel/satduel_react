export const DISCORD_PROMO_EVENT = 'satduel:discord-promo-eligible';

const promoKey = (userId) => `sd:discord-premium-promo-dismissed:${userId}`;

export function dismissDiscordPromo(userId) {
    if (userId == null) return;
    try {
        window.localStorage.setItem(promoKey(userId), 'true');
    } catch {
        // The promotion must never interrupt practice when storage is blocked.
    }
}

export function isFirstPracticeAnswer(stats, review = false) {
    return !review && stats?.practice_answered === 1;
}

export function shouldShowDiscordPromo(userId) {
    if (userId == null) return false;
    try {
        return window.localStorage.getItem(promoKey(userId)) !== 'true';
    } catch {
        return false;
    }
}
