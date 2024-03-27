/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/UI/Home.tsx';
import { Signup } from './src/screens/UI/Signup.tsx';
import { Login } from './src/screens/UI/Login.tsx';
import { ScreenNames } from './src/constants/constants.tsx';
import { Profile } from './src/screens/UI/Profile.tsx';
import { Session } from './src/screens/UI/Session.tsx';
import { Setups } from './src/screens/UI/Setups.tsx';
import { RootStackParamList } from './src/constants/types.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
