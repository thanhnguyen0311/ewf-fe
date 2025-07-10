import { useEffect } from "react";
import { useNavigate } from "react-router";
import {logout} from "../../services/authService";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Run your logout logic
        logout();

        // Redirect the user to the login page (or any other page)
        navigate("/login");
    }, [navigate]);

    return null; // No UI needed, but you can show a "Logging out..." message if desired
}