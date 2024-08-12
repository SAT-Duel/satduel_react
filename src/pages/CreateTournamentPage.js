import React, {useState, useEffect} from 'react';
import {Form, Input, Button, DatePicker, InputNumber, Switch, Card, Select, Typography, message} from 'antd';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import {useAuth} from "../context/AuthContext";
import RichTextEditor from "../RichTextEditor";

const {Title} = Typography;
const {TextArea} = Input;
const {Option} = Select;

const PageContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
`;

const StyledForm = styled(Form)`
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const QuestionCard = styled(Card)`
    margin-bottom: 24px;
`;

const CreateTournamentPage = () => {
    const [form] = Form.useForm();
    const [questions, setQuestions] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        // Add event listener to warn user about unsaved changes
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const onFinish = (values) => {
        const durationInSeconds = values.duration * 60;

        // Format the duration as "HH:MM:SS"
        const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substring(11, 19);

        // Format start and end time in a consistent way
        const formattedStartTime = moment(values.start_time).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
        const formattedEndTime = moment(values.end_time).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

        const tournamentData = {
            ...values,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            duration: formattedDuration,
            questions: questions,
            private: values.private || true, // Ensure 'private' is set to false if undefined
        };

        console.log('Tournament data:', tournamentData);
        // Here you would typically send this data to your API
        message.success('Tournament created successfully!');
        form.resetFields();
        setQuestions([]); // Reset questions after form submission
    };

    const addQuestion = () => {
        setQuestions([...questions, {id: uuidv4()}]); // Add a question with a unique ID
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    const updateQuestion = (id, field, value) => {
        const newQuestions = questions.map(question => {
            if (question.id === id) {
                return {...question, [field]: value};
            }
            return question;
        });
        setQuestions(newQuestions);
    };

    return (
        <PageContainer>
            <Title level={2}>Create New Tournament</Title>
            <StyledForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    private: !user.is_admin,  // Default to true unless the user is an admin
                }}
            >
                <Form.Item name="name" label="Tournament Name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{required: true}]}>
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item name="start_time" label="Start Time" rules={[{required: true}]}>
                    <DatePicker showTime/>
                </Form.Item>
                <Form.Item name="end_time" label="End Time" rules={[{required: true}]}>
                    <DatePicker showTime/>
                </Form.Item>
                <Form.Item name="duration" label="Duration (minutes)" rules={[{required: true}]}>
                    <InputNumber min={1}/>
                </Form.Item>
                <Form.Item name="private" label="Private Tournament" valuePropName="checked">
                    <Switch
                        defaultChecked={!user.is_admin}
                        disabled={!user.is_admin}  // Disable switch if user is not admin
                    />
                </Form.Item>

                <Title level={4}>Questions</Title>
                {questions.map((question, index) => (
                    <QuestionCard
                        key={question.id}
                        title={`Question ${index + 1}`}
                        extra={<Button type="link" onClick={() => removeQuestion(question.id)} icon={<MinusCircleOutlined/>}/>}
                    >
                        <RichTextEditor
                            label="Question Text"
                            value={question.question || ''}
                            onChange={(value) => updateQuestion(question.id, 'question', value)}
                        />
                        <RichTextEditor
                            label="Choice A"
                            value={question.choice_a || ''}
                            onChange={(value) => updateQuestion(question.id, 'choice_a', value)}
                        />
                        <RichTextEditor
                            label="Choice B"
                            value={question.choice_b || ''}
                            onChange={(value) => updateQuestion(question.id, 'choice_b', value)}
                        />
                        <RichTextEditor
                            label="Choice C"
                            value={question.choice_c || ''}
                            onChange={(value) => updateQuestion(question.id, 'choice_c', value)}
                        />
                        <RichTextEditor
                            label="Choice D"
                            value={question.choice_d || ''}
                            onChange={(value) => updateQuestion(question.id, 'choice_d', value)}
                        />
                        <Form.Item label="Correct Answer" rules={[{required: true}]}>
                            <Select onChange={(value) => updateQuestion(question.id, 'answer', value)}>
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                                <Option value="C">C</Option>
                                <Option value="D">D</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Difficulty" rules={[{required: true}]}>
                            <Select onChange={(value) => updateQuestion(question.id, 'difficulty', value)}>
                                {[1, 2, 3, 4, 5].map(level => (
                                    <Option key={level} value={level}>{level}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Question Type">
                            <Input onChange={(e) => updateQuestion(question.id, 'question_type', e.target.value)}/>
                        </Form.Item>
                        <RichTextEditor
                            label="Explanation"
                            value={question.explanation || ''}
                            onChange={(value) => updateQuestion(question.id, 'explanation', value)}
                        />
                    </QuestionCard>
                ))}

                <Form.Item>
                    <Button type="dashed" onClick={addQuestion} block icon={<PlusOutlined/>}>
                        Add Question
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Create Tournament
                    </Button>
                </Form.Item>
            </StyledForm>
        </PageContainer>
    );
};

export default CreateTournamentPage;
