import React, {useEffect, useRef, useState} from 'react';
import {RotateCcw, Save} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import QuestionSession from '../../components/PracticeTest/QuestionSession';
import api from '../../components/api';
import {Button, ModalShell, Spinner} from '../../components/ui';
import {notify} from '../../utils/notify';

function TestPage() {
    const {testId} = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [error, setError] = useState('');
    const [quitState, setQuitState] = useState(null);
    const [working, setWorking] = useState(false);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        if (!testId) {
            navigate('/practice_test', {replace: true});
            return;
        }
        api.post(`/api/practice-tests/${testId}/start/`)
            .then((response) => setSession(response.data))
            .catch((requestError) => setError(requestError.response?.data?.error || 'This practice test could not be opened.'));
    }, [navigate, testId]);

    const payload = (answers, state) => ({
        answers,
        current_question: state.currentQuestion,
        review_questions: state.reviewQuestions,
        remaining_seconds: state.timeLeft,
    });

    const finishModule = async (answers, state) => {
        if (working) return;
        try {
            setWorking(true);
            const response = await api.post(
                `/api/practice-tests/attempts/${session.attempt_id}/finish-module/`,
                payload(answers, state),
            );
            if (response.data.completed) {
                navigate(`/practice_test/result/${session.attempt_id}`, {replace: true});
                return;
            }
            setSession(response.data);
            notify.success('Module submitted. Your next module is ready.');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to submit this module.');
        } finally {
            setWorking(false);
        }
    };

    const saveAndExit = async () => {
        try {
            setWorking(true);
            await api.patch(
                `/api/practice-tests/attempts/${session.attempt_id}/`,
                payload(quitState.answers, quitState.state),
            );
            notify.success('Your answers and remaining time were saved.');
            navigate('/practice_test');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to save your progress.');
            setWorking(false);
        }
    };

    const restart = async () => {
        try {
            setWorking(true);
            const response = await api.post(`/api/practice-tests/attempts/${session.attempt_id}/restart/`);
            setQuitState(null);
            setSession(response.data);
            notify.success('Progress cleared. The test has restarted from question 1.');
        } catch (requestError) {
            notify.error(requestError.response?.data?.error || 'Failed to restart this test.');
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

    return (
        <>
            <QuestionSession
                key={`${session.attempt_id}:${session.phase}`}
                questions={session.questions}
                initialSeconds={session.remaining_seconds}
                initialAnswers={session.answers}
                initialReviewQuestions={session.review_questions}
                initialCurrentQuestion={session.current_question}
                eyebrow={session.eyebrow}
                title={session.title}
                statusLabel={working ? 'Submitting…' : session.status_label}
                showDesmos={session.subject === 'math'}
                sessionLabel={session.test_name}
                navigationTitle={`${session.title} · ${session.eyebrow}`}
                reviewDescription="Review any unanswered or marked questions before submitting this module. You cannot return after submission."
                onSubmit={finishModule}
                onQuit={(answers, state) => setQuitState({answers, state})}
                paused={Boolean(quitState) || working}
            />

            <ModalShell
                open={Boolean(quitState)}
                title="Leave this practice test?"
                onClose={() => !working && setQuitState(null)}
                footer={(
                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="danger" onClick={restart} loading={working}>
                            <RotateCcw className="size-4"/> Restart and delete progress
                        </Button>
                        <Button onClick={saveAndExit} loading={working}>
                            <Save className="size-4"/> Save and exit
                        </Button>
                    </div>
                )}
            >
                <p className="m-0 text-sm leading-6 text-slate-600">
                    Save and exit keeps every answer, marked question, current position, and the exact time remaining.
                    Restart permanently clears this unfinished attempt; completed scores are never deleted.
                </p>
            </ModalShell>
        </>
    );
}

export default TestPage;
