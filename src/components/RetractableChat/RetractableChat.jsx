import React, { useState, useRef } from 'react';
import ChatApp from '../ChatApp/ChatApp';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

const RetractableChat = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const chatRef = useRef();

    const toggleChat = () => {
        setIsExpanded(!isExpanded);
    };

    const handlePopout = () => {
        const width = 480;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
            window.location.href,
            'ChatPopout',
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };

    const handleEndSession = () => {
        if (chatRef.current) {
            chatRef.current.clearMessages();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            {isExpanded ? (
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
                        <BurgerMenu onPopout={handlePopout} onEndSession={handleEndSession} />
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
                    <ChatApp ref={chatRef} />
                </div>
            ) : null}
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