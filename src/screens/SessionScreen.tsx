// screens/SessionScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// the only available solution for the typescript error now is ignoring
// @ts-ignore
import WebSocket, {MessageEvent} from 'react-native-websocket';
import {RouteProp} from '@react-navigation/native';
import {Session} from './HomeScreen';

// define the type of the route prop
type SessionScreenRouteProp = RouteProp<
  // the first argument is an object that maps the name of each screen to the parameters it can receive
  {
    Home: undefined; // the home screen does not receive any parameters
    Session: {session: Session}; // the session screen receives a session object as a parameter
  },
  'Session' // the second argument is the name of the current screen
>;

// define the type of the props for the SessionScreen component
type SessionScreenProps = {
  route: SessionScreenRouteProp; // the route prop is of type SessionScreenRouteProp
};
export function SessionScreen({route}: SessionScreenProps) {
  // route.params.session is the session object passed from the home screen
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState(null);
  console.log(socket);
  useEffect(() => {
    // create a websocket instance with the socket_url
    const ws = new WebSocket(route.params.session.socket_url);
    setSocket(ws);
    // handle the websocket events
    ws.onopen = () => {
      // connection opened
      console.log('connected');
    };
    ws.onmessage = (e: MessageEvent) => {
      // a message received
      console.log('message', e.data);
      // add the message to the state
      setMessages(prev => [...prev, e.data]);
    };
    ws.onerror = (e: MessageEvent) => {
      // an error occurred
      console.error(e.message);
    };
    ws.onclose = (e: MessageEvent) => {
      // connection closed
      console.log('disconnected', e.code, e.reason);
    };
  }, [route.params.session.socket_url]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.session.name}</Text>
      <View style={styles.messages}>
        {messages.map((message, index) => (
          // render each message as a text
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    margin: 10,
  },
  messages: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    overflow: 'scroll',
  },
  message: {
    fontSize: 16,
    color: '#000',
    margin: 5,
  },
});
