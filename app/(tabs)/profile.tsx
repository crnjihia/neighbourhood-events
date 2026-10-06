import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { requestForegroundPermission } from '../../src/services/location';
import * as SecureStore from '../../src/services/storage';
import { registerForPush, setNotificationCategories } from '../../src/services/notifications';
import { logout } from '../../src/services/auth';
import { useRouter } from 'expo-router';
import { useTheme, ThemeMode } from '../../src/context/ThemeContext';

const AVAILABLE_CATEGORIES = [
  { id: 'tree_planting', label: '🌲 Tree Planting Drives' },
  { id: 'cleanup', label: '🌊 Beach & River Cleanups' },
  { id: 'blood_donation', label: '🩸 Blood Donation Days' },
  { id: 'meetup', label: '☕ Neighbourhood Meetups' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, setThemeMode, toggleTheme } = useTheme();
  const [radius, setRadius] = useState('10');
  const [categories, setCategories] = useState<string[]>([
    'tree_planting',
    'cleanup',
    'blood_donation',
    'meetup',
  ]);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    requestForegroundPermission();
    (async () => {
      const savedRadius = await SecureStore.getItemAsync('radiusKm');
      if (savedRadius) setRadius(savedRadius);

      const savedCats = await SecureStore.getItemAsync('notificationCategories');
      if (savedCats) {
        try {
          setCategories(JSON.parse(savedCats));
        } catch {
          // ignore
        }
      }

      const token = await SecureStore.getItemAsync('pushToken');
      if (token) setPushToken(token);
    })();
  }, []);

  const handleSaveRadius = async () => {
    const num = parseFloat(radius);
    if (isNaN(num) || num < 1 || num > 50) {
      Alert.alert('Invalid Radius', 'Please enter a distance between 1 km and 50 km.');
      return;
    }
    await SecureStore.setItemAsync('radiusKm', String(num));
    Alert.alert('Radius Updated', `Discovery radius set to ${num} km.`);
  };

  const toggleCategory = async (catId: string) => {
    const updated = categories.includes(catId)
      ? categories.filter(c => c !== catId)
      : [...categories, catId];

    setCategories(updated);
    await setNotificationCategories(updated);
  };

  const handleRegisterPush = async () => {
    const token = await registerForPush();
    if (token) {
      setPushToken(token);
      Alert.alert('Push Notifications Enabled', 'You will receive alerts for events matching your radius!');
    } else {
      Alert.alert('Push Registration', 'Could not obtain push token or permission was denied.');
    }
  };

  const handleLogout = async () => {
    await logout();
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('/(auth)/login');
  };

  const themeOptions: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'system', label: 'System', icon: '📱' },
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.mainHeading, { color: colors.textPrimary }]}>Preferences & Settings</Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
            Customize your discovery radius, notifications, and theme
          </Text>
        </View>

        {/* Theme / Dark Mode Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🎨 Appearance</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Choose your preferred color theme:
          </Text>
          <View style={styles.themeSelectorRow}>
            {themeOptions.map(opt => {
              const isActive = mode === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: isActive ? colors.primary : colors.chipBackground,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setThemeMode(opt.id)}
                >
                  <Text style={styles.themeOptIcon}>{opt.icon}</Text>
                  <Text
                    style={[
                      styles.themeOptLabel,
                      {
                        color: isActive ? '#FFFFFF' : colors.textPrimary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Discovery Radius */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>📍 Discovery Radius</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Maximum distance for local event discovery and alerts:
          </Text>
          <View style={styles.radiusRow}>
            <TextInput
              style={[
                styles.radiusInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
              keyboardType="numeric"
              value={radius}
              onChangeText={setRadius}
              maxLength={2}
            />
            <Text style={[styles.unitText, { color: colors.textSecondary }]}>km (1 – 50 km)</Text>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveRadius}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Categories */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🔔 Notification Categories</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Select the community drives you wish to be alerted for:
          </Text>

          {AVAILABLE_CATEGORIES.map(cat => {
            const isSelected = categories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.checkboxRow,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.inputBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={[styles.checkboxIcon, { color: colors.primary }]}>
                  {isSelected ? '☑' : '☐'}
                </Text>
                <Text
                  style={[
                    styles.checkboxLabel,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.pushRegisterButton,
              {
                backgroundColor: pushToken ? colors.primary : colors.info,
              },
            ]}
            onPress={handleRegisterPush}
          >
            <Text style={styles.pushRegisterText}>
              {pushToken ? '✓ Notifications Active' : '🔔 Enable Push Notifications'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account & Sign out */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>👤 Account</Text>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: colors.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                borderColor: colors.danger,
              },
            ]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
    marginTop: 8,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: '800',
  },
  subHeading: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    marginBottom: 12,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  themeOptIcon: {
    fontSize: 16,
  },
  themeOptLabel: {
    fontSize: 13,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 65,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  unitText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkboxIcon: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  pushRegisterButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  pushRegisterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
