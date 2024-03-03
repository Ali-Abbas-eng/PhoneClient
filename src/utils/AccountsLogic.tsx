import axios from 'axios';
import {validatePassword} from './informationValidators.tsx';

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
    const response = await axios.post('http://10.0.2.2:8000/api/v1/login/', {
      email,
      password,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: unknown) {
    __handleServerAccessError(error);
  }
};

export const __handleSignUp = async (
  firstName: string,
  lastName: string,
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
    const response = await axios.post('http://10.0.2.2:8000/api/v1/register/', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      password1: password,
      password2: confirmPassword,
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error: unknown) {
    __handleServerAccessError(error);
  }
};

const __handleServerAccessError = (error: unknown) => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    console.log(axiosError.response.data);
    console.log(axiosError.response.status);
    console.log(axiosError.response.headers);
    throw new Error(axiosError.response.data);
  } else if (axiosError.request) {
    console.log(axiosError.request);
    throw new Error('No response received from server.');
  } else {
    console.log('Error', axiosError.message);
    throw new Error(axiosError.message);
  }
};
