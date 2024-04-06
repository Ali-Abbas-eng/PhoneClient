import React, {useEffect, useState} from 'react';
import { Button, View } from 'react-native';
import {
    playSound,
    startRecording,
    stopRecording,
} from '../utils/AudioManager.tsx';
import {
    sendAudio,
    initialiseWebSocket,
    getNextAudio
} from '../utils/WebSocketManager.tsx';
import { SocketIP } from '../constants/constants.tsx';
import {SpeakingSessionManagerProps} from "../constants/types.tsx";
import {PERMISSIONS} from "react-native-permissions";
import {requestPermissions} from "../utils/PermissionsManager.tsx";
import {notifyMessage} from "../utils/informationValidators.tsx";

export const SpeakingSessionManager = ({ session, webSocket }: SpeakingSessionManagerProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState('');
    const [waitingForEchoResponse, setWaitingForEchoResponse] = useState(true);
    const socketURL = SocketIP + session.socket_url;

    // request permissions clause
    useEffect(() => {
        const permissionGrants = requestPermissions([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        if (!permissionGrants) {
            notifyMessage('All permissions must be granted to start a session');
        }}, []);

    // initialise websocket clause
    useEffect(() => {
        webSocket.current = new WebSocket(socketURL);
        const result = initialiseWebSocket(webSocket);
        console.log('Result of initialiseWebSocket: ', result);
        startConversation();
    }, []);

    // play audio clause
    useEffect(() => {
        if (waitingForEchoResponse) {
            let audioFile = getNextAudio();
            if (audioFile){
                playSound(audioFile)
            }
        }
    }, [waitingForEchoResponse]);

    const startRecordingHandler = async () => {
        setWaitingForEchoResponse(false);
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
        setWaitingForEchoResponse(true);
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
