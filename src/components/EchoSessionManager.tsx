import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { EchoResponse } from '../constants/types.tsx';
import { downloadFile } from '../utils/FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
interface EchoSessionManagerProps {
    webSocketManager: React.MutableRefObject<WebSocketManager>;
    audioManager: React.MutableRefObject<AudioManagerAPI>;
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
export const EchoSessionManager: React.FC<EchoSessionManagerProps> = ({
    webSocketManager,
    audioManager,
}) => {
    const userMessagesCount = useRef<number>(0);
    const echoMessagesCount = useRef<number>(0);
    const sessionInitialised = useRef<boolean>(false);
    const completeResponse = useRef<boolean>(false);
    const [echoTurn, setEchoTurn] = useState<boolean>(true);
    const [messageReady, setMessageReady] = useState(false);

    useEffect(() => {
        const onMessageRecorded = async (
            filePath: string,
            completeResponse: boolean,
        ) => {
            if (webSocketManager.current) {
                await webSocketManager.current.sendAudio(filePath);
                userAudioMessages.push(filePath);
                setEchoTurn(completeResponse);
                ++userMessagesCount.current;
            } else {
            }
        };
        const onMessageReceived = async (data: EchoResponse) => {
            try {
                let filePath = __generateAudioFileName('echo');
                await downloadFile(data.audio, filePath);
                echoAudioMessages.push(filePath);
                echoMessagesTranscripts.push(data.response_text);
                userMessagesTranscripts.push(data.answer_text); // User's previous response transcript.
                setMessageReady(true);
                return true;
            } catch (error) {
                console.error('Error Receiving Audio: ', error);
                return false;
            }
        };
        webSocketManager.current.initialiseWebSocket(onMessageReceived);
        audioManager.current.registerOnStopRecordingCallback(onMessageRecorded);
    }, [audioManager, webSocketManager]);

    const startRecording = useCallback(() => {
        audioManager.current.startRecording(
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
            audioManager.current.playSound(message, onAudioPlayed);
        }
    }, [audioManager]);

    useEffect(() => {
        if (!sessionInitialised.current) {
            webSocketManager.current.startConversation();
        }
    }, [webSocketManager]);

    useEffect(() => {
        if (echoTurn) {
            console.log('it is echo turn, message must be played');
            playEchoMessage();
        } else {
            startRecording();
        }
    }, [echoTurn, messageReady, playEchoMessage, startRecording]);

    return (
        <Button
            title="Stop Recording"
            disabled={audioManager.current.isStoppable() && !echoTurn}
            onPress={async () => {
                await audioManager.current.stopRecording(false);
            }}
        />
    );
};
