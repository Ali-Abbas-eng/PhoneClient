import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { SessionManager } from '../utils/SessionManager.tsx';
import { styles } from '../styles/styels.tsx';
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

    const [recordedMessages, setRecordedMessages] = useState(['']);

    // Function to handle the end of recording and update the messages
    const handleStopRecording = () => {
        // Placeholder for the logic to retrieve the recorded message
        const newMessage = ''; // Replace with actual message retrieval logic
        setRecordedMessages([...recordedMessages, newMessage]);
        sessionManager.current.stopRecording(false);
    };

    return (
        <View style={styles.sessionContainer}>
            {/* Scrollable message box with curved corners */}
            <ScrollView style={styles.sessionMessageBox}>
                {recordedMessages.map((message, index) => (
                    <View key={index} style={styles.sessionMessage}>
                        {/* Replace with actual message content */}
                        <Text style={styles.sessionMessageText}>
                            Recording {index + 1}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Microphone button */}
            <TouchableOpacity
                style={styles.sessionMicrophoneButton}
                disabled={!isRecordingStoppable}
                onPress={handleStopRecording}>
                <Image
                    source={require('../../assets/session/microphone-icon.png')} // Replace with your microphone icon path
                    style={styles.sessionMicrophoneIcon}
                    resizeMode="center"
                />
            </TouchableOpacity>
        </View>
    );
};
