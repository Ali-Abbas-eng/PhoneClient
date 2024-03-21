import {
    check,
    PERMISSIONS,
    RESULTS,
    request,
    Permission,
} from 'react-native-permissions';

export async function requestPermissions(resource: Permission) {
    let status = await check(resource);
    if (status === RESULTS.GRANTED) {
        console.log('The permission is granted');
        return true;
    } else if (status === RESULTS.UNAVAILABLE) {
        console.log(
            'This feature is not available (on this device / in this context)',
        );
        return false;
    } else if (status === RESULTS.BLOCKED) {
        console.log('The permission is denied and not requestable anymore');
        return false;
    } else if (status === RESULTS.DENIED) {
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
    return false;
}
