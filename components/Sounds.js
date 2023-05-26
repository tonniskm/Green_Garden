

import {Audio} from 'expo-av'

export async function playSound(sound){
    const soundObj = new Audio.Sound();
    soundObj.setOnPlaybackStatusUpdate();

    sound=="ping"?await soundObj.loadAsync(require("../assets/Sounds/ping.mp3"),{shouldPlay:false},false):
    sound=="win"?await soundObj.loadAsync(require("../assets/Sounds/win.mp3"),{shouldPlay:false},false):
    {}
    
    
    await soundObj.playAsync();
    
}