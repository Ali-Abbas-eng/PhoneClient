import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {styles} from '../styles/styels.tsx';
import {ToastAndroid, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenName, RegisterScreenName} from '../constants.tsx';
import {__handleLogIn} from '../utils/AccountsLogic.tsx';
function notifyMessage(msg: string | null) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg ? msg : '', ToastAndroid.SHORT);
  } else {
  }
}

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const handleLogin = async () => {
    __handleLogIn(email, password)
      .then(() => {
        navigation.reset({
          index: 0,
          // @ts-ignore
          routes: [{name: HomeScreenName}],
        });
      })
      .catch(error => {
        notifyMessage(error.toString());
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        style={styles.logo}
        source={require('../../assets/app_logo.png')}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate(RegisterScreenName);
          }}
          style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
