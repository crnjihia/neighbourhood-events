import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import syncRouter from './routes/sync';
import eventsRouter from './routes/events';
import rsvpRouter from './routes/rsvp';
import devicesRouter from './routes/devices';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/sync', syncRouter);
app.use('/events', eventsRouter);
app.use('/rsvp', rsvpRouter);
app.use('/devices', devicesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
