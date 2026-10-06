import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'neighbourhood_events_secret_jwt';

// In-memory fallback if database is bootstrapping
const memoryUsers = new Map<string, { id: string; name: string; email: string; passwordHash: string }>();

// POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          radiusKm: 5,
        },
      });

      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(201).json({ id: user.id, name: user.name, email: user.email, token });
    } catch {
      // Memory fallback for offline/isolated prototype runs
      if (memoryUsers.has(email)) {
        return res.status(409).json({ error: 'User already exists' });
      }
      const id = `user_${Date.now()}`;
      memoryUsers.set(email, { id, name, email, passwordHash });
      const token = jwt.sign({ sub: id, email }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(201).json({ id, name, email, token });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({ id: user.id, name: user.name, email: user.email, token });
      }
    } catch {
      // Fallback
    }

    const memUser = memoryUsers.get(email);
    if (memUser && bcrypt.compareSync(password, memUser.passwordHash)) {
      const token = jwt.sign({ sub: memUser.id, email: memUser.email }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ id: memUser.id, name: memUser.name, email: memUser.email, token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
