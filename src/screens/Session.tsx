import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import { notifyMessage } from '../utils/informationValidators.tsx';
import { __requestPermissions } from '../utils/PermissionsManager.tsx';

import { initialiseWebSocket } from '../utils/WebSocketManager.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { SessionManager } from '../components/AudioRecorder.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const { session } = route.params;
    console.log(session);
    const socketURL = SocketIP + session.socket_url;
    console.log('Socket URL: ', socketURL);
    console.log('Type of Socket URL: ', typeof socketURL);
    const webSocket = useRef<WebSocket | null>(null);
    useEffect(() => {
        __requestPermissions(PERMISSIONS.ANDROID.RECORD_AUDIO)
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
        __requestPermissions(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
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
        __requestPermissions(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
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
            <SessionManager webSocket={webSocket} />
        </View>
    );
};

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
