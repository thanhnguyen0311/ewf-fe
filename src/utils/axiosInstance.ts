// src/utils/axiosInstance.js
import axios from "axios";
import {getToken, login} from "../services/authService";


const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set your base API URL
});


// Interceptor to attach token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        let token = getToken();

        if (token != null) {
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            token = await login("demo@eastwestfurniture.net", "123456")
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration or invalid token
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;