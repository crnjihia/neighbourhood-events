import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { getItemAsync, setItemAsync } from '../services/storage';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeColors {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  danger: string;
  warning: string;
  info: string;
  chipBackground: string;
  chipActiveBackground: string;
  inputBackground: string;
  shadowColor: string;
}

const lightColors: ThemeColors = {
  isDark: false,
  background: '#F8FAF8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderSubtle: '#EDF2F7',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#15803D', // rich forest emerald
  primaryLight: '#DCFCE7',
  primaryDark: '#14532D',
  accent: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#0284C7',
  chipBackground: '#F1F5F9',
  chipActiveBackground: '#15803D',
  inputBackground: '#F8FAFC',
  shadowColor: 'rgba(15, 23, 42, 0.08)',
};

const darkColors: ThemeColors = {
  isDark: true,
  background: '#0B0F19', // deep nocturnal obsidian
  surface: '#111827',
  surfaceElevated: '#1E293B',
  card: '#151D2C',
  border: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#22C55E', // vivid neon mint-emerald
  primaryLight: 'rgba(34, 197, 94, 0.18)',
  primaryDark: '#16A34A',
  accent: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  info: '#38BDF8',
  chipBackground: '#1E293B',
  chipActiveBackground: '#22C55E',
  inputBackground: '#151D2C',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  colors: lightColors,
  setThemeMode: async () => {},
  toggleTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    getItemAsync('app_theme_mode').then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setMode(saved);
      }
    });
  }, []);

  const setThemeMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    await setItemAsync('app_theme_mode', newMode);
  };

  const isDarkMode =
    mode === 'dark' || (mode === 'system' && deviceScheme === 'dark');

  const toggleTheme = async () => {
    const nextMode: ThemeMode = isDarkMode ? 'light' : 'dark';
    await setThemeMode(nextMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
