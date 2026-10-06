import React from 'react';
import { render } from '@testing-library/react-native';
import EventCard from '../EventCard';

test('renders event title', () => {
  const event = {
    id: '1',
    title: 'Karura Forest Tree Planting',
    category: 'tree_planting',
    latitude: -1.2405,
    longitude: 36.8344,
    address: 'Karura Forest Gate C, Limuru Rd',
    distanceKm: 2.4,
  };
  const { getByText } = render(<EventCard event={event} />);
  expect(getByText('Karura Forest Tree Planting')).toBeTruthy();
  expect(getByText('2.4 km away')).toBeTruthy();
});
