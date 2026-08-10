import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RotateCcw, Save} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import QuestionSession from '../../components/PracticeTest/QuestionSession';
import BreakScreen from '../../components/PracticeTest/BreakScreen';
import api from '../../components/api';
import {Button, ModalShell, Spinner} from '../../components/ui';
import {
    clearPracticeTestSession,
    practiceTestSecondsLeft,
    readPracticeTestSession,
    restorePracticeTestSession,
    writePracticeTestSession,
} from '../../utils/practiceTestSession';
import {notify} from '../../utils/notify';

function hydrateSession(serverSession) {
    const localSession = restorePracticeTestSession(serverSession);
    writePracticeTestSession(serverSession.attempt_id, localSession);
    return {
        ...serverSession,
        deadlineAt: localSession.deadlineAt,
        progress: localSession.progress,
    };
}

function prepareSession(serverSession) {
    if (serverSession.break) {
        clearPracticeTestSession(serverSession.attempt_id);
        return serverSession;
    }
    return hydrateSession(serverSession);
}

function progressPayload(session, answers, state) {
    return {
        phase: session.phase,
        answers,
        current_question: state.currentQuestion,
        review_questions: state.reviewQuestions,
        annotations: state.annotations,
        remaining_seconds: state.timeLeft,
    };
}

function TestPage() {
    const {testId} = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [error, setError] = useState('');
    const [quitState, setQuitState] = useState(null);
    const [working, setWorking] = useState(false);
    const started = useRef(false);
    const sessionRef = useRef(null);
    const annotationSaveTimer = useRef(null);

    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    useEffect(() => () => window.clearTimeout(annotationSaveTimer.current), []);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        if (!testId) {
            navigate('/practice_test', {replace: true});
            return;
        }
        api.post(`/api/practice-tests/${testId}/start/`)
            .then((response) => setSession(prepareSession(response.data)))
            .catch((requestError) => setError(requestError.response?.data?.error || 'This practice test could not be opened.'));
    }, [navigate, testId]);

    const persistProgress = useCallback((answers, state) => {
        setSession((current) => {
            if (!current) return current;
            const cached = readPracticeTestSession(current.attempt_id);
            if (!cached || cached.phase !== current.phase) return current;
            const progress = {
                answers,
                currentQuestion: state.currentQuestion,
                reviewQuestions: state.reviewQuestions,
                annotations: state.annotations,
                hideTimer: state.hideTimer,
            };
            writePracticeTestSession(current.attempt_id, {
                ...cached,
                progress,
                updatedAt: Date.now(),
            });
            return {...current, progress};
        });
    }, []);

    const persistAnnotations = useCallback((answers, state) => {
        const current = sessionRef.current;
        if (!current || current.break) return;
        window.clearTimeout(annotationSaveTimer.current);
        annotationSaveTimer.current = window.setTimeout(() => {
            const liveState = {
                ...state,
                timeLeft: practiceTestSecondsLeft({
                    timeLimitSeconds: current.time_limit_seconds,
                    deadlineAt: current.deadlineAt,
                }),
            };
            api.patch(
                `/api/practice-tests/attempts/${current.attempt_id}/`,
                progressPayload(current, answers, liveState),
            ).catch(() => notify.error('Your test tools could not sync. Your browser copy is still safe.'));
        }, 250);
    }, []);

    const finishModule = async (answers, state) => {
        if (working) return;
        try {
            setWorking(true);
            window.clearTimeout(annotationSaveTimer.current);
            const response = await api.post(
                `/api/practice-tests/attempts/${session.attempt_id}/finish-module/`,
                progressPayload(session, answers, state),
            );
            clearPracticeTestSession(session.attempt_id);
            if (response.data.completed) {
                navigate(`/practice_test/result/${session.attempt_id}`, {replace: true});
                return;
            }
            setSession(prepareSession(response.data));
            if (!response.data.break) notify.success('Module submitted. Your next module is ready.');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to submit this module.');
        } finally {
            setWorking(false);
        }
    };

    const saveAndExit = async () => {
        try {
            setWorking(true);
            window.clearTimeout(annotationSaveTimer.current);
            const liveState = {
                ...quitState.state,
                timeLeft: practiceTestSecondsLeft({
                    timeLimitSeconds: session.time_limit_seconds,
                    deadlineAt: session.deadlineAt,
                }),
            };
            await api.patch(
                `/api/practice-tests/attempts/${session.attempt_id}/`,
                progressPayload(session, quitState.answers, liveState),
            );
            clearPracticeTestSession(session.attempt_id);
            notify.success('Your answers, position, and remaining time were saved.');
            navigate('/practice_test');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to save your progress.');
            setWorking(false);
        }
    };

    const restart = async () => {
        try {
            setWorking(true);
            window.clearTimeout(annotationSaveTimer.current);
            const response = await api.post(`/api/practice-tests/attempts/${session.attempt_id}/restart/`);
            clearPracticeTestSession(session.attempt_id);
            setQuitState(null);
            setSession(prepareSession(response.data));
            notify.success('Progress cleared. The test has restarted from question 1.');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to restart this test.');
        } finally {
            setWorking(false);
        }
    };

    const resumeAfterBreak = async () => {
        try {
            setWorking(true);
            const response = await api.post(`/api/practice-tests/attempts/${session.attempt_id}/resume-after-break/`);
            setSession(hydrateSession(response.data));
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to open the Math section.');
        } finally {
            setWorking(false);
        }
    };

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
                <p className="m-0 font-bold text-rose-700">{error}</p>
                <Button onClick={() => navigate('/practice_test')}>Back to practice tests</Button>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-600">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <Spinner/> Preparing your saved test…
                </div>
            </div>
        );
    }

    if (session.break) {
        return <BreakScreen initialSeconds={session.break_remaining_seconds} onResume={resumeAfterBreak} working={working}/>;
    }

    return (
        <>
            <QuestionSession
                key={`${session.attempt_id}:${session.phase}`}
                questions={session.questions}
                initialSeconds={practiceTestSecondsLeft({
                    timeLimitSeconds: session.time_limit_seconds,
                    deadlineAt: session.deadlineAt,
                })}
                deadlineAt={session.deadlineAt}
                initialProgress={session.progress}
                title={session.title}
                statusLabel={working ? 'Submitting…' : null}
                sectionNumber={session.section_number}
                moduleNumber={session.module_number}
                showDesmos={session.subject === 'math'}
                navigationTitle={`Section ${session.section_number}, Module ${session.module_number}: ${session.title} Questions`}
                reviewDescription="Review any unanswered or marked questions before submitting this module. You cannot return after submission."
                onProgressChange={persistProgress}
                onAnnotationsPersist={persistAnnotations}
                onSubmit={finishModule}
                onQuit={(answers, state) => setQuitState({answers, state})}
            />

            <ModalShell
                open={Boolean(quitState)}
                title="Save and quit this practice test?"
                onClose={() => !working && setQuitState(null)}
                footer={(
                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="danger" onClick={restart} loading={working}>
                            <RotateCcw className="size-4"/> Restart and delete progress
                        </Button>
                        <Button onClick={saveAndExit} loading={working}>
                            <Save className="size-4"/> Save &amp; quit
                        </Button>
                    </div>
                )}
            >
                <p className="m-0 text-sm leading-6 text-slate-600">
                    Save &amp; quit pauses the test with every answer, marked question, current position, and the exact time remaining.
                    Until you save, the timer continues—even if you close this dialog, switch tabs, or refresh.
                </p>
            </ModalShell>
        </>
    );
}

export default TestPage;
