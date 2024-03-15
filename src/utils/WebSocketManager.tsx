// utils/WebSocketManager.tsx
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// @ts-ignore
import WebSocket from 'react-native-websocket';

export function createWebSocketConnection(
  url: string,
  setIsRecording: (isRecording: boolean) => void,
  audioRecorderPlayer: AudioRecorderPlayer,
) {
  const socket = new WebSocket(url);
  console.log(socket);
  console.log(url);
  socket.onopen = function () {
    console.log('Open');
    socket.send(JSON.stringify({ start: 1 })); // Send an empty message
  };
  socket.onmessage = function (event: { data: string }) {
    let data = JSON.parse(event.data);
    console.log('Data: ', data);
    if (data.audio) {
      audioRecorderPlayer.startPlayer(data.audio);
    }
    setIsRecording(false);
  };
  socket.onerror = function (error: any) {
    console.log('WebSocket Error: ', error);
  };

  socket.onclose = function (event: any) {
    console.log('WebSocket Closed: ', event);
  };
  socket.forceUpdate();
  return socket;
}
