import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
    HomeScreenName,
    ScreenNames,
    SocketIP,
} from '../../constants/constants.tsx';
import { SessionScreenProps } from '../../constants/types.tsx';
import { notifyMessage } from '../../utils/informationValidators.tsx';
import { initialiseWebSocket } from '../../utils/WebSocketManager.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { SessionManager } from '../../components/AudioRecorder.tsx';
import { styles } from '../../styles/styels.tsx';
import { useNavigation } from '@react-navigation/native';
import { requestPermissions } from '../../utils/PermissionsManager.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const { session } = route.params;
    console.log(session);
    const socketURL = SocketIP + session.socket_url;
    console.log('Socket URL: ', socketURL);
    console.log('Type of Socket URL: ', typeof socketURL);
    const webSocket = useRef<WebSocket | null>(null);
    const navigation = useNavigation();
    useEffect(() => {
        const permissionGrants = requestPermissions([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        if (!permissionGrants) {
            notifyMessage('All permissions must be granted to start a session');
            navigation.reset({
                index: 0,
                // @ts-ignore
                routes: [{ name: HomeScreenName }],
            });
        } else {
            webSocket.current = new WebSocket(socketURL);
            const result = initialiseWebSocket(webSocket);
            console.log('Result of initialiseWebSocket: ', result);
            setSocketInitialised(result.initialised);
        }
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
                webSocket.current = null;
            }
        };
    }, [navigation, socketURL]);

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