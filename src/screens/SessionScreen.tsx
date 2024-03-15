import { Button, View } from 'react-native';
export function SessionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Conversation" onPress={() => {}} />
      <Button title="Start Recording" onPress={() => {}} />
      <Button title="Stop Recording" onPress={() => {}} />
    </View>
  );
}
