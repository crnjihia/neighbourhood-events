import { Router, Request, Response } from 'express';
import { fanOutEventPush } from '../services/push';

const router = Router();

// POST /notifications/trigger - admin endpoint to fan out push to nearby users
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ error: 'eventId is required' });
    }

    const result = await fanOutEventPush(eventId);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error in /notifications/trigger:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
