import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import CategoryFilter from './CategoryFilter';

const CATEGORY_COLORS: Record<string, { color: string; icon: string }> = {
  tree_planting: { color: '#15803D', icon: '🌲' },
  cleanup: { color: '#0284C7', icon: '🌊' },
  blood_donation: { color: '#DC2626', icon: '🩸' },
  meetup: { color: '#D97706', icon: '☕' },
};

export default function MapScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const events = useEvents(selectedCategories);

  return (
    <ScrollView
      style={[styles.webContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.webContent}
    >
      <View style={styles.webHeader}>
        <Text style={[styles.webTitle, { color: colors.primary }]}>🗺️ Nairobi Community Map</Text>
        <Text style={[styles.webSubtitle, { color: colors.textSecondary }]}>
          Explore coordinates and event locations across Nairobi neighbourhoods
        </Text>
        <View style={{ marginTop: 10 }}>
          <CategoryFilter selected={selectedCategories} onToggle={toggleCategory} />
        </View>
      </View>

      <View
        style={[
          styles.webMapCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Text style={[styles.webMapHeader, { color: colors.textPrimary }]}>
          📍 Active Neighbourhood Initiatives ({events.length})
        </Text>
        <View style={styles.eventGrid}>
          {events.map(event => {
            const meta = CATEGORY_COLORS[event.category] || { color: colors.primary, icon: '📍' };
            return (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.webPinCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => {
                  router.push({
                    pathname: '/event/[id]',
                    params: { id: event.id },
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: colors.isDark ? 'rgba(255,255,255,0.08)' : `${meta.color}15`,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: meta.color }]}>
                      {meta.icon} {(event.category || '').replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  {event.rsvpCount ? (
                    <Text style={[styles.rsvpMini, { color: colors.textSecondary }]}>
                      👥 {event.rsvpCount} going
                    </Text>
                  ) : null}
                </View>

                <Text style={[styles.pinTitle, { color: colors.textPrimary }]}>{event.title}</Text>
                <Text style={[styles.pinAddress, { color: colors.textSecondary }]}>
                  📍 {event.address || 'Nairobi, Kenya'}
                </Text>

                <View style={styles.coordsFooter}>
                  <Text style={[styles.pinCoords, { color: colors.textMuted }]}>
                    GPS: {event.latitude?.toFixed(4)}, {event.longitude?.toFixed(4)}
                  </Text>
                  <Text style={[styles.pinLink, { color: colors.primary }]}>View Details →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
  },
  webContent: {
    padding: 20,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  webHeader: {
    marginBottom: 16,
  },
  webTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  webSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  webMapCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  webMapHeader: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventGrid: {
    gap: 14,
  },
  webPinCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rsvpMini: {
    fontSize: 12,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  pinAddress: {
    fontSize: 13,
    marginBottom: 8,
  },
  coordsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: 8,
    marginTop: 4,
  },
  pinCoords: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  pinLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});
