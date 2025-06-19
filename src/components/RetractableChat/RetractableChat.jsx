import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatApp from "../ChatApp/ChatApp";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import "./RetractableChat.css";

const RetractableChat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([{
    sender: "bot",
    text: "Hello! How can I assist you today",
    name: "Support",
  }]);
  const [popoutWindow, setPopoutWindow] = useState(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleMessagesChange = useCallback((newMessages) => {
    console.log('Main: handleMessagesChange', newMessages);
    setMessages(newMessages);
    if (popoutWindow && !popoutWindow.closed) {
      popoutWindow.postMessage({
        type: 'UPDATE_MESSAGES',
        messages: newMessages,
        source: 'main'
      }, '*');
    }
  }, [popoutWindow]);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Main: Received message', event.data);
      
      if (event.data.type === 'UPDATE_MESSAGES' && event.data.source === 'popout') {
        console.log('Main: Updating messages from popout', event.data.messages);
        setMessages(event.data.messages);
        if (chatRef.current) {
          chatRef.current.messages = event.data.messages;
        }
      } else if (event.data.type === 'REQUEST_INITIAL_MESSAGES') {
        console.log('Main: Sending initial messages', messagesRef.current);
        if (event.source) {
          event.source.postMessage({
            type: 'INIT_MESSAGES',
            messages: messagesRef.current,
            source: 'main'
          }, '*');
        }
      } else if (event.data.type === 'END_SESSION' && event.data.source === 'popout') {
        console.log('Main: Received end session from popout');
        handleEndSession(false); // Don't notify popout since it initiated the end
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleChat = () => {
    setIsExpanded(prev => !prev);
  };

  const handlePopout = () => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},left=${left},top=${top}`;

    const newWindow = window.open(
      '/popout',
      '_blank',
      features
    );

    if (newWindow) {
      console.log('Main: Opening popout window');
      setPopoutWindow(newWindow);

      // Send initial messages once the window is loaded
      const checkLoaded = setInterval(() => {
        try {
          if (newWindow.document.readyState === 'complete') {
            clearInterval(checkLoaded);
            console.log('Main: Popout loaded, sending initial messages', messagesRef.current);
            newWindow.postMessage({
              type: 'INIT_MESSAGES',
              messages: messagesRef.current,
              source: 'main'
            }, '*');
          }
        } catch (e) {
          clearInterval(checkLoaded);
          console.error('Main: Error checking popout window', e);
        }
      }, 100);

      const checkWindow = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindow);
          setPopoutWindow(null);
        }
      }, 1000);
    }
  };

  const handleEndSession = (notifyPopout = true) => {
    console.log('Main: Ending session, notifyPopout:', notifyPopout);
    
    const defaultMessage = [{
      sender: "bot",
      text: "Hello! How can I assist you today",
      name: "Support"
    }];

    setMessages(defaultMessage);
    if (chatRef.current) {
      chatRef.current.clearMessages();
    }

    if (notifyPopout && popoutWindow && !popoutWindow.closed) {
      console.log('Main: Notifying popout of end session');
      popoutWindow.postMessage({
        type: 'END_SESSION',
        source: 'main'
      }, '*');
    }

    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
    }}>
      {isExpanded && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          width: "90vw",
          maxWidth: "480px",
          minWidth: "300px",
          height: "70vh",
          maxHeight: "700px",
          minHeight: "400px",
          border: "1px solid #ccc",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          fontFamily: "Poppins, sans-serif",
          padding: "16px",
        }}>
          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            zIndex: 1000,
          }}>
            <BurgerMenu
              onPopout={handlePopout}
              onEndSession={() => handleEndSession(true)}
              messages={messages}
            />
            <button
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
          <ChatApp 
            ref={chatRef}
            onMessagesChange={handleMessagesChange}
            initialMessages={messages}
          />
        </div>
      )}
      <button
        onClick={toggleChat}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#0078ff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
