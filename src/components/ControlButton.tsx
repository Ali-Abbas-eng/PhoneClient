// ControlButtons.tsx
import React from 'react';
import { Button, View } from 'react-native';

interface ControlButtonsProps {
  onStart: () => void;
  onRecord: () => void;
  onStop: () => void;
  onPlay: () => void;
  isRecording: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onStart,
  onRecord,
  onStop,
  onPlay,
  isRecording,
}) => {
  return (
    <View>
      <Button title="Start Conversation" onPress={onStart} />
      <Button
        title="Start Recording"
        onPress={onRecord}
        disabled={!isRecording}
      />
      <Button title="Stop Recording" onPress={onStop} disabled={isRecording} />
      <Button title="Play Audio" onPress={onPlay} disabled={isRecording} />
    </View>
  );
};
