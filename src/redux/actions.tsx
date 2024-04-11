export const SET_WEBSOCKET = 'SET_WEBSOCKET';
export const SET_ECHO_SESSION_MANAGER = 'SET_ECHO_SESSION_MANAGER';

export const setWebSocket = (webSocket: any) => ({
    type: SET_WEBSOCKET,
    payload: webSocket,
});

export const setEchoSessionManager = (echoSessionManager: any) => ({
    type: SET_ECHO_SESSION_MANAGER,
    payload: echoSessionManager,
});
