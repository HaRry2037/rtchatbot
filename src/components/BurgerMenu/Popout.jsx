import React, { useEffect, useState } from 'react';
import './Popout.css';

const Popout = () => {
    const [chatData, setChatData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('chatData');
        if (stored) {
            setChatData(JSON.parse(stored));
        }

        // Optional: fallback if storage is not yet set
        const handleMessage = (event) => {
            if (event.data?.type === 'CHAT_DATA') {
                setChatData(event.data.payload);
                localStorage.setItem('chatData', JSON.stringify(event.data.payload));
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!chatData) {
        return <div className="loading">Loading chat...</div>;
    }

    return (
        <div className="popout-chat">
            <div className="popout-header">
                <h3>Chat Support</h3>
                <button className="close-button" onClick={() => window.close()}>
                    ×
                </button>
            </div>
            <div className="popout-messages">
                {chatData.messages?.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <span className="message-name">{message.name}</span>
                        <div className="message-text">{message.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Popout;
