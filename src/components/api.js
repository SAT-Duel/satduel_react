// api.js
import axios from 'axios';

const api = axios.create({
    withCredentials: true,  // This is important for sending cookies
});

// Function to get CSRF token
const getCSRFToken = () => {
    const name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return null;
}

// Set up request interceptor to add CSRF token
api.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    } else {
        console.warn('CSRF token not found');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
