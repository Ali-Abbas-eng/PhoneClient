import api from '../../utils/APICaller.tsx';
import { LoginAPITokenEndpoint } from '../../constants/constants.tsx';
import {
    __handleServerAccessError,
    __removeTokens,
    storeTokens,
} from '../../utils/AccountsLogic.tsx';

export const __handleLogin = async (email: string, password: string) => {
    try {
        const response = await api.post(LoginAPITokenEndpoint, {
            username: email,
            password: password,
        });
        // Save the tokens in your state or in AsyncStorage
        const { access, refresh } = response.data;
        await __removeTokens();
        await storeTokens(access, refresh);
        return true;
    } catch (error) {
        __handleServerAccessError(error);
        return false;
    }
};
