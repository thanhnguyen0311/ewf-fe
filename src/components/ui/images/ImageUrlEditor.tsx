import React from 'react';


interface UrlEditorProps {
    url: string;
    onUrlChange: (newUrl: string) => void; // Callback to handle URL changes
    onMoveTop: () => void; // Callback for moving item upward
    onMoveBottom: () => void; // Callback for moving item downward

}

const ImageUrlEditor: React.FC<UrlEditorProps> = ({ url, onUrlChange, onMoveTop, onMoveBottom}) => {
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

            <div>
                <button
                    data-tip="move to top"
                    type="button"
                    style={{
                        cursor: 'pointer',
                        color: 'orange',
                        background: 'none',
                        border: 'none',
                        fontSize: '16px', // Adjust font size as needed
                        padding: 0, // Remove default padding
                    }}
                    onClick={onMoveTop}
                >
                    ▲
                </button>
                <button
                    data-tip="move to bottom"
                    type="button"
                    style={{
                        cursor: 'pointer',
                        color: 'orange',
                        background: 'none',
                        border: 'none',
                        fontSize: '16px', // Adjust font size as needed
                        padding: 0, // Remove default padding
                    }}
                    onClick={onMoveBottom}
                >
                    ▼
                </button>
            </div>

        </div>
    );
};

export default ImageUrlEditor;