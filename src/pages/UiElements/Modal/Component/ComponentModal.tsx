import React, {useEffect, useState} from "react";
import {ImageProp} from "../../../../interfaces/Image";
import "./ImageModal.css";

interface ComponentModalProps {
    isVisible: boolean;
    onClose: () => void;
    componentsData: {id: number;componentId: number; sku: string; quantity: number; pos: number }[];
    onSave: (updatedImages: ImageProp) => void;
}

const ComponentModal: React.FC<ComponentModalProps> = ({ isVisible, onClose, componentsData, onSave }) => {
    const [components, setComponents] = useState<{id: number;componentId: number; sku: string; quantity: number; pos: number }[]>(componentsData || []);

    useEffect(() => {
        if (isVisible && components) {
            setComponents(components);
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isVisible) {
                onClose(); // Close the modal when ESC is pressed
            }
        };

        window.addEventListener("keydown", handleKeyDown); // Add event listener

        return () => {
            window.removeEventListener("keydown", handleKeyDown); // Cleanup on component unmount
        };


    }, [isVisible, components]);


    if (!isVisible || !components) return null;

    const handleSave = () => {
        // onSave(cleanedImages);
        onClose();
    };



    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">Edit Components</h2>
                <form className="modal-form">
                    <div className="modal-buttons">
                        <button type="button" className="btn btn-save" onClick={handleSave}>
                            Save
                        </button>
                        <button type="button" className="btn btn-close" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComponentModal;










