import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useParams} from 'react-router-dom';
import Question from "../components/Question";
import useOpponentProgress from "../hooks/useOpponentProgress";
import Progress from "../components/Progress";


const DuelBattle = () => {
    const {token, loading} = useAuth(); // Get the token from the AuthContext
    const {roomId} = useParams(); // Get the roomId from the URL params
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoading] = useState(true);
    const [trackedQuestionMap, setTrackedQuestionMap] = useState({}); // Mapping of Question IDs to TrackedQuestion IDs
    const [opponentProgress, setOpponentProgress] = useState([]);

    useOpponentProgress(roomId, setOpponentProgress);

    const fetchTrackedQuestions = async (roomId, token) => {
        const response = await axios.post('http://localhost:8000/api/match/questions/', {
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
        const response = await axios.post('http://localhost:8000/api/get_question/', {
            question_id: questionId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    };

    // Combine tracked questions with their full details
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

    useEffect(() => {
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
        const response = await axios.post('http://127.0.0.1:8000/api/check_answer/', {
            question_id: id,
            selected_choice: choice
        });
        return response.data.result;
    };
    const updateStatus = async (tracked_question_id, result) => {
        const response = await axios.post('http://localhost:8000/api/match/update/', {
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
                q.id === tracked_question_id ? { ...q, status: result === 'correct' ? 'Correct' : 'Incorrect' } : q
            ));
        }
        console.log(response.data);
    }
    const handleQuestionSubmit = async (id, choice) => {
        const trackedQuestionId = trackedQuestionMap[id]; // Get the tracked question ID from the map
        console.log(`Question: ${id}, Chosen answer: ${choice}, TrackedQuestion: ${trackedQuestionId}`);
        const result = await checkAnswer(id, choice);
        alert(result);
        await updateStatus(trackedQuestionId, result);
    };

    if (loadingQuestions) {
        return <div>Loading questions...</div>;
    }

    return (
        <div>
            <h1>Question Battle</h1>
            {questions.map((trackedQuestion) => (
                <Question questionData={trackedQuestion.questionDetails} key={trackedQuestion.id}
                          onSubmit={handleQuestionSubmit} status={trackedQuestion.status}/>
            ))}
            <h1>Opponent's Progress</h1>
            {opponentProgress.map((trackedQuestion) => (
                <div key={trackedQuestion.id}>
                    <Progress status={trackedQuestion.status}/>
                </div>
            ))}
        </div>
    );
};

export default DuelBattle;
