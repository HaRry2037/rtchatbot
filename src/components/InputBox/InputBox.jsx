import React, { useState } from 'react';
import RatingButton from '../InputComponents/RatingButton';
import FileUploadButton from '../InputComponents/FileUploadButton';
import EmojiButton from '../InputComponents/EmojiButton';
import './InputBox.css';

const InputBox = ({ onSend, userName }) => {
    const [text, setText] = useState('');
    
    const handleSend = () => {
        if (text.trim() === '') return;
        
        const nameToUse = userName?.trim() || 'Guest';
        onSend({ text, name: nameToUse });
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmojiSelect = (emoji) => {
        setText(prev => prev + emoji);
    };

    return (
        <form 
            className="input-form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSend();
            }}
        >
            <input 
                className="input-field"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Let us know how we can help you..'
            />

            <FileUploadButton />
            <EmojiButton onEmojiSelect={handleEmojiSelect} />
            <RatingButton />
        </form>
    );
};

export default InputBox;