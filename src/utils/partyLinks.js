// Party invites are code-based: the link drops a friend on /party with the
// room code attached, and PartyHomePage joins them as soon as they are signed
// in. /party has a prerendered share card, so the link unfurls as a party
// invite in Discord and iMessage (the query string does not change the file
// Netlify serves).
const CODE_RULE = /^\d{6}$/;

export function isPartyCode(value) {
    return CODE_RULE.test(String(value || ''));
}

export function partyInvitePath(code) {
    return `/party?code=${encodeURIComponent(code)}`;
}

export function partyInviteUrl(code) {
    return `${window.location.origin}${partyInvitePath(code)}`;
}
