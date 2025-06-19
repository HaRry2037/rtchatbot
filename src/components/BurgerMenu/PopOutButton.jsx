import React from "react";

const PopOutButton = ({ onPopout, messages, setPopOutWindow, closeMenu }) => {
  const handleClick = () => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes`;

    const newWindow = window.open("/popout", "ChatWindow", features);
    if (!newWindow) return;

    newWindow.name = "ChatPopout"; // ✅ So BurgerMenu knows it's in popout

    setPopOutWindow(newWindow);
    if (onPopout) onPopout();
    if (closeMenu) closeMenu();

    // Send messages after new window signals readiness
    const handleMessage = (event) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "READY_FOR_CHAT"
      ) {
        newWindow.postMessage(
          {
            type: "CHAT_DATA",
            payload: messages || [],
          },
          window.location.origin
        );
        window.removeEventListener("message", handleMessage); // Clean up
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <button className="burger-menu-item" onClick={handleClick}>
      Pop Out Chat
    </button>
  );
};

export default PopOutButton;
