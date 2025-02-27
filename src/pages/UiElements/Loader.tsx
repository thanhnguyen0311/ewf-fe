import React, { FC } from "react";
import './Loader.css';

interface LoaderProps {
    isLoading: boolean;
    className?: string;
    children?: React.ReactNode;
}

const Loader: FC<LoaderProps> = ({ isLoading, children, className }) => {
    return (
        <div className={`space-y-6 relative ${className}`}>
            {isLoading && (
            <div className="absolute inset-0 flex items-center rounded-b-3xl justify-center bg-gray-100 bg-opacity-70 z-10">
                <div className="loader  border-t-4  border-orange-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>)}

            <div className={`${isLoading ? "filter blur-sm" : ""}`}>
                {children}
            </div>
        </div>
    );
}

export default Loader;