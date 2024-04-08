const initialState = {
    isRecording: false,
    audioPath: '',
    waitingForEchoResponse: true,
    receivedAudios: [],
    echoTurn: false,
};

const rootReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case 'START_RECORDING':
            return { ...state, isRecording: true };
        case 'STOP_RECORDING':
            return { ...state, isRecording: false };
        case 'SET_AUDIO_PATH':
            return { ...state, audioPath: action.payload };
        case 'SET_WAITING_FOR_ECHO_RESPONSE':
            return { ...state, waitingForEchoResponse: action.payload };
        case 'ADD_AUDIO_TO_QUEUE':
            return { ...state, receivedAudios: [...state.receivedAudios, action.payload]}
        case 'REMOVE_AUDIO_FROM_QUEUE':
            return { ...state, receivedAudios: [...state.receivedAudios.slice(1)]}
        default:
            return state;
    }
};

export default rootReducer;
