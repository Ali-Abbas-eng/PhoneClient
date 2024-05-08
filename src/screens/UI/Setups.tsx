import React from 'react';
import { ScrollView } from 'react-native';
import { SessionCard } from '../../components/SessionCard.tsx';
import { Session, SetupScreenProps } from '../../constants/types.tsx';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../constants/constants.tsx';
import { styles } from '../../styles/styels.tsx';

export const Setups: React.FC<SetupScreenProps> = ({ route }) => {
    const navigation = useNavigation();

    const { sessions } = route.params;
    return (
        <ScrollView>
            {sessions.map((session: Session) => (
                <SessionCard
                    key={session.id}
                    session={session}
                    functionality={() => {
                        // @ts-ignore
                        navigation.navigate(ScreenNames.Session, {
                            session: session,
                        });
                    }}
                />
            ))}
        </ScrollView>
    );
};
