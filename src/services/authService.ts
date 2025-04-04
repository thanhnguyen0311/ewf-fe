import axios from "axios";


export const login = async (email: any, password: any) => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
        const  token  = response.data;

        localStorage.setItem("authToken", token);

        return true;
    } catch (err) {
        // @ts-ignore
        throw new Error(err.response.data.message || "Failed to log in");
    }
};



export const getToken = () => localStorage.getItem("authToken");


export const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    window.location.href = "/signin";
};
