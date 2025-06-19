import React, { useState, useEffect } from "react";
import { handleEndSession } from "./endSession";
import PopOutButton from "./PopOutButton";
import "./BurgerMenu.css";

const BurgerMenu = ({ onPopout, onEndSession, messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [popOutWindow, setPopOutWindow] = useState(null);

  const toggleSound = () => {
    setSoundOn(prev => {
      const newState = !prev;
      // Notify pop-out window about sound state change if it exists
      if (popOutWindow && !popOutWindow.closed) {
        popOutWindow.postMessage(
          { type: "SOUND_STATE", payload: newState },
          window.location.origin
        );
      }
      return newState;
    });
  };

  useEffect(() => {
    // Listen for sound state changes and menu actions from pop-out window
    const handleMessage = (event) => {
      if (event.origin === window.location.origin) {
        if (event.data?.type === "SOUND_STATE") {
          setSoundOn(event.data.payload);
        } else if (event.data?.type === "MENU_ACTION") {
          const action = event.data.action;
          // Handle different menu actions
          if (action.includes("Sound")) {
            toggleSound();
          } else if (action.includes("End Session")) {
            handleEndSessionClick();
          }
        } else if (event.data?.type === "END_SESSION") {
          // Handle end session request from pop-out window
          handleEndSessionClick();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleEndSessionClick = () => {
    // Notify pop-out window about session end
    if (popOutWindow && !popOutWindow.closed) {
      popOutWindow.postMessage(
        { type: "END_SESSION" },
        window.location.origin
      );
      popOutWindow.close();
    }
    
    handleEndSession(() => {
      setIsOpen(false);
      if (onEndSession) onEndSession();
    });
  };

  // Detect if rendering inside the popout window
  const isInPopout = window.name === "ChatWindow";

  // Render burger UI only
  const renderBurger = () => (
    <div className="burger-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="burger-icon"
        aria-label="Menu"
      >
        <div className="burger-line" />
        <div className="burger-line" />
        <div className="burger-line" />
      </button>

      <div className={`burger-dropdown${isOpen ? " open" : ""}`}>
        <button className="burger-menu-item" onClick={toggleSound}>
          Sound {soundOn ? "On" : "Off"}
        </button>

        <PopOutButton
          onPopout={onPopout}
          messages={messages}
          setPopOutWindow={setPopOutWindow}
          closeMenu={() => setIsOpen(false)}
        />

        <button
          className="burger-menu-item end"
          onClick={handleEndSessionClick}
        >
          End Session
        </button>
      </div>
    </div>
  );

  return renderBurger();
};

export default BurgerMenu;
