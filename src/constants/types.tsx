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
    Scenarios: { sessions: Session[] };
    Login: undefined;
};

export type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export type SessionScreenProps = {
    route: RouteProp<RootStackParamList, 'Session'>;
};

export type LanguageCardProps = {
    language: string;
    image_url?: string;
    sessions: Session[];
    onPress: () => void;
};

export type ScenariosScreenProps = {
    route: RouteProp<RootStackParamList, 'Scenarios'>;
};
