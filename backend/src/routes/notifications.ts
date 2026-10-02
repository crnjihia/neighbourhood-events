import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as ExpoServerSDK from 'expo-server-sdk';

const router = Router();
const prisma = new PrismaClient();
const expo = new ExpoServerSDK.Expo();

// Admin endpoint to trigger push notifications for a new event
router.post('/trigger', async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: 'eventId required' });

  // Fetch event and users within radius who opted in to this category
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const users = await prisma.user.findMany({
    where: {
      radiusKm: { gte: 0 },
      notificationCategories: { contains: event.category },
    },
  });

  const messages: any[] = [];
  for (const user of users) {
    if (!user.pushToken) continue;
    const dist = haversine(
      event.latitude,
      event.longitude,
      user.latitude ?? 0,
      user.longitude ?? 0,
    );
    if (dist <= (user.radiusKm ?? 5)) {
      messages.push({
        to: user.pushToken,
        sound: 'default',
        title: 'New event nearby!',
        body: `${event.title} is happening ${Math.round(dist)} km away`,
        data: { eventId: event.id },
      });
    }
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }
  res.json({ success: true, sent: messages.length });
});

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router;
