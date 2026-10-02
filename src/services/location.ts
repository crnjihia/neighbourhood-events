import * as Location from 'expo-location';

export async function requestForegroundPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  const { status } = await Location.getForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }
  const result = await Location.getCurrentPositionAsync({});
  return { latitude: result.coords.latitude, longitude: result.coords.longitude };
}
