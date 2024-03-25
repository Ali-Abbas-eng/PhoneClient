// screens/ScenariosScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SessionCard } from '../components/SessionCard';
import { Session, SetupScreenProps } from '../constants/types.tsx';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../constants/constants.tsx';

export const Setups: React.FC<SetupScreenProps> = ({ route }) => {
    const navigation = useNavigation();

    const { sessions } = route.params;
    return (
        <ScrollView style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
});
