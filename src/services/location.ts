import * as Location from 'expo-location';

export async function requestForegroundPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Error requesting foreground location permission:', error);
    return false;
  }
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const requested = await requestForegroundPermission();
      if (!requested) return null;
    }
    const result = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: result.coords.latitude, longitude: result.coords.longitude };
  } catch (error) {
    console.warn('Error getting current location:', error);
    return null;
  }
}
