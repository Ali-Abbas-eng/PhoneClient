import {
    check,
    Permission,
    PERMISSIONS,
    request,
    RESULTS,
} from 'react-native-permissions';

export async function __requestPermissions(resource: Permission) {
    let status = await check(resource);
    if (status === RESULTS.GRANTED) {
        return true;
    } else if (status === RESULTS.UNAVAILABLE) {
        return false;
    } else if (status === RESULTS.BLOCKED) {
        return false;
    } else if (status === RESULTS.DENIED) {
        let result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (result === RESULTS.GRANTED) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

export const requestPermissions = async (resources: Array<Permission>) => {
    if (!Array.isArray(resources)) {
        resources = [resources];
    }
    let permissionGrantStatusArray: Promise<boolean>[] = resources.map(
        async (resource: Permission) => {
            try {
                return await __requestPermissions(resource);
            } catch (_) {
                return false;
            }
        },
    );
    const results: boolean[] = await Promise.all(permissionGrantStatusArray);
    return results.every((result: boolean) => result);
};
