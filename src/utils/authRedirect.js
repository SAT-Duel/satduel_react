const POST_LOGIN_REDIRECT_KEY = 'satduel_post_login_redirect';

export function safeRedirectPath(value, fallback = '/') {
    if (!value || typeof value !== 'string') return fallback;
    if (!value.startsWith('/') || value.startsWith('//')) return fallback;
    try {
        const url = new URL(value, window.location.origin);
        if (url.origin !== window.location.origin) return fallback;
        return `${url.pathname}${url.search}${url.hash}` || fallback;
    } catch {
        return fallback;
    }
}

export function loginPathFor(path) {
    return `/login?next=${encodeURIComponent(safeRedirectPath(path, '/'))}`;
}

export function rememberPostLoginRedirect(path) {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, safeRedirectPath(path, '/'));
}

export function consumePostLoginRedirect() {
    const path = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    return path ? safeRedirectPath(path, null) : null;
}
