import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import Message from "../message_box/message";
import InputBox from "../InputBox/InputBox";
import TypingDots from "../TypingDots/TypingDots";
import { getResponse } from "../MockResponses/MockResponses";
import ChatSound from "../ChatSound/ChatSound";
import agentAvatar from '../../../public/icon/supo avatar.png';
import './ChatApp.css';

const DEFAULT_MESSAGE = { sender: 'bot', text: 'Hello! How can I assist you today', name: 'Support' };

const ChatApp = forwardRef((props, ref) => {
    const [messages, setMessages] = useState(() => {
        return props.initialMessages && props.initialMessages.length > 0 
            ? props.initialMessages 
            : [DEFAULT_MESSAGE];
    });
    const [soundOn, setSoundOn] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const chatSoundRef = useRef();
    const hasInitialized = useRef(false);
    const prevMessagesRef = useRef(messages);

    // Update messages when initialMessages prop changes
    useEffect(() => {
        console.log('ChatApp: initialMessages changed', props.initialMessages);
        if (props.initialMessages && props.initialMessages.length > 0) {
            setMessages(props.initialMessages);
            prevMessagesRef.current = props.initialMessages;
        }
    }, [props.initialMessages]);

    // Notify parent of message changes
    useEffect(() => {
        console.log('ChatApp: messages changed', messages);
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            return;
        }

        // Always notify parent of message changes
        if (props.onMessagesChange) {
            console.log('ChatApp: notifying parent of message change');
            props.onMessagesChange(messages);
        }
        prevMessagesRef.current = messages;
    }, [messages, props.onMessagesChange]);

    useImperativeHandle(ref, () => ({
        clearMessages: () => {
            console.log('ChatApp: clearing messages');
            const defaultMsg = [DEFAULT_MESSAGE];
            setMessages(defaultMsg);
            prevMessagesRef.current = defaultMsg;
            setIsTyping(false);
        },
        messages,
        setMessages: (newMessages) => {
            console.log('ChatApp: setting messages via ref', newMessages);
            setMessages(newMessages);
            prevMessagesRef.current = newMessages;
        },
        toggleSound: () => {
            setSoundOn(prev => !prev);
        },
        addMessage: (msg) => {
            console.log('ChatApp: adding message via ref', msg);
            setMessages(prev => {
                const newMessages = [...prev, msg];
                prevMessagesRef.current = newMessages;
                return newMessages;
            });
        }
    }));

    const handleSend = useCallback(({ text, name }) => {
        console.log('ChatApp: handling send', { text, name });
        const nameToUse = name?.trim() || 'Guest';
        const newMessage = { sender: 'user', text, name: nameToUse };
        
        setMessages(prev => {
            const newMessages = [...prev, newMessage];
            prevMessagesRef.current = newMessages;
            return newMessages;
        });
        
        if (soundOn) {
            chatSoundRef.current?.playSend();
        }
        
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getResponse(text);
            const botMessage = { sender: 'bot', text: botResponse, name: 'Support' };
            
            setMessages(prev => {
                const newMessages = [...prev, botMessage];
                prevMessagesRef.current = newMessages;
                return newMessages;
            });
            
            if (soundOn) {
                chatSoundRef.current?.playReceive();
            }
        }, 1500);
    }, [soundOn]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
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
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                paddingTop: '24px',
                height: '60px',
                zIndex: 1,
                padding: '24px'
            }}>
                <div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px'
                    }}>
                        <img 
                            src={agentAvatar}
                            alt="Agent Avatar"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                objectPosition: 'center top'
                            }}
                        />
                        <div>
                            <h3 style={{ margin: 0 }}>Chat Support</h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>We are here to help</p>
                        </div>
                    </div>
                </div>
            </div>

            <div 
                className="messages-container"
                style={{
                    flex: 1,
                    padding: '10px 16px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    backgroundColor: '#fff',
                    marginTop: '100px',
                    height: 'calc(100vh - 160px)'
                }}
            >
                {messages.map((msg, index) => (
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
            <InputBox onSend={handleSend} />
            <ChatSound ref={chatSoundRef} soundOn={soundOn} />
        </div>
    );
});

export default ChatApp;
