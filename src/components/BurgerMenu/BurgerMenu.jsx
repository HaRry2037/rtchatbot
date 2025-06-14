import React, { useState, useEffect } from 'react';
import { handleEndSession } from './endSession';
import './BurgerMenu.css';

const BurgerMenu = ({ onPopout, onEndSession, messages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [popOutWindow, setPopOutWindow] = useState(null);

    const handleEndSessionClick = () => {
        handleEndSession(() => {
            setIsOpen(false);
            if (onEndSession) onEndSession();
        });
    };

    const toggleSound = () => setSoundOn(!soundOn);

    const handlePopOutClick = () => {
        const width = 100;
        const height = 100;

        const newWindow = window.open(
            '/popout',
            'ChatWindow',
            `width=${width},height=${height},resizable=yes`
        );

        setPopOutWindow(newWindow);
        setIsOpen(false);
        if (onPopout) onPopout();
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (
                event.origin === window.location.origin &&
                event.data?.type === 'READY_FOR_CHAT'
            ) {
                if (popOutWindow) {
                    popOutWindow.postMessage(
                        { type: 'CHAT_DATA', payload: messages || [] },
                        window.location.origin
                    );
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [popOutWindow, messages]);

    return (
        <div className="burger-menu">
            <button onClick={() => setIsOpen(!isOpen)} className="burger-icon" aria-label="Menu">
                <div className="burger-line" />
                <div className="burger-line" />
                <div className="burger-line" />
            </button>

            <div className={`burger-dropdown${isOpen ? ' open' : ''}`}>
                <button className="burger-menu-item" onClick={toggleSound}>
                    {soundOn ? 'Sound On' : 'Sound Off'}
                </button>

                <button className="burger-menu-item" onClick={handlePopOutClick}>
                    Pop Out Chat
                </button>

                <button className="burger-menu-item end" onClick={handleEndSessionClick}>
                    End Session
                </button>
            </div>
        </div>
    );
};

export default BurgerMenu;
