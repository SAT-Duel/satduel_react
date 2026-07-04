import React, {useState} from 'react';
import styled from 'styled-components';
import {Card, Typography, Select, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import api from '../components/api';

const {Title, Text} = Typography;
const {Option} = Select;

const FullScreenContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f4f8 0%, #e1e9f0 100%);
    padding: 1rem;
    box-sizing: border-box;
`;

const StyledCard = styled(Card)`
    width: 420px;
    max-width: 100%;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

/**
 * Shown after a new Google signup: collects the one field Google can't give us
 * (grade), then continues into the normal first-login goal-setting flow.
 */
const CompleteProfilePage = () => {
    const [grade, setGrade] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!grade) {
            message.warning('Please select your grade.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('api/auth/complete_profile/', {grade});
            navigate('/goal_setting');
        } catch (e) {
            message.error(e.response?.data?.error || 'Could not save your grade. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <FullScreenContainer>
            <StyledCard>
                <Title level={2} style={{marginBottom: '0.25rem'}}>Welcome to SAT Duel!</Title>
                <Text type="secondary">One quick thing — what grade are you in?</Text>
                <div style={{margin: '1.5rem 0'}}>
                    <Select
                        placeholder="Select Grade"
                        style={{width: '100%'}}
                        size="large"
                        value={grade}
                        onChange={setGrade}
                    >
                        <Option value="<1">{'<1'}</Option>
                        {[...Array(12)].map((_, i) => (
                            <Option key={i + 1} value={String(i + 1)}>{i + 1}</Option>
                        ))}
                        <Option value=">12">{'>12'}</Option>
                    </Select>
                </div>
                <Button
                    type="primary"
                    size="large"
                    block
                    loading={submitting}
                    onClick={handleSubmit}
                >
                    Continue
                </Button>
            </StyledCard>
        </FullScreenContainer>
    );
};

export default CompleteProfilePage;
