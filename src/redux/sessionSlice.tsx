import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
    webSocket: any;
    echoSessionManager: any;
}

const initialState: SessionState = {
    webSocket: null,
    echoSessionManager: null,
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setWebSocket: (state, action: PayloadAction<any>) => {
            state.webSocket = action.payload;
        },
        setEchoSessionManager: (state, action: PayloadAction<any>) => {
            state.echoSessionManager = action.payload;
        },
    },
});

export const { setWebSocket, setEchoSessionManager } = sessionSlice.actions;

export default sessionSlice.reducer;
