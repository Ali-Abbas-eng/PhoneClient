// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import React from 'react';
import { DocumentDirectoryPath, downloadFile } from 'react-native-fs';
import { AudioManagerAPI } from './AudioManager.tsx';

let audioBuffer: string[] = [];

export const startConversation = (
    webSocket: React.MutableRefObject<WebSocket>,
) => {
    if (webSocket.current) {
        webSocket.current.onopen = () => {
            webSocket.current?.send(JSON.stringify({ start: 1 }));
        };
    } else {
    }
};

export const initialiseWebSocket = (
    webSocket: React.MutableRefObject<WebSocket | null>,
    onMessageReceived: (audioPath: string) => void,
) => {
    console.log('Initialising WebSocket...');
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
            // Add the audio data to the buffer
            audioBuffer.push(audio_final_url);
            const audioLocalPath = generateAudioFilePaths();

            __downloadFile(audio_final_url, generateAudioFilePaths()).then(
                r => {
                    console.log('FILE DOWNLOADED SUCCESSFULLY');
                    // Call the callback function with the audio path
                    onMessageReceived(audioLocalPath);
                },
            );
        }
    };
    console.log(webSocket.current);
    console.log('Socket Status: ', webSocket.current?.state);
    return {
        initialised: initialisedSuccessfully,
    };
};

const __downloadFile = async (uri: string, destination: string) => {
    const options = {
        fromUrl: uri,
        toFile: destination,
        background: true,
        begin: (res: any) => {
            console.log('begin', res);
            console.log(
                'contentLength:',
                res.contentLength / (1024 * 1024),
                'MB',
            );
        },
        progress: (res: any) => {
            const percentage = (res.bytesWritten / res.contentLength) * 100;
            console.log(`progress: ${percentage}%`);
        },
    };

    try {
        const result = await downloadFile(options).promise;
        console.log('Download completed!', result);
    } catch (error) {
        console.log('Error downloading file:', error);
    }
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

// Function to get the next audio in the buffer
export function getNextAudio() {
    return audioBuffer.shift();
}

// Function to check if the buffer is empty
export function isBufferEmpty() {
    return audioBuffer.length === 0;
}

const generateAudioFilePaths = () => {
    const baseName = `${Math.floor(new Date().getTime() / 1000)}_echo.mp3`;
    return `${DocumentDirectoryPath}/${baseName}`;
};
