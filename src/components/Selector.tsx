// SelectSession.tsx
import React from 'react';
import { Picker } from '@react-native-picker/picker';

interface SelectSessionProps {
  onValueChange: (itemValue: string, itemIndex: number) => void;
}

export const SelectSession: React.FC<SelectSessionProps> = ({
  onValueChange,
}) => {
  return (
    <Picker onValueChange={onValueChange}>
      <Picker.Item label="General English" value="general_english" />
      <Picker.Item label="IELTS" value="ielts" />
      <Picker.Item label="General German" value="general_german" />
    </Picker>
  );
};
