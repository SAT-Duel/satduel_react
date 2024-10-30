// api.js
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to dynamically update the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Get the latest token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set token in header
        }
        return config;
    },
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Assume you have a refresh token logic here
            const refreshToken = localStorage.getItem('refresh_token');
            const {data} = await axios.post(`${baseUrl}/api/token/refresh`, {refresh_token: refreshToken});
            console.log("token refreshed");
            localStorage.setItem('access_token', data.access_token);
            originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;

            return api(originalRequest); // Retry the original request
        }
        return Promise.reject(error);
    }
);

export default api;
