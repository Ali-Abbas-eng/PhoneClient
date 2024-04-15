import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, View } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { EchoResponse } from '../constants/types.tsx';
import { downloadFile } from '../utils/FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
interface StartChatButtonProps {
    webSocketManager: WebSocketManager;
    audioManager: AudioManagerAPI;
}

const __generateAudioFileName = (author: string) => {
    const baseName = `${Math.floor(new Date().getTime() / 1000)}_${author}.mp3`;
    return `${DocumentDirectoryPath}/${baseName}`;
};

let echoAudioMessages: string[] = [];
let echoMessagesTranscripts: string[] = [];
let userMessagesTranscripts: string[] = [];
let userAudioMessages: string[] = [];
const minimumMessagesDuration = 5;
const maximumMessagesDuration = 10;
const chunkMessagesDuration = 3;
export const EchoSessionManager: React.FC<StartChatButtonProps> = ({
    webSocketManager,
    audioManager,
}) => {
    const userMessagesCount = useRef<number>(0);
    const echoMessagesCount = useRef<number>(0);
    const sessionInitialised = useRef<boolean>(false);
    const completeResponse = useRef<boolean>(false);
    const [echoTurn, setEchoTurn] = useState<boolean>(true);
    const [messageReady, setMessageReady] = useState<boolean>(false);
    const onMessageReceived = async (data: EchoResponse) => {
        try {
            let filePath = __generateAudioFileName('echo');
            await downloadFile(data.audio, filePath);
            echoAudioMessages.push(filePath);
            echoMessagesTranscripts.push(data.response_text);
            userMessagesTranscripts.push(data.answer_text); // User's previous response transcript.
            console.log('EchoAudioMessages: ', echoAudioMessages);
            console.log('EchoMessagesTranscripts: ', echoMessagesTranscripts);
            console.log('UserMessagesTranscripts: ', userMessagesTranscripts);
            setMessageReady(true);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    webSocketManager.initialiseWebSocket(onMessageReceived);

    const onMessageRecorded = async (
        filePath: string,
        completeResponse: boolean,
    ) => {
        if (webSocketManager) {
            console.log('Message Recorded at: ', filePath);
            await webSocketManager.sendAudio(filePath);
            userAudioMessages.push(filePath);
            setEchoTurn(completeResponse);
            ++userMessagesCount.current;
        } else {
            console.log(
                'Error [SessionConductor.onMessageRecorded]: webSocketManager is: ',
                webSocketManager,
            );
        }
    };
    audioManager.registerOnStopRecordingCallback(onMessageRecorded);
    const startRecording = useCallback(() => {
        audioManager.startRecording(
            minimumMessagesDuration,
            maximumMessagesDuration,
            chunkMessagesDuration,
        );
    }, [audioManager]);

    const playEchoMessage = useCallback(() => {
        const onAudioPlayed = () => {
            if (completeResponse.current || !sessionInitialised.current) {
                setEchoTurn(false);
            } else {
                completeResponse.current = true;
                sessionInitialised.current = true;
            }
            ++echoMessagesCount.current;
        };
        let message = echoAudioMessages[echoMessagesCount.current];
        if (message) {
            audioManager.playSound(message, onAudioPlayed);
        }
    }, [audioManager]);

    useEffect(() => {
        console.log('WebSocketManager Object: ', webSocketManager);
        if (!sessionInitialised.current) {
            webSocketManager.startConversation();
        }
    }, [webSocketManager]);

    useEffect(() => {
        if (echoTurn) {
            playEchoMessage();
        } else {
            startRecording();
        }
    }, [echoTurn, messageReady, playEchoMessage, startRecording]);

    return (
        <Button
            title="Stop Recording"
            disabled={audioManager.isStoppable() && !echoTurn}
            onPress={async () => {
                await audioManager.stopRecording(
                    false,
                    userAudioMessages[userMessagesCount.current - 1],
                );
            }}
        />
    );
};
