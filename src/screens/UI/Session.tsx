import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { SocketIP } from '../../constants/constants.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { requestPermissions } from '../../utils/PermissionsManager.tsx';
import { notifyMessage } from '../../utils/informationValidators.tsx';
import { WebSocketManager } from '../../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../../utils/AudioManager.tsx';
import { EchoSessionManager } from '../../components/EchoSessionManager.tsx';
import { styles } from '../../styles/styels.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const { session } = route.params;
    const webSocket = useRef<WebSocket>(
        new WebSocket(SocketIP + session.socket_url),
    );
    const webSocketManager = useRef<WebSocketManager>(
        new WebSocketManager(webSocket),
    );
    const audioManager = useRef<AudioManagerAPI>(new AudioManagerAPI());

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
        let current = webSocketManager.current;
        return () => {
            if (webSocketManager) {
                current.webSocket.current.close();
            }
        };
    }, [webSocketManager]);
    if (webSocketManager && audioManager) {
        return (
            <EchoSessionManager
                webSocketManager={webSocketManager}
                audioManager={audioManager}
            />
        );
    } else {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
};
