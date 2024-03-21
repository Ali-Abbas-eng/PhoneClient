import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { notifyMessage } from './informationValidators.tsx';

export async function requestAudioPermission() {
    let microphonePermissionStatus = await check(
        PERMISSIONS.ANDROID.RECORD_AUDIO,
    );

    if (microphonePermissionStatus === RESULTS.GRANTED) {
        console.log('The permission is granted');
        return true;
    } else if (microphonePermissionStatus === RESULTS.UNAVAILABLE) {
        console.log(
            'This feature is not available (on this device / in this context)',
        );
        return false;
    } else if (microphonePermissionStatus === RESULTS.BLOCKED) {
        console.log('The permission is denied and not requestable anymore');
        return false;
    } else if (microphonePermissionStatus === RESULTS.DENIED) {
        console.log(
            'The permission has not been requested / is denied but requestable',
        );
        let result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (result === RESULTS.GRANTED) {
            console.log('User granted the permission');
            return true;
        } else {
            console.log('User denied the permission');
            return false;
        }
    }
}
