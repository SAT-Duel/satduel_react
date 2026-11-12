import assert from 'node:assert/strict';
import test from 'node:test';
import {formatPremiumEnd, isOnFreeWeek} from './premium.js';

test('isOnFreeWeek reads the backend flag and tolerates missing data', () => {
    assert.equal(isOnFreeWeek({premium: {on_free_week: true}}), true);
    assert.equal(isOnFreeWeek({premium: {on_free_week: false}}), false);
    assert.equal(isOnFreeWeek({}), false);
    assert.equal(isOnFreeWeek(null), false);
});

test('formatPremiumEnd includes the day and the time', () => {
    const text = formatPremiumEnd('2026-11-18T21:41:00', 'en-US');
    assert.match(text, /Nov 18/);
    assert.match(text, /9:41/);
});

test('formatPremiumEnd returns an empty string for missing or bad dates', () => {
    assert.equal(formatPremiumEnd(null), '');
    assert.equal(formatPremiumEnd('not a date'), '');
});
