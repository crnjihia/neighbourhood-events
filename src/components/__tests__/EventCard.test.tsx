import React from 'react';
import { render } from '@testing-library/react-native';
import EventCard from '../../EventCard';

test('renders event title', () => {
  const event = { id: '1', title: 'Test Event', category: 'cleanup', latitude: 0, longitude: 0 };
  const { getByText } = render(<EventCard event={event} />);
  expect(getByText('Test Event')).toBeTruthy();
});
