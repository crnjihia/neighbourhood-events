import React, { useEffect } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import OfflineBanner from '../src/components/OfflineBanner';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { ensureSeedEvents } from '../src/db/seed';

function RootLayoutContent() {
  const router = useRouter();
  const { colors, mode } = useTheme();

  useEffect(() => {
    // Populate rich initial seed events if database is fresh
    ensureSeedEvents();

    if (Platform.OS !== 'web') {
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response?.notification?.request?.content?.data;
        if (data && data.eventId) {
          router.navigate(`/event/${data.eventId}`);
        }
      });
      return () => subscription.remove();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            color: colors.textPrimary,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event/[id]"
          options={{
            title: 'Event Details',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: 'Sign In',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            title: 'Create Account',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
