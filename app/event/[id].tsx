import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from '../../src/db/database';
import Event from '../../src/db/models/Event';
import { createRSVP, getUserRSVP } from '../../src/services/rsvp';
import DistanceBadge from '../../src/components/DistanceBadge';
import { haversineDistance } from '../../src/hooks/useEvents';
import { useLocation } from '../../src/hooks/useLocation';
import { useTheme } from '../../src/context/ThemeContext';

const CATEGORY_COLORS: Record<string, string> = {
  tree_planting: '#15803D',
  blood_donation: '#DC2626',
  cleanup: '#0284C7',
  meetup: '#EA580C',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  tree_planting: '🌱',
  blood_donation: '🩸',
  cleanup: '🧹',
  meetup: '🤝',
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { location } = useLocation();
  const { colors, toggleTheme } = useTheme();

  const [event, setEvent] = useState<Event | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadEventData = useCallback(async () => {
    if (!id) return;
    try {
      const eventRecord = await database.collections.get<Event>('events').find(id);
      setEvent(eventRecord);
      const userStatus = await getUserRSVP(id);
      setRsvpStatus(userStatus);
    } catch (e) {
      console.warn('Failed to load event details:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleRSVP = async (newStatus: 'going' | 'interested' | 'declined') => {
    if (!id) return;
    setUpdating(true);
    try {
      await createRSVP(id, newStatus);
      setRsvpStatus(newStatus);
      Alert.alert(
        'RSVP Updated',
        newStatus === 'going'
          ? "Awesome! You're confirmed for this event."
          : newStatus === 'interested'
            ? 'Noted! We saved this event to your list.'
            : 'You marked this event as declined.',
      );
      loadEventData();
    } catch (e: any) {
      Alert.alert('RSVP Error', e.message || 'Could not update RSVP');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Event not found</Text>
        <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
          This event may have been removed or not yet synced to your device.
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[event.category] || colors.primary;
  const categoryEmoji = CATEGORY_EMOJIS[event.category] || '📍';
  const categoryLabel = (event.category || 'event').replace('_', ' ').toUpperCase();

  const distanceKm =
    location && event.latitude && event.longitude
      ? haversineDistance(location.latitude, location.longitude, event.latitude, event.longitude)
      : undefined;

  const startsFormatted = event.startsAt
    ? new Date(event.startsAt).toLocaleDateString('en-KE', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Date TBA';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Top Nav Row */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          style={[
            styles.navIconButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={[styles.navIconText, { color: colors.textPrimary }]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navIconButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={toggleTheme}
          accessibilityLabel="Toggle Dark Mode"
        >
          <Text style={styles.navIconText}>{colors.isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Header Card */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.badgeRow}>
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}22` }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {categoryEmoji} {categoryLabel}
            </Text>
          </View>
          <DistanceBadge distanceKm={distanceKm} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>{event.title}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.metaIconBg, { backgroundColor: `${colors.primary}18` }]}>
            <Text style={styles.metaIcon}>📅</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>When</Text>
            <Text style={[styles.metaText, { color: colors.textPrimary }]}>{startsFormatted}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.metaIconBg, { backgroundColor: `${colors.accent}18` }]}>
            <Text style={styles.metaIcon}>📍</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Location</Text>
            <Text style={[styles.metaText, { color: colors.textPrimary }]}>
              {event.address || 'Nairobi, Kenya'}
            </Text>
            {event.latitude && event.longitude ? (
              <Text style={[styles.coordText, { color: colors.textMuted }]}>
                {event.latitude.toFixed(4)}°, {event.longitude.toFixed(4)}°
              </Text>
            ) : null}
          </View>
        </View>

        {event.capacity ? (
          <View style={styles.metaRow}>
            <View style={[styles.metaIconBg, { backgroundColor: `${colors.info}18` }]}>
              <Text style={styles.metaIcon}>👥</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Volunteers</Text>
              <Text style={[styles.metaText, { color: colors.textPrimary }]}>
                {event.rsvpCount || 0} / {event.capacity} spots filled
              </Text>
              <View
                style={[
                  styles.progressBarBg,
                  { backgroundColor: colors.isDark ? '#1E293B' : '#E2E8F0' },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${Math.min(
                        100,
                        Math.round(((event.rsvpCount || 0) / (event.capacity || 1)) * 100),
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* Description Section */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          About this Initiative
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {event.description ||
            'Join your neighbours in making Nairobi greener, cleaner, and more vibrant.'}
        </Text>
      </View>

      {/* RSVP Interactive Card */}
      <View
        style={[
          styles.rsvpCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          Your Participation
        </Text>

        {rsvpStatus ? (
          <View
            style={[
              styles.currentStatusContainer,
              {
                backgroundColor:
                  rsvpStatus === 'going'
                    ? `${colors.primary}20`
                    : rsvpStatus === 'interested'
                      ? `${colors.warning}20`
                      : `${colors.danger}20`,
                borderColor:
                  rsvpStatus === 'going'
                    ? colors.primary
                    : rsvpStatus === 'interested'
                      ? colors.warning
                      : colors.danger,
              },
            ]}
          >
            <Text
              style={[
                styles.currentStatusText,
                {
                  color:
                    rsvpStatus === 'going'
                      ? colors.primary
                      : rsvpStatus === 'interested'
                        ? colors.warning
                        : colors.danger,
                },
              ]}
            >
              Current status: <Text style={styles.statusHighlight}>{rsvpStatus.toUpperCase()}</Text>
            </Text>
          </View>
        ) : (
          <Text style={[styles.rsvpPrompt, { color: colors.textSecondary }]}>
            Will you be joining this neighbourhood event?
          </Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.rsvpButton,
              {
                borderColor: rsvpStatus === 'going' ? colors.primary : colors.border,
                backgroundColor:
                  rsvpStatus === 'going'
                    ? colors.primary
                    : colors.isDark
                      ? '#1E293B'
                      : '#F0FDF4',
              },
            ]}
            onPress={() => handleRSVP('going')}
            disabled={updating}
          >
            <Text
              style={[
                styles.rsvpButtonText,
                {
                  color:
                    rsvpStatus === 'going'
                      ? '#FFFFFF'
                      : colors.isDark
                        ? '#86EFAC'
                        : colors.primaryDark,
                },
              ]}
            >
              ✓ Going
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rsvpButton,
              {
                borderColor: rsvpStatus === 'interested' ? colors.warning : colors.border,
                backgroundColor:
                  rsvpStatus === 'interested'
                    ? colors.warning
                    : colors.isDark
                      ? '#1E293B'
                      : '#FFFBEB',
              },
            ]}
            onPress={() => handleRSVP('interested')}
            disabled={updating}
          >
            <Text
              style={[
                styles.rsvpButtonText,
                {
                  color:
                    rsvpStatus === 'interested'
                      ? '#FFFFFF'
                      : colors.isDark
                        ? '#FDE68A'
                        : '#B45309',
                },
              ]}
            >
              ⭐ Interested
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rsvpButton,
              {
                borderColor: rsvpStatus === 'declined' ? colors.textMuted : colors.border,
                backgroundColor:
                  rsvpStatus === 'declined'
                    ? colors.textMuted
                    : colors.isDark
                      ? '#1E293B'
                      : '#F1F5F9',
              },
            ]}
            onPress={() => handleRSVP('declined')}
            disabled={updating}
          >
            <Text
              style={[
                styles.rsvpButtonText,
                {
                  color:
                    rsvpStatus === 'declined'
                      ? '#FFFFFF'
                      : colors.textSecondary,
                },
              ]}
            >
              ✕ Decline
            </Text>
          </TouchableOpacity>
        </View>

        {updating && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginTop: 14 }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  metaIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metaIcon: {
    fontSize: 18,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  coordText: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  rsvpCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  currentStatusContainer: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  currentStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusHighlight: {
    fontWeight: '900',
  },
  rsvpPrompt: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  rsvpButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

