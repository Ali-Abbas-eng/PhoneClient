import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';

import { notifyMessage } from '../utils/informationValidators.tsx';
import { requestAudioPermission } from '../utils/PermissionsManager.tsx';
import {
    initialiseWebSocket,
    startRecording,
    stopRecording,
} from '../utils/WebSocketManager.tsx';

export function SessionScreen({ route }: SessionScreenProps) {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const [recording, setRecording] = useState(false);
    const { session } = route.params;
    const socketURL = SocketIP + session.socket_url;
    const webSocket = useRef<WebSocket | null>(null);
    useEffect(() => {
        requestAudioPermission()
            .then(() => {
                webSocket.current = new WebSocket(socketURL);
                const result = initialiseWebSocket(webSocket);
                console.log('Result of initialiseWebSocket: ', result);
                setSocketInitialised(result.initialised);
            })
            .catch(error => {
                notifyMessage(error);
            });
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
                webSocket.current = null;
            }
        };
    }, [socketURL]);
    if (!socketInitialised) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Button title="Start Conversation" onPress={() => {}} />
            <Button
                title="Start Recording"
                onPress={() => {
                    startRecording(recording).then(result => {
                        return setRecording(result);
                    });
                }}
            />
            <Button
                title="Stop Recording"
                onPress={() => {
                    stopRecording(recording).then(result => {
                        setRecording(!!result);
                    });
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
