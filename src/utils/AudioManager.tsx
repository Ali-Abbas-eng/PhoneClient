import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import { DocumentDirectoryPath } from 'react-native-fs';
import Sound from 'react-native-sound';

export class AudioManagerAPI {
    private audioRecorderPlayer: AudioRecorderPlayer;
    private __isRecording: boolean;
    private __isPlaying: boolean;
    private onStopRecordingCallback: (
        filePath: string,
        completeResponse: boolean,
    ) => void;
    private audioSet: {
        AudioEncoderAndroid: AudioEncoderAndroidType;
        AVNumberOfChannelsKeyIOS: number;
        AVFormatIDKeyIOS: AVEncodingOption;
        AudioSourceAndroid: AudioSourceAndroidType;
        AVModeIOS: AVModeIOSOption;
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType;
    };
    private readonly audioCount: number;
    private __isStoppable: boolean;
    private readonly meteringEnabled: boolean;

    constructor() {
        this.meteringEnabled = false;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioCount = 0;
        this.__isStoppable = false;
        this.__isPlaying = false;
        this.__isRecording = false;
        this.onStopRecordingCallback = (_: string) => {};
        this.audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVModeIOS: AVModeIOSOption.measurement,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
    }

    registerOnStopRecordingCallback(
        functionality: (filePath: string, completeResopnse: boolean) => void,
    ) {
        this.onStopRecordingCallback = functionality;
    }

    generateAudioFilePaths() {
        const baseName = `${Math.floor(new Date().getTime() / 1000)}_${
            this.audioCount
        }`;
        const audioFiles = {
            full: `${DocumentDirectoryPath}/${baseName}.aac`,
            chunk: `${DocumentDirectoryPath}/${baseName}_chunk.mp3`,
        };
        return audioFiles;
    }

    async startRecording(
        MINIMUM_AUDIO_LENGTH: number,
        MAXIMUM_AUDIO_LENGTH: number,
        STAGING_AUDIO_LENGTH: number,
    ) {
        console.log('Started Recording...');
        const filePaths = this.generateAudioFilePaths();
        const filePath = filePaths.full;
        const stagingFilePath = filePaths.chunk;
        this.isRecordingSwitch();
        try {
            await this.audioRecorderPlayer.startRecorder(
                stagingFilePath,
                this.audioSet,
                this.meteringEnabled,
            );

            // Save a chunk of the recording after STAGING_AUDIO_LENGTH seconds
            setTimeout(async () => {
                if (this.__isRecording) {
                    await this.stopRecording(true);
                    await this.audioRecorderPlayer.startRecorder(
                        filePath,
                        this.audioSet,
                        this.meteringEnabled,
                    );
                }
            }, STAGING_AUDIO_LENGTH * 1000);

            // Allow user to stop recording after MINIMUM_AUDIO_LENGTH seconds
            setTimeout(() => {
                this.__isStoppable = true;
            }, MINIMUM_AUDIO_LENGTH * 1000);

            // Stop recording automatically after MAXIMUM_AUDIO_LENGTH seconds
            setTimeout(() => {
                if (this.__isRecording) {
                    this.stopRecording(false); // stop recording the original audio
                }
            }, MAXIMUM_AUDIO_LENGTH * 1000);
        } catch (error) {
            console.log('Uh-oh! Failed to start recording:', error);
            return {
                audioPath: '',
                stagingFilePath: '',
                error: error,
            };
        }
    }

    async stopRecording(isChunk: boolean) {
        if (this.isRecording() && (this.isStoppable() || isChunk)) {
            try {
                const fileURI = await this.audioRecorderPlayer.stopRecorder();
                this.onStopRecordingCallback(fileURI, !isChunk);
            } catch (error) {
                console.log('Oops! Failed to stop recording:', error);
            }
            if (!isChunk) {
                this.__isStoppable = false;
                this.__isRecording = false;
            }
        }
    }

    playSound(soundFile: string, callback: { (): void; (): void } | undefined) {
        this.isPlayingSwitch();
        let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                sound.play((success: boolean) => {
                    if (success) {
                        if (callback) {
                            callback();
                        }
                        console.log('successfully finished playing');
                    } else {
                        console.log(
                            'playback failed due to audio decoding errors',
                        );
                    }
                });
            }
        });
    }

    isStoppable() {
        return this.__isStoppable;
    }

    isRecording() {
        return this.__isRecording;
    }

    isRecordingSwitch() {
        this.__isRecording = !this.__isRecording;
    }
    isPlayingSwitch() {
        this.__isPlaying = !this.__isPlaying;
    }
}
