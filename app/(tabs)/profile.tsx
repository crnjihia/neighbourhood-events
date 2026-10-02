import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { requestForegroundPermission } from '../../src/services/location';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const [radius, setRadius] = useState('5');

  useEffect(() => {
    // Request location permission on profile entry
    requestForegroundPermission();
    // Load saved radius if any
    (async () => {
      const saved = await SecureStore.getItemAsync('radiusKm');
      if (saved) setRadius(saved);
    })();
  }, []);

  const handleSave = async () => {
    await SecureStore.setItemAsync('radiusKm', radius);
    // TODO: Persist to WatermelonDB User model
    alert('Radius saved: ' + radius + ' km');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Set search radius (km):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={radius}
        onChangeText={setRadius}
      />
      <Button title="Save Radius" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
});
