import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fanOutEventPush } from '../services/push';

const router = Router();
const prisma = new PrismaClient();

// GET /events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const whereClause: any = {};
    if (category && typeof category === 'string') {
      whereClause.category = category;
    }
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startsAt: 'asc' },
    });
    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /events/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { rsvps: true },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(event);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /events
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      startsAt,
      endsAt,
      capacity,
      imageUrl,
      organizerId,
    } = req.body;

    if (!title || !category || latitude === undefined || longitude === undefined || !address) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || '',
        category,
        latitude: Number(latitude),
        longitude: Number(longitude),
        address,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        endsAt: endsAt ? new Date(endsAt) : new Date(Date.now() + 7200000),
        capacity: capacity ? Number(capacity) : null,
        imageUrl: imageUrl || null,
        organizerId: organizerId || null,
        rsvpCount: 0,
      },
    });

    // Fan-out push notifications asynchronously in the background
    fanOutEventPush(newEvent.id).catch(err => {
      console.error('Failed to fan out push for new event:', err);
    });

    return res.status(201).json(newEvent);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
