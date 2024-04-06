import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import {
    playSound,
    startRecording as startAudioRecording,
    stopRecording as stopAudioRecording,
} from '../utils/AudioManager.tsx';
import {
    sendAudio,
    initialiseWebSocket,
    getNextAudio, isBufferEmpty,
} from '../utils/WebSocketManager.tsx';
import { SocketIP } from '../constants/constants.tsx';
import {SpeakingSessionManagerProps} from "../constants/types.tsx";
import { connect } from 'react-redux';
import {
    startRecording,
    stopRecording,
    setAudioPath,
    setWaitingForEchoResponse,
} from '../redux/actions';
import {requestPermissions} from "../utils/PermissionsManager.tsx";
import {PERMISSIONS} from "react-native-permissions";
import {notifyMessage} from "../utils/informationValidators.tsx";

const SpeakingSessionManager = ({
                                    session,
                                    webSocket,
                                    isRecording,
                                    audioPath,
                                    waitingForEchoResponse,
                                    startRecording,
                                    stopRecording,
                                    setAudioPath,
                                    setWaitingForEchoResponse,
                                } : any) => {
    const socketURL = SocketIP + session.socket_url;

    useEffect(() => {
        webSocket.current = new WebSocket(socketURL);
        const result = initialiseWebSocket(webSocket);
        console.log('Result of initialiseWebSocket: ', result);
        startConversation();
    }, []);

    useEffect(() => {
        const permissionGrants = requestPermissions([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        if (!permissionGrants) {
            notifyMessage('All permissions must be granted to start a session');
        }
    }, []);

    useEffect(() => {
        if (waitingForEchoResponse) {
            let audioFile = getNextAudio();
            if (audioFile){
                playSound(audioFile)
            }
            setWaitingForEchoResponse(!isBufferEmpty())
        } else {
            startRecordingHandler().then(
                () => {
                    setWaitingForEchoResponse(true);
                }
            );
        }
    }, [waitingForEchoResponse]);

    const startRecordingHandler = async () => {
        setWaitingForEchoResponse(false);
        if (!isRecording) {
            const result = await startAudioRecording();
            startRecording();
            setAudioPath(result.audioPath);
            if (result.error) {
                console.log(result.error);
            }
        }
    };

    const stopRecordingHandler = async () => {
        const result = await stopAudioRecording(isRecording);
        stopRecording();
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
            <Button title="Stop Recording" onPress={stopRecordingHandler} />
        </View>
    );
};

const mapStateToProps = (state: { isRecording: boolean; audioPath: string; waitingForEchoResponse: boolean; }) => ({
    isRecording: state.isRecording,
    audioPath: state.audioPath,
    waitingForEchoResponse: state.waitingForEchoResponse,
});

const mapDispatchToProps = {
    startRecording,
    stopRecording,
    setAudioPath,
    setWaitingForEchoResponse,
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakingSessionManager);
