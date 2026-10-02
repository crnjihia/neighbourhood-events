import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { requestForegroundPermission } from '../../src/services/location';
import * as SecureStore from 'expo-secure-store';
import { registerForPush, setNotificationCategories } from '../../src/services/notification';

export default function ProfileScreen() {
  const [radius, setRadius] = useState('5');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    requestForegroundPermission();
    (async () => {
      const savedRadius = await SecureStore.getItemAsync('radiusKm');
      if (savedRadius) setRadius(savedRadius);
      const savedCats = await SecureStore.getItemAsync('notificationCategories');
      if (savedCats) setCategories(JSON.parse(savedCats));
    })();
  }, []);

  const handleSaveRadius = async () => {
    await SecureStore.setItemAsync('radiusKm', radius);
    Alert.alert('Radius saved', radius + ' km');
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const handleSaveCategories = async () => {
    await SecureStore.setItemAsync('notificationCategories', JSON.stringify(categories));
    await setNotificationCategories(categories);
    Alert.alert('Categories saved');
  };

  const handleRegisterPush = async () => {
    const token = await registerForPush();
    if (token) Alert.alert('Push token registered', token);
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
      <Button title="Save Radius" onPress={handleSaveRadius} />

      <Text style={{marginTop: 20}}>
        Notification Categories (toggle to opt‑in):
      </Text>
      {['tree_planting', 'blood_donation', 'cleanup', 'meetup'].map(cat => (
        <Button
          key={cat}
          title={`${categories.includes(cat) ? '☑' : '☐'} ${cat.replace('_', ' ')}`}
          onPress={() => toggleCategory(cat)}
        />
      ))}
      <Button title="Save Categories" onPress={handleSaveCategories} />

      <Button title="Register Push Token" onPress={handleRegisterPush} style={{marginTop: 20}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
});
