import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScreenNames } from './constants.tsx';
import { ComplexAudioObject } from '../utils/ComplexAudio.tsx';

export interface Session {
    id: number;
    socket_url: string;
    name: string;
    description: string;
    number_of_messages: number;
    image_url: string;
    background_url: string;
}
export type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, ScreenNames.Home>;
};

export type RootStackParamList = {
    [ScreenNames.Home]: undefined;
    [ScreenNames.Session]: { session: Session };
    [ScreenNames.Setups]: { sessions: Session[] };
    [ScreenNames.Login]: undefined;
    [ScreenNames.Profile]: undefined;
    [ScreenNames.Signup]: undefined;
    [ScreenNames.Main]: undefined;
};

export type SessionScreenRouteProp = RouteProp<
    RootStackParamList,
    ScreenNames.Session
>;

export type SetupScreenRouteProp = RouteProp<
    RootStackParamList,
    ScreenNames.Setups
>;

export type SetupScreenProps = {
    route: SetupScreenRouteProp;
};

export type SessionScreenProps = {
    route: SessionScreenRouteProp;
};

export type LanguageCardProps = {
    language: string;
    image_url?: string;
    sessions: Session[];
    onPress: () => void;
};

export type AudioMessageProps = {
    audioObject: ComplexAudioObject;
};

export type EchoResponse = {
    audio: string;
    answer_text: string;
    response_text: string;
};
