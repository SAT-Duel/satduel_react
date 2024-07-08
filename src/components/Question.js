import React, {useState, useEffect} from 'react';
import {Radio, Button, Space} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import styled, {keyframes} from 'styled-components';
import {useAuth} from "../context/AuthContext";
import axios from "axios";

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const QuestionCard = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 24px;
    animation: ${fadeIn} 0.5s ease-out;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    &.correct {
        border-left: 5px solid #52c41a;
    }

    &.incorrect {
        border-left: 5px solid #f5222d;
    }
`;

const QuestionText = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: #1a1a1a;
`;

const StyledRadioGroup = styled(Radio.Group)`
    width: 100%;
`;

const StyledRadio = styled(Radio)`
    display: block;
    height: 30px;
    line-height: 30px;
    margin: 8px 0;
    transition: all 0.3s;

    &:hover {
        background-color: #f0f0f0;
        border-radius: 4px;
    }

    .ant-radio-checked + span {
        color: #1890ff;
        font-weight: 500;
    }
`;

const SubmitButton = styled(Button)`
    margin-top: 16px;
`;

const Note = styled.p`
    margin-top: 16px;
    font-style: italic;
    color: ${props => props.correct ? '#52c41a' : '#f5222d'};
`;

const Explanation = styled.p`
    margin-top: 16px;
    background-color: #f0f0f0;
    padding: 12px;
    border-radius: 4px;
`;
const QuestionNumber = styled.span`
  font-weight: bold;
  color: #4b0082;
  margin-right: 10px;
`;

function Question({questionData, onSubmit, status, questionNumber}) {
    const {question, choices, id} = questionData;
    const [selectedChoice, setSelectedChoice] = useState('');
    const [note, setNote] = useState('');
    const {loading} = useAuth();

    const [answer, setAnswer] = useState(null);
    const [answerChoice, setAnswerChoice] = useState(null);
    const [explanation, setExplanation] = useState(null);

    const getAnswer = async () => {
        try {
            const response = await axios.post('/api/get_answer/', {question_id: id});
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
        <QuestionCard className={getStatusClass()}>
            <QuestionNumber>Question {questionNumber}:</QuestionNumber>
            <QuestionText>
                {question}
            </QuestionText>
            <StyledRadioGroup onChange={onChange} value={selectedChoice}>
                <Space direction="vertical" style={{width: '100%'}}>
                    {choices.map((choice, index) => (
                        <StyledRadio key={index} value={choice} disabled={status !== 'Blank'}>
                            {choice}
                        </StyledRadio>
                    ))}
                </Space>
            </StyledRadioGroup>
            {note && (
                <Note correct={status === 'Correct'}>
                    {status === 'Correct' ? <CheckCircleOutlined/> : <CloseCircleOutlined/>} {note}
                </Note>
            )}
            {explanation && <Explanation>{explanation}</Explanation>}
            <SubmitButton type="primary" onClick={handleSubmit} disabled={status !== 'Blank'}>
                Submit
            </SubmitButton>
        </QuestionCard>
    )
        ;
}

export default Question;
