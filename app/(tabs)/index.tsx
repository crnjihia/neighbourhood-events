import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import CategoryFilter from '../../src/components/CategoryFilter';
import { useEvents } from '../../src/hooks/useEvents';
import EventCard from '../../src/components/EventCard';

export default function ExploreScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const events = useEvents(selectedCategories);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <CategoryFilter selected={selectedCategories} onToggle={toggleCategory} />
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
