import { useEffect, useState } from 'react';
import { database } from '../db/database';
import Event from '../db/models/Event';
import { Q } from '@nozbe/watermelondb';

export function useEvents(selectedCategories: string[]) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const collection = database.get<Event>('events');
    const query = selectedCategories.length
      ? collection.query(Q.where('category', Q.oneOf(selectedCategories)))
      : collection.query();
    const subscription = query.observe().subscribe(setEvents);
    return () => subscription.unsubscribe();
  }, [selectedCategories]);

  return events;
}
