import axios from 'axios';
import { validatePassword } from './informationValidators.tsx';
import {
    LoginAPITokenEndpoint,
    RegisterEndpoint,
    ServerEndpoint,
} from '../constants.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AxiosError {
    response?: {
        data: any;
        status: number;
        headers: any;
    };
    request?: any;
    message: string;
}

export const storeTokens = async (access: string, refresh: string) => {
    try {
        await AsyncStorage.setItem('access', access);
        await AsyncStorage.setItem('refresh', refresh);
    } catch (error) {
        console.error(error);
    }
};

export const getTokens = async () => {
    try {
        const access = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');
        return { access, refresh };
    } catch (error) {
        console.error(error);
        return { access: '', refresh: '' };
    }
};

export const __tokenAuthentication = async () => {
    // Try to get the tokens from AsyncStorage
    const tokens = await getTokens();

    // If the tokens exist, return them
    return !!(tokens.access && tokens.refresh);
};
export const __handleLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(LoginAPITokenEndpoint, {
            username: email,
            password: password,
        });
        // Save the tokens in your state or in AsyncStorage
        const { access, refresh } = response.data;
        await storeTokens(access, refresh);
        return { access_granted: true };
    } catch (error) {
        return {
            access_granted: true,
            error: __handleServerAccessError(error),
        };
    }
};

export const __handleSignUp = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
) => {
    const validationMessage = validatePassword(password, confirmPassword);
    if (validationMessage !== 'SUCCESS') {
        throw new Error(validationMessage);
    }

    try {
        const response = await axios.post(RegisterEndpoint, {
            first_name: name,
            last_name: name,
            email: email,
            phone_number: phoneNumber,
            password1: password,
            password2: confirmPassword,
        });

        if (response.status === 201) {
            return response.data;
        }
        return false;
    } catch (error: unknown) {
        __handleServerAccessError(error);
    }
};

export const __handleServerAccessError = (error: unknown) => {
    const axiosError = error as AxiosError;
    let errorMessage;

    if (axiosError.response) {
        errorMessage = axiosError.response.data;
    } else if (axiosError.request) {
        errorMessage = 'No response received from server.';
    } else {
        errorMessage = axiosError.message;
    }

    Alert.alert(
        'Error',
        errorMessage.hasOwnProperty('detail')
            ? errorMessage.detail
            : 'Unknown Error',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
    );
    return errorMessage;
};
