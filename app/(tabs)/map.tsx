import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEvents } from '../../src/hooks/useEvents';
import { useLocation } from '../../src/hooks/useLocation';

export default function MapScreen() {
  const { location } = useLocation();
  const events = useEvents([]); // no filter for now

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: -1.2921, // Nairobi approx
        longitude: 36.8219,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation>
        {events.map(event => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
            description={event.category.replace('_', ' ')}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});
