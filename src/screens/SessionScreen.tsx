import { Button, View } from 'react-native';
import { LoginScreenName, SocketIP } from '../constants/constants.tsx';
import { SessionScreenProps } from '../constants/types.tsx';
import WebSocket from 'react-native-websocket';

export function SessionScreen({ route, navigation }: SessionScreenProps) {
    const { session } = route.params;
    const url = SocketIP + session.socket_url;
    const chatSocket = new WebSocket(url);
    chatSocket.onopen = function (_: any) {
        chatSocket.send(JSON.stringify({ start: 1 })); // Send an empty message
    };
    console.log('URL: ', url);
    chatSocket.onmessage = function (event: any) {
        let data = JSON.parse(event.data);
        console.log('Data: ', data);
    };
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="Start Conversation"
                onPress={() => {
                    navigation.navigate(LoginScreenName);
                }}
            />
            <Button
                title="Start Recording"
                onPress={() => {
                    console.log('Session: ', session);
                }}
            />
            <Button title="Stop Recording" onPress={() => {}} />
        </View>
    );
}
