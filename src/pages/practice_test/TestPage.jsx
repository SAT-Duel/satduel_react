import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import QuestionSession from '../../components/PracticeTest/QuestionSession';
import api from '../../components/api';
import {Button, Spinner} from '../../components/ui';
import {useAuth} from '../../context/AuthContext';
import {loginPathFor} from '../../utils/authRedirect';
import {
    clearPracticeTestSession,
    createPracticeTestSession,
    pausePracticeTestSession,
    practiceTestSecondsLeft,
    readPracticeTestSession,
    resumePracticeTestSession,
    writePracticeTestSession,
} from '../../utils/practiceTestSession';

const DEFAULT_TEST_SECONDS = 25 * 60;

function TestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, loading: authLoading} = useAuth();
    const [session, setSession] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const hasLoaded = useRef(false);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        if (authLoading || hasLoaded.current) return;
        if (!user) {
            navigate(loginPathFor('/practice_test'), {replace: true});
            return;
        }
        hasLoaded.current = true;

        const saved = readPracticeTestSession(user.id);
        if (saved) {
            const restored = saved.timer.status === 'paused'
                ? resumePracticeTestSession(saved)
                : saved;
            writePracticeTestSession(user.id, restored);
            setSession(restored);
            return;
        }

        const queryParams = new URLSearchParams({
            type: 'any',
            difficulty: 'any',
            page: 1,
            page_size: 10,
            random: true,
        }).toString();

        api.get(`api/filter_questions/?${queryParams}`)
            .then((response) => {
                const created = createPracticeTestSession({
                    testId: location.state?.testId ?? 1,
                    testName: location.state?.testName ?? 'SAT Diagnostic Test',
                    initialSeconds: location.state?.initialSeconds ?? DEFAULT_TEST_SECONDS,
                    questions: response.data.questions,
                });
                writePracticeTestSession(user.id, created);
                setSession(created);
            })
            .catch((error) => {
                console.error(error);
                setLoadError(true);
            });
    }, [authLoading, location.state, navigate, user]);

    const persistProgress = useCallback((progress) => {
        if (!user || hasSubmitted.current) return;
        setSession((current) => {
            if (!current) return current;
            const next = {...current, progress, updatedAt: Date.now()};
            writePracticeTestSession(user.id, next);
            return next;
        });
    }, [user]);

    const saveAndQuit = useCallback((progress) => {
        if (!user || !session) return;
        const paused = pausePracticeTestSession(session, progress);
        writePracticeTestSession(user.id, paused);
        navigate('/practice_test', {replace: true, state: {testSaved: true}});
    }, [navigate, session, user]);

    const submit = useCallback((selectedAnswers) => {
        if (!user || !session || hasSubmitted.current) return;
        hasSubmitted.current = true;
        const timeUsedSeconds = session.initialSeconds - practiceTestSecondsLeft(session);
        clearPracticeTestSession(user.id);
        navigate('/test_result', {
            state: {
                questions: session.questions,
                selectedAnswers,
                testId: session.testId,
                testName: session.testName,
                timeUsedSeconds,
            },
        });
    }, [navigate, session, user]);

    if (loadError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center text-slate-600">
                <p className="m-0 font-bold">We couldn’t load your test.</p>
                <Button to="/practice_test" variant="secondary">Return to practice tests</Button>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-600">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <Spinner/> Loading your test…
                </div>
            </div>
        );
    }

    return (
        <QuestionSession
            questions={session.questions}
            initialSeconds={session.initialSeconds}
            deadlineAt={session.timer.deadlineAt}
            initialProgress={session.progress}
            onProgressChange={persistProgress}
            onSaveAndQuit={saveAndQuit}
            onSubmit={submit}
        />
    );
}

export default TestPage;
