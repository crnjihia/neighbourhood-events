import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  event: {
    id: string;
    title: string;
    category: string;
    latitude: number;
    longitude: number;
  };
};

export default function EventCard({ event }: Props) {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to dynamic route /event/[id]
    // Expo Router uses push with path string
    navigation.navigate('event', { id: event.id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.category}>{event.category.replace('_', ' ')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  category: { fontSize: 12, color: '#666' },
});
