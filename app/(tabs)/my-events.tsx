import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { database } from '../../src/db/database';
import RSVP from '../../src/db/models/RSVP';
import Event from '../../src/db/models/Event';
import EventCard from '../../src/components/EventCard';
import { useSync } from '../../src/hooks/useSync';
import * as SecureStore from '../../src/services/storage';
import { Q } from '@nozbe/watermelondb';
import { useTheme } from '../../src/context/ThemeContext';

type FilterTab = 'all' | 'going' | 'interested';

export default function MyEventsScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [myEvents, setMyEvents] = useState<{ event: Event; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { syncing, sync } = useSync();

  const loadMyEvents = useCallback(async () => {
    try {
      const currentUserId = (await SecureStore.getItemAsync('userId')) || 'local-user';
      const rsvps = await database.collections
        .get<RSVP>('rsvps')
        .query(Q.where('user_id', currentUserId))
        .fetch();

      const eventIds = rsvps.map(r => r.eventId);
      if (eventIds.length === 0) {
        setMyEvents([]);
        setLoading(false);
        return;
      }

      const events = await database.collections
        .get<Event>('events')
        .query(Q.where('id', Q.oneOf(eventIds)))
        .fetch();

      const eventsMap = new Map<string, Event>();
      events.forEach(ev => eventsMap.set(ev.id, ev));

      const paired = rsvps
        .filter(r => r.status !== 'declined')
        .map(r => ({
          event: eventsMap.get(r.eventId)!,
          status: r.status,
        }))
        .filter(item => item.event !== undefined);

      setMyEvents(paired);
    } catch (e) {
      console.warn('Error loading my events:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyEvents();

    const rsvpSub = database.collections
      .get<RSVP>('rsvps')
      .query()
      .observe()
      .subscribe(() => {
        loadMyEvents();
      });

    return () => rsvpSub.unsubscribe();
  }, [loadMyEvents]);

  const filtered = myEvents.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Initiatives</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Your confirmed RSVPs and interested community drives
        </Text>

        <View style={styles.tabContainer}>
          {(['all', 'going', 'interested'] as FilterTab[]).map(tab => {
            const isTabActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isTabActive ? colors.primary : colors.chipBackground,
                    borderColor: isTabActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color: isTabActive ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isTabActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab === 'all' ? 'All Saved' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.event.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    item.status === 'going' ? colors.primaryLight : 'rgba(245, 158, 11, 0.15)',
                  borderColor: item.status === 'going' ? colors.primary : colors.warning,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: item.status === 'going' ? colors.primary : colors.warning },
                ]}
              >
                {item.status === 'going' ? '✓ You are Going' : '⭐ Interested'}
              </Text>
            </View>
            <EventCard event={item.event} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={syncing}
            onRefresh={async () => {
              await sync();
              loadMyEvents();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No saved neighbourhood events yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Explore nearby tree plantings, cleanups, or meetups and RSVP to see them organized here.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  statusIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
