const SESSION_VERSION = 2;
const SESSION_KEY_PREFIX = 'sd:practice-test-session';

export function practiceTestSessionKey(attemptId) {
    return `${SESSION_KEY_PREFIX}:${attemptId}`;
}

export function readPracticeTestSession(attemptId, storage = window.localStorage) {
    try {
        const session = JSON.parse(storage.getItem(practiceTestSessionKey(attemptId)));
        if (
            session?.version !== SESSION_VERSION
            || session.attemptId !== attemptId
            || !session.phase
            || !session.progress
            || !Number.isFinite(session.deadlineAt)
        ) {
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export function writePracticeTestSession(attemptId, session, storage = window.localStorage) {
    try {
        storage.setItem(practiceTestSessionKey(attemptId), JSON.stringify(session));
        return true;
    } catch {
        return false;
    }
}

export function clearPracticeTestSession(attemptId, storage = window.localStorage) {
    try {
        storage.removeItem(practiceTestSessionKey(attemptId));
    } catch {
        // Server-side progress still remains available when storage is blocked.
    }
}

export function practiceTestSecondsLeft(session, now = Date.now()) {
    const limit = Number(session?.timeLimitSeconds) || 0;
    const seconds = Math.ceil((Number(session?.deadlineAt) - now) / 1000);
    return Math.max(0, Math.min(limit, Number.isFinite(seconds) ? seconds : 0));
}

export function createPracticeTestSession(serverSession, now = Date.now()) {
    return {
        version: SESSION_VERSION,
        attemptId: serverSession.attempt_id,
        testId: serverSession.test_id,
        phase: serverSession.phase,
        timeLimitSeconds: serverSession.time_limit_seconds,
        deadlineAt: now + serverSession.remaining_seconds * 1000,
        progress: {
            answers: serverSession.answers || {},
            reviewQuestions: serverSession.review_questions || [],
            currentQuestion: serverSession.current_question || 1,
            hideTimer: false,
        },
        updatedAt: now,
    };
}

export function restorePracticeTestSession(serverSession, storage = window.localStorage, now = Date.now()) {
    const cached = readPracticeTestSession(serverSession.attempt_id, storage);
    if (cached?.phase === serverSession.phase && cached.testId === serverSession.test_id) {
        return cached;
    }
    if (cached) clearPracticeTestSession(serverSession.attempt_id, storage);
    return createPracticeTestSession(serverSession, now);
}
