import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import OfflineBanner from '../src/components/OfflineBanner';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack />
    </View>
  );
}
