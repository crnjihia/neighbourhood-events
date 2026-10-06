import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import DistanceBadge from './DistanceBadge';
import { useTheme } from '../context/ThemeContext';

export interface EventCardData {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  distanceKm?: number;
  startsAt?: Date | string | number;
  rsvpCount?: number;
}

type Props = {
  event: EventCardData;
};

const CATEGORY_META: Record<string, { color: string; darkColor: string; icon: string; label: string }> = {
  tree_planting: { color: '#15803D', darkColor: '#4ADE80', icon: '🌲', label: 'TREE PLANTING' },
  cleanup: { color: '#0284C7', darkColor: '#38BDF8', icon: '🌊', label: 'CLEANUP' },
  blood_donation: { color: '#DC2626', darkColor: '#F87171', icon: '🩸', label: 'BLOOD DONATION' },
  meetup: { color: '#D97706', darkColor: '#FBBF24', icon: '☕', label: 'MEETUP' },
};

export default function EventCard({ event }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/event/[id]',
      params: { id: event.id },
    });
  };

  const meta = CATEGORY_META[event.category] || {
    color: '#64748B',
    darkColor: '#94A3B8',
    icon: '📍',
    label: (event.category || 'EVENT').replace('_', ' ').toUpperCase(),
  };

  const badgeColor = colors.isDark ? meta.darkColor : meta.color;

  const startsFormatted = event.startsAt
    ? new Date(event.startsAt).toLocaleDateString('en-KE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      testID={`event-card-${event.id}`}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.08)' : `${meta.color}14`,
              borderColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'transparent',
            },
          ]}
        >
          <Text style={[styles.categoryText, { color: badgeColor }]}>
            {meta.icon} {meta.label}
          </Text>
        </View>
        <DistanceBadge distanceKm={event.distanceKm} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        {event.title}
      </Text>

      {startsFormatted ? (
        <Text style={[styles.dateText, { color: colors.primary }]}>
          🗓️ {startsFormatted}
        </Text>
      ) : null}

      {event.address ? (
        <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
          📍 {event.address}
        </Text>
      ) : null}

      <View style={[styles.footerRow, { borderTopColor: colors.borderSubtle }]}>
        {event.rsvpCount !== undefined ? (
          <Text style={[styles.rsvpCount, { color: colors.textSecondary }]}>
            👥 {event.rsvpCount} {event.rsvpCount === 1 ? 'neighbour going' : 'neighbours going'}
          </Text>
        ) : null}
        <Text style={[styles.detailsLink, { color: colors.primary }]}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 2,
  },
  rsvpCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});
