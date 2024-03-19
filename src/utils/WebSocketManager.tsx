// @ts-ignore
import WebSocket from 'react-native-websocket';
import { ServerEndpoint } from '../constants/constants.tsx';
import Sound from 'react-native-sound';
import { notifyMessage } from './informationValidators.tsx';
import React from 'react';
import AudioRecord from 'react-native-audio-record';

export const initialiseWebSocket = (
    webSocket: React.MutableRefObject<WebSocket | null>,
) => {
    if (!webSocket.current) return { initialised: false };
    let initialisedSuccessfully = true;

    webSocket.current.onopen = () => {
        console.log('Socket is open.');
        webSocket.current?.send(JSON.stringify({ start: 1 }));
        initialisedSuccessfully = true;
    };

    webSocket.current.onclose = () => {
        console.log('Socket is closed.');
    };

    webSocket.current.onerror = (event: any) => {
        console.log(event.message);
        initialisedSuccessfully = false;
    };

    webSocket.current.onmessage = (event: any) => {
        let data = JSON.parse(event.data);
        console.log('Data: ', data);
        if (data.audio) {
            let audio_final_url = ServerEndpoint + data.audio;
            let sound = new Sound(audio_final_url, '', error => {
                if (error) {
                    notifyMessage(error);
                    return;
                }
                sound.play(success => {
                    if (!success) {
                        console.log('Sound did not play');
                    }
                });
            });
        }
    };
    console.log(webSocket.current);
    console.log('Socket Status: ', webSocket.current?.state);
    return {
        initialised: initialisedSuccessfully,
    };
};

const audioOptions = {
    sampleRate: 44100,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'buffer.wav',
};
export const startRecording = async (recording: boolean) => {
    if (recording) {
        return true;
    }
    try {
        AudioRecord.init(audioOptions);
        AudioRecord.start();
        return true;
    } catch (error: any) {
        notifyMessage(error.toString());
        return false;
    }
};

export const stopRecording = async (recording: boolean) => {
    if (!recording) {
        return false;
    }
    return await AudioRecord.stop();
};
