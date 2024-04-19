import api from '../../utils/APICaller.tsx';
import { GetSessionsListEndpoint } from '../../constants/constants.tsx';
import { Session } from '../../constants/types.tsx';
import {
    __refreshTokens,
    __tokenAuthentication,
} from '../../utils/AccountsLogic.tsx';

const __fetchSessions = async () => {
    let sessions: Record<string, Session[]> = { '': [] };
    try {
        const response = await api.get(GetSessionsListEndpoint);
        if (response) {
            sessions = response.data;
        }
    } catch (error) {
        console.error(error);
    }
    return sessions;
};

const __authenticate = async () => {
    return await __tokenAuthentication()
        .then(async verified => {
            let refreshed = false;
            if (!verified) {
                refreshed = await __refreshTokens();
            }
            await __refreshTokens();
            return verified || refreshed;
        })
        .catch(() => {
            return false;
        });
};

export const fillHomeScreenData = async () => {
    const authenticated = await __authenticate();
    let sessions: Record<string, Session[]> = { '': [] };
    if (authenticated) {
        sessions = await __fetchSessions();
    }
    return {
        authenticated: authenticated,
        sessions: sessions,
    };
};
