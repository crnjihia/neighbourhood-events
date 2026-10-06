import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useEvents } from '../hooks/useEvents';
import { useLocation } from '../hooks/useLocation';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_COLORS: Record<string, string> = {
  tree_planting: '#15803D',
  blood_donation: '#DC2626',
  cleanup: '#0284C7',
  meetup: '#D97706',
};

export default function MapScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { location } = useLocation();
  const events = useEvents([]);

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : {
        latitude: -1.286389, // Nairobi City Center
        longitude: 36.817223,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {events.map(event => {
          const pinColor = CATEGORY_COLORS[event.category] || colors.primary;
          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              pinColor={pinColor}
            >
              <Callout
                onPress={() => {
                  router.push({
                    pathname: '/event/[id]',
                    params: { id: event.id },
                  });
                }}
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{event.title}</Text>
                  <Text style={styles.calloutCategory}>
                    {(event.category || '').replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={[styles.calloutLink, { color: colors.primary }]}>Tap to view details →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View
        style={[
          styles.legendOverlay,
          {
            backgroundColor: colors.isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#15803D' }]} />
          <Text style={[styles.legendText, { color: colors.textPrimary }]}>Tree Planting</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#0284C7' }]} />
          <Text style={[styles.legendText, { color: colors.textPrimary }]}>Cleanup</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
          <Text style={[styles.legendText, { color: colors.textPrimary }]}>Blood Drive</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#D97706' }]} />
          <Text style={[styles.legendText, { color: colors.textPrimary }]}>Meetup</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  callout: {
    width: 180,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
    color: '#0F172A',
  },
  calloutCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  calloutLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  legendOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
