import React, {useEffect, useState} from "react";
import {ImageProp} from "../../../interfaces/Image";
import "./ImageModal.css";

interface ProductImageModalProps {
    isVisible: boolean;
    onClose: () => void;
    imagesData: ImageProp | null;
    onSave: (updatedImages: ImageProp) => void;
}

const ProductImageModal: React.FC<ProductImageModalProps> = ({ isVisible, onClose, imagesData, onSave }) => {
    const [images, setImages] = useState<ImageProp>(imagesData || { cgi: [], img: [], dim: []});


    const handleInputChange = (type: keyof ImageProp, value: string) => {
        setImages({
            ...images,
            [type]: value.split(",").map((item) => item.trim()), // Convert comma-separated string to array
        });
    };

    useEffect(() => {
        if (imagesData) {
            setImages(imagesData);
        }
    }, [imagesData]);

    if (!isVisible || !imagesData) return null;

    const handleSave = () => {
        onSave(images);
        onClose();
    };




    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">Edit Images</h2>
                <form className="modal-form">
                    <div className="form-group">
                        <label htmlFor="cgi-input">CGI Images</label>
                        <>
                            {images.cgi.map((url, index) => {
                                const cleanedUrl = url.replace(/"/g, ''); // Remove quotes if present

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '10px'
                                        }}
                                    >

                                    {/* Preview Image */}
                                        <img
                                            src={cleanedUrl}
                                            alt={`Preview ${index}`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                                            onError={(e) => {
                                                // Fallback in case of a broken URL
                                                e.currentTarget.src = 'https://via.placeholder.com/100';
                                            }}
                                        />
                                        {/* URL Input */}
                                        <input
                                            type="text"
                                            value={cleanedUrl}
                                            onChange={(e) => handleInputChange('cgi', e.target.value)}
                                            style={{ width: '300px' }}
                                        />
                                    </div>
                                );
                            })}
                        </>

                    </div>
                    <div className="form-group">
                        <label htmlFor="img-input">IMG Images</label>
                        {images.img.map((url, index) => (
                            <>
                                <a key={index} href={url} >
                                    {url}
                                </a>
                                <br></br>
                            </>
                        ))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dim-input">DIM Images</label>
                        {images.dim.map((url, index) => (
                            <>
                                <a key={index} href={url} >
                                    {url}
                                </a>
                                <br></br>
                            </>
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

