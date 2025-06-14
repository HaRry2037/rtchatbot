import React, { useRef, useEffect, useState } from 'react';
import ChatApp from '../ChatApp/ChatApp';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

const StandaloneChat = () => {
    const chatRef = useRef();
    const [messages, setMessages] = useState([]);

    // Handle messages from main window (if popped out)
    useEffect(() => {
        const handleMessageRequest = (event) => {
            if (event.data?.type === 'REQUEST_CHAT_DATA') {
                event.source?.postMessage({
                    type: 'CHAT_DATA',
                    payload: { messages },
                }, '*');
            }
        };
        window.addEventListener('message', handleMessageRequest);
        return () => window.removeEventListener('message', handleMessageRequest);
    }, [messages]);

    const handleEndSession = () => {
        if (chatRef.current) {
            chatRef.current.clearMessages();
            setMessages([
                { sender: 'bot', text: 'Hello! How can I assist you today?', name: 'Support' }
            ]);
        }
    };

    const handleNewMessages = (msgs) => setMessages(msgs);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                boxSizing: 'border-box',
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#fff'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingBottom: '10px',
            }}>
                <BurgerMenu
                    onPopout={() => {}}
                    onEndSession={handleEndSession}
                    messages={messages}
                />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ChatApp ref={chatRef} onMessagesChange={handleNewMessages} />
            </div>
        </div>
    );
};

export default StandaloneChat;