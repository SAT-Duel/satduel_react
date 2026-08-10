const SESSION_VERSION = 1;
const SESSION_KEY_PREFIX = 'sd:practice-test-session';

export function practiceTestSessionKey(userId) {
    return `${SESSION_KEY_PREFIX}:${userId}`;
}

export function readPracticeTestSession(userId, storage = window.localStorage) {
    try {
        const session = JSON.parse(storage.getItem(practiceTestSessionKey(userId)));
        if (session?.version !== SESSION_VERSION || !Array.isArray(session.questions) || !session.timer) {
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export function writePracticeTestSession(userId, session, storage = window.localStorage) {
    try {
        storage.setItem(practiceTestSessionKey(userId), JSON.stringify(session));
        return true;
    } catch {
        return false;
    }
}

export function clearPracticeTestSession(userId, storage = window.localStorage) {
    try {
        storage.removeItem(practiceTestSessionKey(userId));
    } catch {
        // A finished test should still submit when browser storage is unavailable.
    }
}

export function practiceTestSecondsLeft(session, now = Date.now()) {
    const seconds = session?.timer?.status === 'paused'
        ? Number(session.timer.remainingSeconds)
        : Math.ceil((Number(session?.timer?.deadlineAt) - now) / 1000);
    const initialSeconds = Number(session?.initialSeconds) || 0;
    return Math.max(0, Math.min(initialSeconds, Number.isFinite(seconds) ? seconds : 0));
}

export function resumePracticeTestSession(session, now = Date.now()) {
    const remainingSeconds = practiceTestSecondsLeft(session, now);
    return {
        ...session,
        timer: {
            status: 'running',
            deadlineAt: now + remainingSeconds * 1000,
            remainingSeconds: null,
        },
        updatedAt: now,
    };
}

export function pausePracticeTestSession(session, progress, now = Date.now()) {
    return {
        ...session,
        progress,
        timer: {
            status: 'paused',
            deadlineAt: null,
            remainingSeconds: practiceTestSecondsLeft(session, now),
        },
        updatedAt: now,
    };
}

export function createPracticeTestSession({testId, testName, initialSeconds, questions}, now = Date.now()) {
    return {
        version: SESSION_VERSION,
        testId,
        testName,
        initialSeconds,
        questions,
        progress: {
            currentQuestion: 1,
            selectedAnswers: {},
            reviewQuestions: [],
            hideTimer: false,
        },
        timer: {
            status: 'running',
            deadlineAt: now + initialSeconds * 1000,
            remainingSeconds: null,
        },
        updatedAt: now,
    };
}
