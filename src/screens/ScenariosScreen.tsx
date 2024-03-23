// screens/ScenariosScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SessionCard } from '../components/SessionCard';
import { ScenariosScreenProps, Session } from '../constants/types.tsx';

export const ScenariosScreen: React.FC<any> = props => {
    const { sessions } = props.route
        .params as ScenariosScreenProps['route']['params'];

    return (
        <ScrollView style={styles.container}>
            {sessions.map((session: Session) => (
                <SessionCard key={session.id} session={session} />
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
