import axios from 'axios';
import {validatePassword} from './informationValidators.tsx';
import {LoginEndpoint, RegisterEndpoint} from '../constants.tsx';
import {Alert} from 'react-native';

interface AxiosError {
  response?: {
    data: any;
    status: number;
    headers: any;
  };
  request?: any;
  message: string;
}

export const __handleLogIn = async (email: string, password: string) => {
  try {
    const data = {
      email: email,
      password: password,
    };
    console.log('Authentication JSON: ', data);
    console.log('Authentication URL : ', LoginEndpoint);
    const response = await axios.post(LoginEndpoint, data);
    if (response.status === 200) {
      console.log('Data: ', response.data);
      return {data: response.data};
    }
  } catch (error: unknown) {
    return {error: __handleServerAccessError(error)};
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
  let errorMessage = '';

  if (axiosError.response) {
    console.log(axiosError.response.data);
    console.log(axiosError.response.status);
    console.log(axiosError.response.headers);
    errorMessage = axiosError.response.data;
  } else if (axiosError.request) {
    console.log(axiosError.request);
    errorMessage = 'No response received from server.';
  } else {
    console.log('Error', axiosError.message);
    errorMessage = axiosError.message;
  }

  Alert.alert(
    'Error',
    errorMessage,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
  return errorMessage;
};
