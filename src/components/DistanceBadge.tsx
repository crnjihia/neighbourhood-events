import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DistanceBadgeProps {
  distanceKm?: number | null;
}

export default function DistanceBadge({ distanceKm }: DistanceBadgeProps) {
  const { colors } = useTheme();

  if (distanceKm === undefined || distanceKm === null) {
    return null;
  }

  const formattedDistance =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m away`
      : `${distanceKm.toFixed(1)} km away`;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.isDark ? 'rgba(34, 197, 94, 0.4)' : '#C8E6C9',
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.primary }]}>{formattedDistance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
