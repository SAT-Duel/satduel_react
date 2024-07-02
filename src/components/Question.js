import React, { useState, useEffect } from 'react';

function Question({ questionData, onSubmit, status }) {
    const { question, choices, id } = questionData;
    const [selectedChoice, setSelectedChoice] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (status === 'Correct'){
            setSelectedChoice(questionData.choice);
        }else if(status === 'Incorrect'){
            setNote("The correct answer is: " + questionData.choice);
        }

    }, [status, questionData.correctAnswer]);

    const handleSubmit = () => {
        if (selectedChoice) {
            onSubmit(id, selectedChoice);
        } else {
            alert("Please select an option before submitting.");
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'Correct':
                return 'correct';
            case 'Incorrect':
                return 'incorrect';
            default:
                return '';
        }
    };

    return (
        <div className={`question ${getStatusClass()}`}>
            <h3>{question}</h3>
            <div>
                {choices.map((choice, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name={id}
                            value={choice}
                            checked={selectedChoice === choice}
                            onChange={() => setSelectedChoice(choice)}
                            disabled={status !== 'Blank'}
                        />
                        {choice}
                    </label>
                ))}
            </div>
            <p>{note}</p>
            <button onClick={handleSubmit} disabled={status !== 'Blank'}>Submit</button>
        </div>
    );
}

export default Question;
