import React, {useState, useEffect, useCallback} from 'react';
import {
    Card,
    Select,
    Pagination,
    Row,
    Col,
    Button,
    Descriptions,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Switch,
    Typography,
    message
} from 'antd';
import {useNavigate} from 'react-router-dom';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from 'axios';
import RenderWithMath from "../../components/RenderWithMath";
import withAuth from "../../hoc/withAuth";
import styled from 'styled-components';

const {Option} = Select;
const {Title} = Typography;
const {TextArea} = Input;

const Container = styled.div`
    padding: 20px;
`;

const QuestionSelectionTitle = styled(Title)`
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: center;
    color: #0B2F7D;
`;

const FormContainer = styled.div`
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
`;


const AdminCreateTournamentPage = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('any');
    const [selectedDifficulty, setSelectedDifficulty] = useState('any');
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 15 questions per page
    const [form] = Form.useForm();

    const questionTypes = ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context', 'Rhetorical Synthesis',
        'Transitions', 'Central Ideas and Details', 'Command of Evidence', 'Inferences', 'Boundaries', 'Form, Structure, and Sense'];
    const difficulties = ['1', '2', '3', '4', '5'];

    const navigate = useNavigate();
    // const ScrollToError = () => {
    //     const form = Form.useFormInstance();
    //     form.scrollToField(Object.keys(form.getFieldsError().find(({errors}) => errors.length))?.[0], {
    //         behavior: 'smooth',
    //     });
    // };
    const fetchQuestions = useCallback(async () => {
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
    }, [currentPage, pageSize, selectedDifficulty, selectedType]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchQuestions();
    }, [fetchQuestions, currentPage, selectedType, selectedDifficulty]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on new search
        fetchQuestions();
        window.scrollTo(0, 0);
    };

    const handleSelectQuestion = (question) => {
        if (selectedQuestions.some(q => q.id === question.id)) {
            setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
        } else {
            setSelectedQuestions([...selectedQuestions, question]);
        }
    };

    const handleRemoveSelectedQuestion = (id) => {
        setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));
    };

    const handleCreateTournament = async (values) => {
        const selectedQuestionIds = selectedQuestions.map(q => q.id);

        const durationInSeconds = values.duration * 60;
        const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substring(11, 19);
        const startDate = new Date(values.start_time);
        const endDate = new Date(values.end_time);

// Ensure 'private' is handled correctly if it's null


// Format the dates using toISOString and remove the milliseconds
        const formattedStartTime = startDate.toISOString().split('.')[0] + 'Z';
        const formattedEndTime = endDate.toISOString().split('.')[0] + 'Z';
        console.log(formattedStartTime, formattedEndTime)

        if (values.private === null) {
            values.private = false;
        }
        const tournamentData = {
            ...values,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            duration: formattedDuration,
            question_ids: selectedQuestionIds,
            private: values.private,
        };
        console.log(tournamentData)

        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/tournaments/admin_create/`, tournamentData);
            message.success('Tournament created successfully!');
            navigate('/tournaments'); // Redirect to tournaments list after creation
        } catch (error) {
            console.error('Error creating tournament:', error);
            message.error('Failed to create tournament');
        }
    };

    return (
        <Container>
            <Title level={2} style={{marginBottom: '20px', textAlign: 'center'}}>Create a New Tournament</Title>
            <Form form={form} layout="vertical" onFinish={handleCreateTournament}>
                <FormContainer>

                    <Form.Item name="name" label="Tournament Name" rules={[{required: true}]}>
                        <Input placeholder="Enter tournament name"/>
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{required: true}]}>
                        <TextArea rows={4} placeholder="Enter tournament description"/>
                    </Form.Item>
                    <Form.Item name="start_time" label="Start Time" rules={[{required: true}]}>
                        <DatePicker showTime placeholder="Select start time"/>
                    </Form.Item>
                    <Form.Item name="end_time" label="End Time" rules={[{required: true}]}>
                        <DatePicker showTime placeholder="Select end time"/>
                    </Form.Item>
                    <Form.Item name="duration" label="Duration (minutes)" rules={[{required: true}]}>
                        <InputNumber min={1} placeholder="Enter duration in minutes" style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item name="private" label="Private Tournament" valuePropName="checked">
                        <Switch defaultChecked={false}/>
                    </Form.Item>
                </FormContainer>

                <QuestionSelectionTitle level={4}>Select Questions for the Tournament</QuestionSelectionTitle>
                <div style={{marginBottom: 20, display: 'flex', justifyContent: 'center', gap: '10px'}}>
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

                <Row gutter={[16, 16]}>
                    {questions.map(question => (
                        <Col span={8} key={question.id}>
                            <Card
                                title={`ID: ${question.id}`}
                                bordered={false}
                                onClick={() => handleSelectQuestion(question)}
                                hoverable
                                style={{
                                    backgroundColor: selectedQuestions.some(q => q.id === question.id) ? '#e6f7ff' : '#fff',
                                }}
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

                <div style={{marginTop: 40}}>
                    <Title level={4}>Selected Questions</Title>
                    {selectedQuestions.map(question => (
                        <Card
                            key={question.id}
                            title={`ID: ${question.id}`}
                            bordered={true}
                            style={{marginBottom: 20}}
                            extra={
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => handleRemoveSelectedQuestion(question.id)}
                                />
                            }
                        >
                            <RenderWithMath text={question.question}/>
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="Type">{question.question_type}</Descriptions.Item>
                                <Descriptions.Item label="Difficulty">{question.difficulty}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    ))}

                    <Form.Item style={{marginTop: 20}}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            style={{backgroundColor: '#6d31a3', borderColor: '#FFD700'}}
                            htmlType="submit"
                            disabled={selectedQuestions.length === 0}
                        >
                            Create Tournament
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Container>
    );
};

export default withAuth(AdminCreateTournamentPage, true);
