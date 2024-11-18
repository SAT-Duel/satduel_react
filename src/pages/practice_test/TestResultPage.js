import React, {useEffect, useRef, useState} from 'react';
import {Layout, Typography, Card, List, Tag, Button} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined, HomeOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from "react-router-dom";
import api from "../../components/api";

const {Title} = Typography;
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

                    if (selectedAnswers[index] !== null) {
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

                    return {id: index + 1, status};
                })
            );

            let final_score = 200 + Math.round(600 * (score / total_score) / 10) * 10;
            setLoadingScore(false);
            return {score: final_score, questions: results};
        };
        checkAnswers().then((testData) => setTestData(testData));
    }, [questions, selectedAnswers]);


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
                            <List.Item>
                                <span>Question {question.id}: </span>
                                <Tag
                                    color={question.status === 'correct' ? 'success' : 'error'}
                                    icon={question.status === 'correct' ?
                                        <CheckCircleOutlined/> :
                                        <CloseCircleOutlined/>}
                                >
                                    {question.status === 'correct' ? 'Correct' : 'Incorrect'}
                                </Tag>
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
            </Content>
        </Layout>
    );
}

export default TestResults;