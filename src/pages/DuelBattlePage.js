import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate, useParams} from 'react-router-dom';
import Question from "../components/Question";
import useOpponentProgress from "../hooks/useOpponentProgress";
import Progress from "../components/Progress";
import {message} from "antd";

const DuelBattleContainer = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
`;

const QuestionsSection = styled.div`
    flex: 3;
    margin-right: 24px;
`;

const ProgressSection = styled.div`
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    height: fit-content;
    position: sticky;
    top: 24px;
    background: linear-gradient(135deg, #e6e6fa, #e6f7ff);
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 16px;
    color: #1a1a1a;
`;

const TimeDisplay = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #1a1a1a;
    background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
`;


const DuelBattle = () => {
    const {token, loading} = useAuth(); // Get the token from the AuthContext
    const {roomId} = useParams(); // Get the roomId from the URL params
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [trackedQuestionMap, setTrackedQuestionMap] = useState({}); // Mapping of Question IDs to TrackedQuestion IDs
    const [opponentProgress, setOpponentProgress] = useState([]);
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchEndTime = async () => {
            try {
                const response = await axios.post('/api/match/get_end_time/',
                    {
                        room_id: roomId
                    });
                setEndTime(new Date(response.data.end_time));
            } catch (err) {
                message.error(err.response.data.error || 'An error occurred while making a match.');
            }
        };

        fetchEndTime();
    }, [roomId]);

    useEffect(() => {
        const endMatch = async () => {
            try {
                await axios.post('/api/match/end_match/', {
                    room_id: roomId
                });
            } catch
                (err) {
                message.error(err.response.data.error || 'An error occurred while ending the match.');
            }
        };
        if (endTime) {
            const timer = setInterval(() => {
                const now = new Date();
                const difference = endTime - now;

                if (difference > 0) {
                    setTimeLeft(Math.round(difference / 1000));
                } else {
                    clearInterval(timer);
                    setTimeLeft(0);
                    endMatch();
                    navigate(`/battle_result/${roomId}`); // Replace with your desired route
                }
            }, 500);

            return () => clearInterval(timer);
        }
    }, [endTime, navigate, roomId]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useOpponentProgress(roomId, setOpponentProgress);

    const fetchTrackedQuestions = async (roomId, token) => {
        const response = await axios.post('/api/match/questions/', {
            room_id: roomId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    };

    // Fetch full question details for a given question ID
    const fetchQuestionDetails = async (questionId, token) => {
        const response = await axios.post('/api/get_question/', {
            question_id: questionId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    };

    // Combine tracked questions with their full details


    useEffect(() => {
        const combineQuestionsWithDetails = async (trackedQuestions, token) => {
            const questionPromises = trackedQuestions.map(async (trackedQuestion) => {
                const questionDetails = await fetchQuestionDetails(trackedQuestion.question, token);
                return {
                    ...trackedQuestion,
                    questionDetails
                };
            });
            return Promise.all(questionPromises);
        };
        const fetchQuestions = async () => {
            try {
                const trackedQuestions = await fetchTrackedQuestions(roomId, token);
                const questionsWithDetails = await combineQuestionsWithDetails(trackedQuestions, token);
                setQuestions(questionsWithDetails);

                const questionMap = {};
                trackedQuestions.forEach(trackedQuestion => {
                    questionMap[trackedQuestion.question] = trackedQuestion.id;
                });
                setTrackedQuestionMap(questionMap);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching match questions:', err);
                setLoading(false);
            }
        };

        if (!loading) {
            fetchQuestions();
        }
    }, [roomId, token, loading]);

    const checkAnswer = async (id, choice) => {
        console.log(`Question: ${id}, Chosen answer: ${choice}`);
        const response = await axios.post('/api/check_answer/', {
            question_id: id,
            selected_choice: choice
        });
        return response.data.result;
    };
    const updateStatus = async (tracked_question_id, result) => {
        const response = await axios.post('/api/match/update/', {
                tracked_question_id: tracked_question_id,
                result: result
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.data.status === 'success') {
            // Update the question status in the local state
            setQuestions(prevQuestions => prevQuestions.map(q =>
                q.id === tracked_question_id ? {...q, status: result === 'correct' ? 'Correct' : 'Incorrect'} : q
            ));
        }
        console.log(response.data);
    }
    const handleQuestionSubmit = async (id, choice) => {
        const trackedQuestionId = trackedQuestionMap[id]; // Get the tracked question ID from the map
        const result = await checkAnswer(id, choice);
        await updateStatus(trackedQuestionId, result);
    };

    if (loadingQuestions) {
        return <div>Loading questions...</div>;
    }
    if (endTime === null) {
        return <div>Loading battle information...</div>;
    }


    return (
        <DuelBattleContainer>
            <QuestionsSection>
                <SectionTitle>Question Battle</SectionTitle>
                {questions.map((trackedQuestion, i) => (
                    <Question
                        questionData={trackedQuestion.questionDetails}
                        key={trackedQuestion.id}
                        onSubmit={handleQuestionSubmit}
                        status={trackedQuestion.status}
                        questionNumber={i + 1}
                    />
                ))}
            </QuestionsSection>
            <ProgressSection>
                <SectionTitle>Opponent's Progress</SectionTitle>
                {opponentProgress.map((trackedQuestion, i) => (
                    <Progress key={trackedQuestion.id} status={trackedQuestion.status} questionNumber={i + 1}/>
                ))}
                <SectionTitle>Time Left</SectionTitle>
                <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
            </ProgressSection>
        </DuelBattleContainer>
    );
};

export default DuelBattle;
