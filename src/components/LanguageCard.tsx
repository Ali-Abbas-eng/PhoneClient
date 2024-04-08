import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LanguageCardProps } from '../constants/types.tsx';
import { styles } from '../styles/styels.tsx';

export const LanguageCard = ({
    language,
    image_url,
    onPress,
    sessions,
}: LanguageCardProps) => {
    image_url = image_url ? image_url : sessions[0].image_url;
    return sessions.length ? (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View>
                <Image source={{ uri: image_url }} style={styles.background} />
                <View style={styles.overlay}>
                    <Text style={styles.name}>{language}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ) : null;
};
