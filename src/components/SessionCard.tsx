// components/SessionCard.tsx
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Session} from '../screens/HomeScreen.tsx';

type SessionCardProps = {
  session: Session;
};

export function SessionCard({session}: SessionCardProps) {
  // session is an object from the list
  return (
    <View style={styles.card}>
      <Image source={{uri: session.image}} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{session.name}</Text>
        <Text style={styles.description}>{session.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
});
