import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

export const fetchQuestions = async (num, difficulty) => {
    try {
        const response = await axios.get(`${baseUrl}/api/questions/?num=${num}&difficulty=${difficulty}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching questions: ' + error.message);
    }
};

export const checkAnswer = async (questionId, choice) => {
    try {
        const response = await axios.post(`${baseUrl}/api/check_answer/`, {
            question_id: questionId,
            selected_choice: choice,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error checking answer: ' + error.message);
    }
};

// Add more API functions as needed