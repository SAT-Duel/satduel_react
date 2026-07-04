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
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); // Get the latest token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Set token in header
    }
    return config;
});

// On 401, refresh the access token once and retry the original request
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refresh_token');

        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const {data} = await axios.post(`${baseUrl}/api/token/refresh/`, {refresh: refreshToken});
                localStorage.setItem('access_token', data.access);
                originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                return api(originalRequest); // Retry the original request
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
