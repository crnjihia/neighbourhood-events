import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: -1.2921, longitude: 36.8219 } }),
  Accuracy: { Balanced: 3 },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'fake-token' }),
  addNotificationReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addNotificationResponseReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  setNotificationHandler: jest.fn(),
  setNotificationCategoryAsync: jest.fn().mockResolvedValue(undefined),
  AndroidNotificationPriority: { HIGH: 'high' },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: '1' }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock SQLiteAdapter with LokiJSAdapter for Jest environment
jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  const LokiJSAdapter = require('@nozbe/watermelondb/adapters/lokijs').default;
  return jest.fn().mockImplementation((options) => {
    return new LokiJSAdapter({
      ...options,
      useWebWorker: false,
      useIncrementalIndexedDB: false,
    });
  });
});
