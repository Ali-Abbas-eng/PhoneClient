// screens/HomeScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SessionCard} from '../components/SessionCard';
import {GetSessionsListEndpoint, LoginScreenName} from '../constants.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import api from '../utils/APICaller.tsx';
import {__tokenAuthentication} from '../utils/AccountsLogic.tsx';

export interface Session {
  id: number;
  socket_url: string;
  name: string;
  description: string;
  number_of_messages: number;
  image_url: string;
  background_url: string;
}

// define the type of the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<
  // the first argument is an object that maps the name of each screen to the parameters it can receive
  {
    Home: undefined; // the home screen does not receive any parameters
    Session: {session: Session}; // the session screen receives a session object as a parameter
  },
  'Home' // the second argument is the name of the current screen
>;

// define the type of the props for the HomeScreen component
type HomeScreenProps = {
  navigation: HomeScreenNavigationProp; // the navigation prop is of type HomeScreenNavigationProp
};
export function HomeScreen({navigation}: HomeScreenProps) {
  // navigation is a prop passed by react navigation
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // add a state to indicate whether the refresh is active
  // @ts-ignore
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    const auth = await __tokenAuthentication();
    setAuthenticated(auth);
    if (authenticated) {
    } else {
      // @ts-ignore
      navigation.navigate(LoginScreenName);
    }
  };
  checkAuthentication();

  const fetchSessions = () => {
    setLoading(true);
    setRefreshing(true);

    api
      .get(GetSessionsListEndpoint)
      .then(response => {
        // data is the list of sessions
        setSessions(response.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        // handle any error
        console.error(error);
        setLoading(false);
        setRefreshing(false);
      });
  };
  // define the onRefresh function that will be called when refresh starts
  const onRefresh = () => {
    // call the fetchSessions function when the screen is reloaded
    fetchSessions();
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  if (loading) {
    // show a loading indicator while fetching the data
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // use the RefreshControl component to add pull-to-refresh functionality
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing} // pass the refreshing state as the refreshing prop
          onRefresh={onRefresh} // pass the onRefresh function as the onRefresh prop
        />
      }>
      {sessions.map(session => (
        // wrap the session card in a touchable component
        <TouchableOpacity
          key={session.id}
          onPress={() => {
            // navigate to the session screen and pass the session object
            navigation.navigate('Session', {session});
          }}>
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
