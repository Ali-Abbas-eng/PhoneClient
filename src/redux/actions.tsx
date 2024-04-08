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

export const setEchoTurn = (echoTurn: boolean) => ({
    type: 'SET_ECHO_TURN',
    payload: echoTurn,
});

export const setWaitingForEchoResponse = (waiting: any) => ({
    type: 'SET_WAITING_FOR_ECHO_RESPONSE',
    payload: waiting,
});

export const addReceivedAudios = (audioPath: string) => ({
    type: 'ADD_AUDIO_TO_QUEUE',
    payload: audioPath,
})

export const removeReceivedAudio = (audioPath: string) => ({
    type: 'REMOVE_AUDIO_FROM_QUEUE',
    payload: audioPath,
});
