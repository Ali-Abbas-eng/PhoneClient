import React, {useEffect, useState} from 'react';
import { Button, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { connect } from 'react-redux';
import {
    startRecording,
    stopRecording,
    setAudioPath,
    setWaitingForEchoResponse, setEchoTurn, addReceivedAudios, removeReceivedAudio,
} from '../redux/actions';
import {requestPermissions} from "../utils/PermissionsManager.tsx";
import {PERMISSIONS} from "react-native-permissions";
import {notifyMessage} from "../utils/informationValidators.tsx";
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import {getNextAudio, initialiseWebSocket, isBufferEmpty} from "../utils/WebSocketManager.tsx";

const SpeakingSessionManager = ({
                                    session,
                                    webSocket,
                                    waitingForEchoResponse,
                                    receivedAudios,
                                    setWaitingForEchoResponse,
                                    removeReceivedAudio,
                                } : any) => {
    const audioManager = new AudioManagerAPI();
    const socketURL = SocketIP + session.socket_url;
    useEffect(() => {
        webSocket.current = new WebSocket(socketURL);
        const result = initialiseWebSocket(webSocket, (audioPath) => {
            // Dispatch the action to add the audio path to the global state
            addReceivedAudios(audioPath);
        });
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
        console.log(receivedAudios)
        if (waitingForEchoResponse && receivedAudios.length > 0) {
            let audioFile = receivedAudios[0];
            audioManager.playSound(audioFile);
            removeReceivedAudio(audioFile);
            setWaitingForEchoResponse(receivedAudios.length > 1);
        } else if (!waitingForEchoResponse && !audioManager.isRecording()){
            console.log('Trying to start recording');
            audioManager.audioRecordInference(5, 60, 3).then(
                (fullAudioInfo) => {
                    setWaitingForEchoResponse(true);
                    audioManager.isRecordingSwitch();
                    addReceivedAudios(fullAudioInfo.audioPath);
                }
            );
            audioManager.audioRecordInference(5, 60, null).then(
                (chunkAudioInfo) => {
                    setWaitingForEchoResponse(true);
                    audioManager.isRecordingChunkSwitch();
                    addReceivedAudios(chunkAudioInfo.audioPath);
                }
            );
        }
    }, [waitingForEchoResponse, receivedAudios]);

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
    console.log('SpeakingSessionManager initialised successfully');
    return (
        <View>
            <Button title="Stop Recording" onPress={audioManager.stopRecording} disabled={audioManager.isStoppable()} />
        </View>
    );
};

const mapStateToProps = (state: { isRecording: boolean; audioPath: string; waitingForEchoResponse: boolean; receivedAudios: string[]; }) => ({
    isRecording: state.isRecording,
    audioPath: state.audioPath,
    waitingForEchoResponse: state.waitingForEchoResponse,
    receivedAudios: state.receivedAudios,
});

const mapDispatchToProps = {
    startRecording,
    stopRecording,
    setAudioPath,
    setWaitingForEchoResponse,
    setEchoTurn,
    addReceivedAudios,
    removeReceivedAudio,
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakingSessionManager);
