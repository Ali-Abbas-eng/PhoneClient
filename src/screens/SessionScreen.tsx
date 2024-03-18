import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import { useEffect, useRef, useState } from 'react';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';

const audioOptions = {
    sampleRate: 44100,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'test.wav',
};

export function SessionScreen({ route }: SessionScreenProps) {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const [recording, setRecording] = useState(false);
    const { session } = route.params;
    const socketURL = SocketIP + session.socket_url;
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(socketURL);

        ws.current.onopen = () => {
            console.log('Socket is open.');
            console.log('WebSocket readyState: ', ws.current?.readyState);
            ws.current?.send(JSON.stringify({ start: 1 }));
            setSocketInitialised(true);
        };

        ws.current.onclose = (_: any) => {
            console.log('Socket is closed.');
            console.log('WebSocket readyState: ', ws.current?.readyState);
        };

        ws.current.onerror = (event: any) => {
            console.log(event.message);
            setSocketInitialised(false);
            console.log('WebSocket readyState: ', ws.current?.readyState);
        };

        ws.current.onmessage = async (event: any) => {
            console.log('Data: ', event.data);
            console.log('WebSocket readyState: ', ws.current?.readyState);
            let data = JSON.parse(event.data);
            if (data.audio) {
                let sound = new Sound(data.audio, '', error => {
                    if (error) {
                        console.log('failed to load the sound', error);
                    }
                });

                setTimeout(() => {
                    sound.play(success => {
                        if (!success) {
                            console.log('Sound did not play');
                        }
                    });
                }, 100);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [socketURL]);

    const startRecording = async () => {
        console.log('Starting recording..');
        AudioRecord.init(audioOptions);
        AudioRecord.start();
        setRecording(true);
    };

    const stopRecording = async () => {
        if (!recording) return;
        let audioFile = await AudioRecord.stop();
        console.log('Audio file stored at: ', audioFile);
        setRecording(false);
    };

    if (!socketInitialised) {
        // show a loading indicator while fetching the data
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Start Conversation" onPress={() => {}} />
            <Button title="Start Recording" onPress={startRecording} />
            <Button title="Stop Recording" onPress={stopRecording} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
