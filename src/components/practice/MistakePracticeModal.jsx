import React, {useEffect, useState} from 'react';
import PracticeQuestionCard from './PracticeQuestionCard';
import {ModalShell} from '../ui';

function MistakePracticeModal({attempt, onClose}) {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [status, setStatus] = useState('Blank');

    useEffect(() => {
        setSelectedChoice(null);
        setStatus('Blank');
    }, [attempt?.id]);

    if (!attempt) return null;

    const question = {...attempt.question, subject: attempt.subject};
    const submit = (choice) => {
        setStatus(choice === question.correct_answer ? 'Correct' : 'Incorrect');
    };

    return (
        <ModalShell
            open
            title="Practice this mistake"
            onClose={onClose}
            maxWidth="max-w-3xl"
        >
            <p className="m-0 mb-4 text-sm text-slate-500">
                This retry is just for review and won&apos;t change your practice stats.
            </p>
            <PracticeQuestionCard
                question={question}
                selectedChoice={selectedChoice}
                onSelectChoice={setSelectedChoice}
                onSubmit={submit}
                status={status}
                correctAnswer={question.correct_answer}
                correctChoiceLabel={question.correct_choice_label}
                explanation={question.explanation || 'No explanation has been added for this question yet.'}
                primaryAction={onClose}
                primaryActionLabel="Done"
                allowReporting={false}
            />
        </ModalShell>
    );
}

export default MistakePracticeModal;
