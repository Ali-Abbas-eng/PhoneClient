// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import { EchoResponse } from '../constants/types.tsx';
import React from 'react';

export class WebSocketManager {
    webSocket: React.MutableRefObject<WebSocket>;
    constructor(socketRef: React.MutableRefObject<WebSocket>) {
        this.webSocket = socketRef;

        // Bind the context
        this.startConversation = this.startConversation.bind(this);
        this.initialiseWebSocket = this.initialiseWebSocket.bind(this);
        this.sendAudio = this.sendAudio.bind(this);
    }

    startConversation = () => {
        if (this.webSocket.current) {
            this.webSocket.current.onopen = () => {
                this.webSocket.current?.send(JSON.stringify({ start: 1 }));
            };
        } else {
            console.error('WebSocket not available');
        }
    };

    initialiseWebSocket = (
        onMessageReceived: (audioPath: EchoResponse) => void,
    ) => {
        if (!this.webSocket.current) return { initialised: false };
        let initialisedSuccessfully = true;

        this.webSocket.current.onopen = () => {
            initialisedSuccessfully = true;
        };

        this.webSocket.current.onclose = () => {};

        this.webSocket.current.onerror = (event: any) => {
            initialisedSuccessfully = false;
        };

        this.webSocket.current.onmessage = (event: any) => {
            let data = JSON.parse(event.data);
            if (data.audio) {
                data.audio = ServerEndpoint + data.audio;
                onMessageReceived(data);
            }
        };
        return {
            initialised: initialisedSuccessfully,
        };
    };

    sendAudio = async (audioFilePath: string) => {
        if (!this.webSocket.current) return;

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

                // Send the ArrayBuffer over the webSocket.current
                this.getWebSocket().send(arrayBuffer);
            };

            // Read the Blob as an ArrayBuffer
            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error sending audio: ', error);
        }
    };

    getWebSocket() {
        return this.webSocket.current;
    }

    cleanup() {
        this.webSocket.current.close();
    }
}
