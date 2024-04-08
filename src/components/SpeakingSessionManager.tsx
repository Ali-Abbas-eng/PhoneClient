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
                                    echoTurn,
                                    setWaitingForEchoResponse,
                                    removeReceivedAudio,
                                    addReceivedAudios
                                } : any) => {
    const audioManager = new AudioManagerAPI();
    const socketURL = SocketIP + session.socket_url;
    const [sessionInitialised, setSessionInitialised] = useState(false);
    const [recordability, setRecordability] = useState(false);

    // make sure all the required permissions are granted.
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
        webSocket.current = new WebSocket(socketURL);
        const result = initialiseWebSocket(webSocket, (audioPath) => {
            // Dispatch the action to add the audio path to the global state
            addReceivedAudios(audioPath);
        });
        console.log('Result of initialiseWebSocket: ', result);
        startConversation();
    }, []);

    useEffect(() => {
        // Handle the one-off case where echo starts the conversation with one message
        if (echoTurn && !sessionInitialised) {
            let audioFile = receivedAudios[0];
            audioManager.playSound(audioFile).then(
                () => {
                    removeReceivedAudio(audioFile);
                    setSessionInitialised(true);
                    setEchoTurn(false)
                }
            );
        } else if (echoTurn && sessionInitialised) { // moving forward, echo will be sending two messages
            // TODO: two stage audio send/receive functionality
            console.log('Not Implemented yet');
        }
    }, [echoTurn, receivedAudios]);

    useEffect(() => {
        // Handle the one-off case where echo starts the conversation with one message
        if (!echoTurn) { // it's the user's turn

            // TODO: prepare multi-stage request
            /*
            * record two audios
            * send each one immediately when it's done recording
            * when both audios are sent:
            *   change echoTurn to true
            */
        }
    }, [echoTurn, receivedAudios]);


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
            <Button title="Stop Recording" onPress={audioManager.stopRecording} disabled={recordability} />
        </View>
    );
};

const mapStateToProps = (state: { isRecording: boolean; audioPath: string; waitingForEchoResponse: boolean; receivedAudios: string[]; echoTurn: boolean; }) => ({
    isRecording: state.isRecording,
    audioPath: state.audioPath,
    waitingForEchoResponse: state.waitingForEchoResponse,
    receivedAudios: state.receivedAudios,
    echoTurn: state.echoTurn
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
