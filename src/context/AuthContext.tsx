import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define the shape of the context data
interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    logout: () => void;

}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("authToken"));

    const logout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        // Optional: You can verify the token's validity here
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout}}>
            {children}
        </AuthContext.Provider>
    );
};