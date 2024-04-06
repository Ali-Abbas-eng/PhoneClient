import React, {useEffect, useRef} from 'react';
import { View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { SpeakingSessionManager } from '../../components/SpeakingSessionManager.tsx';
import { styles } from '../../styles/styels.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const { session } = route.params;
    const webSocket = useRef<WebSocket | null>(null);

    // destroy web socket clause
    useEffect(() => {
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
                webSocket.current = null;
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <SpeakingSessionManager session={session} webSocket={webSocket} />
        </View>
    );
};