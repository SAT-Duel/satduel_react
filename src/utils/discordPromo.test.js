import assert from 'node:assert/strict';
import test from 'node:test';
import * as promo from './discordPromo.js';

function memoryStorage() {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
    };
}

test.beforeEach(() => {
    global.window = {localStorage: memoryStorage()};
    global.sessionStorage = memoryStorage();
});

test.after(() => {
    delete global.window;
    delete global.sessionStorage;
});

test('dismissal is scoped to one user', () => {
    promo.dismissDiscordPromo(7);

    assert.equal(promo.shouldShowDiscordPromo(7), false);
    assert.equal(promo.shouldShowDiscordPromo(8), true);
});

test('only an answered total of three is eligible for the Discord promotion', () => {
    assert.equal(promo.isThirdPracticeAnswer?.({practice_answered: 2}), false);
    assert.equal(promo.isThirdPracticeAnswer?.({practice_answered: 3}), true);
    assert.equal(promo.isThirdPracticeAnswer?.({practice_answered: 4}), false);
    assert.equal(promo.isThirdPracticeAnswer?.({practice_answered: 3}, true), false);
    assert.equal(promo.isThirdPracticeAnswer?.(), false);
});

test('storage failure keeps the promotion closed', () => {
    global.sessionStorage.getItem = () => { throw new Error('blocked'); };
    global.window.localStorage.getItem = () => { throw new Error('blocked'); };

    assert.equal(promo.shouldShowDiscordPromo(7), false);
});
