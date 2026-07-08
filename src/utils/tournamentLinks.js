export function tournamentSharePath(tournament) {
    if (tournament?.private && tournament?.join_code) {
        return `/tournaments/join/${tournament.join_code}`;
    }
    return `/tournament/${tournament.id}`;
}

export function tournamentShareUrl(tournament) {
    const path = tournamentSharePath(tournament);
    return `${window.location.origin}${path}`;
}
