// Function to clear chat history from local storage
const clearChatHistory = () => {
    try {
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('currentSession');
        return true;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return false;
    }
};

// Function to reset any active states or flags
const resetActiveStates = () => {
    try {
        // Reset any session-related flags
        localStorage.removeItem('isSessionActive');
        localStorage.removeItem('sessionStartTime');
        return true;
    } catch (error) {
        console.error('Error resetting active states:', error);
        return false;
    }
};

// Main function to handle end session
const handleEndSession = (callback = null) => {
    try {
        // Clear the chat history
        const historyCleaned = clearChatHistory();

        // Reset active states
        const statesReset = resetActiveStates();

        // If both operations were successful
        if (historyCleaned && statesReset) {
            // If a callback was provided (e.g., for UI updates), execute it
            if (typeof callback === 'function') {
                callback();
            }
            
            // Return success
            return {
                success: true,
                message: 'Session ended successfully'
            };
        } else {
            throw new Error('Failed to complete all cleanup tasks');
        }
    } catch (error) {
        console.error('Error ending session:', error);
        return {
            success: false,
            message: 'Failed to end session',
            error: error.message
        };
    }
};

export { handleEndSession, clearChatHistory, resetActiveStates }; 