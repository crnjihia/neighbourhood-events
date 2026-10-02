import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  // Create new event – in real app validate and store in PostgreSQL
  const event = req.body;
  // TODO: Save to DB
  res.status(201).json(event);
});

export default router;
