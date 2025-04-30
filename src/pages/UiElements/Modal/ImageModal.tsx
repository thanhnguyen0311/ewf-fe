import React, {useEffect, useState} from "react";
import {ImageProp} from "../../../interfaces/Image";
import "./ImageModal.css";
import ImageUrlEditor from "../../../components/ui/images/ImageUrlEditor";
import Loader from "../Loader/Loader";

interface ProductImageModalProps {
    isVisible: boolean;
    onClose: () => void;
    imagesData: ImageProp | null;
    onSave: (updatedImages: ImageProp) => void;
}

const ProductImageModal: React.FC<ProductImageModalProps> = ({ isVisible, onClose, imagesData, onSave }) => {
    const [images, setImages] = useState<ImageProp>(imagesData || { cgi: [], img: [], dim: []});
    const [editImages, setEditImages] = useState<ImageProp>(imagesData || { cgi: [], img: [], dim: []});

    useEffect(() => {
        if (isVisible && imagesData) {
            setImages(imagesData); // Sync the original images
            setEditImages(imagesData); // Reset the edit images
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


    }, [isVisible, imagesData]);


    if (!isVisible || !imagesData) return null;

    const handleSave = () => {
        onSave(editImages);
        onClose();
    };


    const handleUrlChange = (index: number, newUrl: string, type: keyof ImageProp) => {
        // Update the specific array (cgi, img, or dim) within the images state
        setEditImages((prevState) => {
            const updatedArray = [...prevState[type]];
            if (newUrl === '') {
                // Remove the element if newUrl is empty
                updatedArray.splice(index, 1);
            } else {
                // Update the specific URL at the given index
                updatedArray[index] = newUrl;
            }

            return {
                ...prevState,
                [type]: updatedArray, // Update the corresponding type in state
            };
        });
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                    <h2 className="modal-title">Edit Images</h2>
                    <form className="modal-form">
                        <div className="form-group">
                            <label htmlFor="cgi-input">CGI Images</label>
                            <>
                                {editImages.cgi.map((url, index) => (
                                    <ImageUrlEditor
                                        key={index}
                                        url={url}
                                        onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "cgi")} // Pass handler with index
                                    />
                                ))}
                            </>


                        </div>
                        <div className="form-group">
                            <label htmlFor="img-input">IMG Images</label>
                            {editImages.img.map((url, index) => (
                                <ImageUrlEditor
                                    key={index}
                                    url={url}
                                    onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "img")} // Pass handler with index
                                />
                            ))}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dim-input">DIM Images</label>
                            {editImages.dim.map((url, index) => (
                                <ImageUrlEditor
                                    key={index}
                                    url={url}
                                    onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "dim")} // Pass handler with index
                                />
                            ))}
                        </div>
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

export default ProductImageModal;










