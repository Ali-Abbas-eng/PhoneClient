import { PermissionsAndroid } from 'react-native';

export async function requestAudioPermission() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
            title: 'Audio Recording Permission',
            message:
                'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }
    throw new Error('Audio Recording Permission DENIED');
}
