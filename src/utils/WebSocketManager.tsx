// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import React from 'react';

// Create a variable to store the audio data
let audioBuffer: string[] = [];

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
            // Add the audio data to the buffer instead of playing it
            audioBuffer.push(audio_final_url);
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
        // Fetch the file
        const response = await fetch(audioFilePath);

        // Get the file as a Blob
        const blob = await response.blob();

        // Create a new FileReader
        const reader = new FileReader();

        // Define what happens when the file has been read
        reader.onloadend = () => {
            // Get the result (an ArrayBuffer)
            const arrayBuffer = reader.result;

            // Send the ArrayBuffer over the WebSocket
            webSocket.current.send(arrayBuffer);
        };

        // Read the Blob as an ArrayBuffer
        reader.readAsArrayBuffer(blob);
        // webSocket.current.send(audioData);
    } catch (error) {
        console.error('Error sending audio: ', error);
    }
}

// Function to get the audio buffer
export function getAudioBuffer() {
    return audioBuffer;
}

// Function to clear the audio buffer
export function clearAudioBuffer() {
    audioBuffer = [];
}
