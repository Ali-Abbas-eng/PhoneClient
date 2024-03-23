import { Platform, ToastAndroid } from 'react-native';

export function notifyMessage(msg: string | null) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg ? msg : '', ToastAndroid.SHORT);
    } else {
    }
}

export function validatePassword(password: String, confirmPassword: String) {
    let validation_message = '';
    if (password.length < 8) {
        validation_message += 'Password must be at least 8 characters\n';
    }
    if (password !== confirmPassword) {
        validation_message += "Passwords didn't match";
    }
    return validation_message.length === 0 ? 'SUCCESS' : validation_message;
}
