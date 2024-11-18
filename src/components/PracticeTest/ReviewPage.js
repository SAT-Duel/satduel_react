import React from 'react';
import { Typography } from 'antd';
import QuestionNavigation from './QuestionNavigation';

const { Title, Text } = Typography;
const textStyles = {
    fontSize: '16px',
    lineHeight: '1.8',
};

function ReviewPage({ currentQuestion, totalQuestions, setCurrentQuestion, reviewQuestions, answeredQuestions }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                padding: '20px',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Title level={2}>Check Your Work</Title>
                <Text style={textStyles}>On test day, you won’t be able to move on to the next module until time expires.</Text>
                <br />
                <Text style={textStyles}>For these practice tests, you can click <strong>Submit</strong> when you’re ready to move on.</Text>
            </div>

            <div
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    background: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '20px',
                }}
            >
                <QuestionNavigation
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    setCurrentQuestion={setCurrentQuestion}
                    reviewQuestions={reviewQuestions}
                    answeredQuestions={answeredQuestions}
                />
            </div>
        </div>
    );
}

export default ReviewPage;
