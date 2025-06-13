let isSoundEnabled = true;

export const toggleSound = () => {
    isSoundEnabled = !isSoundEnabled;
    return isSoundEnabled;
};

export const playMessageSound = () => {
    if (!isSoundEnabled) return;
    
    // You can add actual sound implementation here
    // Example using Audio API:
    // const audio = new Audio('path_to_sound_file.mp3');
    // audio.play();
    
    console.log('Message sound played');
};

export const playNotificationSound = () => {
    if (!isSoundEnabled) return;
    
    // You can add actual sound implementation here
    // Example using Audio API:
    // const audio = new Audio('path_to_notification_sound.mp3');
    // audio.play();
    
    console.log('Notification sound played');
}; 