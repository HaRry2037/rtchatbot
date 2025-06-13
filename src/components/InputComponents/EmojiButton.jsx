import React, { useState } from 'react';
import './EmojiButton.css';

const EmojiButton = ({ onEmojiSelect }) => {
    const [showPicker, setShowPicker] = useState(false);
    const emojis = ['😊', '😂', '🤔', '👍', '❤️', '😎', '🎉', '🔥', '👋', '🙌', '✨', '💡'];

    const handleEmojiClick = (emoji) => {
        if (onEmojiSelect) {
            onEmojiSelect(emoji);
        }
        setShowPicker(false);
    };

    return (
        <div className="emoji-container">
            <button 
                className="emoji-button"
                onClick={() => setShowPicker(!showPicker)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s2 2 4 2 4-2 4-2" />
                    <circle cx="9" cy="9" r="1" fill="black" />
                    <circle cx="15" cy="9" r="1" fill="black" />
                </svg>
            </button>

            <div className={`emoji-picker ${showPicker ? 'visible' : ''}`}>
                {emojis.map((emoji, index) => (
                    <button
                        key={index}
                        className="emoji-item"
                        onClick={() => handleEmojiClick(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiButton; 