import { Router, Request, Response } from 'express';
import { pullChanges, pushChanges } from '../services/sync';

const router = Router();

// GET /sync/pull?lastPulledAt=...&schemaVersion=...
router.get('/pull', async (req: Request, res: Response) => {
  try {
    const lastPulledAt = Number(req.query.lastPulledAt) || 0;
    const result = await pullChanges(lastPulledAt);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /sync/pull:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /sync/push?lastPulledAt=...
router.post('/push', async (req: Request, res: Response) => {
  try {
    const lastPulledAt = Number(req.query.lastPulledAt) || 0;
    const { changes } = req.body;
    if (!changes) {
      return res.status(400).json({ error: 'Missing changes in push body' });
    }
    const result = await pushChanges(changes, lastPulledAt);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /sync/push:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
