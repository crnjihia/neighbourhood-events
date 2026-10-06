import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Universal cross-platform storage adapter:
 * - On Native (Android/iOS): Uses hardware-backed expo-secure-store (Keystore / Keychain)
 * - On Web: Uses browser localStorage with in-memory fallback
 */

const memoryStore = new Map<string, string>();

export async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // fallback
    }
    return memoryStore.get(key) || null;
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`SecureStore.getItemAsync failed for key "${key}":`, error);
    return memoryStore.get(key) || null;
  }
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // fallback
    }
    memoryStore.set(key, value);
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(`SecureStore.setItemAsync failed for key "${key}":`, error);
    memoryStore.set(key, value);
  }
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // fallback
    }
    memoryStore.delete(key);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`SecureStore.deleteItemAsync failed for key "${key}":`, error);
    memoryStore.delete(key);
  }
}

// Drop-in compatible object matching expo-secure-store API
export const storage = {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
