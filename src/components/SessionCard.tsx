// components/SessionCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Session } from '../screens/HomeScreen.tsx';

type SessionCardProps = {
    session: Session;
};

export function SessionCard({ session }: SessionCardProps) {
    // session is an object from the list
    return (
        <View style={styles.card}>
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
        </View>
    );
}

// ... rest of your code

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    background: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    content: {
        padding: 10,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#fff',
    },
});
