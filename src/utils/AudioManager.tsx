import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import { DocumentDirectoryPath, downloadFile } from 'react-native-fs';
import Sound from 'react-native-sound';

export class AudioManagerAPI {
    private audioRecorderPlayer: AudioRecorderPlayer;
    private __isRecording: boolean;
    private __isPlaying: boolean;
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
        this.audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVModeIOS: AVModeIOSOption.measurement,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
    }

    generateAudioFilePaths() {
        const baseName = `${Math.floor(new Date().getTime() / 1000)}_${
            this.audioCount
        }`;
        const audioFiles = {
            full: `${DocumentDirectoryPath}/${baseName}.aac`,
            chunk: `${DocumentDirectoryPath}/${baseName}_chunk.aac`,
        };
        return audioFiles;
    }

    async startRecording(
        MINIMUM_AUDIO_LENGTH: number,
        MAXIMUM_AUDIO_LENGTH: number,
    ) {
        console.log('Started Recording...');
        const filePath = this.generateAudioFilePaths().full;
        this.isRecordingSwitch();
        try {
            const uri = await this.audioRecorderPlayer.startRecorder(
                filePath,
                this.audioSet,
                this.meteringEnabled,
            );

            // Allow user to stop recording after MINIMUM_AUDIO_LENGTH seconds
            setTimeout(() => {
                this.__isStoppable = true;
            }, MINIMUM_AUDIO_LENGTH * 1000);

            // Stop recording automatically after MAXIMUM_AUDIO_LENGTH seconds
            setTimeout(() => {
                if (this.__isRecording) {
                    this.stopRecording();
                }
            }, MAXIMUM_AUDIO_LENGTH * 1000);

            return { isRecording: true, audioPath: uri };
        } catch (error) {
            console.log('Uh-oh! Failed to start recording:', error);
            return { isRecording: false, audioPath: '', error: error };
        }
    }

    async stopRecording() {
        if (this.isRecording() && this.isStoppable()) {
            try {
                await this.audioRecorderPlayer.stopRecorder();
                console.log('Stopped Recording!');
            } catch (error) {
                console.log('Oops! Failed to stop recording:', error);
            }
            this.isRecordingSwitch();
            this.isStoppableSwitch();
        }
    }

    async playSound(soundFile: string) {
        this.isPlayingSwitch();
        let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                sound.play((success: boolean) => {
                    if (success) {
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
    isStoppableSwitch() {
        this.__isStoppable = !this.__isStoppable;
    }

    isRecording() {
        return this.__isRecording;
    }

    isRecordingSwitch() {
        this.__isRecording = !this.__isRecording;
    }

    isPlaying() {
        return this.__isPlaying;
    }
    isPlayingSwitch() {
        this.__isPlaying = !this.__isPlaying;
    }
}
