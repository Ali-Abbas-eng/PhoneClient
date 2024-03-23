import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguageCardProps } from '../constants/types.tsx';

export const LanguageCard = ({
    language,
    image_url,
    onPress,
    sessions,
}: LanguageCardProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <Image
                    source={{
                        uri: image_url ? image_url : sessions[0].image_url,
                    }}
                    style={styles.background}
                />
                <View style={styles.overlay}>
                    <Text style={styles.name}>{language}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
