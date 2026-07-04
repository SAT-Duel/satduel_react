import {Button} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import React from "react";

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    title: {
        fontSize: '18px',
        fontWeight: 600,
        margin: 0
    },
    legend: {
        display: 'flex',
        gap: '24px',
        marginBottom: '24px',
        color: '#666'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
    },
    indicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        border: '2px solid'
    },
    questionGrid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    questionButton: {
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.3s',
        position: 'relative'
    },
    reviewButton: {
        display: 'flex',
        justifyContent: 'center'
    }
};

function QuestionNavigation({
                                setIsOpen = null,
                                currentQuestion,
                                totalQuestions,
                                answeredQuestions,
                                reviewQuestions,
                                setCurrentQuestion
                            }) {
    const questions = Array.from({length: totalQuestions}, (_, i) => i + 1);

    const getQuestionStyles = (questionNum) => {
        const baseStyle = {...styles.questionButton};

        if (questionNum === currentQuestion && answeredQuestions.includes(questionNum) && reviewQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#ff4d4f',
                backgroundColor: '#164480',
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(24,144,255,0.2)',
            };
        }

        if (questionNum === currentQuestion && reviewQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#ff4d4f',
                backgroundColor: '#e6f7ff',
                color: '#1890ff',
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(24,144,255,0.2)',
            };
        }

        if (questionNum === currentQuestion && answeredQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#1890ff',
                backgroundColor: '#164480',
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(24,144,255,0.2)',
            };
        }

        if (questionNum === currentQuestion) {
            return {
                ...baseStyle,
                borderColor: '#1890ff',
                backgroundColor: '#e6f7ff',
                color: '#1890ff',
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(24,144,255,0.2)',
            };
        } else if (answeredQuestions.includes(questionNum) && reviewQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#ff4d4f',
                backgroundColor: '#1890ff',
                color: '#fff',
            };
        } else if (answeredQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#1890ff',
                backgroundColor: '#1890ff',
                color: '#fff',
            };
        } else if (reviewQuestions.includes(questionNum)) {
            return {
                ...baseStyle,
                borderColor: '#ff4d4f',
                backgroundColor: '#fff',
                color: '#ff4d4f',
            };
        } else {
            return {
                ...baseStyle,
                borderColor: '#d9d9d9',
                backgroundColor: '#fff',
                color: '#666',
            };
        }
    };

    const handleQuestionClick = (questionNum) => {
        setCurrentQuestion(questionNum);
        if (setIsOpen) {
            setIsOpen(false);
        }
    };
    return (
        <>
            <div style={styles.header}>
                <h2 style={styles.title}>Section 1: Reading and Writing Questions</h2>
                {setIsOpen &&
                    <Button
                        type="text"
                        icon={<CloseOutlined/>}
                        onClick={() => setIsOpen(false)}
                    />
                }
            </div>

            <div style={styles.legend}>
                <div style={styles.legendItem}>
                        <span style={{
                            ...styles.indicator,
                            borderColor: '#1890ff',
                            backgroundColor: '#e6f7ff'
                        }}></span>
                    <span>Current</span>
                </div>
                <div style={styles.legendItem}>
                        <span style={{
                            ...styles.indicator,
                            borderColor: '#d9d9d9',
                            backgroundColor: '#fff'
                        }}></span>
                    <span>Unanswered</span>
                </div>
                <div style={styles.legendItem}>
                        <span style={{
                            ...styles.indicator,
                            borderColor: '#ff4d4f',
                            backgroundColor: '#fff'
                        }}></span>
                    <span>For Review</span>
                </div>
            </div>

            <div style={styles.questionGrid}>
                {questions.map(num => (
                    <Button
                        key={num}
                        style={getQuestionStyles(num)}
                        onClick={() => handleQuestionClick(num)}
                    >
                        {num}
                    </Button>
                ))}
            </div>
            {/* Review Page Button */}
            {setIsOpen &&
                <div style={styles.reviewButton}>
                    <Button
                        type="default"
                        style={{
                            borderColor: '#1890ff',
                            color: '#1890ff',
                            paddingLeft: '24px',
                            paddingRight: '24px',
                        }}
                        onClick={() => handleQuestionClick(11)}
                    >
                        Go to Review Page
                    </Button>
                </div>
            }
        </>
    );
}

export default QuestionNavigation;