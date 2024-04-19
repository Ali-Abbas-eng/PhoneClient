import { DeviceEventEmitter } from 'react-native';
import { WebSocketManager } from '../utils/WebSocketManager.tsx';
import { AudioManagerAPI } from '../utils/AudioManager.tsx';
import { downloadFile } from '../utils/FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
import { Events, Turns } from '../constants/constants.tsx';
import React, { MutableRefObject } from 'react';

export class SessionManager {
    private webSocketManager: React.MutableRefObject<WebSocketManager>;
    private audioManager: React.MutableRefObject<AudioManagerAPI>;
    private userMessagesCount: number;
    private echoMessagesCount: number;
    private sessionInitialised: boolean;
    private completeResponse: boolean;
    private turn: Turns;
    echoTurn: boolean;
    private messageReady: boolean;
    private echoAudioMessages: string[] = [];
    private echoMessagesTranscripts: string[] = [];
    private userMessagesTranscripts: string[] = [];
    private userAudioMessages: string[] = [];
    private minimumMessagesDuration = 5;
    private maximumMessagesDuration = 10;
    private chunkMessagesDuration = 3;

    constructor(
        webSocketManager: MutableRefObject<WebSocketManager>,
        audioManager: MutableRefObject<AudioManagerAPI>,
    ) {
        this.webSocketManager = webSocketManager;
        this.audioManager = audioManager;
        this.userMessagesCount = 0;
        this.echoMessagesCount = 1;
        this.sessionInitialised = false;
        this.completeResponse = false;
        this.turn = Turns.HOLD;
        this.echoTurn = true;
        this.messageReady = false;

        // Add the event listener for 'turnChange'
        DeviceEventEmitter.addListener(
            Events.TURNS_CHANGE,
            this.handleTurnChange,
        );
        this.webSocketManager.current.initialiseWebSocket(
            this.onMessageReceived,
        );
        this.webSocketManager.current.startConversation();
        this.audioManager.current.registerOnStopRecordingCallback(
            this.onMessageRecorded,
        );
    }

    __generateAudioFileName = (author: string) => {
        const baseName = `${Math.floor(
            new Date().getTime() / 1000,
        )}_${author}.mp3`;
        return `${DocumentDirectoryPath}/${baseName}`;
    };

    recalculateTurns = () => {
        const previousTurn = this.turn;
        if (
            this.echoMessagesCount % 2 === 1 &&
            this.echoMessagesCount > this.userMessagesCount
        ) {
            this.turn = Turns.USER;
        } else if (this.echoMessagesCount === this.userMessagesCount) {
            if (this.messageReady) {
                this.turn = Turns.ECHO;
            } else {
                this.turn = Turns.HOLD;
            }
        }
        const newTurn = this.turn;
        if (previousTurn !== newTurn) {
            DeviceEventEmitter.emit(Events.TURNS_CHANGE);
        }
    };

    onMessageRecorded = async (filePath: string, completeResponse: boolean) => {
        if (this.webSocketManager.current) {
            await this.webSocketManager.current.sendAudio(filePath);
            this.userAudioMessages.push(filePath);
            this.echoTurn = completeResponse;
            ++this.userMessagesCount;
            this.recalculateTurns();
        }
    };

    onMessageReceived = async (data: {
        audio: string;
        response_text: string;
        answer_text: string;
    }) => {
        try {
            let filePath = this.__generateAudioFileName('echo');
            await downloadFile(data.audio, filePath);
            this.echoAudioMessages.push(filePath);
            this.echoMessagesTranscripts.push(data.response_text);
            this.userMessagesTranscripts.push(data.answer_text);
            this.messageReady = true;
            this.recalculateTurns();
            return true;
        } catch (error) {
            console.error('Error Receiving Audio: ', error);
            return false;
        }
    };

    startRecording = () => {
        this.audioManager.current.startRecording(
            this.minimumMessagesDuration,
            this.maximumMessagesDuration,
            this.chunkMessagesDuration,
        );
    };

    playEchoMessage = () => {
        const onAudioPlayed = () => {
            if (this.completeResponse || !this.sessionInitialised) {
                this.echoTurn = false;
            } else {
                this.completeResponse = true;
                this.sessionInitialised = true;
            }
            ++this.echoMessagesCount;
            this.recalculateTurns();
        };
        let message = this.echoAudioMessages[this.echoMessagesCount - 1];
        if (message) {
            this.audioManager.current.playSound(message, onAudioPlayed);
        }
    };

    stopRecording() {
        this.audioManager.current.stopRecording;
    }

    handleTurnChange = () => {
        switch (this.turn) {
            case Turns.ECHO:
                console.log(
                    "It's Echo's Turn, and the current messages in the queue are: ",
                    this.echoAudioMessages,
                );
                this.playEchoMessage();
                break;

            case Turns.USER:
                console.log(
                    "It's the User's turn, you should see recording process indicators",
                );
                this.startRecording();
                break;

            case Turns.HOLD:
                console.log("The app is currently waiting on Echo's message");
                break;
        }
    };

    cleanup = () => {
        DeviceEventEmitter.removeAllListeners(Events.TURNS_CHANGE);
    };
}
