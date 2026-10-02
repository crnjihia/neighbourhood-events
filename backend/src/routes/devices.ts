import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  const { pushToken, categories } = req.body;
  // Store token and categories in DB – omitted for brevity
  res.json({ success: true });
});

export default router;
