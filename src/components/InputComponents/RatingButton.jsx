import React, { useState, useRef, useEffect } from 'react';
import './RatingButton.css';

const RatingButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsRatingOpen(false);
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleRating = () => {
        setIsRatingOpen((prev) => !prev);
        setShowTooltip(false);
    };

    return (
        <div className="rating-wrapper" ref={containerRef}>
            <div
                className="rating-button-container"
                onMouseEnter={() => !isRatingOpen && setIsHovered(true)}
                onMouseLeave={() => {
                    !isRatingOpen && setIsHovered(false);
                    setShowTooltip(false);
                }}
            >
                <button className="rating-button" onClick={toggleRating}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                </button>

                <div className={`rating-buttons ${isHovered || isRatingOpen ? 'visible' : ''}`}>
                    <button
                        className="rating-single-button"
                        onClick={()=>console.log("like")}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                    </button>
                    <button
                        className="rating-single-button"
                        onClick={()=>console.log("dislike")}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                        </svg>
                    </button>
                </div>

                {/* Tooltip removed/commented out */}
                {/*
                <div className={`rating-tooltip ${showTooltip ? 'visible' : ''}`}>Rate this chat</div>
                */}
            </div>
        </div>
    );
};

export default RatingButton;
