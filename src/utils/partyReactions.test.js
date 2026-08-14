import assert from 'node:assert/strict';
import test from 'node:test';

import {groupPartyReactions} from './partyReactions.js';

test('matching reaction bursts combine without mixing senders or emoji', () => {
    const grouped = groupPartyReactions([
        {sender_id: 1, emoji: '🔥'},
        {sender_id: 1, emoji: '🔥', count: 2},
        {sender_id: 2, emoji: '🔥'},
        {sender_id: 1, emoji: '😂'},
    ]);

    assert.deepEqual(grouped.map(({sender_id, emoji, count}) => ({sender_id, emoji, count})), [
        {sender_id: 1, emoji: '🔥', count: 3},
        {sender_id: 2, emoji: '🔥', count: 1},
        {sender_id: 1, emoji: '😂', count: 1},
    ]);
});
