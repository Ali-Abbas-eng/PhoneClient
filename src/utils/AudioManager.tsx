import { notifyMessage } from './informationValidators.tsx';
import { readFile } from 'react-native-fs';
// Import the react-native-sound module
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

export const startRecording = async (recording: boolean) => {
    if (recording) {
        return true;
    }
    try {
        console.log('Recording...');
        let sound = new Sound('buffer.mp4', Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            sound.record();
        });
        return true;
    } catch (error: any) {
        notifyMessage(error.toString());
        return false;
    }
};

export const stopRecording = async (recording: boolean) => {
    if (!recording) {
        return false;
    }
    console.log('Done recording...');
    let sound = new Sound('buffer.mp4', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        sound.stop();
    });
    return true;
};

export const getSoundData = async (audioFilePath: string) => {
    // Read the audio file's content as binary data
    let result = await readFile(audioFilePath, 'base64');
    console.log('Playing from: ', result);
    playSound(audioFilePath);
    console.log('Done Playing...');
    return Buffer.from(result, 'base64');
};
