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
    private audioChunkRecorderPlayer: AudioRecorderPlayer;
    private __isRecording: boolean;
    private __isRecordingChunk: boolean;
    private audioSet: {
        AudioEncoderAndroid: AudioEncoderAndroidType;
        AVNumberOfChannelsKeyIOS: number;
        AVFormatIDKeyIOS: AVEncodingOption;
        AudioSourceAndroid: AudioSourceAndroidType;
        AVModeIOS: AVModeIOSOption;
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType
    };
    private audioCount: number;
    private __isStoppable: boolean;
    private meteringEnabled: boolean;

    constructor() {
        this.meteringEnabled = false;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioChunkRecorderPlayer = new AudioRecorderPlayer();
        this.__isRecording = false;
        this.audioCount = 0;
        this.__isRecordingChunk = false;
        this.audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVModeIOS: AVModeIOSOption.measurement,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        this.__isStoppable = false;
    }

    generateAudioFilePaths() {
        const baseName = `${Math.floor(new Date().getTime() / 1000)}_${this.audioCount}`;
        const audioFiles = {
            full: `${DocumentDirectoryPath}/${baseName}.aac`,
            chunk: `${DocumentDirectoryPath}/${baseName}_chunk.aac`,
        }
        return audioFiles;
    }

    async audioRecordInference(MINIMUM_AUDIO_LENGTH: number,
                               MAXIMUM_AUDIO_LENGTH: number,
                               AUDIO_CHUNK_LENGTH: number | null) {
        this.__isRecording = true;
        let result;
        if (AUDIO_CHUNK_LENGTH){
            // We are recording a chunk so that we can get a fast response
            result = await this.startChunkRecording(AUDIO_CHUNK_LENGTH);
        } else {
            // We are recording the full audio
            result = await this.startFullRecording(MINIMUM_AUDIO_LENGTH, MAXIMUM_AUDIO_LENGTH);
        }
        return result;
    }

    // Function to start recording a chunk of audio
    async startChunkRecording(chunkLength: number){
        console.log('Starting chunk recording...');
        const filePath = this.generateAudioFilePaths()["chunk"]
        try {
            const uri = await this.audioChunkRecorderPlayer.startRecorder(
                filePath,
                this.audioSet,
                this.meteringEnabled,
            );
            this.__isRecordingChunk = true;

            // Stop recording after chunkLength seconds
            setTimeout(() => {
                if (this.__isRecordingChunk) {
                    console.log('Stopping chunk recording...');
                    this.audioChunkRecorderPlayer.stopRecorder();
                    this.__isRecordingChunk = false;
                }
            }, chunkLength * 1000);

            console.log('Chunk recording started successfully');
            return { isRecordingChunk: true, audioPath: uri };
        } catch (error) {
            console.log('Failed to start chunk recording:', error);
            return { isRecordingChunk: false, audioPath: '', error: error };
        }
    }

    async startFullRecording(MINIMUM_AUDIO_LENGTH: number, MAXIMUM_AUDIO_LENGTH: number){
        console.log('Started Recording...')
        const filePath = this.generateAudioFilePaths()["full"]
        try {
            const uri = await this.audioRecorderPlayer.startRecorder(
                filePath,
                this.audioSet,
                this.meteringEnabled,
            );
            this.__isRecording = true;

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
        if (this.__isRecording && this.isStoppable()) {
            try {
                await this.audioRecorderPlayer.stopRecorder();
                console.log('Stopped Recording!')
                this.__isRecording = false;
                this.__isStoppable = false;
            } catch (error) {
                console.log('Oops! Failed to stop recording:', error);
            }
        }
    }

    playSound(soundFile: string) {
        let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                sound.play((success: boolean) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        });
    }

    isStoppable(){
        return this.__isStoppable;
    }

    isRecording() {
        return this.__isRecording;
    }

    isRecordingChunk(){
        return this.__isRecordingChunk
    }

    isRecordingSwitch(){
        this.__isRecording = !this.__isRecording;
    }

    isRecordingChunkSwitch() {
        this.__isRecordingChunk = !this.__isRecordingChunk;
    }
}

