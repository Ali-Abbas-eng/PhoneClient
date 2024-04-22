import { DeviceEventEmitter } from 'react-native';
import { WebSocketManager } from './WebSocketManager.tsx';
import { AudioManagerAPI } from './AudioManager.tsx';
import { downloadFile } from './FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
import { Durations, Events, Turns } from '../constants/constants.tsx';
import React, { MutableRefObject } from 'react';
import { UIStateManagerType } from '../constants/types.tsx';

export class SessionManager {
    private webSocketManager: React.MutableRefObject<WebSocketManager>;
    private audioManager: React.MutableRefObject<AudioManagerAPI>;
    private userMessagesCount: number;
    private sessionInitialised: boolean;
    private turn: Turns;
    private messageReady: boolean;
    private echoAudioMessages: string[] = [];
    private echoMessagesTranscripts: string[] = [];
    private userMessagesTranscripts: string[] = [];
    private userAudioMessages: string[] = [];
    private minimumMessagesDuration: Durations = Durations.MIN_RECORD;
    private maximumMessagesDuration: Durations = Durations.MAX_RECORD;
    private chunkMessagesDuration: Durations = Durations.CHUNK_RECORD;
    private uiStateManagers: UIStateManagerType[];
    private uiStateVariables: Record<string, any>;
    private uiStateVariablesPrevious: Record<string, any>;
    constructor(
        webSocketManager: MutableRefObject<WebSocketManager>,
        audioManager: MutableRefObject<AudioManagerAPI>,
    ) {
        this.webSocketManager = webSocketManager;
        this.audioManager = audioManager;
        this.userMessagesCount = 0;
        this.sessionInitialised = false;
        this.turn = Turns.HOLD;
        this.messageReady = false;
        this.uiStateManagers = [];
        this.uiStateVariables = { isRecordingStoppable: false };
        this.uiStateVariablesPrevious = this.uiStateVariables;
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
        DeviceEventEmitter.emit(Events.TURNS_CHANGE);
    }

    __generateAudioFileName = (author: string) => {
        const baseName = `${Math.floor(
            new Date().getTime() / 1000,
        )}_${author}.mp3`;
        return `${DocumentDirectoryPath}/${baseName}`;
    };

    recalculateTurns = () => {
        /*
         * if no message is received and session is not initialised, then it's Echo's Turn to send the first message
         * if a message is received and session is not initialised, then it's time to play the first message
         * if session is initialised, and number of messages by Echo equals number of messages by user + 2, it's the user's turn
         * if session is initialised and number of messages by Echo is less then number of messages by user + 2, it's Echo's turn
         */
        const previousTurn = this.turn;
        const echoAudioMessagesCount = this.getEchoMessagesCount();
        if (
            !this.sessionInitialised &&
            echoAudioMessagesCount === 1 &&
            !this.messageReady
        ) {
            // it's the very beginning of the session
            this.turn = Turns.HOLD;
        } else if (!this.sessionInitialised && this.messageReady) {
            this.turn = Turns.ECHO;
        } else if (
            this.sessionInitialised &&
            echoAudioMessagesCount < this.userMessagesCount + 2 &&
            this.userMessagesCount % 2 === 0
        ) {
            // Echo must be ahead by exactly two message to complete a response
            this.turn = Turns.ECHO;
        } else if (
            this.sessionInitialised &&
            echoAudioMessagesCount === this.userMessagesCount + 2
        ) {
            this.turn = Turns.USER;
        }
        if (
            this.turn === Turns.ECHO &&
            this.echoAudioMessages.length < this.userMessagesCount
        ) {
            // it's Echo's turn, but audios are still pending
            this.turn = Turns.HOLD;
        }
        const newTurn = this.turn;
        if (previousTurn !== newTurn) {
            DeviceEventEmitter.emit(Events.TURNS_CHANGE);
        }
        console.log(
            `State Details:
            \t\tthis.getEchoMessagesCount()  = ${echoAudioMessagesCount}
            \t\tthis.userMessagesCount       = ${this.userMessagesCount}
            \t\tthis.sessionInitialised      = ${this.sessionInitialised}
            \t\tthis.echoAudioMessages       = ${this.echoAudioMessages}
            \t\tPrevious Turn                = ${previousTurn}
            \t\tCurrent Turn                 = ${newTurn}`,
        );
        return previousTurn !== newTurn;
    };

    onMessageRecorded = async (filePath: string) => {
        if (this.webSocketManager.current) {
            await this.webSocketManager.current.sendAudio(filePath);
            this.userAudioMessages.push(filePath);
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
            this.recalculateTurns();
        };
        const messageIndex = this.getEchoMessagesCount() - 2;
        let message = this.echoAudioMessages[messageIndex];
        console.log(`Playing Echo Message State Details
         \t\techoAudioMessages = ${this.echoAudioMessages}
         \t\tmessageIndex      = ${messageIndex}
         \t\tmessage           = ${message}`);
        if (message) {
            this.audioManager.current.playSound(message, onAudioPlayed);
        }
    };

    stopRecording(isChunk: boolean) {
        this.audioManager.current.stopRecording(isChunk);
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
        this.updateStateVariables();
        this.fireUIUpdaters();
    };

    cleanup = () => {
        this.audioManager.current.cleanup();
        this.webSocketManager.current.cleanup();
        DeviceEventEmitter.removeAllListeners(Events.TURNS_CHANGE);
    };

    getEchoMessagesCount() {
        return this.echoAudioMessages.length + 1;
    }

    getIsRecordingStoppable() {
        return (
            this.audioManager.current.isStoppable() && this.turn === Turns.USER
        );
    }

    registerUiStateManager(managerObject: UIStateManagerType) {
        this.uiStateManagers.push(managerObject);
    }

    updateStateVariables() {
        this.uiStateVariables.isRecordingStoppable =
            this.getIsRecordingStoppable();
    }
    fireUIUpdaters() {
        this.uiStateManagers.map((managerObject: UIStateManagerType) => {
            console.log(`State Variables: 
            \t\t${managerObject.target}: ${
                this.uiStateVariables[managerObject.target]
            }`);
            if (
                this.uiStateVariables[managerObject.target] !==
                this.uiStateVariablesPrevious[managerObject.target]
            ) {
                managerObject.handler(
                    this.uiStateVariables[managerObject.target],
                );
            }
        });
    }
}
