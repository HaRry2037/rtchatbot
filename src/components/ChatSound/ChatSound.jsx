import { forwardRef, useImperativeHandle, useRef } from "react";

const ChatSound = forwardRef(({soundOn}, ref)=>{
    const sendSound = useRef(new Audio('/music/popalert.mp3'));
    const receiveSound = useRef(new Audio('/music/popalert.mp3'));
    
    useImperativeHandle(ref, ()=>({
        playSend: ()=>{
            if (soundOn !== true) return;
            try {
                sendSound.current.currentTime = 0;
                sendSound.current.play();
            } catch (error) {
                console.error('Error playing send sound:', error);
            }
        },
        playReceive: ()=>{
            if (soundOn !== true) return;
            try {
                receiveSound.current.currentTime = 0;
                receiveSound.current.play();
            } catch (error) {
                console.error('Error playing receive sound:', error);
            }
        }
    }));
    
    return null;
});

export default ChatSound;