import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SessionCard } from '../components/SessionCard';
import {
    GetSessionsListEndpoint,
    LoginScreenName,
    SessionScreenName,
} from '../constants/constants.tsx';
import api from '../utils/APICaller.tsx';
import { __tokenAuthentication } from '../utils/AccountsLogic.tsx';
import { HomeScreenProps, Session } from '../constants/types.tsx';
export function HomeScreen({ navigation }: HomeScreenProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
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
            if (!auth) {
                throw new Error('User is not authenticated!');
            }
        };
        authenticateAndNavigate()
            .then(null) // stay where you are
            .catch(() => {
                navigation.navigate(LoginScreenName);
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
            {sessions.map(session => (
                <TouchableOpacity
                    key={session.id}
                    onPress={() =>
                        navigation.navigate(SessionScreenName, { session })
                    }>
                    <SessionCard session={session} />
                </TouchableOpacity>
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
