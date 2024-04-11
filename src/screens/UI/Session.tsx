import React, { useEffect, useMemo } from 'react';
import { Button, View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { EchoSessionManager } from '../../utils/EchoSessionManager.tsx';
import { SocketIP } from '../../constants/constants.tsx';
import { PERMISSIONS } from 'react-native-permissions';
import { requestPermissions } from '../../utils/PermissionsManager.tsx';
import { notifyMessage } from '../../utils/informationValidators.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { setWebSocket, setEchoSessionManager } from '../../redux/actions';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const dispatch = useDispatch();
    const webSocket = useSelector(state => state.webSocket);
    const echoSessionManager = useSelector(state => state.echoSessionManager);
    const [start, setStart] = React.useState(false);
    const { session } = route.params;

    useMemo(() => {
        if (webSocket) {
            const newEchoSessionManager = new EchoSessionManager(
                SocketIP + session.socket_url,
                webSocket,
                10, // messageCountLimit
                5, // minimumMessageLength
                10, // maximumMessageLength
                3, // chunkMessageLength
            );
            console.log('newEchoSessionManager', newEchoSessionManager);
            dispatch(setEchoSessionManager(newEchoSessionManager));
        }
    }, [session.socket_url, webSocket, dispatch]);

    console.log('echoSessionManager from Redux', echoSessionManager);

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

    return (
        <View>
            <Button
                title="Start Chat"
                onPress={() => {
                    setStart(true);
                    echoSessionManager.webSocketManager.startConversation();
                }}
                disabled={start && echoSessionManager?.webSocketManager}
            />
            <Button
                title="Stop Recording"
                onPress={() => {}}
                disabled={!echoSessionManager?.isAudioRecordSendable}
            />
        </View>
    );
};
