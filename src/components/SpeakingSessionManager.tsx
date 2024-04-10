import React, { useEffect, useMemo } from 'react';
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
import { EchoSessionManager } from '../utils/EchoSessionManager.tsx';

const SpeakingSessionManager = ({ session }: any) => {
    const echoSessionManager = useMemo(
        () =>
            new EchoSessionManager(
                SocketIP + session.socket_url,
                10, // messageCountLimit
                5, // minimumMessageLength
                10, // maximumMessageLength
                3, // chunkMessageLength
            ),
        [session.socket_url],
    );

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
        echoSessionManager.converse();
    }, [echoSessionManager]);

    return (
        <View>
            <Button
                title="Stop Recording"
                onPress={() => {}}
                disabled={!echoSessionManager.isAudioRecordSendable}
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
