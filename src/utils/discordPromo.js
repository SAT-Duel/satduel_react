const DISMISSED_KEY = 'sd:discord-premium-promo-dismissed';

export function dismissDiscordPromo() {
    try {
        sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
        // The callout can safely reappear if browser storage is unavailable.
    }
}

export function resetDiscordPromo() {
    try {
        sessionStorage.removeItem(DISMISSED_KEY);
    } catch {
        // Login should never depend on browser storage being available.
    }
}

export function shouldShowDiscordPromo() {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) !== 'true';
    } catch {
        return true;
    }
}
