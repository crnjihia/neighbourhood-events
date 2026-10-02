import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoryFilter from '../CategoryFilter';

test('toggles category selection', () => {
  const onToggle = jest.fn();
  const { getByText } = render(<CategoryFilter selected={[]} onToggle={onToggle} />);
  const btn = getByText('☐ tree planting');
  fireEvent.press(btn);
  expect(onToggle).toHaveBeenCalledWith('tree_planting');
});
