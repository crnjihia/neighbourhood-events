import { database } from '../db/database';
import RSVP from '../db/models/RSVP';
import Event from '../db/models/Event';
import * as SecureStore from './storage';
import { Q } from '@nozbe/watermelondb';
import { synchronize } from '../db/sync';

export async function createRSVP(eventId: string, status: string): Promise<RSVP> {
  const currentUserId = (await SecureStore.getItemAsync('userId')) || 'local-user';

  // 1. Perform local write first (offline-first source of truth)
  let savedRsvp: RSVP | undefined;

  await database.write(async () => {
    const rsvpsCollection = database.collections.get<RSVP>('rsvps');

    // Check if an RSVP for this event and user already exists
    const existing = await rsvpsCollection
      .query(Q.where('event_id', eventId), Q.where('user_id', currentUserId))
      .fetch();

    if (existing.length > 0) {
      savedRsvp = await existing[0].update(record => {
        record.status = status;
      });
    } else {
      savedRsvp = await rsvpsCollection.create(record => {
        record.eventId = eventId;
        record.userId = currentUserId;
        record.status = status;
        record.createdAt = new Date();
      });
    }

    // Optimistically update local RSVP count on the event
    try {
      const eventRecord = await database.collections.get<Event>('events').find(eventId);
      if (eventRecord) {
        await eventRecord.update(ev => {
          const currentCount = ev.rsvpCount || 0;
          ev.rsvpCount = status === 'going' ? currentCount + 1 : Math.max(0, currentCount);
        });
      }
    } catch {
      // Event may not be in local DB yet
    }
  });

  // 2. Trigger background sync opportunistically without blocking the user
  synchronize().catch(() => {
    // If offline, the change stays queued in WatermelonDB and syncs automatically upon reconnect
  });

  return savedRsvp!;
}

export async function getUserRSVP(eventId: string): Promise<string | null> {
  try {
    const currentUserId = (await SecureStore.getItemAsync('userId')) || 'local-user';
    const rsvps = await database.collections
      .get<RSVP>('rsvps')
      .query(Q.where('event_id', eventId), Q.where('user_id', currentUserId))
      .fetch();

    return rsvps.length > 0 ? rsvps[0].status : null;
  } catch {
    return null;
  }
}
