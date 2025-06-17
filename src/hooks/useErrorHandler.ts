import {useNotification} from "../context/NotificationContext";


// Option 1: Hook-based approach (use inside React components)
export const useErrorHandler = () => {
    const {sendNotification} = useNotification();

    const handleError = (error: Error | any) => {
        const errorMessage =
            error?.response?.data?.message || error?.message || "Unknown error";

        // Log the error details
        console.error(error?.response?.data || error);

        // Send a notification
        sendNotification("error", "Error", errorMessage);
    };

    return handleError;
};