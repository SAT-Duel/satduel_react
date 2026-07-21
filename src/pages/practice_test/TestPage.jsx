import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import QuestionSession from '../../components/PracticeTest/QuestionSession';
import api from '../../components/api';
import {Spinner} from '../../components/ui';

function TestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialSeconds = location.state?.initialSeconds ?? 600;
    const [questions, setQuestions] = useState(null);
    const hasFetched = useRef(false);
    const startedAt = useRef(Date.now());

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const queryParams = new URLSearchParams({
            type: 'any',
            difficulty: 'any',
            page: 1,
            page_size: 10,
            random: true,
        }).toString();

        api.get(`api/filter_questions/?${queryParams}`)
            .then((response) => setQuestions(response.data.questions))
            .catch((error) => console.error(error));
    }, []);

    if (!questions) {
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
            questions={questions}
            initialSeconds={initialSeconds}
            onSubmit={(selectedAnswers) => navigate('/test_result', {
                state: {
                    questions,
                    selectedAnswers,
                    testId: location.state?.testId ?? 1,
                    testName: location.state?.testName ?? 'SAT Diagnostic Test',
                    timeUsedSeconds: Math.min(
                        initialSeconds,
                        Math.round((Date.now() - startedAt.current) / 1000),
                    ),
                },
            })}
        />
    );
}

export default TestPage;
