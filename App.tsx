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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import store from './src/redux/store.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === ScreenNames.Home) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === ScreenNames.Profile) {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    // You can return any component that you like here!
                    return (
                        <Ionicons
                            name={iconName || ''}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen
                name={ScreenNames.Home}
                component={Home}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name={ScreenNames.Profile}
                component={Profile}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};
function App(): React.JSX.Element {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name={ScreenNames.Main}
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name={ScreenNames.Login} component={Login} />
                    <Stack.Screen
                        name={ScreenNames.Setups}
                        component={Setups}
                    />
                    <Stack.Screen
                        name={ScreenNames.Signup}
                        component={Signup}
                    />
                    <Stack.Screen
                        name={ScreenNames.Session}
                        component={Session}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;
