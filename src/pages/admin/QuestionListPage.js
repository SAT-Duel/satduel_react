import React, { useState, useEffect } from 'react';
import { Card, Select, Pagination, Row, Col, Button, Descriptions } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RenderWithMath from "../../components/RenderWithMath";

const { Option } = Select;
const QuestionListPage = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('any');
    const [selectedDifficulty, setSelectedDifficulty] = useState('any');
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 15 questions per page

    const questionTypes = ['Multiple Choice', 'True/False', 'Short Answer', 'Essay'];
    const difficulties = ['1', '2', '3', '4', '5'];

    useEffect(() => {
        fetchQuestions();
        window.scrollTo(0, 0);
    }, [currentPage]);

    const fetchQuestions = async () => {
        const baseUrl = process.env.REACT_APP_API_URL;

        try {
            const response = await axios.get(`${baseUrl}/api/filter_questions/`, {
                params: {
                    type: selectedType,
                    difficulty: selectedDifficulty,
                    page: currentPage,
                    page_size: pageSize
                }
            });
            setQuestions(response.data.questions);
            setTotalPage(response.data.total);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on new search
        fetchQuestions();
        window.scrollTo(0, 0);
    };


    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        style={{ width: 200 }}
                        value={selectedType}
                        onChange={setSelectedType}
                        placeholder="Select Type"
                    >
                        <Option key="any" value="any">Any Type</Option>
                        {questionTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: 200 }}
                        value={selectedDifficulty}
                        onChange={setSelectedDifficulty}
                        placeholder="Select Difficulty"
                    >
                        <Option key="any" value="any">Any Difficulty</Option>
                        {difficulties.map(difficulty => (
                            <Option key={difficulty} value={difficulty}>{difficulty}</Option>
                        ))}
                    </Select>
                </div>
                <Button type="primary" onClick={handleSearch}>Search</Button>
            </div>

            <Row gutter={[16, 16]}>
                {questions.map(question => (
                    <Col span={8} key={question.id}>
                        <Card
                            title={<Link to={`/admin/edit_question/${question.id}`}>{`ID: ${question.id}`}</Link>}
                            bordered={false}
                            hoverable
                        >
                            <RenderWithMath text={question.question} />
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="Type">{question.type}</Descriptions.Item>
                                <Descriptions.Item label="Difficulty">{question.difficulty}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalPage}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </div>
    );
};

export default QuestionListPage;
