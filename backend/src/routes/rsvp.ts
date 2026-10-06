import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /rsvp
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, userId, status } = req.body;
    if (!eventId || !status) {
      return res.status(400).json({ error: 'eventId and status are required' });
    }

    const effectiveUserId = userId || 'anonymous-user';

    const rsvp = await prisma.rSVP.create({
      data: {
        eventId,
        userId: effectiveUserId,
        status,
      },
    });

    if (status === 'going') {
      await prisma.event.update({
        where: { id: eventId },
        data: { rsvpCount: { increment: 1 } },
      }).catch(() => {});
    }

    return res.status(201).json(rsvp);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /rsvp/user/:userId
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { userId: req.params.userId },
      include: { event: true },
    });
    return res.json(rsvps);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
