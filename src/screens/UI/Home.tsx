import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { ScreenNames } from '../../constants/constants.tsx';
import { HomeScreenProps, Session } from '../../constants/types.tsx';
import { LanguageCard } from '../../components/LanguageCard.tsx';
import { fillHomeScreenData } from '../Logic/Home.tsx';
import { styles } from '../../styles/styels.tsx';
export function Home({ navigation }: HomeScreenProps) {
    const [sessions, setSessions] = useState<Record<string, Session[]>>({
        '': [],
    });
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const initialise = useCallback(() => {
        fillHomeScreenData()
            .then(result => {
                if (!result.authenticated) {
                    navigation.navigate(ScreenNames.Login);
                }
                setAuthenticated(result.authenticated);
                setSessions(result.sessions);
                setLoading(false);
            })
            .catch(() => {});
    }, [navigation]); // include all dependencies here

    useEffect(() => {
        initialise();
    }, [initialise]); // useEffect will now only re-run if `initialise` changes

    if (loading || !authenticated) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContentContainer}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={initialise} />
            }>
            {Object.keys(sessions).map((language, index) => (
                <LanguageCard
                    key={index}
                    language={language}
                    sessions={sessions[language]}
                    onPress={() =>
                        navigation.navigate(ScreenNames.Setups, {
                            sessions: sessions[language],
                        })
                    }
                />
            ))}
        </ScrollView>
    );
}
