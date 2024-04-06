import React, {useEffect, useState} from 'react';
import { Button, View } from 'react-native';
import {
    playSound,
    startRecording,
    stopRecording,
} from '../utils/AudioManager.tsx';
import { sendAudio, initialiseWebSocket } from '../utils/WebSocketManager.tsx';
import { SocketIP } from '../constants/constants.tsx';
import {SpeakingSessionManagerProps} from "../constants/types.tsx";

export const SpeakingSessionManager = ({ session, webSocket }: SpeakingSessionManagerProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState('');
    const socketURL = SocketIP + session.socket_url;

    useEffect(() => {
        webSocket.current = new WebSocket(socketURL);
        const result = initialiseWebSocket(webSocket);
        console.log('Result of initialiseWebSocket: ', result);
        startConversation();
    }, []);

    const startRecordingHandler = async () => {
        if (!isRecording) {
            const result = await startRecording();
            setIsRecording(result.isRecording);
            setAudioPath(result.audioPath);
            if (result.error) {
                console.log(result.error);
            }
        } else {
            console.log('Already recording');
        }
    };

    const stopRecordingHandler = async () => {
        const result = await stopRecording(isRecording);
        setIsRecording(result.isRecording);
        await sendAudio(webSocket, audioPath);
        if (result.error) {
            console.log(result.error);
        }
    };
    const startConversation = () => {
        if (webSocket.current) {
            webSocket.current.onopen = () => {
                console.log('Socket is open.');
                webSocket.current?.send(JSON.stringify({ start: 1 }));
            };
        } else {
            console.log('WebSocket is not open yet');
        }
    };


    return (
        <View>
            <Button title="Start Recording" onPress={startRecordingHandler} />
            <Button title="Stop Recording" onPress={stopRecordingHandler} />
        </View>
    );
};