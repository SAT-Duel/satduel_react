// api.js
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: localStorage.getItem('access_token')?`Bearer ${localStorage.getItem('access_token')}`:null,
        'Content-Type': 'application/json',
    },
});

export default api;
