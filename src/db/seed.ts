import { database } from './database';
import Event from './models/Event';
import { SEED_NAIROBI_EVENTS } from '../data/seedEvents';

/**
 * Ensures WatermelonDB has rich initial Nairobi events populated.
 * Runs automatically on startup if local database is empty or has fewer events.
 */
export async function ensureSeedEvents(): Promise<number> {
  try {
    const eventsCollection = database.collections.get<Event>('events');
    const existing = await eventsCollection.query().fetch();

    if (existing.length >= SEED_NAIROBI_EVENTS.length) {
      return existing.length;
    }

    const existingTitles = new Set(existing.map(e => e.title));
    const now = Date.now();
    let inserted = 0;

    await database.write(async () => {
      for (const item of SEED_NAIROBI_EVENTS) {
        if (!existingTitles.has(item.title)) {
          await eventsCollection.create(ev => {
            ev.title = item.title;
            ev.description = item.description;
            ev.category = item.category;
            ev.latitude = item.latitude;
            ev.longitude = item.longitude;
            ev.address = item.address;
            ev.startsAt = new Date(now + item.startsAtOffsetHours * 3600 * 1000);
            ev.endsAt = new Date(now + (item.startsAtOffsetHours + item.durationHours) * 3600 * 1000);
            ev.capacity = item.capacity;
            ev.rsvpCount = item.rsvpCount;
            ev.imageUrl = item.imageUrl || undefined;
          });
          inserted++;
        }
      }
    });

    return existing.length + inserted;
  } catch (error) {
    console.warn('Seed events check skipped or error:', error);
    return 0;
  }
}
