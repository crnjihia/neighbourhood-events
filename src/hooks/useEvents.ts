import { useEffect, useState } from 'react';
import { database } from '../db/database';
import Event from '../db/models/Event';
import { Q } from '@nozbe/watermelondb';
import { useLocation } from './useLocation';

export function haversineDistance(
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

export type EventWithDistance = Event & {
  distanceKm?: number;
};

export function useEvents(selectedCategories: string[] = [], maxRadiusKm?: number) {
  const [events, setEvents] = useState<EventWithDistance[]>([]);
  const { location } = useLocation();

  useEffect(() => {
    try {
      const collection = database.get<Event>('events');
      const query = selectedCategories.length > 0
        ? collection.query(Q.where('category', Q.oneOf(selectedCategories)))
        : collection.query();

      const subscription = query.observe().subscribe(rawEvents => {
        let processed: EventWithDistance[] = rawEvents.map(ev => {
          const item = ev as unknown as EventWithDistance;
          if (location) {
            item.distanceKm = haversineDistance(
              location.latitude,
              location.longitude,
              ev.latitude,
              ev.longitude,
            );
          }
          return item;
        });

        // Filter by radius if specified
        if (location && maxRadiusKm && maxRadiusKm > 0) {
          processed = processed.filter(ev => (ev.distanceKm ?? 0) <= maxRadiusKm);
        }

        // Sort by distance if location is available, otherwise by start date
        if (location) {
          processed.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
        }

        setEvents(processed);
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      // In tests or before DB init, gracefully set empty list
      setEvents([]);
    }
  }, [selectedCategories, location, maxRadiusKm]);

  return events;
}
