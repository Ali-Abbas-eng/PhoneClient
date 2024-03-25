import React, { useState } from 'react';
import { Button, View } from 'react-native';
import {
    playSound,
    startRecording,
    stopRecording,
} from '../utils/AudioManager.tsx';
// @ts-ignore
import WebSocket from 'react-native-websocket';
import { sendAudio } from '../utils/WebSocketManager.tsx';

export const SessionManager = ({ webSocket }: WebSocket) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState('');
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
        console.log(result);
        await sendAudio(webSocket, audioPath);
        if (result.error) {
            console.log(result.error);
        }
    };
    const startConversation = () => {
        webSocket.current?.send(JSON.stringify({ start: 1 }));
    };
    return (
        <View>
            <Button title="CONVERSE" onPress={startConversation} />
            <Button
                title="Start Recording"
                onPress={() => {
                    startRecordingHandler();
                }}
            />
            <Button
                title="Stop Recording"
                onPress={() => {
                    stopRecordingHandler();
                }}
            />
            <Button title="Play Audio" onPress={() => playSound(audioPath)} />
        </View>
    );
};