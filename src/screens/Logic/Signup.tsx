import { validatePassword } from '../../utils/informationValidators.tsx';
import axios from 'axios';
import { RegisterEndpoint } from '../../constants/constants.tsx';
import { __handleServerAccessError } from '../../utils/AccountsLogic.tsx';

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
