import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../context/ThemeContext';

export default function OfflineBanner() {
  const [isConnected, setIsConnected] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.isDark ? '#78350F' : '#FEF3C7',
          borderColor: colors.isDark ? '#F59E0B' : '#FCD34D',
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.isDark ? '#FDE68A' : '#92400E' }]}>
        ⚡ You are offline — Changes are saved locally and will sync once reconnected
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
