import React, {useState, useEffect} from 'react';
import {Radio, Button, Space} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import styled, {keyframes} from 'styled-components';
import {useAuth} from "../context/AuthContext";
import axios from "axios";
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const QuestionCard = styled.div`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 24px;
    animation: ${fadeIn} 0.5s ease-out;
    transition: all 0.3s ease;
    border: 1px solid #e8e8e8;

    &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.09);
    }

    &.correct {
        border-left: 5px solid #52c41a;
        background-color: #f6ffed;
    }

    &.incorrect {
        border-left: 5px solid #f5222d;
        background-color: #fff1f0;
    }
`;

const QuestionText = styled.h3`
    font-size: 1.2rem;
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

    .ant-radio-checked .ant-radio-wrapper {
        background-color: #e6f7ff;
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
    display: flex;
    align-items: center;

    svg {
        margin-right: 8px;
    }
`;

const Explanation = styled.p`
    margin-top: 16px;
    background-color: #f8f8f8;
    padding: 12px;
    border-radius: 4px;
    border-left: 4px solid #1890ff;
    font-size: 0.9rem;
    line-height: 1.5;
`;

const QuestionNumber = styled.span`
    font-weight: bold;
    color: #4b0082;
    margin-right: 10px;
`;

const renderWithMath = (text) => {
    const parts = text.split(/(\$.*?\$)/);
    return parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={index} math={part.slice(1, -1)}/>;
        }
        return part;
    });
};

function Question({questionData, onSubmit, status, questionNumber}) {
    const {question, choices, id} = questionData;
    const [selectedChoice, setSelectedChoice] = useState('');
    const [note, setNote] = useState('');
    const {loading} = useAuth();

    const [answer, setAnswer] = useState(null);
    const [answerChoice, setAnswerChoice] = useState(null);
    const [explanation, setExplanation] = useState(null);


    useEffect(() => {
        const getAnswer = async () => {
            try {
                const response = await axios.post('/api/get_answer/', {question_id: id});
                setAnswer(response.data.answer);
                setExplanation(response.data.explanation);
                setAnswerChoice(response.data.answer_choice);
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
        const fetchAnswer = async () => {
            if (status === 'Correct' || status === 'Incorrect') {
                await getAnswer();
                if (status === 'Correct') {
                    setSelectedChoice(answer);
                    setNote(`Correct! ${answerChoice} is the correct answer.`);
                } else if (status === 'Incorrect') {
                    if (!loading) {
                        setNote(`Nice Try! ${answerChoice} is the correct answer.`);
                    }
                }
            }
        };

        fetchAnswer();
    }, [status, note, answer, answerChoice, loading]);

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

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setSelectedChoice(e.target.value);
    };

    return (
        <QuestionCard className={getStatusClass()}>
            <QuestionNumber>Question {questionNumber}:</QuestionNumber>
            <QuestionText>
                {renderWithMath(question)}
            </QuestionText>
            <StyledRadioGroup onChange={onChange} value={selectedChoice}>
                <Space direction="vertical" style={{width: '100%'}}>
                    {choices.map((choice, index) => (
                        <StyledRadio key={index} value={choice} disabled={status !== 'Blank'}>
                            {renderWithMath(choice)}
                        </StyledRadio>
                    ))}
                </Space>
            </StyledRadioGroup>
            {note && (
                <Note correct={status === 'Correct'}>
                    {status === 'Correct' ? <CheckCircleOutlined/> : <CloseCircleOutlined/>} {note}
                </Note>
            )}
            {explanation && <Explanation>{renderWithMath(explanation)}</Explanation>}
            <SubmitButton type="primary" onClick={handleSubmit} disabled={status !== 'Blank'}>
                Submit
            </SubmitButton>
        </QuestionCard>
    );
}

export default Question;