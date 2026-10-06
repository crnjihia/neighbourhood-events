import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  selected: string[];
  onToggle: (category: string) => void;
};

const CATEGORIES = [
  { id: 'tree_planting', icon: '🌲', label: 'tree planting' },
  { id: 'cleanup', icon: '🌊', label: 'cleanup' },
  { id: 'blood_donation', icon: '🩸', label: 'blood donation' },
  { id: 'meetup', icon: '☕', label: 'meetup' },
];

export default function CategoryFilter({ selected, onToggle }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map(cat => {
        const isSelected = selected.includes(cat.id);
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onToggle(cat.id)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? colors.primary : colors.textSecondary,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {isSelected ? '☑' : '☐'} {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
  },
});
