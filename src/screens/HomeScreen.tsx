// screens/HomeScreen.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SelectSession} from '../components/Selector';
import {ControlButtons} from '../components/ControlButton';
import { ChatSocketURL, ProfileScreenName } from "../constants";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {createWebSocketConnection} from '../utils/WebSocketManager';
import {styles} from '../styles/styels.tsx';
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const [sessionType, setSessionType] = useState('general_english');
  const [isRecording, setIsRecording] = useState(false);
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<string[]>([]);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const navigation = useNavigation();
  const handleStart = () => {
    const socket = createWebSocketConnection(
      `${ChatSocketURL}${sessionType}`,
      setIsRecording,
      audioRecorderPlayer,
    );
    setChatSocket(socket);
    // @ts-ignore
    socket.send(JSON.stringify({message: 'hello'}));
  };

  const handleRecord = () => {
    audioRecorderPlayer.startRecorder().then((path: string) => {
      console.log(`started recorder at path: ${path}`);
      setIsRecording(true);
      setRecordedChunks(prevChunks => [...prevChunks, path]);
    });
  };

  const handleStop = () => {
    audioRecorderPlayer.stopRecorder().then(() => {
      console.log('stopped recording');
      setIsRecording(false);
    });
  };

  const handlePlay = () => {
    recordedChunks.forEach(path => {
      audioRecorderPlayer.startPlayer(path);
    });
  };

  return (
    <View>
      <Text>Hello, Welcome to Echo Speaking Partner</Text>
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          navigation.navigate(ProfileScreenName);
        }}
        style={[styles.button, styles.buttonOutline]}>
        <Text style={styles.buttonOutlineText}>Profile</Text>
      </TouchableOpacity>
      <SelectSession onValueChange={setSessionType} />
      <ControlButtons
        onStart={handleStart}
        onRecord={handleRecord}
        onStop={handleStop}
        onPlay={handlePlay}
        isRecording={isRecording}
      />
    </View>
  );
}
