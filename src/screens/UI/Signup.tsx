import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { styles } from '../../styles/styels.tsx';
import { LoginScreenName, ScreenNames } from '../../constants/constants.tsx';
import {
    __handleServerAccessError,
    __removeTokens,
} from '../../utils/AccountsLogic.tsx';
import { useNavigation } from '@react-navigation/native';
import { __handleSignUp } from '../Logic/Signup.tsx';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();

    const handleSignUp = async () => {
        await __removeTokens();
        __handleSignUp(
            name,
            email,
            password,
            confirmPassword,
            phoneNumber,
        ).then((response: any) => {
            console.log(`Response from __handleSignUp was: ${response}`);
            if (response) {
                navigation.reset({
                    index: 0,
                    // @ts-ignore
                    routes: [{ name: ScreenNames.Home }],
                });
            }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image
                style={styles.logo}
                source={require('../../../assets/logo_no_background.png')}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="First Name"
                    value={name}
                    onChangeText={text => {
                        setName(text);
                    }}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => {
                        setEmail(text);
                    }}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Phone"
                    value={phoneNumber}
                    onChangeText={text => {
                        setPhoneNumber(text);
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

                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={text => {
                        setConfirmPassword(text);
                    }}
                    style={styles.input}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button]}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        // @ts-ignore
                        navigation.navigate(LoginScreenName);
                    }}
                    style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};
