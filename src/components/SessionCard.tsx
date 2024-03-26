// components/SessionCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Session } from '../constants/types.tsx';
import { styles } from '../styles/styels.tsx';

type SessionCardProps = {
    session: Session;
    functionality: any;
};

export function SessionCard({ session, functionality }: SessionCardProps) {
    // session is an object from the list
    return (
        <TouchableOpacity style={styles.card} onPress={functionality}>
            <Image
                source={{ uri: session.background_url }}
                style={styles.background}
            />
            <View style={styles.overlay}>
                <Image
                    source={{ uri: session.image_url }}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <Text style={styles.name}>{session.name}</Text>
                    <Text style={styles.description}>
                        {session.description}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
