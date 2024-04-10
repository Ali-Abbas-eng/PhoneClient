// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import React from 'react';
import { DocumentDirectoryPath } from 'react-native-fs';
import { EchoResponse } from '../constants/types.tsx';

export class WebSocketManager {
    audioBuffer: string[] = [];
    webSocket: WebSocket;

    constructor(socketURL: string) {
        this.webSocket = new WebSocket(socketURL);
    }

    startConversation = () => {
        if (this.webSocket) {
            this.webSocket.onopen = () => {
                this.webSocket?.send(JSON.stringify({ start: 1 }));
            };
        }
    };

    initialiseWebSocket = (
        onMessageReceived: (audioPath: EchoResponse) => void,
    ) => {
        console.log('Initialising WebSocket...');
        if (!this.webSocket) return { initialised: false };
        let initialisedSuccessfully = true;

        this.webSocket.onopen = () => {
            console.log('Socket is open.');
            initialisedSuccessfully = true;
        };

        this.webSocket.onclose = () => {
            console.log('Socket is closed.');
        };

        this.webSocket.onerror = (event: any) => {
            console.log(event.message);
            initialisedSuccessfully = false;
        };

        this.webSocket.onmessage = (event: any) => {
            let data = JSON.parse(event.data);
            console.log('Data: ', data);
            if (data.audio) {
                data.audio = ServerEndpoint + data.audio;
                onMessageReceived(data);
                // // Add the audio data to the buffer
                // this.audioBuffer.push(audio_final_url);
                // const audioLocalPath = this.generateAudioFilePaths();
                //
                // this.__downloadFile(
                //     audio_final_url,
                //     this.generateAudioFilePaths(),
                // ).then(() => {
                //     console.log('FILE DOWNLOADED SUCCESSFULLY');
                //     // Call the callback function with the audio path
                //     onMessageReceived(audioLocalPath);
                // });
            }
        };
        console.log(this.webSocket);
        console.log('Socket Status: ', this.webSocket?.state);
        return {
            initialised: initialisedSuccessfully,
        };
    };

    sendAudio = async (audioFilePath: string) => {
        if (!this.webSocket) return;

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
                this.webSocket.send(arrayBuffer);
            };

            // Read the Blob as an ArrayBuffer
            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error sending audio: ', error);
        }
    };

    getNextAudio = () => {
        return this.audioBuffer.shift();
    };

    isBufferEmpty = () => {
        return this.audioBuffer.length === 0;
    };

    generateAudioFilePaths = () => {
        const baseName = `${Math.floor(new Date().getTime() / 1000)}_echo.mp3`;
        return `${DocumentDirectoryPath}/${baseName}`;
    };
}
