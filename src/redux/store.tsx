import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {};

const store = configureStore({
    // @ts-ignore
    reducer: rootReducer,
    preloadedState: initialState,
});

export default store;
