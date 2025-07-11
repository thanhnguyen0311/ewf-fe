import React, {useEffect, useState} from "react";
import {ImageProp} from "../../../../interfaces/Image";
import "./ImageModal.css";
import ImageUrlEditor from "../../../../components/ui/images/ImageUrlEditor";
import {PlusIcon} from "../../../../icons";

interface ProductImageModalProps {
    isVisible: boolean;
    onClose: () => void;
    imagesData: ImageProp | null;
    onSave: (updatedImages: ImageProp) => void;
}

const ProductImageModal: React.FC<ProductImageModalProps> = ({ isVisible, onClose, imagesData, onSave }) => {
    const [editImages, setEditImages] = useState<ImageProp>(imagesData || { cgi: [], img: [], dim: []});

    useEffect(() => {
        if (isVisible && imagesData) {
            setEditImages(imagesData);
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isVisible) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVisible, imagesData, onClose]);


    if (!isVisible || !imagesData) return null;

    const handleSave = () => {
        const cleanedImages = {
            cgi: editImages.cgi.filter((url) => url.trim() !== ""),
            img: editImages.img.filter((url) => url.trim() !== ""),
            dim: editImages.dim.filter((url) => url.trim() !== ""),
        };
        onSave(cleanedImages);
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


    const handleMoveTop = (index: number, type: keyof ImageProp) => {
        if (index > 0) {
            // Swap the current image with the one before it in the array
            setEditImages((prevState) => {
                const updatedArray = [...prevState[type]];
                [updatedArray[index - 1], updatedArray[index]] = [updatedArray[index], updatedArray[index - 1]];

                return {
                    ...prevState,
                    [type]: updatedArray, // Update the corresponding array in state
                };
            });
        }
    };

    const handleAdd = (type: keyof ImageProp) => {
        setEditImages((prevState) => {
            const updatedArray = [...prevState[type], ""]; // Append an empty string as a placeholder
            return {
                ...prevState,
                [type]: updatedArray, // Update the corresponding array in state
            };
        });
    };


    const handleMoveBottom = (index: number, type: keyof ImageProp) => {
        setEditImages((prevState) => {
            const updatedArray = [...prevState[type]];
            if (index < updatedArray.length - 1) {
                // Swap the current image with the one after it in the array
                [updatedArray[index], updatedArray[index + 1]] = [updatedArray[index + 1], updatedArray[index]];

                return {
                    ...prevState,
                    [type]: updatedArray, // Update the corresponding array in state
                };
            }
            return prevState; // No changes if already at the bottom
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                    <h2 className="modal-title">Edit Images</h2>
                    <form className="modal-form">
                        <div className="form-group">
                            <label
                                htmlFor="cgi-input"
                                   style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                CGI Images
                                <button
                                    data-tip="move to bottom"
                                    type="button"
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        color: 'blue',
                                        padding: 0,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => handleAdd("cgi")}
                                >
                                    <PlusIcon style={{ fontSize: '24px', width: '24px', height: '24px' }} />

                                </button>
                            </label>

                            <>
                                {editImages.cgi.map((url, index) => (
                                    <ImageUrlEditor
                                        key={index}
                                        url={url}
                                        onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "cgi")}
                                        onMoveTop={() => handleMoveTop(index, "cgi")}
                                        onMoveBottom={() => handleMoveBottom(index, "cgi")}
                                    />
                                ))}
                            </>


                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="img-input"
                                   style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Images
                                <button
                                    data-tip="move to bottom"
                                    type="button"
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        color: 'blue',
                                        padding: 0,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => handleAdd("img")}
                                >
                                    <PlusIcon style={{ fontSize: '24px', width: '24px', height: '24px' }} />

                                </button>
                            </label>
                            {editImages.img.map((url, index) => (
                                <ImageUrlEditor
                                    key={index}
                                    url={url}
                                    onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "img")} // Pass handler with index
                                    onMoveTop={() => handleMoveTop(index, "img")}
                                    onMoveBottom={() => handleMoveBottom(index, "img")}
                                />
                            ))}
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="dim-input"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Dimension Images
                                <button
                                    data-tip="move to bottom"
                                    type="button"
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        color: 'blue',
                                        padding: 0,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => handleAdd("dim")}
                                >
                                    <PlusIcon style={{ fontSize: '24px', width: '24px', height: '24px' }} />

                                </button>
                            </label>
                            {editImages.dim.map((url, index) => (
                                <ImageUrlEditor
                                    key={index}
                                    url={url}
                                    onUrlChange={(newUrl) => handleUrlChange(index, newUrl, "dim")}
                                    onMoveTop={() => handleMoveTop(index, "dim")}
                                    onMoveBottom={() => handleMoveBottom(index, "dim")}
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










