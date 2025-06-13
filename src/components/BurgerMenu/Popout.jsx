import React, { useEffect, useState } from 'react';
import './Popout.css';

const Popout = () => {
    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        // Step 1: Tell parent window we’re ready
        if (window.opener) {
            window.opener.postMessage({ type: 'READY_FOR_CHAT' }, window.location.origin);
        }

        // Step 2: Listen for parent response
        const handleMessage = (event) => {
            if (
                event.origin === window.location.origin &&
                event.data?.type === 'CHAT_DATA'
            ) {
                setChatData(event.data.payload || []);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!chatData.length) {
        return <div className="loading">Loading chat...</div>;
    }

    return (
        <div className="popout-chat">
            <div className="popout-header">
                <h3>Chat Support</h3>
                <button className="close-button" onClick={() => window.close()}>×</button>
            </div>

            <div className="popout-messages">
                {chatData.map((message, index) => (
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
