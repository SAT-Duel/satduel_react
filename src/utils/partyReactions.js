export function groupPartyReactions(reactions) {
    const groups = new Map();
    reactions.forEach((reaction) => {
        const groupKey = `${reaction.sender_id}:${reaction.emoji}`;
        const current = groups.get(groupKey);
        groups.set(groupKey, current
            ? {...current, count: current.count + (reaction.count || 1)}
            : {...reaction, groupKey, count: reaction.count || 1});
    });
    return Array.from(groups.values());
}
