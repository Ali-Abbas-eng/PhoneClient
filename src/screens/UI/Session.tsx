import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { EchoSessionManager } from '../../utils/EchoSessionManager.tsx';
import { SocketIP } from '../../constants/constants.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { requestPermissions } from '../../utils/PermissionsManager.tsx';
import { notifyMessage } from '../../utils/informationValidators.tsx';
import { WebSocketManager } from '../../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../../utils/AudioManager.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const [start, setStart] = React.useState(false);
    const { session } = route.params;
    const [echoSessionManager, setEchoSessionManager] =
        useState<EchoSessionManager | null>(null);

    useEffect(() => {
        const webSocket = new WebSocket(SocketIP + session.socket_url);
        const webSocketManager = new WebSocketManager(webSocket);
        const audioManager = new AudioManagerAPI();

        setEchoSessionManager(
            new EchoSessionManager(
                audioManager,
                webSocketManager,
                10, // messageCountLimit
                5, // minimumMessageLength
                10, // maximumMessageLength
                3, // chunkMessageLength
            ),
        );
    }, [session.socket_url]);

    useEffect(() => {
        console.log('The value of Echo Session Manager: ');
        console.log(echoSessionManager);
    }, [echoSessionManager]);

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
                echoSessionManager.webSocketManager.webSocket.close();
                setEchoSessionManager(null);
            }
        };
    }, [echoSessionManager]);

    return (
        <View>
            <Button
                title="Start Chat"
                onPress={() => {
                    setStart(true);
                    setTimeout(() => {
                        echoSessionManager
                            ? echoSessionManager.converse()
                            : console.log(echoSessionManager);
                    }, 1);
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
