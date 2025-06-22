import React, {useEffect, useRef, useState} from 'react';
import {Layout, Typography, Card, List, Tag, Button, Modal, Spin, Space, Divider} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined, HomeOutlined, EyeOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from "react-router-dom";
import api from "../../components/api";
import RenderWithMath from "../../components/RenderWithMath";

const {Title, Text, Paragraph} = Typography;
const {Content} = Layout;

function TestResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const {questions, selectedAnswers} = location.state || {questions: [], selectedAnswers: []};
    const [testData, setTestData] = useState({
        score: 85,
        questions: [
            {id: 1, status: 'correct'},
            {id: 2, status: 'incorrect'},
            {id: 3, status: 'correct'},
            {id: 4, status: 'correct'},
            {id: 5, status: 'incorrect'},
        ]
    });

    const [loadingScore, setLoadingScore] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionModalVisible, setQuestionModalVisible] = useState(false);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;
        const checkAnswers = async () => {
            let score = 0;
            let total_score = 0;

            const results = await Promise.all(
                questions.map(async (question, index) => {
                    let status = 'incorrect';
                    const question_score = Math.sqrt(6 - question.difficulty);
                    const choice_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

                    if (selectedAnswers[index + 1] !== null) {
                        try {
                            const response = await api.post('api/check_answer/', {
                                question_id: question.id,
                                selected_choice: question.choices[choice_map[selectedAnswers[index + 1]]]
                            });
                            status = response.data.result;
                        } catch (error) {
                            console.error("Error checking answer:", error);
                        }
                    }

                    total_score += question_score;
                    if (status === 'correct') {
                        score += question_score;
                    }

                    return {
                        id: index + 1, 
                        status,
                        questionId: question.id,
                        userChoice: selectedAnswers[index + 1],
                        questionData: question
                    };
                })
            );

            let final_score = 200 + Math.round(600 * (score / total_score) / 10) * 10;
            setLoadingScore(false);
            return {score: final_score, questions: results};
        };
        checkAnswers().then((testData) => setTestData(testData));
    }, [questions, selectedAnswers]);

    const handleQuestionClick = async (question) => {
        setSelectedQuestion(question);
        setQuestionModalVisible(true);
        setLoadingQuestion(true);
        
        try {
            const response = await api.get(`api/get_question/${question.questionId}`);
            setQuestionDetails(response.data);
        } catch (error) {
            console.error("Error fetching question details:", error);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const getChoiceText = (questionData, choiceValue) => {
        if (!questionData || choiceValue === null) return 'No answer selected';
        const choiceMap = {'A': 0, 'B': 1, 'C': 2, 'D': 3};
        const choiceIndex = choiceMap[choiceValue];
        return questionData.choices[choiceIndex] || 'Invalid choice';
    };

    const getCorrectChoiceText = (questionDetails) => {
        if (!questionDetails) return '';
        const choices = [questionDetails.choice_a, questionDetails.choice_b, questionDetails.choice_c, questionDetails.choice_d];
        const choiceMap = {'A': 0, 'B': 1, 'C': 2, 'D': 3};
        const correctIndex = choiceMap[questionDetails.answer];
        return choices[correctIndex] || '';
    };

    // Sample data
    if (loadingScore) {
        return (
            <Layout style={{minHeight: '100vh', background: '#f0f2f5', padding: '24px'}}>
                <Content style={{maxWidth: '800px', margin: '0 auto'}}>
                    <Title style={{textAlign: 'center'}}>Practice Test Result</Title>
                    <Card style={{textAlign: 'center', marginBottom: '24px'}}>
                        <Title level={2}>Calculating your score...</Title>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{minHeight: '100vh', background: '#f0f2f5', padding: '24px'}}>
            <Content style={{maxWidth: '800px', margin: '0 auto'}}>
                {/* Header */}
                <Title style={{textAlign: 'center'}}>Practice Test Result</Title>

                {/* Score */}
                <Card style={{textAlign: 'center', marginBottom: '24px'}}>
                    <Title level={2}>Your Score: {testData.score}</Title>
                </Card>

                {/* Questions List */}
                <Card style={{marginBottom: '24px'}}>
                    <List
                        dataSource={testData.questions}
                        renderItem={(question) => (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    padding: '12px 16px',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    transition: 'all 0.3s',
                                    backgroundColor: '#fff'
                                }}
                                onClick={() => handleQuestionClick(question)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff';
                                    e.currentTarget.style.borderColor = '#f0f0f0';
                                }}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <span style={{fontWeight: 500}}>Question {question.id}</span>
                                        <Tag
                                            color={question.status === 'correct' ? 'success' : 'error'}
                                            icon={question.status === 'correct' ?
                                                <CheckCircleOutlined/> :
                                                <CloseCircleOutlined/>}
                                        >
                                            {question.status === 'correct' ? 'Correct' : 'Incorrect'}
                                        </Tag>
                                    </div>
                                    <EyeOutlined style={{color: '#1890ff', fontSize: '16px'}} />
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>

                {/* Return Button */}
                <div style={{textAlign: 'center'}}>
                    <Button
                        type="primary"
                        icon={<HomeOutlined/>}
                        size="large"
                        onClick={() => navigate('/trainer')}
                    >
                        Return to Homepage
                    </Button>
                </div>

                {/* Question Review Modal */}
                <Modal
                    title={`Question ${selectedQuestion?.id} Review`}
                    open={questionModalVisible}
                    onCancel={() => setQuestionModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setQuestionModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={800}
                    destroyOnClose
                >
                    {loadingQuestion ? (
                        <div style={{textAlign: 'center', padding: '40px'}}>
                            <Spin size="large" />
                            <div style={{marginTop: '16px'}}>Loading question details...</div>
                        </div>
                    ) : questionDetails ? (
                        <div>
                            {/* Question */}
                            <div style={{marginBottom: '24px'}}>
                                <Title level={4}>Question:</Title>
                                <Paragraph style={{fontSize: '16px', lineHeight: '1.6'}}>
                                    <RenderWithMath text={questionDetails.question}/>
                                </Paragraph>
                            </div>
                            {/* Choices */}
                            <div style={{marginBottom: '24px'}}>
                                <Title level={4}>Choices:</Title>
                                <Space direction="vertical" style={{width: '100%'}}>
                                    {[
                                        {label: 'A', text: questionDetails.choice_a},
                                        {label: 'B', text: questionDetails.choice_b},
                                        {label: 'C', text: questionDetails.choice_c},
                                        {label: 'D', text: questionDetails.choice_d}
                                    ].map((choice) => (
                                        <div
                                            key={choice.label}
                                            style={{
                                                padding: '12px 16px',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '6px',
                                                backgroundColor: 
                                                    choice.label === questionDetails.answer ? '#f6ffed' :
                                                    choice.label === selectedQuestion?.userChoice ? '#fff2e8' : '#fafafa',
                                                borderColor: 
                                                    choice.label === questionDetails.answer ? '#52c41a' :
                                                    choice.label === selectedQuestion?.userChoice ? '#fa8c16' : '#d9d9d9'
                                            }}
                                        >
                                            <Text strong>{choice.label}. </Text>
                                            <Text>{choice.text}</Text>
                                            {choice.label === questionDetails.answer && (
                                                <Tag color="success" style={{marginLeft: '8px'}}>Correct Answer</Tag>
                                            )}
                                            {choice.label === selectedQuestion?.userChoice && choice.label !== questionDetails.answer && (
                                                <Tag color="error" style={{marginLeft: '8px'}}>Your Answer</Tag>
                                            )}
                                        </div>
                                    ))}
                                </Space>
                            </div>

                            {/* Your Answer vs Correct Answer */}
                            <Divider />
                            <div style={{marginBottom: '24px'}}>
                                <Title level={4}>Your Answer:</Title>
                                <Paragraph>
                                    <Text strong>
                                        {selectedQuestion?.userChoice !== null 
                                            ? `${selectedQuestion.userChoice}. ${getChoiceText(selectedQuestion.questionData, selectedQuestion.userChoice)}`
                                            : 'No answer selected'
                                        }
                                    </Text>
                                </Paragraph>
                                
                                <Title level={4}>Correct Answer:</Title>
                                <Paragraph>
                                    <Text strong style={{color: '#52c41a'}}>
                                        {questionDetails.answer}. {getCorrectChoiceText(questionDetails)}
                                    </Text>
                                </Paragraph>
                            </div>

                            {/* Explanation */}
                            {questionDetails.explanation && (
                                <div>
                                    <Divider />
                                    <Title level={4}>Explanation:</Title>
                                    <Paragraph style={{fontSize: '14px', lineHeight: '1.6', color: '#666'}}>
                                        {questionDetails.explanation}
                                    </Paragraph>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px'}}>
                            <Text type="secondary">Failed to load question details</Text>
                        </div>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
}

export default TestResults;