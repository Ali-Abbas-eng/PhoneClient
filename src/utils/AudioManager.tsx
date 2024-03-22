import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AVModeIOSOption,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
import { DocumentDirectoryPath } from 'react-native-fs';
import { readFile } from 'react-native-fs';
const Sound = require('react-native-sound');
export const playSound = (soundFile: string) => {
    let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        // loaded successfully
        console.log(
            `Duration in Seconds: ${sound.getDuration()}
             Number of Channels: ${sound.getNumberOfChannels()}`,
        );

        // Play the sound with an onEnd callback
        sound.play((success: boolean) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    });
};

const generateAudioName = () => {
    return `${Math.floor(new Date().getTime() / 1000)}`;
};

export const startRecording = async () => {
    const path = `${DocumentDirectoryPath}/${generateAudioName()}.aac`;
    const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const meteringEnabled = false;

    try {
        const uri = await audioRecorderPlayer.startRecorder(
            path,
            audioSet,
            meteringEnabled,
        );
        return { isRecording: true, audioPath: uri };
    } catch (error) {
        console.log('Uh-oh! Failed to start recording:', error);
        return { isRecording: false, audioPath: '', error: error };
    }
};

export const stopRecording = async (isRecording: boolean) => {
    if (isRecording) {
        try {
            await audioRecorderPlayer.stopRecorder();
            return { isRecording: false };
        } catch (error) {
            console.log('Oops! Failed to stop recording:', error);
            return { isRecording: isRecording, error: error };
        }
    } else {
        console.log('Not Recording to being with');
        return { isRecording };
    }
};
