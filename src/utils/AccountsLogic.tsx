import axios from 'axios';
import { validatePassword } from './informationValidators.tsx';
import {
    LoginAPITokenEndpoint, RefreshTokenEndpoint,
    RegisterEndpoint,
} from '../constants/constants.tsx';
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

export const __removeTokens = async () => {
    try {
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');
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

export const __handleSignUp = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
) => {
    const validationMessage = validatePassword(password, confirmPassword);
    if (validationMessage !== 'SUCCESS') {
        __handleServerAccessError(validationMessage);
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
        return response.status === 204;
    } catch (error: unknown) {
        __handleServerAccessError(error);
        return false;
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

export const __refreshTokens = async () => {
    try {
        const { refresh: refreshToken } = await getTokens();
        const response = await axios.post(RefreshTokenEndpoint, {
            refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        await __removeTokens();
        await storeTokens(access, refresh);

        return true;
    } catch (error) {
        console.error(error);
        __handleServerAccessError(error);
        return false;
    }
};
