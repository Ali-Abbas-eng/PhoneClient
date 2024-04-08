export const startRecording = () => {
    return { type: 'START_RECORDING' };
};

export const stopRecording = () => {
    return { type: 'STOP_RECORDING' };
};

export const setAudioPath = (path: any) => {
    return { type: 'SET_AUDIO_PATH', payload: path };
};

export const setEchoTurn = (echoTurn: boolean) => {
    return { type: 'SET_ECHO_TURN', payload: echoTurn };
};

export const setWaitingForEchoResponse = (waiting: any) => {
    return { type: 'SET_WAITING_FOR_ECHO_RESPONSE', payload: waiting };
};

export const addReceivedAudios = (audioPath: string) => {
    return { type: 'ADD_AUDIO_TO_QUEUE', payload: audioPath };
};

export const removeReceivedAudio = (audioPath: string) => {
    return { type: 'REMOVE_AUDIO_FROM_QUEUE', payload: audioPath };
};
