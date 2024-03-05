// App.tsx
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {SelectSession} from '../components/Selector';
import {ControlButtons} from '../components/ControlButton';
import { ChatSocketURL, SocketEndpoint } from "../constants";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// @ts-ignore
import WebSocket from 'react-native-websocket';

export function HomeScreen() {
  const [sessionType, setSessionType] = useState('general_english');
  const [isRecording, setIsRecording] = useState(false);
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<string[]>([]);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  useEffect(() => {
    // TODO: Initialize WebSocket and AudioRecorderPlayer here
  }, []);

  const handleStart = () => {
    // TODO: Handle start conversation
    const socket = new WebSocket(`${ChatSocketURL}${sessionType}`);
    console.log(`${ChatSocketURL}${sessionType}`);
    socket.onopen = function (event) {
      socket.send(JSON.stringify({start: 1})); // Send an empty message
    };
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      console.log('Data: ', data);
      if (data.audio) {
        audioRecorderPlayer.startPlayer(data.audio);
      }
      setIsRecording(false);
    };
    setChatSocket(socket);
  };

  const handleRecord = () => {
    // TODO: Handle start recording
    audioRecorderPlayer.startRecorder().then((path: string) => {
      console.log(`started recorder at path: ${path}`);
      setIsRecording(true);
      setRecordedChunks(prevChunks => [...prevChunks, path]);
    });
  };

  const handleStop = () => {
    // TODO: Handle stop recording
    audioRecorderPlayer.stopRecorder().then(() => {
      console.log('stopped recording');
      setIsRecording(false);
    });
  };

  const handlePlay = () => {
    // TODO: Handle play audio
    recordedChunks.forEach(path => {
      audioRecorderPlayer.startPlayer(path);
    });
  };

  return (
    <View>
      <Text>Hello, Welcome to Echo Speaking Partner</Text>
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
