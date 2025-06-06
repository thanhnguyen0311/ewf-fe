import React, { useEffect, useRef } from "react";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./VirtualKeyboard.css";

interface VirtualKeyboardProps {
    onChange: (input: string) => void;
    input: string;
    onClose: () => void; // Add this to notify parent when modal closes
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onChange, input, onClose }) => {
    const keyboardRef = useRef<Keyboard | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null); // Reference for the modal container

    // Initialize the keyboard when the component mounts
    useEffect(() => {
        if (modalRef.current && !keyboardRef.current) {
            keyboardRef.current = new Keyboard({
                rootElement: modalRef.current,
                onChange: (input: string) => {
                    onChange(input); // Trigger parent change handler
                },
                layout: {
                    default: [
                        "1 2 3 4 5 6 7 8 9 0",
                        "q w e r t y u i o p",
                        "a s d f g h j k l",
                        "z x c v b n m",
                        "{space} {bksp}"
                    ]
                },
                display: {
                    "{bksp}": "⌫",
                    "{space}": "␣"
                }
            });
        }

        return () => {
            // Cleanup the keyboard instance on unmount
            if (keyboardRef.current) {
                keyboardRef.current.destroy();
                keyboardRef.current = null;
            }
        };
    }, [onChange]);

    // Update input value when it changes
    useEffect(() => {
        keyboardRef.current?.setInput(input);
    }, [input]);

    // Synchronize with physical keyboard
    useEffect(() => {
        const handleInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            keyboardRef.current?.setInput(target.value); // Sync virtual keyboard
            onChange(target.value); // Notify parent component
        };

        // Attach `input` events to track changes
        window.addEventListener("input", handleInput);

        return () => {
            window.removeEventListener("input", handleInput);
        };
    }, [onChange]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose(); // Close the keyboard modal
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={modalRef} className="virtual-keyboard-popup">
            {/* The keyboard container */}
            <div className="simple-keyboard" />
        </div>
    );
};

export default VirtualKeyboard;