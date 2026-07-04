import React, {useState} from 'react';
import styled from 'styled-components';
import {Card, Typography, Button} from 'antd';
import api from "../components/api";
import { useNavigate } from 'react-router-dom';

const {Title, Text} = Typography;

const FullScreenContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f4f8 0%, #e1e9f0 100%);
    overflow: hidden;
    padding: 1rem;
    box-sizing: border-box;
`;

const HeaderContainer = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const StyledTitle = styled(Title)`
    font-size: 3rem !important;
    font-weight: 900 !important;
    color: #1a365d;
    margin-bottom: 0.5rem !important;
`;

const SubtitleText = styled(Text)`
    font-size: 1.25rem;
    color: #4a5568;
`;

const GoalCardsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    width: 100%;
    max-width: 1400px;
    justify-content: center;
    align-items: stretch;
`;

const StyledCard = styled(Card)`
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    &.selected {
        border: 3px solid #3182ce;
        box-shadow: 0 15px 35px rgba(49, 130, 206, 0.2);
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-grow: 1;
`;

const GoalTitle = styled(Title)`
    color: #2d3748 !important;
    margin-bottom: 1rem !important;
`;

const GoalMetrics = styled.div`
    font-size: 1.1rem;
    color: #4a5568;
    text-align: center;
`;

const ConfirmButton = styled(Button)`
    margin-top: 2rem;
    padding: 0.75rem 2rem;
    font-size: 1.2rem;
    border-radius: 12px;
`;

const BoldText = styled("span")`
    font-weight: bold;
    color: #16212f;
`;

const goalOptions = [
    {
        title: 'Beginner Path',
        score: 1500,
        dailyQuestions: 5,
        weeklyQuestions: 40,
        gradient: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
        key: 'beginner'
    },
    {
        title: 'Steady Learner',
        score: 1540,
        dailyQuestions: 10,
        weeklyQuestions: 100,
        gradient: 'linear-gradient(135deg, #e6f2ff 0%, #c3dafe 100%)',
        key: 'intermediate'
    },
    {
        title: 'Advanced Track',
        score: 1570,
        dailyQuestions: 20,
        weeklyQuestions: 150,
        gradient: 'linear-gradient(135deg, #f0fff4 0%, #9ae6b4 100%)',
        key: 'advanced'
    },
    {
        title: 'Expert Challenge',
        score: 1600,
        dailyQuestions: 40,
        weeklyQuestions: 250,
        gradient: 'linear-gradient(135deg, #fffaf0 0%, #fbd38d 100%)',
        key: 'expert'
    }
];

const GoalSettingPage = () => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const navigate = useNavigate();

    const handleGoalSelection = (goal) => {
        setSelectedGoal(goal);
    };

    const handleSubmit = async () => {
        if (selectedGoal) {
            try {
                await api.post('api/set_goal/', {
                    goal: selectedGoal.key
                });
                navigate('/practice_test', { 
                    state: { 
                        isNewUser: true,
                        fromGoalSetting: true 
                    }
                });
            } catch (e) {
                console.error('Error setting goal:', e);
            }
        }
    };

    return (
        <FullScreenContainer>
            <HeaderContainer>
                <StyledTitle>Set Your Learning Goal</StyledTitle>
                <SubtitleText>Choose your dedication level</SubtitleText>
            </HeaderContainer>

            <GoalCardsContainer>
                {goalOptions.map((goal, index) => (
                    <StyledCard
                        key={index}
                        className={selectedGoal === goal ? 'selected' : ''}
                        style={{
                            background: goal.gradient,
                            border: selectedGoal === goal ? '3px solid #3182ce' : 'none'
                        }}
                        onClick={() => handleGoalSelection(goal)}
                    >
                        <CardContent>
                            <GoalTitle level={4}>{goal.title}</GoalTitle>
                            <GoalMetrics>
                                <div> Aiming for <BoldText>{goal.score}?</BoldText> </div>
                                <div>{goal.dailyQuestions} Questions Per Day</div>
                                <div>{goal.weeklyQuestions} Questions Per Week</div>
                            </GoalMetrics>
                        </CardContent>
                    </StyledCard>
                ))}
            </GoalCardsContainer>

            {selectedGoal && (
                <ConfirmButton
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                >
                    Start My Learning Journey
                </ConfirmButton>
            )}
        </FullScreenContainer>
    );
};

export default GoalSettingPage;