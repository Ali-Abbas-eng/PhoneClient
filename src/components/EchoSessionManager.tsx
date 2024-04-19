import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { EchoResponse } from '../constants/types.tsx';
import { downloadFile } from '../utils/FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
import { Events, Turns } from '../constants/constants.tsx';
import { DeviceEventEmitter } from 'react-native';

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
    const echoMessagesCount = useRef<number>(1);
    const sessionInitialised = useRef<boolean>(false);
    const completeResponse = useRef<boolean>(false);
    const turn = useRef<number>(Turns.HOLD);
    const [echoTurn, setEchoTurn] = useState<boolean>(true);
    const [messageReady, setMessageReady] = useState(false);
    const recalculateTurns = useCallback(() => {
        const previousTurn = turn.current;
        // if the current turn now is Echo's, we switch if the number of messages is divisible by 2
        // and is grater than the number of messages recorded by the user
        if (
            echoMessagesCount.current % 2 === 1 &&
            echoMessagesCount.current > userMessagesCount.current
        ) {
            // echo is two played messages ahead of user, it's time for the user to start recording
            turn.current = Turns.USER;
        } else if (echoMessagesCount.current === userMessagesCount.current) {
            // if there is a buffered message ready to be played
            if (messageReady) {
                // the user has now replied to all echo messages, it's now Echo's turn to push the conversation
                turn.current = Turns.ECHO;
            } else {
                turn.current = Turns.HOLD;
            }
        }
        const newTurn = turn.current;
        if (previousTurn !== newTurn) {
            DeviceEventEmitter.emit(Events.TURNS_CHANGE);
        }
        console.log('Previous Turn: ', previousTurn);
        console.log('Current Turn: ', newTurn);
    }, [messageReady]);
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
                recalculateTurns();
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
                recalculateTurns();
                return true;
            } catch (error) {
                console.error('Error Receiving Audio: ', error);
                return false;
            }
        };
        webSocketManager.current.initialiseWebSocket(onMessageReceived);
        audioManager.current.registerOnStopRecordingCallback(onMessageRecorded);
    }, [audioManager, recalculateTurns, webSocketManager]);

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
            recalculateTurns();
        };
        let message = echoAudioMessages[echoMessagesCount.current - 1];
        if (message) {
            audioManager.current.playSound(message, onAudioPlayed);
        }
    }, [audioManager, recalculateTurns]);

    useEffect(() => {
        if (!sessionInitialised.current) {
            webSocketManager.current.startConversation();
        }
    }, [webSocketManager]);

    // Define your function that contains the logic
    const handleTurnChange = useCallback(() => {
        switch (turn.current) {
            case Turns.ECHO:
                console.log(
                    "It's Echo's Turn, and the current messages in the queue are: ",
                    echoAudioMessages,
                );
                playEchoMessage();
                break;

            case Turns.USER:
                console.log(
                    "It's the User's turn, you should see recording process indicators",
                );
                startRecording();
                break;

            case Turns.HOLD:
                console.log("The app is currently waiting on Echo's message");
                // do nothing
                break;
        }
    }, [playEchoMessage, startRecording]);
    // Add the event listener for 'turnChange'
    DeviceEventEmitter.addListener(Events.TURNS_CHANGE, handleTurnChange);
    // useEffect(() => {
    //     handleTurnChange();
    // }, [handleTurnChange]);
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
