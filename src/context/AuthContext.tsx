import React, { createContext, useState, useEffect } from "react";
import {getUserInfo} from "../services/authService";

// Define the shape of the context data
interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: UserDto | null;
    logout: () => void;

}
export interface UserDto {
    firstName: string,
    lastName: string,
    email: string,
    role: string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("authToken"));
    const [user, setUser] = useState< UserDto | null>(null);

    const logout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            getUserInfo().then((userData) => {
                if (userData) {
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    logout();
                }
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, user}}>
            {children}
        </AuthContext.Provider>
    );
};