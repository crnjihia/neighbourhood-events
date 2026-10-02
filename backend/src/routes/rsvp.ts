import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  const { eventId, status } = req.body;
  // In a real implementation, persist RSVP and return result
  res.json({ eventId, status, createdAt: Date.now() });
});

export default router;
