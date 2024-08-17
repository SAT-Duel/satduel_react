import React, {useState, useEffect} from 'react';
import {Card, Select, Pagination, Row, Col, Button, Descriptions} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {PlusOutlined} from '@ant-design/icons';
import axios from 'axios';
import RenderWithMath from "../../components/RenderWithMath";
import withAuth from "../../hoc/withAuth";

const {Option} = Select;

const QuestionListPage = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('any');
    const [selectedDifficulty, setSelectedDifficulty] = useState('any');
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 15 questions per page

    const questionTypes = ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context', 'Rhetorical Synthesis',
        'Transitions', 'Central Ideas and Details', 'Command of Evidence', 'Inferences', 'Boundaries', 'Form, Structure, and Sense'];
    const difficulties = ['1', '2', '3', '4', '5'];

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]);

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

    const handleCreateQuestion = () => {
        navigate('/admin/create_question');
    };

    return (
        <div style={{padding: '20px'}}>
            <div style={{marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                    <Select
                        style={{width: 200}}
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
                        style={{width: 200}}
                        value={selectedDifficulty}
                        onChange={setSelectedDifficulty}
                        placeholder="Select Difficulty"
                    >
                        <Option key="any" value="any">Any Difficulty</Option>
                        {difficulties.map(difficulty => (
                            <Option key={difficulty} value={difficulty}>{difficulty}</Option>
                        ))}
                    </Select>
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    style={{backgroundColor: '#6d31a3', borderColor: '#FFD700'}} // Gold color
                    onClick={handleCreateQuestion}
                >
                    Create Question
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {questions.map(question => (
                    <Col span={8} key={question.id}>
                        <Card
                            title={<Link to={`/admin/edit_question/${question.id}`}>{`ID: ${question.id}`}</Link>}
                            bordered={false}
                            onClick={() => navigate(`/admin/edit_question/${question.id}`)} // Add onClick to navigate
                            hoverable
                        >
                            <RenderWithMath text={question.question}/>
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="Type">{question.question_type}</Descriptions.Item>
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
                style={{marginTop: '20px', textAlign: 'center'}}
            />
        </div>
    );
};

export default withAuth(QuestionListPage, true);
