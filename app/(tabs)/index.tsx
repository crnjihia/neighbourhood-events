import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import CategoryFilter from '../../src/components/CategoryFilter';
import { useEvents } from '../../src/hooks/useEvents';
import EventCard from '../../src/components/EventCard';
import { useSync } from '../../src/hooks/useSync';
import { requestForegroundPermission } from '../../src/services/location';
import * as SecureStore from '../../src/services/storage';
import { useTheme } from '../../src/context/ThemeContext';
import { ensureSeedEvents } from '../../src/db/seed';

const RADIUS_OPTIONS = [5, 10, 20, 0]; // 0 means 'All'

export default function ExploreScreen() {
  const { colors, toggleTheme, mode } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { syncing, sync } = useSync();

  useEffect(() => {
    requestForegroundPermission();
    SecureStore.getItemAsync('radiusKm').then(saved => {
      if (saved) setRadiusKm(Number(saved));
    });
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const handleSelectRadius = async (r: number) => {
    setRadiusKm(r);
    await SecureStore.setItemAsync('radiusKm', String(r));
  };

  // Query events with category and radius filters
  const events = useEvents(selectedCategories, radiusKm > 0 ? radiusKm : undefined);

  // Client-side search filtering by title, address, description
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase();
    return events.filter(
      ev =>
        ev.title?.toLowerCase().includes(query) ||
        ev.address?.toLowerCase().includes(query) ||
        ev.description?.toLowerCase().includes(query),
    );
  }, [events, searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.titleRow}>
          <View style={styles.branding}>
            <Text style={styles.logoIcon}>🌱</Text>
            <View>
              <Text style={[styles.title, { color: colors.primary }]}>Neighbourhood Events</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Hyperlocal volunteering in Nairobi
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.themeToggleButton, { backgroundColor: colors.chipBackground, borderColor: colors.border }]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Dark Mode"
          >
            <Text style={styles.themeToggleIcon}>{colors.isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search events, tree drives, cleanups..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearSearch, { color: colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Radius Selector Pills */}
        <View style={styles.radiusRow}>
          <Text style={[styles.radiusLabel, { color: colors.textSecondary }]}>Radius:</Text>
          {RADIUS_OPTIONS.map(r => {
            const isSelected = radiusKm === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => handleSelectRadius(r)}
                style={[
                  styles.radiusPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.chipBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.radiusPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {r === 0 ? 'All' : `${r}km`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category Filters */}
        <CategoryFilter selected={selectedCategories} onToggle={toggleCategory} />
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={syncing}
            onRefresh={sync}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          filteredEvents.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={[styles.listCount, { color: colors.textSecondary }]}>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found nearby
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {searchQuery ? 'No events matching your search' : 'No events found in this radius'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try widening your distance radius or load all 12 Nairobi community initiatives below.
            </Text>
            <TouchableOpacity
              style={[styles.seedButton, { backgroundColor: colors.primary }]}
              onPress={async () => {
                await ensureSeedEvents();
              }}
            >
              <Text style={styles.seedButtonText}>+ Load Nairobi Community Events</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  themeToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
  },
  clearSearch: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
  radiusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  radiusPillText: {
    fontSize: 12,
  },
  listHeader: {
    marginBottom: 12,
  },
  listCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  seedButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  seedButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
