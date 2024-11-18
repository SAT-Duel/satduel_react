import React from "react";
import { Button, Radio, Space, Typography } from "antd";
import { BookOutlined, BookFilled } from "@ant-design/icons";

const { Text } = Typography;

const AnswerSection = ({ currentQuestion, question, selectedAnswer, setSelectedAnswer, reviewQuestions, setReviewQuestions }) => {
    const splitText = (text) => {
        const parts = text.split('\n'); // Split text by \n
        const lastPart = parts.slice(-1)[0]; // The last part
        return lastPart;
    };

    const choices = question.choices;
    const formated_choices = [
        { letter: 'A', text: choices[0] },
        { letter: 'B', text: choices[1] },
        { letter: 'C', text: choices[2] },
        { letter: 'D', text: choices[3] }
    ];

    // Check if the current question is marked for review
    const isMarkedForReview = reviewQuestions.includes(currentQuestion);

    // Toggle review status for the current question
    const toggleReviewStatus = () => {
        setReviewQuestions(prevReviewQuestions => {
            if (isMarkedForReview) {
                // Remove the question from the review list
                return prevReviewQuestions.filter(q => q !== currentQuestion);
            } else {
                // Add the question to the review list
                return [...prevReviewQuestions, currentQuestion];
            }
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space align="center">
                    <Button
                        type="primary"
                        shape="square"
                        style={{
                            background: isMarkedForReview ? 'red' : '#1d2b53',
                            height: '32px',
                            width: '32px'
                        }}
                    >
                        {currentQuestion}
                    </Button>
                    <Button
                        type="text"
                        icon={isMarkedForReview ? <BookFilled /> : <BookOutlined />}
                        onClick={toggleReviewStatus}
                        style={{
                            color: isMarkedForReview ? 'red' : 'inherit'
                        }}
                    >
                        {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                    </Button>
                </Space>

                <Text strong>
                    {splitText(question.question)}
                </Text>

                <Radio.Group
                    onChange={(e) => setSelectedAnswer({ ...selectedAnswer, [currentQuestion]: e.target.value })}
                    value={selectedAnswer[currentQuestion]}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {formated_choices.map(({ letter, text }) => (
                            <Radio.Button
                                key={letter}
                                value={letter}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderRadius: '8px',
                                    marginBottom: '8px'
                                }}
                            >
                                <Space>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {letter}
                                    </div>
                                    <span>{text}</span>
                                </Space>
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </Space>
        </div>
    );
};

export default AnswerSection;
