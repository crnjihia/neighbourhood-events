import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import OfflineBanner from '../src/components/OfflineBanner';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.eventId) {
        router.navigate(`/event/${data.eventId}`);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack />
    </View>
  );
}
