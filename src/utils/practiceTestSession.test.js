import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createPracticeTestSession,
    pausePracticeTestSession,
    practiceTestSecondsLeft,
    readPracticeTestSession,
    resumePracticeTestSession,
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

test('running sessions keep counting down while the page is gone', () => {
    const session = createPracticeTestSession({
        testId: 1,
        testName: 'Diagnostic',
        initialSeconds: 1500,
        questions: [{id: 1}],
    }, 10_000);

    assert.equal(practiceTestSecondsLeft(session, 25_000), 1485);
    assert.equal(practiceTestSecondsLeft(session, 35_000), 1475);
});

test('save and quit pauses the timer and resume starts it from the saved time', () => {
    const session = createPracticeTestSession({
        testId: 1,
        testName: 'Diagnostic',
        initialSeconds: 1500,
        questions: [{id: 1}],
    }, 10_000);
    const progress = {currentQuestion: 2, selectedAnswers: {1: 'B'}, reviewQuestions: [1], hideTimer: true};
    const paused = pausePracticeTestSession(session, progress, 25_000);

    assert.equal(practiceTestSecondsLeft(paused, 900_000), 1485);
    assert.deepEqual(paused.progress, progress);

    const resumed = resumePracticeTestSession(paused, 900_000);
    assert.equal(practiceTestSecondsLeft(resumed, 910_000), 1475);
});

test('session progress survives a storage round trip', () => {
    const storage = memoryStorage();
    const session = createPracticeTestSession({
        testId: 1,
        testName: 'Diagnostic',
        initialSeconds: 1500,
        questions: [{id: 42}],
    }, 10_000);
    session.progress.selectedAnswers = {1: 'C'};

    writePracticeTestSession(7, session, storage);

    assert.deepEqual(readPracticeTestSession(7, storage), session);
});
