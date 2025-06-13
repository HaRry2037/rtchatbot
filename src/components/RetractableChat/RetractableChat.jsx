import React, { useState, useRef, useEffect } from 'react';
import ChatApp from '../ChatApp/ChatApp';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

const RetractableChat = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const chatRef = useRef();
    const [messages, setMessages] = useState([]);

    const toggleChat = () => {
        setIsExpanded(!isExpanded);
    };

    const handleEndSession = () => {
        if (chatRef.current) {
            chatRef.current.clearMessages();
            setMessages([
                { sender: 'bot', text: 'Hello! How can I assist you today', name: 'Support' }
            ]);
        }
    };

    const handlePopout = () => {
        const width = 480;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            '',
            'ChatPopout',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) return;

        // Inject minimal HTML and JS into the new window
        popup.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Chat Popout</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    body { margin: 0; font-family: sans-serif; }
                    #root { height: 100vh; }
                </style>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.opener.postMessage({ type: 'REQUEST_CHAT_DATA' }, '*');
                    window.addEventListener('message', (event) => {
                        if (event.data?.type === 'CHAT_DATA') {
                            window.localStorage.setItem('chatData', JSON.stringify(event.data.payload));
                            window.location.href = '/popout'; // Navigate to your React route
                        }
                    });
                </script>
            </body>
            </html>
        `);
    };

    // Listen for popout window requesting chat data
    useEffect(() => {
        const handleMessageRequest = (event) => {
            if (event.data?.type === 'REQUEST_CHAT_DATA') {
                event.source?.postMessage({
                    type: 'CHAT_DATA',
                    payload: {
                        messages: messages || []
                    }
                }, '*');
            }
        };
        window.addEventListener('message', handleMessageRequest);
        return () => window.removeEventListener('message', handleMessageRequest);
    }, [messages]);

    const handleNewMessages = (msgs) => {
        setMessages(msgs);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            {isExpanded && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: '480px',
                    height: '700px',
                    border: '1px solid #ccc',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    fontFamily: 'Poppins, sans-serif',
                    padding: '16px'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <BurgerMenu 
                            onPopout={handlePopout} 
                            onEndSession={handleEndSession} 
                            messages={messages} 
                        />
                        <button
                            onClick={toggleChat}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <ChatApp ref={chatRef} onMessagesChange={handleNewMessages} />
                </div>
            )}
            <button
                onClick={toggleChat}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#0078ff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        </div>
    );
};

export default RetractableChat;
