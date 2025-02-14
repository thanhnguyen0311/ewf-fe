import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';

const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors (401, 403, etc.)
        return Promise.reject(error);
    }
);

export default axiosInstance;