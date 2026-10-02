import { Router } from 'express';

const router = Router();

// Pull changes since last timestamp
router.get('/pull', (req, res) => {
  const lastPulledAt = Number(req.query.lastPulledAt) || 0;
  // In a real implementation, query PostgreSQL for changes after this timestamp
  res.json({ changes: [], timestamp: Date.now() });
});

// Push local changes to server
router.post('/push', (req, res) => {
  const { changes } = req.body;
  // Apply changes to PostgreSQL – omitted for brevity
  res.json({ success: true, timestamp: Date.now() });
});

export default router;
