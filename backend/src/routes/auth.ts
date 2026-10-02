import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Simple in‑memory user store for prototype
const users: Record<string, { id: string; name: string; email: string; passwordHash: string }> = {};

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users[email]) return res.status(409).json({ error: 'User exists' });
  const passwordHash = bcrypt.hashSync(password, 8);
  const id = Date.now().toString();
  users[email] = { id, name, email, passwordHash };
  res.json({ id, name, email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token });
});

export default router;
