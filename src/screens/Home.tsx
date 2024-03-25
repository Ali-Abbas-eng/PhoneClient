import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import {
    GetSessionsListEndpoint,
    LoginScreenName,
    ScenariosScreenName, ScreenNames,
} from '../constants/constants.tsx';
import api from '../utils/APICaller.tsx';
import {
    __handleServerAccessError,
    __refreshTokens,
    __tokenAuthentication,
} from '../utils/AccountsLogic.tsx';
import { HomeScreenProps, Session } from '../constants/types.tsx';
import { LanguageCard } from '../components/LanguageCard.tsx';
export function Home({ navigation }: HomeScreenProps) {
    const [sessions, setSessions] = useState<Record<string, Session[]>>({
        '': [],
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const fetchSessions = async () => {
        try {
            setLoading(true);
            setRefreshing(true);
            const response = await api.get(GetSessionsListEndpoint);
            setSessions(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const authenticateAndNavigate = async () => {
            const auth = await __tokenAuthentication();
            setAuthenticated(auth);
            return auth;
        };
        __refreshTokens().then(() => {
            authenticateAndNavigate()
                .then((result: boolean) => {
                    if (!result) {
                        navigation.navigate(ScreenNames.Login);
                    } else {
                        __handleServerAccessError('User is not authenticated');
                    }
                }) // stay where you are
                .catch(() => {});
        });
    }, [navigation]);

    useEffect(() => {
        fetchSessions();
    }, []);
    const onRefresh = () => {
        fetchSessions();
    };

    if (loading || !authenticated) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
