import React, {useState, useEffect} from 'react';
import {Radio, Button, Space, Alert} from 'antd';
import styled from 'styled-components';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import RenderWithMath from './RenderWithMath';

const QuestionCard = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    border: 1px solid #e8e8e8;
`;

const QuestionText = styled.h3`
    font-size: 1rem;
    margin-bottom: 16px;
    color: #1a1a1a;
    line-height: 1.5;
`;

const StyledRadioGroup = styled(Radio.Group)`
    width: 100%;
`;

const StyledRadio = styled(Radio)`
    display: block;
    margin: 8px 0;
    transition: all 0.3s;

    .ant-radio-wrapper {
        display: block;
        padding: 8px 12px;
        border-radius: 4px;

        &:hover {
            background-color: #f0f0f0;
        }
    }
`;

const SubmitButton = styled(Button)`
    margin-top: 16px;
`;

const QuestionNumber = styled.span`
    font-weight: bold;
    color: #4b0082;
    margin-right: 10px;
`;

function Question({questionData, onSubmit, status, questionNumber, disabled = false}) {
    const {question, choices, id} = questionData;
    const [selectedChoice, setSelectedChoice] = useState('');
    const [feedback, setFeedback] = useState(null);
    const {loading} = useAuth();

    const [answer, setAnswer] = useState(null);
    const [answerChoice, setAnswerChoice] = useState(null);
    const [explanation, setExplanation] = useState(null);

    useEffect(() => {
        const getAnswer = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.post(`${baseUrl}/api/get_answer/`, {question_id: id});
                setAnswer(response.data.answer);
                setExplanation(response.data.explanation);
                setAnswerChoice(response.data.answer_choice);
            } catch (error) {
                setAnswer(null);
                setExplanation(null);
                setAnswerChoice(null);
            }
        };
        const fetchAnswer = async () => {
            if (status === 'Correct' || status === 'Incorrect') {
                if (!loading) {
                    await getAnswer();
                }
                if (status === 'Correct') {
                    setSelectedChoice(answer);
                    setFeedback({
                        type: 'success',
                        message: `Correct! ${answerChoice} is the correct answer.`,
                    });
                } else if (status === 'Incorrect') {
                    setFeedback({
                        type: 'error',
                        message: `Nice Try! ${answerChoice} is the correct answer.`,
                    });
                }
            }
        };
        fetchAnswer();
    }, [status, answer, answerChoice, loading, id]);

    const handleSubmit = () => {
        if (selectedChoice) {
            onSubmit(id, selectedChoice);
        } else {
            alert('Please select an option before submitting.');
        }
    };

    const onChange = (e) => {
        setSelectedChoice(e.target.value);
    };

    return (
        <QuestionCard>
            <QuestionNumber>Question {questionNumber}:</QuestionNumber>
            <QuestionText>
                <RenderWithMath text={question}/>
            </QuestionText>
            <StyledRadioGroup onChange={onChange} value={selectedChoice}>
                <Space direction="vertical" style={{width: '100%'}}>
                    {choices.map((choice, index) => (
                        <StyledRadio key={index} value={choice} disabled={status !== 'Blank' || disabled}>
                            <RenderWithMath text={choice}/>
                        </StyledRadio>
                    ))}
                </Space>
            </StyledRadioGroup>
            {feedback && (
                <Alert
                    style={{marginTop: '16px'}}
                    message={feedback.message}
                    type={feedback.type}
                    showIcon
                />
            )}
            {explanation && (
                <Alert
                    style={{marginTop: '16px'}}
                    message={<RenderWithMath text={explanation}/>}
                    type="info"
                />
            )}
            {status === 'Blank' && !disabled && (
                <SubmitButton type="primary" onClick={handleSubmit}>
                    Submit
                </SubmitButton>
            )}
        </QuestionCard>
    );
}

export default Question;
