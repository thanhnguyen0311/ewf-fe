import React from 'react';

interface UrlEditorProps {
    url: string;
    onUrlChange: (newUrl: string) => void; // Callback to handle URL changes
}

const ImageUrlEditor: React.FC<UrlEditorProps> = ({ url, onUrlChange }) => {
    const cleanedUrl = url.replace(/"/g, ''); // Remove unnecessary quotes

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
            }}
        >
            {/* Preview Image */}
            <div style={{ position: 'relative' }}>
                <img
                    src={cleanedUrl}
                    alt="Preview"
                    className="image-preview" // Add a class for hover effect
                    onError={(e) => {
                        // Fallback in case of a broken image URL
                        e.currentTarget.src = 'https://static.thenounproject.com/png/2932881-200.png';
                    }}
                />
            </div>

            {/* URL Input */}
            <input
                type="text"
                value={cleanedUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                style={{ width: '450px' }}
            />
        </div>
    );
};

export default ImageUrlEditor;