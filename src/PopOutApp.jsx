import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatApp from "./components/ChatApp/ChatApp";
import ChatSound from "./components/ChatSound/ChatSound";
import PopOutBurgerMenu from "./PopOutBurgerMenu";

const PopOutApp = () => {
  const chatRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleMessagesChange = useCallback((newMessages) => {
    console.log('Popout: handleMessagesChange', newMessages);
    setMessages(newMessages);
    // Send to main window
    if (window.opener) {
      console.log('Popout: Sending messages to main', newMessages);
      window.opener.postMessage({
        type: 'UPDATE_MESSAGES',
        messages: newMessages,
        source: 'popout'
      }, '*');
    }
  }, []);

  useEffect(() => {
    console.log('Popout: Requesting initial messages');
    // Request initial messages from main window
    if (window.opener) {
      window.opener.postMessage({
        type: 'REQUEST_INITIAL_MESSAGES',
        source: 'popout'
      }, '*');
    }

    const handleMessage = (event) => {
      console.log('Popout: Received message', event.data);

      if (event.data.type === 'INIT_MESSAGES' && event.data.source === 'main') {
        console.log('Popout: Setting initial messages', event.data.messages);
        setMessages(event.data.messages);
        if (chatRef.current) {
          chatRef.current.messages = event.data.messages;
        }
      } else if (event.data.type === 'UPDATE_MESSAGES' && event.data.source === 'main') {
        console.log('Popout: Updating messages from main', event.data.messages);
        setMessages(event.data.messages);
        if (chatRef.current) {
          chatRef.current.messages = event.data.messages;
        }
      } else if (event.data.type === 'END_SESSION' && event.data.source === 'main') {
        handleEndSession(false); // Don't notify main window since it initiated the end
      } else if (event.data.type === 'SOUND_STATE') {
        setSoundOn(event.data.payload);
        if (chatRef.current) {
          chatRef.current.toggleSound();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleEndSession = (notifyMain = true) => {
    console.log('Popout: Ending session, notifyMain:', notifyMain);
    
    // First notify main window if we initiated the end
    if (notifyMain && window.opener) {
      console.log('Popout: Notifying main window of end session');
      window.opener.postMessage({
        type: 'END_SESSION',
        source: 'popout'
      }, '*');
    }

    const defaultMessage = [{
      sender: "bot",
      text: "Hello! How can I assist you today",
      name: "Support"
    }];

    // Reset local state
    setMessages(defaultMessage);
    if (chatRef.current) {
      chatRef.current.clearMessages();
    }

    // Close window after a short delay
    setTimeout(() => {
      window.close();
    }, 200);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {/* Top-right menu */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "16px",
          zIndex: 999,
        }}
      >
        <PopOutBurgerMenu>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                color: "black",
                fontSize: "14px",
              }}
              onClick={() => {
                setSoundOn(!soundOn);
                if (chatRef.current) {
                  chatRef.current.toggleSound();
                }
              }}
            >
              Sound {soundOn ? "On" : "Off"}
            </div>
            <div
              style={{
                cursor: "pointer",
                color: "black",
                fontSize: "14px",
              }}
              onClick={() => {
                window.close();
              }}
            >
              Close Popout
            </div>
            <div
              style={{
                cursor: "pointer",
                color: "red",
                fontWeight: "bold",
                fontSize: "14px",
              }}
              onClick={() => handleEndSession(true)}
            >
              End Session
            </div>
          </div>
        </PopOutBurgerMenu>
      </div>

      {/* Fullscreen Chat */}
      <div style={{ padding: "24px" }}>
        <ChatApp 
          ref={chatRef}
          onMessagesChange={handleMessagesChange}
          initialMessages={messages}
        />
      </div>
    </div>
  );
};

export default PopOutApp;
