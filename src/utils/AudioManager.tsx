import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
import ReactNativeFileSystem from 'react-native-fs';
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
            'duration in seconds: ' +
                sound.getDuration() +
                'number of channels: ' +
                sound.getNumberOfChannels(),
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

export const getSoundData = async (audioFilePath: string) => {
    // Read the audio file's content as binary data
    let result = await readFile(audioFilePath, 'base64');
    console.log('Playing from: ', result);
    playSound(audioFilePath);
    console.log('Done Playing...');
    return Buffer.from(result, 'base64');
};

export const startRecording = async () => {
    const path = `${ReactNativeFileSystem.DocumentDirectoryPath}/buffer.mp3`;
    const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    try {
        const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
        audioRecorderPlayer.addRecordBackListener((_: any) => {
            return;
        });
        console.log(`Recording started at path: ${uri}`);
        playSound(uri);
        return { recording: true, filePath: uri };
    } catch (error: any) {
        console.error('Failed to start recording: ', error);
        return { recording: false, error: error.message };
    }
};

export const stopRecording = async () => {
    return {
        filePath: `${ReactNativeFileSystem.DocumentDirectoryPath}/buffer.mp3`,
        recording: false,
    };
};
