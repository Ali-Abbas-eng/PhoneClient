import axios from 'axios';
import { getTokens } from './AccountsLogic.tsx';
import { ServerEndpoint } from '../constants.tsx';

const api = axios.create({
    baseURL: ServerEndpoint,
});

api.interceptors.request.use(
    async config => {
        const { access } = await getTokens();
        config.headers.Authorization = `Bearer ${access}`;
        return config;
    },
    error => Promise.reject(error),
);

export default api;
