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
    private __audioBuffer: string[];
    private onStopRecordingCallback: (filePath: string) => void;
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
        this.__audioBuffer = [];
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

    registerOnStopRecordingCallback(functionality: (filePath: string) => void) {
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

    startRecording(
        MINIMUM_AUDIO_LENGTH: number,
        MAXIMUM_AUDIO_LENGTH: number,
        STAGING_AUDIO_LENGTH: number,
    ) {
        const filePaths = this.generateAudioFilePaths();
        const filePath = filePaths.full;
        const stagingFilePath = filePaths.chunk;
        this.isRecordingSwitch();
        try {
            this.audioRecorderPlayer.startRecorder(
                stagingFilePath,
                this.audioSet,
                this.meteringEnabled,
            );

            // Save a chunk of the recording after STAGING_AUDIO_LENGTH seconds
            setTimeout(async () => {
                if (this.__isRecording) {
                    this.stopRecording(true);
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
            return {
                audioPath: '',
                stagingFilePath: '',
                error: error,
            };
        }
    }

    stopRecording(isChunk: boolean) {
        if (this.isRecording() && (this.isStoppable() || isChunk)) {
            try {
                this.audioRecorderPlayer
                    .stopRecorder()
                    .then((fileURI: string) => {
                        this.onStopRecordingCallback(fileURI);
                        this.__audioBuffer.push(fileURI);
                        this.audioRecorderPlayer.removeRecordBackListener();
                    });
            } catch (error) {}
            if (!isChunk) {
                this.__isStoppable = false;
                this.__isRecording = false;
                return new ComplexAudioObject(this.__audioBuffer);
            }
        }
        return;
    }

    playSound(soundFile: string, callback: { (): void; (): void } | undefined) {
        this.isPlayingSwitch();
        let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
            } else {
                sound.play((success: boolean) => {
                    if (success) {
                        if (callback) {
                            callback();
                        }
                    } else {
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

    cleanup() {
        this.audioRecorderPlayer.removeRecordBackListener();
        this.audioRecorderPlayer.removePlayBackListener();
    }
}

export class ComplexAudioObject {
    private audioFiles: any;
    private totalDuration: number;
    private currentFileIndex: number;
    private isPlaying: boolean;
    private soundObjects: any;
    constructor(audioFiles: string[]) {
        this.audioFiles = audioFiles; // Array of audio file paths
        this.totalDuration = 0; // Total duration of all audio files
        this.currentFileIndex = 0; // Index of the current audio file being played
        this.isPlaying = false; // Is audio currently playing

        // Initialize Sound objects for each audio file and calculate total duration
        this.soundObjects = this.audioFiles.map((filePath: string) => {
            let sound = new Sound(filePath, '', error => {
                if (error) {
                    console.log('Failed to load the sound', error);
                    return;
                }
                // Update total duration
                this.totalDuration += sound.getDuration();
            });
            return sound;
        });
    }

    // Play function to play the audio files consecutively
    play() {
        if (this.currentFileIndex < this.soundObjects.length) {
            this.isPlaying = true;
            let sound = this.soundObjects[this.currentFileIndex];
            sound.play((success: boolean) => {
                if (success) {
                    console.log(
                        `Finished playing ${
                            this.audioFiles[this.currentFileIndex]
                        }`,
                    );
                    this.currentFileIndex++;
                    this.play(); // Play the next audio file
                } else {
                    console.log('Playback failed due to audio decoding errors');
                }
            });
        } else {
            console.log('Finished playing all audio files');
            this.isPlaying = false;
            this.currentFileIndex = 0; // Reset the index if you want to replay the list later
        }
    }

    // Function to stop the audio playback
    stop() {
        if (this.isPlaying) {
            let sound = this.soundObjects[this.currentFileIndex];
            sound.stop(() => {
                console.log('Playback stopped');
                this.isPlaying = false;
                this.currentFileIndex = 0; // Reset the index
            });
        }
    }

    // Function to get the total duration of the audio list
    getDuration() {
        return this.totalDuration;
    }
}
