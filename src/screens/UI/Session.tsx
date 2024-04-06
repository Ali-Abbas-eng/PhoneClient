import React, { useRef } from 'react';
import { View } from 'react-native';
import { SessionScreenProps } from '../../constants/types.tsx';
import { SpeakingSessionManager } from '../../components/SpeakingSessionManager.tsx';
import { styles } from '../../styles/styels.tsx';

export const Session: React.FC<SessionScreenProps> = ({ route }) => {
    const { session } = route.params;
    const webSocket = useRef<WebSocket | null>(null);

    return (
        <View style={styles.container}>
            <SpeakingSessionManager session={session} webSocket={webSocket} />
        </View>
    );
};