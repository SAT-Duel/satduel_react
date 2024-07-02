import React, {useState, useEffect} from 'react';
import Question from '../components/Question';
import axios from "axios";

function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/questions/?num=10');
            setQuestions(response.data); // Axios automatically parses the JSON data
        } catch (error) {
            setError(`An error occurred: ${error.response ? error.response.data : 'Server unreachable'}`);
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <p>Loading questions...</p>;
    if (error) return <p>Error loading questions: {error}</p>;
    const handleQuestionSubmit = async (id, choice) => {
        console.log(`Question: ${id}, Chosen answer: ${choice}`);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/check_answer/', {
                question_id: id,
                selected_choice: choice
            });
            alert(response.data.result);
        } catch (error) {
            setError('Error checking answer: ' + (error.response ? error.response.data.error : 'Server unreachable'));
        }
    };

    return (
        <div>
            <h1>SAT Practice Questions</h1>
            {questions.map((question) => (
                <Question status="Blank" key={question.id} questionData={question} onSubmit={handleQuestionSubmit}/>
            ))}
        </div>
    );
}

export default QuestionsPage;
