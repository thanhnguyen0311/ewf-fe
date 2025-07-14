import {useNotification} from "../context/NotificationContext";


// Option 1: Hook-based approach (use inside React components)
export const useErrorHandler = () => {
    const { sendNotification } = useNotification();

    return (error: unknown): { field: string; message: string } => {
        let errorMessage = "Unknown error";
        let field = "";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as { response?: unknown }).response === "object"
        ) {
            const response = (error as { response: { data?: { message?: string; field?: string } } }).response;
            errorMessage = response?.data?.message ?? errorMessage;
            field = response?.data?.field ?? "";
        }

        console.error((error as { response?: { data?: unknown } })?.response?.data || error);

        sendNotification("error", "Error", errorMessage);

        return {
            field,
            message: errorMessage,
        };
    };
};