import React, {FC, useState} from "react";
import ProductDetail from "../Product/ProductDetail";


interface ImageProp {
    image : string;
    name : string;
    toggleZoom: () => void;
}
const ImageModal: FC<ImageProp> = ({ image, name, toggleZoom}) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={toggleZoom}
            ></div>

            {/* Modal content */}
            <div className="relative z-10 max-w-4xl max-h-screen p-2">
                <button
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                    onClick={toggleZoom}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <img
                    src={image}
                    alt={name}
                    className="max-h-[70vh] object-contain rounded-lg"
                />
            </div>
        </div>
    );
}

export default ImageModal;