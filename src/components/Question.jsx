import React, {useEffect, useState} from 'react';
import PracticeQuestionCard from './practice/PracticeQuestionCard';
import api from './api';

function isAnswered(status) {
    const value = String(status || 'Blank').toLowerCase();
    return value === 'correct' || value === 'incorrect';
}

function Question({
    questionData,
    onSubmit,
    status,
    questionNumber,
    disabled = false,
    showQuestionNumber = true,
    timerSeconds = null,
    timerRunning = false,
    onTimerToggle,
    onTimerReset,
}) {
    const [selectedChoice, setSelectedChoice] = useState('');
    const [answerDetails, setAnswerDetails] = useState(null);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        setSelectedChoice('');
        setAnswerDetails(null);
    }, [questionData?.id]);

    useEffect(() => {
        let cancelled = false;

        const getAnswer = async () => {
            if (!isAnswered(status) || !questionData?.id) return;
            try {
                const response = await api.post('/api/get_answer/', {question_id: questionData.id});
                if (!cancelled) {
                    setAnswerDetails(response.data);
                }
            } catch {
                if (!cancelled) {
                    setAnswerDetails(null);
                }
            }
        };

        getAnswer();
        return () => {
            cancelled = true;
        };
    }, [questionData?.id, status]);

    const handleSubmit = async (choice) => {
        if (!choice || checking) return;
        setChecking(true);
        try {
            await onSubmit(questionData.id, choice);
        } finally {
            setChecking(false);
        }
    };

    return (
        <PracticeQuestionCard
            question={questionData}
            questionNumber={questionNumber}
            selectedChoice={selectedChoice}
            onSelectChoice={setSelectedChoice}
            onSubmit={handleSubmit}
            status={status}
            disabled={disabled}
            checking={checking}
            timerSeconds={timerSeconds}
            timerRunning={timerRunning}
            onTimerToggle={onTimerToggle}
            onTimerReset={onTimerReset}
            correctAnswer={answerDetails?.answer}
            correctChoiceLabel={answerDetails?.answer_choice}
            explanation={answerDetails?.explanation}
        />
    );
}

export default Question;
