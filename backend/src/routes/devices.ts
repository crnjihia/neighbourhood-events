import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /devices/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { pushToken, categories, radiusKm, latitude, longitude, email, name, userId } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: 'pushToken is required' });
    }

    const categoriesJson = Array.isArray(categories) ? categories : ['tree_planting', 'cleanup', 'meetup', 'blood_donation'];

    if (userId) {
      await prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          name: name || 'Neighbourhood Resident',
          email: email || `user_${Date.now()}@nairobi.org`,
          pushToken,
          notificationCategories: categoriesJson,
          radiusKm: radiusKm ? Number(radiusKm) : 5,
          latitude: latitude ? Number(latitude) : -1.2921,
          longitude: longitude ? Number(longitude) : 36.8219,
        },
        update: {
          pushToken,
          notificationCategories: categoriesJson,
          radiusKm: radiusKm ? Number(radiusKm) : undefined,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
        },
      });
    } else if (email) {
      await prisma.user.upsert({
        where: { email },
        create: {
          name: name || 'Neighbourhood Resident',
          email,
          pushToken,
          notificationCategories: categoriesJson,
          radiusKm: radiusKm ? Number(radiusKm) : 5,
          latitude: latitude ? Number(latitude) : -1.2921,
          longitude: longitude ? Number(longitude) : 36.8219,
        },
        update: {
          pushToken,
          notificationCategories: categoriesJson,
          radiusKm: radiusKm ? Number(radiusKm) : undefined,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
        },
      });
    }

    return res.json({ success: true, message: 'Device preferences saved' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
