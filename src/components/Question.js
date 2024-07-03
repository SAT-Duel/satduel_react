import React, {useState, useEffect} from 'react';
import {Card, Space, Radio, Button} from 'antd';
import type {RadioChangeEvent} from 'antd';
import {useAuth} from "../context/AuthContext";
import axios from "axios";


function Question({questionData, onSubmit, status}) {
    const {question, choices, id} = questionData;
    const [selectedChoice, setSelectedChoice] = useState('');
    const [note, setNote] = useState('');
    const {loading} = useAuth();

    const [answer, setAnswer] = useState(null);
    const [answerChoice, setAnswerChoice] = useState(null);
    const [explanation, setExplanation] = useState(null);

    const getAnswer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/get_answer/', {question_id: id});
            setAnswer(response.data.answer);
            setExplanation(response.data.explanation);
            setAnswerChoice(response.data.answer_choice)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Question does not exist');
            } else {
                console.log('An error occurred');
            }
            setAnswer(null);
            setExplanation(null);
            setAnswerChoice(null);
        }
    };

    useEffect(() => {
        const fetchAnswer = async () => {
            if (status === 'Correct' || status === 'Incorrect') {
                await getAnswer();
                if (status === 'Correct') {
                    setSelectedChoice(answer);
                    setNote("Correct! " + answerChoice + " is the correct answer.");
                } else if (status === 'Incorrect') {
                    if (!loading) {
                        setNote("Nice Try! " + answerChoice + " is the correct answer.");
                    }
                }
            }
        };

        fetchAnswer();
    }, [status, note]);

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
    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setSelectedChoice(e.target.value);
    };

    return (
        <div>
            <Card title={question} style={{width: '100%'}} className={`question ${getStatusClass()}`}>
                <Radio.Group onChange={onChange} value={selectedChoice}>
                    <Space direction="vertical">
                        {choices.map((choice, index) => (
                            <Radio key={index} checked={selectedChoice === choice} disabled={status !== 'Blank'}
                                   value={choice}>{choice}</Radio>
                        ))}

                    </Space>
                </Radio.Group>
                <p>{note}</p>
                <p>{explanation}</p>
                <Button type="primary" onClick={handleSubmit} disabled={status !== 'Blank'}>Submit</Button>
            </Card>
        </div>
    )
        ;
}

export default Question;
