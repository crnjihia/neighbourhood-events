import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

type Loc = { latitude: number; longitude: number } | null;

export function useLocation() {
  const [location, setLocation] = useState<Loc>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation(null);
        return;
      }
      const result = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: result.coords.latitude, longitude: result.coords.longitude });
    })();
  }, []);

  return { location };
}
