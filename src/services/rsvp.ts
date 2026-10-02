import { database } from '../db/database';
import RSVP from '../db/models/RSVP';
import * as SecureStore from 'expo-secure-store';

export async function createRSVP(eventId: string, status: string): Promise<void> {
  const token = await SecureStore.getItemAsync('authToken');
  const response = await fetch(`${process.env.API_URL}/rsvp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ eventId, status }),
  });
  if (!response.ok) {
    throw new Error('RSVP failed');
  }
  // Write locally to WatermelonDB for offline support
  await database.write(async () => {
    await database.collections.get<RSVP>('rsvps').create(rsvp => {
      rsvp.eventId = eventId;
      rsvp.userId = 'localUser'; // placeholder – replace with actual user id after auth
      rsvp.status = status;
      rsvp.createdAt = new Date();
    });
  });
}
