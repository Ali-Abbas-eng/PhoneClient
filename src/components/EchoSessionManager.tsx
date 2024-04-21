import React, { useEffect, useRef, useState } from 'react';
import { Button, View } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { SessionManager } from '../utils/SessionManager.tsx';

interface EchoSessionManagerProps {
    webSocketManager: React.MutableRefObject<WebSocketManager>;
    audioManager: React.MutableRefObject<AudioManagerAPI>;
}

export const EchoSessionManager: React.FC<EchoSessionManagerProps> = ({
    webSocketManager,
    audioManager,
}) => {
    const sessionManager = useRef(
        new SessionManager(webSocketManager, audioManager),
    );
    const [isRecordingStoppable, setIsRecordingStoppable] = useState(false);
    const stopRecordingStateManager = {
        target: 'isRecordingStoppable',
        handler: setIsRecordingStoppable,
    };
    sessionManager.current.registerUiStateManager(stopRecordingStateManager);

    useEffect(() => {
        const currentSessionManager = sessionManager.current;
        return () => {
            // Clean up when the component unmounts
            currentSessionManager.cleanup();
        };
    }, []);
    console.log(sessionManager.current.getIsRecordingStoppable());
    return (
        <View>
            <Button
                title="Stop Recording"
                disabled={!isRecordingStoppable}
                onPress={async () => {
                    sessionManager.current.stopRecording(false);
                }}
            />
        </View>
    );
};
