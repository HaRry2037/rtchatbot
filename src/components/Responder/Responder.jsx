import React from 'react';

const Responder = {
    greetings: [
        "Hello! How can I help you today?",
        "Hi there! Welcome to our support chat.",
        "Good day! What brings you here today?"
    ],
    
    general: [
        "I understand. Could you please provide more details?",
        "Let me help you with that.",
        "I'll be happy to assist you with this matter."
    ],
    
    product: [
        "Our products are designed with quality in mind. Which specific product are you interested in?",
        "I can help you find the perfect product for your needs.",
        "Would you like to know more about our product features?"
    ],
    
    support: [
        "I'm sorry you're experiencing issues. Let me help you resolve that.",
        "Could you describe the problem you're facing in more detail?",
        "I'll guide you through the troubleshooting steps."
    ],
    
    closing: [
        "Is there anything else I can help you with?",
        "Don't hesitate to ask if you have more questions!",
        "Feel free to reach out if you need further assistance."
    ]
};

const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        return getRandomResponse('greetings');
    }
    
    if (message.includes('product') || message.includes('price') || message.includes('cost')) {
        return getRandomResponse('product');
    }
    
    if (message.includes('help') || message.includes('issue') || message.includes('problem')) {
        return getRandomResponse('support');
    }
    
    if (message.includes('bye') || message.includes('thank')) {
        return getRandomResponse('closing');
    }
    
    return getRandomResponse('general');
};

const getRandomResponse = (category) => {
    const responses = mockResponses[category];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
};

export { getResponse }; 

//chatbot session static route