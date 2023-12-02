import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Sorry, This App is not available in your region due to the OFAC restriction that prohibit Syrian companies from accessing international services such as web hosting and AI cloud services, so we can only scale up a bit at a time, we sincerely apologise for the inconvenience.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
