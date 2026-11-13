// A duel challenge is a link to the ten questions a player just finished.
// /challenge/* is rewritten onto one prerendered share card in public/_redirects,
// so the link unfurls as a challenge in Discord and iMessage.
export function challengePath(code) {
    return `/challenge/${encodeURIComponent(code)}`;
}

export function challengeUrl(code) {
    return `${window.location.origin}${challengePath(code)}`;
}

/** Hand-off text for the share sheet. `score` and `total` are the sender's. */
export function challengeShareText(score, total) {
    return `I got ${score}/${total} on these SAT questions. Same ${total}, your turn:`;
}
