import { SET_WEBSOCKET, SET_ECHO_SESSION_MANAGER } from './actions';

const initialState = {
    webSocket: null,
    echoSessionManager: null,
};

const rootReducer = (
    state = initialState,
    action: { type: any; payload: any },
) => {
    console.log('action', action);
    switch (action.type) {
        case SET_WEBSOCKET:
            return { ...state, webSocket: action.payload };
        case SET_ECHO_SESSION_MANAGER:
            return { ...state, echoSessionManager: action.payload };
        default:
            return state;
    }
};


export default rootReducer;
