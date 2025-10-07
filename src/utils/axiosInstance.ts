// src/utils/axiosInstance.js
import axios from "axios";
import {getToken} from "../api/authService";


const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set your base API URL
});


// Interceptor to attach token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getToken();

        if (token) {
            if (config.headers) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);


// Interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {


        if (error.response && error.response.status === 401) {

            localStorage.removeItem("authToken");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;