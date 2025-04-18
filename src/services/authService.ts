import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import {UserDto} from "../context/AuthContext";


export const login = async (email: any, password: any) => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
        const  token  = response.data;

        localStorage.setItem("authToken", token);

        return true;
    } catch (err) {
        // @ts-ignore
        throw new Error(err.response.data.message || "Failed to log in");
    }
};

export const getUserInfo = async (): Promise<UserDto | null> => {
    try {
        const response = await axiosInstance.get<UserDto>(`/api/auth/me`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        logout();
        return null;
    }
};


export const getToken = () => localStorage.getItem("authToken");


export const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    window.location.href = "/signin";
};
