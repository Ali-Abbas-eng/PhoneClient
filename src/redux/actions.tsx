export const startRecording = () => {
    console.log('Action: START_RECORDING');
    return { type: 'START_RECORDING' };
};

export const stopRecording = () => {
    console.log('Action: STOP_RECORDING');
    return { type: 'STOP_RECORDING' };
};

export const setAudioPath = (path: any) => {
    console.log('Action: SET_AUDIO_PATH', path);
    return { type: 'SET_AUDIO_PATH', payload: path };
};

export const setEchoTurn = (echoTurn: boolean) => {
    console.log('Action: SET_ECHO_TURN', echoTurn);
    return { type: 'SET_ECHO_TURN', payload: echoTurn };
};

export const setWaitingForEchoResponse = (waiting: any) => {
    console.log('Action: SET_WAITING_FOR_ECHO_RESPONSE', waiting);
    return { type: 'SET_WAITING_FOR_ECHO_RESPONSE', payload: waiting };
};

export const addReceivedAudios = (audioPath: string) => {
    console.log('Action: ADD_AUDIO_TO_QUEUE', audioPath);
    return { type: 'ADD_AUDIO_TO_QUEUE', payload: audioPath };
}

export const removeReceivedAudio = (audioPath: string) => {
    console.log('Action: REMOVE_AUDIO_FROM_QUEUE', audioPath);
    return { type: 'REMOVE_AUDIO_FROM_QUEUE', payload: audioPath };
};
