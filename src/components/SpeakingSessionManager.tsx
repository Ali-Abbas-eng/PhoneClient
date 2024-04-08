import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { connect } from 'react-redux';
import {
    startRecording,
    stopRecording,
    setAudioPath,
    setEchoTurn,
    addReceivedAudios,
    removeReceivedAudio,
} from '../redux/actions';
import { requestPermissions } from '../utils/PermissionsManager.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { notifyMessage } from '../utils/informationValidators.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import {
    initialiseWebSocket,
    sendAudio,
    startConversation,
} from '../utils/WebSocketManager.tsx';

const SpeakingSessionManager = ({
    session,
    webSocket,
    receivedAudios,
    echoTurn,
    addReceivedAudios,
    removeReceivedAudio,
    setEchoTurn,
}: any) => {
    const audioManager = React.useMemo(() => new AudioManagerAPI(), []);
    audioManager.registerOnStopRecordingCallback(async (filePath: string) => {
        await sendAudio(webSocket, filePath);
        console.log(`File at: ${filePath} is being sent to Echo server`);
        // TODO: FIX: recorded file is not reachable.
    });
    const socketURL = SocketIP + session.socket_url;
    const [sessionInitialised, setSessionInitialised] = useState(false);

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
        initialiseWebSocket(webSocket, audioPath => {
            // Dispatch the action to add the audio path to the global state
            addReceivedAudios(audioPath);
        });
        startConversation(webSocket);
    }, [addReceivedAudios, socketURL, webSocket]);

    useEffect(() => {
        // Handle the one-off case where echo starts the conversation with one message
        if (echoTurn && !sessionInitialised) {
            let audioFile = receivedAudios[0];
            audioManager.playSound(audioFile).then(() => {
                removeReceivedAudio(audioFile);
                setSessionInitialised(true);
                setEchoTurn(false);
                audioManager.isPlayingSwitch();
            });
        } else if (echoTurn && sessionInitialised) {
            // moving forward, echo will be sending two messages
            // TODO: two stage audio send/receive functionality
            console.log('Not Implemented yet');
        }
    }, [
        audioManager,
        echoTurn,
        receivedAudios,
        removeReceivedAudio,
        sessionInitialised,
        setEchoTurn,
    ]);

    useEffect(() => {
        // Handle the one-off case where echo starts the conversation with one message
        if (!echoTurn && !audioManager.isPlaying()) {
            // it's the user's turn
            console.log("It is not Echo's turn, we must record....");
            audioManager
                .startRecording(5, 10, 3)
                .then(fullAudioInfo => {
                    sendAudio(webSocket, fullAudioInfo.audioPath).then(() => {
                        console.log('Complete Audio Sent');
                        setEchoTurn(true);
                    });
                    console.log('Playing Recorded Audio....');
                })
                .catch(error => {
                    console.error(error);
                });
            // TODO: prepare multi-stage request
            /*
             * record two audios
             * send each one immediately when it's done recording
             * when both audios are sent:
             *   change echoTurn to true
             */
        }
    }, [audioManager, echoTurn, setEchoTurn, webSocket]);

    return (
        <View>
            <Button
                title="Stop Recording"
                onPress={() => {}}
                disabled={!audioManager.isStoppable()}
            />
        </View>
    );
};

const mapStateToProps = (state: {
    isRecording: boolean;
    audioPath: string;
    waitingForEchoResponse: boolean;
    receivedAudios: string[];
    echoTurn: boolean;
}) => ({
    isRecording: state.isRecording,
    audioPath: state.audioPath,
    waitingForEchoResponse: state.waitingForEchoResponse,
    receivedAudios: state.receivedAudios,
    echoTurn: state.echoTurn,
});

const mapDispatchToProps = {
    startRecording,
    stopRecording,
    setAudioPath,
    setEchoTurn,
    addReceivedAudios,
    removeReceivedAudio,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SpeakingSessionManager);
