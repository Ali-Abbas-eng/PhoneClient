// EchoSessionManager.tsx
import React, { useEffect, useRef } from 'react';
import { Button } from 'react-native';
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

    useEffect(() => {
        const currentSessionManager = sessionManager.current;
        return () => {
            // Clean up when the component unmounts
            currentSessionManager.cleanup();
        };
    }, []);

    return (
        <Button
            title="Stop Recording"
            disabled={!sessionManager.current.echoTurn}
            onPress={async () => {
                sessionManager.current.stopRecording(false);
            }}
        />
    );
};
