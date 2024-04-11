import { AudioManagerAPI } from './AudioManager.tsx';
import { WebSocketManager } from './WebSocketManager.tsx';
import { DocumentDirectoryPath } from 'react-native-fs';
import { downloadFile } from './FileManager.tsx';
import { EchoResponse } from '../constants/types.tsx';

export class EchoSessionManager {
    private audioManager: AudioManagerAPI;
    public webSocketManager: WebSocketManager;
    private sessionInitialised: boolean;
    private echoAudioMessages: string[];
    private echoMessagesTranscripts: string[];
    private userAudioMessages: string[];
    private userMessagesTranscripts: string[];
    private echoMessagesCount: number;
    private userMessagesCount: number;
    private readonly chatMessagesLimit: number;
    private echoTurn: boolean;
    private readonly minimumMessageLength: number;
    private readonly maximumMessageLength: number;
    private readonly chunkMessageLength: number;
    public isAudioRecordSendable: boolean;

    constructor(
        socketURL: string,
        messageCountLimit: number,
        minimumMessageLength: number,
        maximumMessageLength: number,
        chunkMessageLength: number,
    ) {
        this.audioManager = new AudioManagerAPI();
        this.webSocketManager = new WebSocketManager(socketURL);
        this.sessionInitialised = false;
        this.echoMessagesCount = 0;
        this.userMessagesCount = 0;
        this.echoAudioMessages = [];
        this.userAudioMessages = [];
        this.echoMessagesTranscripts = [];
        this.userMessagesTranscripts = [];
        this.chatMessagesLimit = messageCountLimit;
        this.echoTurn = true;
        this.minimumMessageLength = minimumMessageLength;
        this.maximumMessageLength = maximumMessageLength;
        this.chunkMessageLength = chunkMessageLength;
        this.isAudioRecordSendable = false;

        // Bind the context
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.onMessageRecorded = this.onMessageRecorded.bind(this);

        // Register callbacks
        this.audioManager.registerOnStopRecordingCallback(
            this.onMessageRecorded,
        );
        this.webSocketManager.initialiseWebSocket(this.onMessageReceived);
    }

    __generateAudioFileName(author: string) {
        const baseName = `${Math.floor(new Date().getTime() / 1000)}_${author}.mp3`;
        return `${DocumentDirectoryPath}/${baseName}`;
    }

    async onMessageReceived(data: EchoResponse) {
        try {
            let filePath = this.__generateAudioFileName('echo');
            await downloadFile(data.audio, filePath);
            this.echoAudioMessages.push(filePath);
            this.echoMessagesTranscripts.push(data.response_text);
            this.userMessagesTranscripts.push(data.answer_text); // User's previous response transcript.
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async onMessageRecorded(filePath: string, completeResponse: boolean) {
        await this.webSocketManager.sendAudio(filePath);
        this.userAudioMessages.push(filePath);
        this.echoTurn = completeResponse; // if both parts of the audio were sent (it's now echo's turn)
        ++this.userMessagesCount;
    }

    async converse() {
        this.webSocketManager.startConversation();
        while (this.userMessagesCount < this.chatMessagesLimit) {
            // Define behaviour on echo's turn
            if (this.echoTurn) {
                let completeResponse = false;
                let message = this.echoAudioMessages[this.echoMessagesCount];
                if (message) {
                    await this.audioManager.playSound(message);
                    if (completeResponse || !this.sessionInitialised) {
                        // if complete response flag is met, then echo said what it said, switch turns.
                        this.echoTurn = false;
                    } else {
                        // if complete response flag is false, then the audio played is the first chunk
                        completeResponse = true;
                    }
                    if (!this.sessionInitialised) {
                        this.sessionInitialised = true;
                    }
                    ++this.echoMessagesCount;
                }
            } else {
                await this.audioManager.startRecording(
                    this.minimumMessageLength,
                    this.maximumMessageLength,
                    this.chunkMessageLength,
                );
                this.isAudioRecordSendable =
                    this.audioManager.isStoppable() && !this.echoTurn;
            }
        }
    }
}
