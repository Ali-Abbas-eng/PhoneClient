import { createStore } from 'redux';
import rootReducer from './reducers';
import {configureStore} from "@reduxjs/toolkit";

const initialState = {
    isRecording: false,
    audioPath: '',
    waitingForEchoResponse: true,
    receivedAudios: [],
    echoTurn: true,
};

const store = configureStore({
    // @ts-ignore
    reducer: rootReducer,
    preloadedState: initialState
});

console.log('Store created: ', store.getState());

export default store;
