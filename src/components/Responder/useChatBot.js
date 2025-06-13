import { useState } from 'react';
import { getResponse } from './MockResponses';

const useChatBot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you today?', name: 'Support' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const addMessage = (text, name) => {
        setMessages(prev => [...prev, { sender: 'user', text, name }]);
        
        setIsTyping(true);
        
        setTimeout(() => {
            const botResponse = getResponse(text);
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse, name: 'Support' }]);
        }, 1000);
    };

    return {
        messages,
        isTyping,
        addMessage
    };
};

export default useChatBot; 