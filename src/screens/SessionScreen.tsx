import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import { notifyMessage } from '../utils/informationValidators.tsx';
import { requestAudioPermission } from '../utils/PermissionsManager.tsx';

import { initialiseWebSocket, sendAudio } from '../utils/WebSocketManager.tsx';
import { startRecording, stopRecording } from '../utils/AudioManager.tsx';

export function SessionScreen({ route }: SessionScreenProps) {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const [recording, setRecording] = useState(false);
    const { session } = route.params;
    const socketURL = SocketIP + session.socket_url;
    console.log('Socket URL: ', socketURL);
    console.log('Type of Socket URL: ', typeof socketURL);
    const startSessionHandler = () => {
        webSocket.current?.send(JSON.stringify({ start: 1 }));
    };
    const startRecordingHandler = () => {
        startRecording(recording).then(result => {
            return setRecording(result);
        });
    };
    const stopRecordingHandler = () => {
        stopRecording(recording).then(result => {
            setRecording(!!result);
            if (typeof result === 'string') {
                sendAudio(webSocket, result);
            }
        });
    };
    const webSocket = useRef<WebSocket | null>(null);
    useEffect(() => {
        requestAudioPermission()
            .then((granted: boolean) => {
                if (granted) {
                    webSocket.current = new WebSocket(socketURL);
                    const result = initialiseWebSocket(webSocket);
                    console.log('Result of initialiseWebSocket: ', result);
                    setSocketInitialised(result.initialised);
                } else {
                    // TODO: Annoy user into granting permissions
                }
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
            <Button title="Start Conversation" onPress={startSessionHandler} />
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
