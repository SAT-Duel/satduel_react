import React, {useState, useEffect} from 'react';
import {Card, Typography, Progress, message} from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';

const {Title, Paragraph} = Typography;

const OverviewCard = styled(Card)`
    text-align: center;
    background: #fafafa;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CircularProgressBarWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
`;

const StatsWrapper = styled.div`
    margin-left: 24px;
    color: #333;
    text-align: left;
    font-size: 16px;
`;

const OverviewBox = () => {
    const {token} = useAuth();
    const [statistics, setStatistics] = useState({
        correctAnswers: 0,
        incorrectAnswers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            if (!token) return;
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const statsResponse = await axios.get(
                    `${baseUrl}/api/infinite_questions_profile/`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );

                setStatistics({
                    correctAnswers: statsResponse.data.correct_number,
                    incorrectAnswers: statsResponse.data.incorrect_number,
                });
            } catch (error) {
                message.error('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, [token]);

    const total = statistics.correctAnswers + statistics.incorrectAnswers;
    const percent = total > 0 ? Math.round((statistics.correctAnswers / total) * 100) : 0;

    return (
        <OverviewCard loading={loading} bordered={false}>
            <Title level={4} style={{color: '#333', marginBottom: 16}}>
                Accuracy
            </Title>
            <CircularProgressBarWrapper>
                <Progress
                    type="circle"
                    percent={percent}
                    strokeWidth={12}
                    width={140}
                    strokeColor={{'0%': '#4f46e5', '100%': '#6366f1'}}
                    trailColor="#e0e7ff"
                    format={(p) => `${p}%`}
                />
                <StatsWrapper>
                    <Paragraph style={{margin: 0}}>
                        <strong>Correct:</strong> {statistics.correctAnswers}
                    </Paragraph>
                    <Paragraph style={{marginTop: 4, margin: 0}}>
                        <strong>Incorrect:</strong> {statistics.incorrectAnswers}
                    </Paragraph>
                </StatsWrapper>
            </CircularProgressBarWrapper>
        </OverviewCard>
    );
};

export default OverviewBox;
