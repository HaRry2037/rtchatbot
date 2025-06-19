import React, { useEffect, useState } from 'react';
import './Popout.css';

const Popout = () => {
    const [chatData, setChatData] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [soundOn, setSoundOn] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('chatData');
        if (stored) {
            setChatData(JSON.parse(stored));
        }

        const handleMessage = (event) => {
            if (event.origin === window.location.origin) {
                if (event.data?.type === 'CHAT_DATA') {
                    setChatData(event.data.payload);
                    localStorage.setItem('chatData', JSON.stringify(event.data.payload));
                } else if (event.data?.type === 'SOUND_STATE') {
                    setSoundOn(event.data.payload);
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleSoundToggle = () => {
        const newSoundState = !soundOn;
        setSoundOn(newSoundState);
        window.opener?.postMessage({ type: 'TOGGLE_SOUND', payload: newSoundState }, window.location.origin);
    };

    const handleClosePopout = () => {
        window.opener?.postMessage({ type: 'CLOSE_POPOUT' }, window.location.origin);
        window.close();
    };

    const handleEndSession = () => {
        window.opener?.postMessage({ type: 'END_SESSION' }, window.location.origin);
        window.close();
    };

    if (!chatData) {
        return <div className="loading">Loading chat...</div>;
    }

    return (
        <div className="popout-chat">
            <div className="popout-header">
                <h3>Chat Support</h3>
                <div className="header-controls">
                    <div
                        className="burger-icon"
                        onClick={() => setMenuOpen(!menuOpen)}
                        title="Menu"
                    >
                        ☰
                    </div>
                    {menuOpen && (
                        <div className="popout-menu">
                            <button onClick={handleClosePopout}>
                                Close Pop Out Window
                            </button>
                            <button onClick={handleSoundToggle}>
                                Sound {soundOn ? 'On' : 'Off'}
                            </button>
                            <button onClick={handleEndSession}>
                                Session End
                            </button>
                        </div>
                    )}
                </div>
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
