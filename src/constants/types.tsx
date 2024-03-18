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

type RootStackParamList = {
    Home: undefined;
    Session: { session: Session };
    Login: undefined;
};

export type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export type SessionScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Session'>;
    route: RouteProp<RootStackParamList, 'Session'>;
};
