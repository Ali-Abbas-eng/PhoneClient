import { DeviceEventEmitter } from 'react-native';
import { WebSocketManager } from './WebSocketManager.tsx';
import { AudioManagerAPI } from './AudioManager.tsx';
import { downloadFile } from './FileManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
import { Durations, Events, Turns } from '../constants/constants.tsx';
import React, { MutableRefObject } from 'react';
import { ComplexAudioObject } from './ComplexAudio.tsx';

export class SessionManager {
    private webSocketManager: React.MutableRefObject<WebSocketManager>;
    private audioManager: React.MutableRefObject<AudioManagerAPI>;
    private userMessagesCount: number;
    private turn: Turns;
    private echoAudioMessages: string[];
    private userAudioMessages: string[];
    public echoComplexAudioMessages: ComplexAudioObject[];
    public userComplexAudioMessages: ComplexAudioObject[];
    private nextMessageToPlay: number;
    private minimumMessagesDuration: Durations = Durations.MIN_RECORD;
    private maximumMessagesDuration: Durations = Durations.MAX_RECORD;
    private chunkMessagesDuration: Durations = Durations.CHUNK_RECORD;
    private isPlaying: boolean;
    private isRecording: boolean;
    constructor(
        webSocketManager: MutableRefObject<WebSocketManager>,
        audioManager: MutableRefObject<AudioManagerAPI>,
    ) {
        this.webSocketManager = webSocketManager;
        this.audioManager = audioManager;
        this.userMessagesCount = 0;
        this.turn = Turns.HOLD;
        this.isPlaying = false;
        this.isRecording = false;
        this.echoAudioMessages = ['dummyMessage'];
        this.userAudioMessages = [];
        this.echoComplexAudioMessages = [];
        this.userComplexAudioMessages = [];
        this.nextMessageToPlay = 1;
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
        if (
            this.getEchoMessagesCount() === echoMessagesTarget &&
            this.nextMessageToPlay === echoMessagesTarget // account for counting from 0
        ) {
            return false;
        }
        if (this.getEchoMessagesCount() !== this.nextMessageToPlay + 1) {
            return true;
        }
        return this.getEchoMessagesCount() !== this.userMessagesCount;
    }

    recalculateTurns = () => {
        if (this.userComplexAudioMessages.length > 0) {
            console.log('UserAudioMessages: ', this.userComplexAudioMessages);
        } else {
            console.log('No User Complex Audio Messages as of this stage');
        }
        if (this.echoComplexAudioMessages.length > 0) {
            console.log('EchoAudioMessages: ', this.echoComplexAudioMessages);
        } else {
            console.log('No Echo Complex Audio Messages as of this stage');
        }
        const previousTurn = this.turn;
        if (this.isPlaying && this.isRecording) {
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
        return previousTurn !== newTurn;
    };

    onMessageRecorded = async (filePath: string) => {
        if (this.webSocketManager.current) {
            await this.webSocketManager.current.sendAudio(filePath);
            ++this.userMessagesCount;
            this.isRecording = false;
            this.userAudioMessages.push(filePath);
            if (!filePath.includes('chunk')) {
                this.userComplexAudioMessages = [
                    ...this.userComplexAudioMessages,
                    new ComplexAudioObject([
                        this.userAudioMessages[this.userMessagesCount - 2],
                        this.userAudioMessages[this.userMessagesCount - 1],
                    ]),
                ];
            }
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
                const endIndex = this.echoAudioMessages.length - 1;
                const startIndex = endIndex - 1;
                let newComplexAudioObject = null;
                if (endIndex === 1) {
                    // it's the first message
                    newComplexAudioObject = new ComplexAudioObject([
                        this.echoAudioMessages[endIndex],
                    ]);
                } else if (endIndex % 2 === 1) {
                    newComplexAudioObject = new ComplexAudioObject([
                        this.echoAudioMessages[startIndex],
                        this.echoAudioMessages[endIndex],
                    ]);
                }
                if (newComplexAudioObject) {
                    this.echoComplexAudioMessages = [
                        ...this.echoComplexAudioMessages,
                        newComplexAudioObject,
                    ];
                }
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
                this.startRecording();
                break;

            case Turns.HOLD:
                break;
        }
    };

    cleanup = () => {
        this.audioManager.current.cleanup();
        this.webSocketManager.current.cleanup();
        DeviceEventEmitter.removeAllListeners(Events.TURNS_CHANGE);
    };

    getEchoMessagesCount() {
        return this.echoAudioMessages.length;
    }
}
