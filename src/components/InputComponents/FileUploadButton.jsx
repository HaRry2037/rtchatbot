import React from 'react';
import './FileUploadButton.css';

const FileUploadButton = () => {
    const handleFileUpload = () => {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        
        // Handle file selection
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Handle the file upload here
                console.log('File selected:', file.name);
            }
        };
        
        // Trigger file input click
        fileInput.click();
    };

    return (
        <button 
            className="file-upload-button"
            onClick={handleFileUpload}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
        </button>
    );
};

export default FileUploadButton; 