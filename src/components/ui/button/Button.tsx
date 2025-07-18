import React, {ReactNode} from "react";

interface ButtonProps {
    children: ReactNode; // Button text or content
    size?: "sm" | "md" | "xs"; // Button size
    variant?: "primary" | "outline" | "normal" | "danger"; // Button variant
    startIcon?: ReactNode; // Icon before the text
    endIcon?: ReactNode; // Icon after the text
    onClick?: () => void; // Click handler
    disabled?: boolean; // Disabled state
    className?: string; // Disabled state
    type?: "button" | "submit" | "reset"; // Button type
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           size = "md",
                                           variant = "primary",
                                           startIcon,
                                           endIcon,
                                           onClick,
                                           className = "",
                                           disabled = false,
                                           type = "button"
                                       }) => {

    // Size Classes
    const sizeClasses = {
        xs: "px-2 py-1.5 text-xs",
        sm: "px-4 py-2.5 text-sm",
        md: "px-5 py-3.5 text-md",
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-brand-400 text-white shadow-theme-xs hover:bg-brand-500 disabled:bg-brand-300",
        outline:
            "bg-transparent text-orange-500 ring-1 ring-inset ring-orange-500 hover:bg-orange-50 dark:hover:bg-orange-50/[0.1]",
        normal:
            "text-gray-500 ring-1 ring-inset ring-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300", // Normal button styles
        danger:
            "bg-red-500 text-white hover:bg-red-600 shadow-theme-xs disabled:bg-red-300",

    };

    return (
        <button
            className={`inline-flex items-center font-semibold justify-center gap-2 rounded-lg transition ${className} ${
                sizeClasses[size]
            } ${variantClasses[variant]} ${
                disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={onClick}
            type={type}
            disabled={disabled}

        >
            {startIcon && <span className="flex items-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );
};

export default Button;


