import React from 'react';
import {SafeAreaView, StyleSheet, Text, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.centeredView, backgroundStyle]}>
      <Text style={styles.highlight}>
        Sorry, This App is not available in your region due to the OFAC
        restriction that prohibit Syrian companies from accessing international
        services such as web hosting and AI cloud services, so we can only scale
        up a bit at a time, we sincerely apologise for the inconvenience.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default App;
