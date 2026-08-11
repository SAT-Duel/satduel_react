import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createPracticeTestSession,
    practiceTestSecondsLeft,
    readPracticeTestSession,
    restorePracticeTestSession,
    writePracticeTestSession,
} from './practiceTestSession.js';

const memoryStorage = () => {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
};

const serverSession = (updates = {}) => ({
    attempt_id: 12,
    test_id: 4,
    phase: 'english_a',
    time_limit_seconds: 1920,
    remaining_seconds: 1800,
    answers: {'1': 'B'},
    review_questions: [2],
    annotations: {'1': {marks: [], crossed_out: ['D']}},
    current_question: 3,
    ...updates,
});

test('a live module keeps counting down while the page is gone', () => {
    const session = createPracticeTestSession(serverSession(), 10_000);

    assert.equal(practiceTestSecondsLeft(session, 25_000), 1785);
    assert.equal(practiceTestSecondsLeft(session, 35_000), 1775);
});

test('answers, annotations, position, review marks, and timer survive a storage round trip', () => {
    const storage = memoryStorage();
    const session = createPracticeTestSession(serverSession(), 10_000);
    session.progress.answers['3'] = 'C';
    session.progress.hideTimer = true;
    writePracticeTestSession(12, session, storage);

    const restored = restorePracticeTestSession(serverSession(), storage, 900_000);

    assert.deepEqual(restored, session);
    assert.deepEqual(restored.progress.annotations, serverSession().annotations);
    assert.equal(practiceTestSecondsLeft(restored, 910_000), 900);
});

test('a completed module cannot leak progress into the next module', () => {
    const storage = memoryStorage();
    const first = createPracticeTestSession(serverSession(), 10_000);
    writePracticeTestSession(12, first, storage);

    const next = restorePracticeTestSession(serverSession({
        phase: 'english_c',
        remaining_seconds: 1920,
        answers: {},
        review_questions: [],
        current_question: 1,
    }), storage, 20_000);

    assert.equal(next.phase, 'english_c');
    assert.deepEqual(next.progress.answers, {});
    assert.equal(readPracticeTestSession(12, storage), null);
});
