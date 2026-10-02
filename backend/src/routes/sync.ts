import { Router } from 'express';

const router = Router();

// Pull changes since last timestamp
router.get('/pull', (req, res) => {
  const lastPulledAt = Number(req.query.lastPulledAt) || 0;
  // TODO: Query PostgreSQL for changes after `lastPulledAt`
  // For now, return empty changes and current timestamp
  res.json({ changes: [], timestamp: Date.now() });
});

// Push local changes to server
router.post('/push', (req, res) => {
  const { changes } = req.body;
  // TODO: Apply `changes` to PostgreSQL with conflict resolution
  // For now, acknowledge receipt
  res.json({ success: true, timestamp: Date.now() });
});

export default router;
