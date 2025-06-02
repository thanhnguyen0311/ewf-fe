import React, { createContext, useContext, useState, FC } from "react";
import Alert from "../components/ui/alert/Alert";

type NotificationType = "success" | "warning" | "error" | "info";

interface NotificationContextProps {
    sendNotification: (
        type: NotificationType,
        title: string,
        message: string,
        options?: {
            showLink?: boolean;
            linkHref?: string;
            linkText?: string;
            autoHideDuration?: number;
        }
    ) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<{
        type: NotificationType;
        title: string;
        message: string;
        showLink?: boolean;
        linkHref?: string;
        linkText?: string;
    } | null>(null);

    // Function to trigger the notification
    const sendNotification = (
        type: NotificationType,
        title: string,
        message: string,
        options?: {
            showLink?: boolean;
            linkHref?: string;
            linkText?: string;
            autoHideDuration?: number;
        }
    ) => {
        const { showLink, linkHref, linkText, autoHideDuration } = options || {};
        setNotification({ type, title, message, showLink, linkHref, linkText });

        // Auto-hide notification after a configurable timeout (default: 3 seconds)
        setTimeout(() => {
            setNotification(null);
        }, autoHideDuration || 3000);
    };

    return (
        <NotificationContext.Provider value={{ sendNotification }}>
            {children}

            {/* Render Alert in a top-right, animated container */}
            <div
                className={`fixed top-20 right-0 mt-4 mr-4 z-50 transition-transform duration-500 ease-in-out ${
                    notification ? "transform translate-x-0" : "transform translate-x-full"
                }`}
            >
                {notification && (
                    <Alert
                        variant={notification.type}
                        title={notification.title}
                        message={notification.message}
                        showLink={notification.showLink}
                        linkHref={notification.linkHref}
                        linkText={notification.linkText}
                    />
                )}
            </div>
        </NotificationContext.Provider>
    );
};


// Custom hook for using the notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};