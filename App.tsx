/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/Home.tsx';
import { Signup } from './src/screens/Signup.tsx';
import { Login } from './src/screens/Login.tsx';
import {
    HomeScreenName,
    LoginScreenName,
    ProfileScreenName,
    RegisterScreenName,
    ScenariosScreenName,
    ScreenNames,
    SessionScreenName,
} from './src/constants/constants.tsx';
import { Profile } from './src/screens/Profile.tsx';
import { Session } from './src/screens/Session.tsx';
import { Setups } from './src/screens/Setups.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={ScreenNames.Home} component={Home} />
                <Stack.Screen name={ScreenNames.Setups} component={Setups} />
                <Stack.Screen name={ScreenNames.Login} component={Login} />
                <Stack.Screen name={ScreenNames.Profile} component={Profile} />
                <Stack.Screen name={ScreenNames.Signup} component={Signup} />
                <Stack.Screen name={ScreenNames.Session} component={Session} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
