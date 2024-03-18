import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { LoginScreenName, SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import { useEffect, useRef, useState } from 'react';

export function SessionScreen({ route, navigation }: SessionScreenProps) {
    const [socketInitialised, setSocketInitialised] = useState(false);
    const { session } = route.params;
    const socketURL = SocketIP + session.socket_url;
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(socketURL);

        ws.current.onopen = () => {
            console.log('Socket is open.');
            console.log('WebSocket readyState: ', ws.current?.readyState);
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

        ws.current.onmessage = (event: any) => {
            console.log('Data: ', event.data);
            console.log('WebSocket readyState: ', ws.current?.readyState);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [socketURL]);

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
            <Button
                title="Start Recording"
                onPress={() => {
                    navigation.navigate(LoginScreenName);
                }}
            />
            <Button title="Stop Recording" onPress={() => {}} />
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
