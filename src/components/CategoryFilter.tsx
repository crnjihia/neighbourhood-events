import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  selected: string[];
  onToggle: (category: string) => void;
};

const categories = ['tree_planting', 'blood_donation', 'cleanup', 'meetup'];

export default function CategoryFilter({ selected, onToggle }: Props) {
  return (
    <View style={styles.container}>
      {categories.map(cat => (
        <TouchableOpacity key={cat} onPress={() => onToggle(cat)} style={styles.item}>
          <Text style={styles.text}>
            {selected.includes(cat) ? '☑' : '☐'} {cat.replace('_', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  item: { marginRight: 8 },
  text: { fontSize: 14 },
});
