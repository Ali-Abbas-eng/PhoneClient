import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface Session {
    id: number;
    socket_url: string;
    name: string;
    description: string;
    number_of_messages: number;
    image_url: string;
    background_url: string;
}

// define the type of the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<
    // the first argument is an object that maps the name of each screen to the parameters it can receive
    {
        Home: undefined; // the home screen does not receive any parameters
        Session: { session: Session }; // the session screen receives a session object as a parameter
        Login: undefined;
    },
    'Home' // the second argument is the name of the current screen
>;
// define the type of the props for the HomeScreen component
export type HomeScreenProps = {
    navigation: HomeScreenNavigationProp; // the navigation prop is of type HomeScreenNavigationProp
};

// define the type of the navigation prop
type SessionScreenNavigationProp = StackNavigationProp<
    // the first argument is an object that maps the name of each screen to the parameters it can receive
    {
        Home: undefined; // the home screen does not receive any parameters
        Session: { session: Session }; // the session screen receives a session object as a parameter
        Login: undefined;
    },
    'Home' // the second argument is the name of the current screen
>;

export type SessionScreenProps = {
    navigation: SessionScreenNavigationProp;
    session: Session;
};
