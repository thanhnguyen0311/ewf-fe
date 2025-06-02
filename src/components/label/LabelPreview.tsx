// LabelPreview.tsx
import React from 'react';
import { LPNRequestProp } from "../../interfaces/LPN";
import './LabelPreview.css';

const LabelPreview: React.FC<{ data: LPNRequestProp }> = ({ data }) => {
    if (!data) return null; // Ensuring early null check.

    return (
        <div className="label-container">
            <div className="label-row">
                <span className="label-title">RFID Tag ID:</span>
                <span className="label-value">{data.tagID}</span>
            </div>
            <div className="label-row">
                <span className="label-title">SKU:</span>
                <span className="label-value">{data.sku}</span>
            </div>
            <div className="label-row">
                <span className="label-title">Qty:</span>
                <span className="label-value">{data.quantity}</span>
            </div>
            <div className="label-row">
                <span className="label-title">Container:</span>
                <span className="label-value">{data.containerNumber}</span>
            </div>
            <div className="label-row">
                <span className="label-title">Received:</span>
                <span className="label-value">{new Date().toLocaleDateString('en-US')}</span>
            </div>
        </div>
    );
};

export default LabelPreview;