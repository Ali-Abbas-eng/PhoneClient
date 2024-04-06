export const startRecording = () => ({
    type: 'START_RECORDING',
});

export const stopRecording = () => ({
    type: 'STOP_RECORDING',
});

export const setAudioPath = (path: any) => ({
    type: 'SET_AUDIO_PATH',
    payload: path,
});

export const setWaitingForEchoResponse = (waiting: any) => ({
    type: 'SET_WAITING_FOR_ECHO_RESPONSE',
    payload: waiting,
});
