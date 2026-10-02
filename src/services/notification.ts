import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

export async function registerForPush(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Push notification permission not granted');
    return null;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await SecureStore.setItemAsync('pushToken', token);
  return token;
}

export async function setNotificationCategories(categories: string[]): Promise<void> {
  const token = await SecureStore.getItemAsync('pushToken');
  const payload = {
    pushToken: token,
    categories,
  };
  // Store locally – real app would POST to /devices/register
  await SecureStore.setItemAsync('notificationCategories', JSON.stringify(categories));
  // Example POST (commented out for now):
  // await fetch(`${process.env.API_URL}/devices/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
}
