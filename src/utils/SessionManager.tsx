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
    private echoAudioMessages: string[] = ['dummyMessage'];
    private echoMessagesTranscripts: string[] = [];
    private userMessagesTranscripts: string[] = [];
    private userAudioMessages: string[] = [];
    private playedMessages: number[];
    private nextMessageToPlay: number;
    private minimumMessagesDuration: Durations = Durations.MIN_RECORD;
    private maximumMessagesDuration: Durations = Durations.MAX_RECORD;
    private chunkMessagesDuration: Durations = Durations.CHUNK_RECORD;
    private uiStateManagers: UIStateManagerType[];
    private uiStateVariables: Record<string, any>;
    private uiStateVariablesPrevious: Record<string, any>;
    private isPlaying: boolean;
    private isRecording: boolean;
    private turnsConsistency: Record<Turns, number>;
    constructor(
        webSocketManager: MutableRefObject<WebSocketManager>,
        audioManager: MutableRefObject<AudioManagerAPI>,
    ) {
        this.webSocketManager = webSocketManager;
        this.audioManager = audioManager;
        this.userMessagesCount = 0;
        this.sessionInitialised = false;
        this.turn = Turns.HOLD;
        this.uiStateManagers = [];
        this.isPlaying = false;
        this.isRecording = false;
        this.nextMessageToPlay = 1;
        this.playedMessages = [1];
        this.turnsConsistency = {
            [Turns.ECHO]: 1,
            [Turns.USER]: 0,
            [Turns.HOLD]: 0,
        };

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

    isItEchosTurn() {
        const echoMessagesTarget =
            this.userMessagesCount - (this.userMessagesCount % 2) + 2;
        console.log(`\t\tEchoMessagesTarget: ${echoMessagesTarget}`);
        console.log(`\t\tEchoMessagesCount: ${this.getEchoMessagesCount()}`);
        console.log(`\t\tNextMessageToPlay: ${this.nextMessageToPlay}`);
        if (
            this.getEchoMessagesCount() === echoMessagesTarget &&
            this.nextMessageToPlay === echoMessagesTarget // account for counting from 0
        ) {
            console.log('Hello, from Condition: 1111111111');
            return false;
        }
        if (this.getEchoMessagesCount() !== this.nextMessageToPlay + 1) {
            console.log('Hello, from Condition: 2222222222');
            return true;
        }
        return this.getEchoMessagesCount() !== this.userMessagesCount;
    }

    recalculateTurns = () => {
        /*
         * if no message is received and session is not initialised, then it's Echo's Turn to send the first message
         * if a message is received and session is not initialised, then it's time to play the first message
         * if session is initialised, and number of messages by Echo equals number of messages by user + 2, it's the user's turn
         * if session is initialised and number of messages by Echo is less then number of messages by user + 2, it's Echo's turn
         */
        const previousTurn = this.turn;
        const echoAudioMessagesCount = this.getEchoMessagesCount();
        if (this.isPlaying && this.isRecording) {
            console.log(
                `Fatal State: this.isRecording: ${this.isRecording}, this.isPlaying: ${this.isPlaying}`,
            );
            return null;
        }
        if (this.isPlaying || this.isRecording) {
            return;
        }
        this.turn = this.isItEchosTurn() ? Turns.ECHO : Turns.USER;
        if (
            this.turn === Turns.ECHO &&
            this.nextMessageToPlay === this.userMessagesCount &&
            this.getEchoMessagesCount() === this.userMessagesCount
        ) {
            // it's Echo's turn, but audios are still pending
            this.turn = Turns.HOLD;
        }
        const newTurn = this.turn;
        if (previousTurn !== newTurn) {
            DeviceEventEmitter.emit(Events.TURNS_CHANGE);
        } else if (newTurn === Turns.ECHO) {
            // we're expecting echo to play the next message
            DeviceEventEmitter.emit(Events.TURNS_CHANGE);
        }
        console.log(
            `State Details:
            \t\tthis.getEchoMessagesCount()  = ${echoAudioMessagesCount}
            \t\tthis.userMessagesCount       = ${this.userMessagesCount}
            \t\tthis.sessionInitialised      = ${this.sessionInitialised}
            \t\tthis.echoAudioMessages       = ${this.echoAudioMessages}
            \t\tthis.nextMessageToPlay       = ${this.nextMessageToPlay}
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
            this.isRecording = false;
            ++this.turnsConsistency[Turns.USER];
            this.recalculateTurns();
        }
    };

    onMessageReceived = (data: {
        audio: string;
        response_text: string;
        answer_text: string;
    }) => {
        try {
            let filePath = this.__generateAudioFileName('echo');
            downloadFile(data.audio, filePath).then(() => {
                this.echoAudioMessages.push(filePath);
                this.echoMessagesTranscripts.push(data.response_text);
                this.userMessagesTranscripts.push(data.answer_text);
                this.playedMessages.push(0);
                this.recalculateTurns();
            });
        } catch (error) {
            console.error('Error Receiving Audio: ', error);
        }
    };

    startRecording = () => {
        this.isRecording = true;
        this.audioManager.current.startRecording(
            this.minimumMessagesDuration,
            this.maximumMessagesDuration,
            this.chunkMessagesDuration,
        );
    };

    onAudioPlayed = () => {
        this.isPlaying = false;
        this.playedMessages[this.nextMessageToPlay] = 1;
        ++this.turnsConsistency[Turns.ECHO];
        ++this.nextMessageToPlay;
        this.recalculateTurns();
    };
    playEchoMessage = () => {
        this.isPlaying = true;
        let message = this.echoAudioMessages[this.nextMessageToPlay];
        if (message) {
            this.audioManager.current.playSound(message, this.onAudioPlayed);
        }
    };

    stopRecording(isChunk: boolean) {
        this.audioManager.current.stopRecording(isChunk);
    }

    handleTurnChange = () => {
        switch (this.turn) {
            case Turns.ECHO:
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
        return this.echoAudioMessages.length;
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
