import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from 'react-native';
import { styles } from '../styles/styels.tsx';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenName, RegisterScreenName } from '../constants.tsx';
import { __handleLogin } from '../utils/AccountsLogic.tsx';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        const result = await __handleLogin(email, password);
        if (result.access_granted) {
            // Use the tokens in your API calls
            navigation.reset({
                index: 0,
                // @ts-ignore
                routes: [{ name: HomeScreenName }],
            });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image
                style={styles.logo}
                source={require('../../assets/logo_no_background.png')}
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
