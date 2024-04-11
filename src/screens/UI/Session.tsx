import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { EchoSessionManager } from '../../utils/EchoSessionManager.tsx';
import { SocketIP } from '../../constants/constants.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { requestPermissions } from '../../utils/PermissionsManager.tsx';
import { notifyMessage } from '../../utils/informationValidators.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const [start, setStart] = React.useState(false);
    const { session } = route.params;
    const [webSocket, setWebSocket] = useState<WebSocket | null>(
        new WebSocket(SocketIP + session.socket_url),
    );
    const [echoSessionManager, setEchoSessionManager] =
        useState<EchoSessionManager | null>(
            new EchoSessionManager(
                webSocket,
                10, // messageCountLimit
                5, // minimumMessageLength
                10, // maximumMessageLength
                3, // chunkMessageLength
            ),
        );

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
        return () => {
            if (echoSessionManager) {
                setEchoSessionManager(null);
                console.log('Echo Session Manager: ', echoSessionManager);
            }
            if (webSocket) {
                webSocket.close();
                setWebSocket(null);
            }
        };
    }, [echoSessionManager, webSocket]);

    return (
        <View>
            <Button
                title="Start Chat"
                onPress={() => {
                    setStart(true);
                    echoSessionManager?.webSocketManager?.startConversation();
                }}
                disabled={start}
            />
            <Button
                title="Stop Recording"
                onPress={() => {}}
                disabled={!echoSessionManager?.isAudioRecordSendable}
            />
        </View>
    );
};
