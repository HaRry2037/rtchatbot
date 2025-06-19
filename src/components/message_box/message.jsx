import React from 'react';
import './message.css';

const Message = ({sender, text, name}) => {
    const isUser = sender === 'user';
    const displayName = name || (isUser ? 'Guest' : 'Bot');
    
    return(
        <div className={`message-container ${isUser ? 'user' : 'bot'}`}>
            <span className="message-name">{displayName}</span>
            <div className="message-content">
                <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>{text}</div>
            </div>
        </div>
    );
};

export default Message;