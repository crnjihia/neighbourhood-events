import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { createRSVP } from '../../src/services/rsvp';

type Params = { id: string };

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<Params>();
  const [status, setStatus] = useState<string | null>(null);

  const handleRSVP = async (newStatus: string) => {
    try {
      await createRSVP(id, newStatus);
      setStatus(newStatus);
      Alert.alert('Success', `RSVP set to ${newStatus}`);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event ID: {id}</Text>
      {/* Additional event details would be fetched from the local DB here */}
      <Button title="Going" onPress={() => handleRSVP('going')} />
      <Button title="Interested" onPress={() => handleRSVP('interested')} />
      <Button title="Declined" onPress={() => handleRSVP('declined')} />
      {status && (
        <Text style={styles.status}>You marked as: {status}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 12 },
  status: { marginTop: 12, fontStyle: 'italic' },
});
