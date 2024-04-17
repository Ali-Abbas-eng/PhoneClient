// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import { EchoResponse } from '../constants/types.tsx';

export class WebSocketManager {
    webSocket: WebSocket;

    constructor(socket: WebSocket) {
        this.webSocket = socket;

        // Bind the context
        this.startConversation = this.startConversation.bind(this);
        this.initialiseWebSocket = this.initialiseWebSocket.bind(this);
        this.sendAudio = this.sendAudio.bind(this);
    }

    startConversation = () => {
        if (this.webSocket) {
            console.log(this.webSocket);
            this.webSocket.onopen = () => {
                console.log('Socket is Open');
                this.webSocket?.send(JSON.stringify({ start: 1 }));
            };
        } else {
            console.error('WebSocket not available');
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
                console.log('Data', JSON.stringify(data));
                onMessageReceived(data);
            }
        };
        console.log(this.webSocket);
        console.log('Socket Status: ', this.webSocket?.state);
        return {
            initialised: initialisedSuccessfully,
        };
    };

    sendAudio = async (audioFilePath: string) => {
        console.log('Trying to Send Audio At: ', audioFilePath);
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

    getWebSocket() {
        return this.webSocket;
    }
}
