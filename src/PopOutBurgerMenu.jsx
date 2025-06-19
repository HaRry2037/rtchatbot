import React, { useState, useRef, useEffect } from "react";

const PopOutBurgerMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Add click handler wrapper to sync with main window
  const handleMenuItemClick = (event) => {
    const clickedElement = event.target;
    
    // Check if the clicked element is a menu item and get its text content
    if (clickedElement.classList.contains('burger-menu-item') || 
        clickedElement.closest('.burger-menu-item')) {
      const menuItem = clickedElement.classList.contains('burger-menu-item') ? 
                      clickedElement : 
                      clickedElement.closest('.burger-menu-item');
      const menuText = menuItem.textContent.trim();

      // Notify main window about the menu action
      if (window.opener) {
        window.opener.postMessage({
          type: 'MENU_ACTION',
          action: menuText
        }, window.location.origin);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="burger-menu" ref={menuRef}>
      {/* Inline styles */}
      <style>{`
        .burger-menu {
          position: relative;
          display: inline-block;
        }

        .burger-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
        }

        .burger-line {
          width: 20px;
          height: 2px;
          background-color: white;
          margin: 2px 0;
          transition: opacity 0.2s ease;
        }

        .burger-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 8px;
          min-width: 200px;
          z-index: 1000;
        }

        .burger-dropdown.open {
          display: block;
        }

        .burger-menu-item {
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #333;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .burger-menu-item:hover {
          background-color: #f5f5f5;
        }

        .burger-menu-item.end {
          color: #ff4444;
        }
      `}</style>

      <button className="burger-icon" onClick={toggleMenu}>
        <div className="burger-line" />
        <div className="burger-line" />
        <div className="burger-line" />
      </button>

      <div className={`burger-dropdown ${isOpen ? "open" : ""}`} onClick={handleMenuItemClick}>
        {children}
      </div>
    </div>
  );
};

export default PopOutBurgerMenu;
