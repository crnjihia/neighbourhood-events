import { useEffect, useState } from 'react';
import { database } from '../db/database';
import Event from '../db/models/Event';
import { Q } from '@nozbe/watermelondb';
import { useLocation } from '../hooks/useLocation';

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useEvents(selectedCategories: string[]) {
  const [events, setEvents] = useState<Event[]>([]);
  const { location } = useLocation(); // { latitude, longitude } | null

  useEffect(() => {
    const collection = database.get<Event>('events');
    const query = selectedCategories.length
      ? collection.query(Q.where('category', Q.oneOf(selectedCategories)))
      : collection.query();
    const subscription = query.observe().subscribe(rawEvents => {
      if (location) {
        const withDist = rawEvents.map(ev => ({
          ...ev,
          _distance: haversine(
            location.latitude,
            location.longitude,
            ev.latitude,
            ev.longitude,
          ),
        }));
        withDist.sort((a, b) => a._distance - b._distance);
        setEvents(withDist as unknown as Event[]);
      } else {
        setEvents(rawEvents);
      }
    });
    return () => subscription.unsubscribe();
  }, [selectedCategories, location]);

  return events;
}
