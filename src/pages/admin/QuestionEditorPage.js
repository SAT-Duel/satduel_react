import React, {useState, useEffect} from 'react';
import {Form, Input, Select, Button, message, Spin, Modal, Typography} from 'antd';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Question from '../../components/Question'; // Make sure to import the Question component
const {Title} = Typography;

const {Option} = Select;
const {TextArea} = Input;

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
`;
const HeroTitle = styled(Title)`
    font-size: 3.5rem;
    color: #0B2F7D;
    margin-bottom: 20px;
    text-align: center;
`;

const StyledForm = styled(Form)`
    background: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PreviewButton = styled(Button)`
    margin-right: 16px;
`;

const QuestionEditorPage = () => {
    const [form] = Form.useForm();
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${baseUrl}/api/get_question/${id}`);
            const answer = await axios.post(`${baseUrl}/api/get_answer/`, {question_id: id});
            const questionData = {
                'question': response.data.question,
                'choice_a': response.data.choices[0],
                'choice_b': response.data.choices[1],
                'choice_c': response.data.choices[2],
                'choice_d': response.data.choices[3],
                'answer': answer.data.answer_choice,
                'difficulty': response.data.difficulty,
                'question_type': response.data.question_type,
                'explanation': answer.data.explanation,
            }
            form.setFieldsValue(questionData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching question:', error);
            message.error('Failed to fetch question data');
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${baseUrl}/api/edit_question/${id}`, values);
            if (response.data.status === 'success') {
                message.success('Question updated successfully');
                navigate('/admin/edit_question/' + id);
            } else {
                message.error('Failed to update question');
            }
        } catch (error) {
            console.error('Error updating question:', error);
            message.error('Failed to update question');
        }
    };

    const handlePreview = () => {
        const values = form.getFieldsValue();
        setPreviewData({
            id: id,
            question: values.question,
            choices: [values.choice_a, values.choice_b, values.choice_c, values.choice_d],
            answer: values.answer,
            explanation: values.explanation,
        });
        setPreviewVisible(true);
    };

    if (loading) {
        return <Spin size="large"/>;
    }

    return (
        <Container>
            <HeroTitle level={1}>Question Editor</HeroTitle>
            <StyledForm form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="question"
                    label="Question"
                    rules={[{required: true}]}
                    tooltip="Use \underline{text} to underline, \textit{text} for italics, \textbf{text} for bold. Use $...$ for inline math and $$...$$ for block math."
                >
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item name="choice_a" label="Choice A" rules={[{required: true}]}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="choice_b" label="Choice B" rules={[{required: true}]}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="choice_c" label="Choice C" rules={[{required: true}]}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="choice_d" label="Choice D" rules={[{required: true}]}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="answer" label="Answer" rules={[{required: true}]}>
                    <Select>
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                        <Option value="C">C</Option>
                        <Option value="D">D</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="difficulty" label="Difficulty" rules={[{required: true}]}>
                    <Select>
                        {[1, 2, 3, 4, 5].map(d => (
                            <Option key={d} value={d}>{d}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="question_type" label="Question Type">
                    <Input/>
                </Form.Item>
                <Form.Item name="explanation" label="Explanation">
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item>
                    <PreviewButton type="default" onClick={handlePreview}>
                        Preview
                    </PreviewButton>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </StyledForm>

            <Modal
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
            >
                {previewData && (
                    <Question
                        questionData={previewData}
                        onSubmit={() => {
                        }}
                        status="Correct"
                        questionNumber={1}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default QuestionEditorPage;