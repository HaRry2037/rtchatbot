import React, {useState, forwardRef, useImperativeHandle} from "react";
import Message from "../message_box/message";
import InputBox from "../InputBox/InputBox";
import TypingDots from "../TypingDots/TypingDots";
import { getResponse } from "../MockResponses/MockResponses";

const ChatApp = forwardRef((props, ref) => {
    const [messages, setMessages] = useState([
        {sender: 'bot', text: 'Hello! How can I assist you today', name:'Support'}
    ]);
    const [isTyping, setIsTyping] = useState(false);
    
    const userName = '';

    useImperativeHandle(ref, () => ({
        clearMessages: () => {
            setMessages([
                {sender: 'bot', text: 'Hello! How can I assist you today', name:'Support'}
            ]);
            setIsTyping(false);
        }
    }));

    const handleSend = ({text, name}) => {
        const nameToUse = name?.trim() || 'Guest';
        setMessages((prev) => [
            ...prev,
            {sender: 'user', text, name: nameToUse}
        ]);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getResponse(text);
            setMessages((prev) => [
                ...prev,
                {sender:'bot', text: botResponse, name: 'Support'}
            ]);
        }, 1500);
    };

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            height:'100vh',
            position: 'relative',
            overflow: 'hidden',
            margin: '-16px',
            padding: 0,
            width: 'calc(100% + 32px)'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                background: '#0078ff', 
                color:'#fff',
                fontFamily: 'Poppins, sans-serif',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                paddingTop: '24px',
                height: '60px',
                zIndex: 1
            }}>
                <div style={{ padding: '0 24px' }}>
                    <h3 style={{margin:0}}> Chat Support</h3>
                    <p style={{margin:0, fontSize:'12px'}}>We are here to help</p>
                </div>
            </div>

            <div style={{
                flex: 1,
                padding: '10px',
                overflowY: 'auto',
                backgroundColor: '#fff',
                marginTop: '100px'
            }}>
                {messages.map((msg,index)=>(
                    <Message 
                        key={index}
                        sender={msg.sender}
                        text={msg.text}
                        name={msg.name}
                    />
                ))}
                {isTyping && (
                    <Message sender='bot' text={<TypingDots />} name='Support' />
                )}
            </div>
            <InputBox onSend={handleSend} userName={userName}/>
        </div>
    );
});

export default ChatApp;