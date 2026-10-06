import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const expo = new Expo();
const prisma = new PrismaClient();

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface PushResult {
  sent: number;
  tickets: ExpoPushTicket[];
}

/**
 * Send push notification fan-out for a given event to all nearby opted-in users
 */
export async function fanOutEventPush(eventId: string): Promise<PushResult> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  // Find all users who have registered a push token
  const users = await prisma.user.findMany({
    where: {
      pushToken: { not: null },
    },
  });

  const messages: ExpoPushMessage[] = [];

  for (const user of users) {
    if (!user.pushToken || !Expo.isExpoPushToken(user.pushToken)) {
      continue;
    }

    // Check category opt-in
    let categories: string[] = [];
    if (user.notificationCategories) {
      if (Array.isArray(user.notificationCategories)) {
        categories = user.notificationCategories as string[];
      } else if (typeof user.notificationCategories === 'string') {
        try {
          categories = JSON.parse(user.notificationCategories);
        } catch {
          categories = [];
        }
      }
    }

    if (categories.length > 0 && !categories.includes(event.category)) {
      continue; // User did not opt into this category
    }

    // Check distance radius
    const userLat = user.latitude ?? -1.2921;
    const userLon = user.longitude ?? 36.8219;
    const distanceKm = haversineDistance(
      event.latitude,
      event.longitude,
      userLat,
      userLon,
    );

    const userRadius = user.radiusKm ?? 5;
    if (distanceKm > userRadius) {
      continue; // Outside user's notification radius
    }

    const categoryFormatted = event.category.replace('_', ' ');
    messages.push({
      to: user.pushToken,
      sound: 'default',
      title: `New ${categoryFormatted} nearby!`,
      body: `${event.title} is happening ${distanceKm < 1 ? 'nearby' : `${Math.round(distanceKm)} km away`}. Tap to view or RSVP!`,
      data: {
        eventId: event.id,
        category: event.category,
      },
      categoryId: 'event_invite',
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push chunk:', error);
    }
  }

  return {
    sent: messages.length,
    tickets,
  };
}
