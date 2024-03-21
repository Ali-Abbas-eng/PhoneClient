// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import React from 'react';
import { getSoundData, playSound } from './AudioManager.tsx';

export const initialiseWebSocket = (
    webSocket: React.MutableRefObject<WebSocket | null>,
) => {
    if (!webSocket.current) return { initialised: false };
    let initialisedSuccessfully = true;

    webSocket.current.onopen = () => {
        console.log('Socket is open.');
        initialisedSuccessfully = true;
    };

    webSocket.current.onclose = () => {
        console.log('Socket is closed.');
    };

    webSocket.current.onerror = (event: any) => {
        console.log(event.message);
        initialisedSuccessfully = false;
    };

    webSocket.current.onmessage = (event: any) => {
        let data = JSON.parse(event.data);
        console.log('Data: ', data);
        if (data.audio) {
            let audio_final_url = ServerEndpoint + data.audio;
            playSound(audio_final_url);
        }
    };
    console.log(webSocket.current);
    console.log('Socket Status: ', webSocket.current?.state);
    return {
        initialised: initialisedSuccessfully,
    };
};
export async function sendAudio(
    webSocket: React.MutableRefObject<WebSocket>,
    audioFilePath: string,
) {
    if (!webSocket.current) return;

    try {
        const audioData = getSoundData(audioFilePath);
        webSocket.current.send(audioData);
    } catch (error) {
        console.error('Error sending audio: ', error);
    }
}
