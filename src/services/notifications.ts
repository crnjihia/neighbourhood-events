import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from './storage';
import { apiRequest } from './api';

// Configure notification behavior when app is in foreground (on native)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  });
}

export const NOTIFICATION_CATEGORIES = [
  'tree_planting',
  'blood_donation',
  'cleanup',
  'meetup',
] as const;

export type EventCategory = (typeof NOTIFICATION_CATEGORIES)[number];

/**
 * Configure interactive notification action buttons for event notifications
 */
export async function setupNotificationCategories(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.setNotificationCategoryAsync('event_invite', [
      {
        identifier: 'going',
        buttonTitle: 'Going',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'interested',
        buttonTitle: 'Interested',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: {
          isDestructive: true,
          opensAppToForeground: false,
        },
      },
    ]);
  } catch (error) {
    console.warn('Failed to configure notification categories:', error);
  }
}

/**
 * Register for Expo Push Notifications and store token
 */
export async function registerForPush(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return 'demo-web-push-token';
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const pushTokenResult = await Notifications.getExpoPushTokenAsync();
    const token = pushTokenResult.data;

    await SecureStore.setItemAsync('pushToken', token);
    await setupNotificationCategories();

    // Sync push token with backend
    await syncDevicePreferences(token);

    return token;
  } catch (error) {
    console.warn('Error obtaining push token:', error);
    return null;
  }
}

/**
 * Save user notification category preferences locally and sync to backend
 */
export async function setNotificationCategories(categories: string[]): Promise<void> {
  await SecureStore.setItemAsync('notificationCategories', JSON.stringify(categories));
  const token = await SecureStore.getItemAsync('pushToken');
  if (token) {
    await syncDevicePreferences(token, categories);
  }
}

/**
 * Helper to sync device token, radius, and categories with backend
 */
export async function syncDevicePreferences(
  token: string,
  categories?: string[],
  radiusKm?: number,
): Promise<void> {
  try {
    const cats =
      categories ||
      (await SecureStore.getItemAsync('notificationCategories').then(res =>
        res ? JSON.parse(res) : NOTIFICATION_CATEGORIES,
      ));

    const radius =
      radiusKm ||
      (await SecureStore.getItemAsync('radiusKm').then(r => (r ? Number(r) : 5)));

    await apiRequest('/devices/register', {
      method: 'POST',
      body: JSON.stringify({
        pushToken: token,
        categories: cats,
        radiusKm: radius,
      }),
      requiresAuth: false,
    });
  } catch (error) {
    // Graceful offline degradation
    console.log('Device preference sync queued or skipped while offline');
  }
}
