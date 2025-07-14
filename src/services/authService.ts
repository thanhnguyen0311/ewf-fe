import axiosInstance from "../utils/axiosInstance";
import {UserDto} from "../context/AuthContext";


export const login = async (email: string, password: string) => {

    try {
        const response = await axiosInstance.post(`/v1/auth/login`, { email, password });
        const  token  = response.data;

        localStorage.setItem("authToken", token);

        return true;
    } catch (err) {
    }
};

export const getUserInfo = async (): Promise<UserDto | null> => {
    try {
        const response = await axiosInstance.get<UserDto>(`/v1/auth/me`);
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
