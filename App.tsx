/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen.tsx';
import { RegisterScreen } from './src/screens/RegisterScreen.tsx';
import { LoginScreen } from './src/screens/LoginScreen.tsx';
import {
    HomeScreenName,
    LoginScreenName,
    ProfileScreenName,
    RegisterScreenName,
    SessionScreenName,
} from './src/constants/constants.tsx';
import { ProfileScreen } from './src/screens/ProfileScreen.tsx';
import { SessionScreen } from './src/screens/SessionScreen.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={HomeScreenName} component={HomeScreen} />
                <Stack.Screen name={LoginScreenName} component={LoginScreen} />
                <Stack.Screen
                    name={ProfileScreenName}
                    component={ProfileScreen}
                />
                <Stack.Screen
                    name={RegisterScreenName}
                    component={RegisterScreen}
                />
                <Stack.Screen
                    name={SessionScreenName}
                    component={SessionScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
