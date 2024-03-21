import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import { notifyMessage } from '../utils/informationValidators.tsx';
import { requestPermissions } from '../utils/PermissionsManager.tsx';

import { initialiseWebSocket, sendAudio } from '../utils/WebSocketManager.tsx';
import { startRecording, stopRecording } from '../utils/AudioManager.tsx';
import { PERMISSIONS } from 'react-native-permissions';

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
        startRecording().then(result => {
            if (!recording) {
                if (result.error) {
                    console.error('Failed to start recording: ', result.error);
                } else {
                    setRecording(result.recording);
                }
            } else {
                console.log('Already Recording (START RECORDING THEN CLAUSE)');
            }
        });
    };

    const stopRecordingHandler = () => {
        stopRecording().then((result: any) => {
            if (result.error) {
                console.error('Failed to stop recording: ', result.error);
            } else {
                setRecording(result.recording);
                if (result.filePath) {
                    sendAudio(webSocket, result.filePath);
                }
            }
        });
    };

    const webSocket = useRef<WebSocket | null>(null);
    useEffect(() => {
        requestPermissions(PERMISSIONS.ANDROID.RECORD_AUDIO)
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
        requestPermissions(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
            .then((granted: boolean) => {
                if (granted) {
                    console.log(
                        'Permission to write to external storage, granted',
                    );
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
