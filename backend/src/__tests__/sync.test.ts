import request from 'supertest';
import express from 'express';
import syncRouter from '../routes/sync';

jest.mock('../services/sync', () => ({
  pullChanges: jest.fn().mockResolvedValue({
    changes: {
      events: { created: [], updated: [], deleted: [] },
      users: { created: [], updated: [], deleted: [] },
      rsvps: { created: [], updated: [], deleted: [] },
    },
    timestamp: 1700000000,
  }),
  pushChanges: jest.fn().mockResolvedValue({
    success: true,
    timestamp: 1700000001,
  }),
}));

const app = express();
app.use(express.json());
app.use('/sync', syncRouter);

describe('/sync endpoints', () => {
  it('GET /sync/pull returns changes conforming to WatermelonDB protocol', async () => {
    const res = await request(app).get('/sync/pull?lastPulledAt=0');
    expect(res.status).toBe(200);
    expect(res.body.changes).toBeDefined();
    expect(res.body.changes.events).toBeDefined();
    expect(res.body.changes.rsvps).toBeDefined();
    expect(res.body.timestamp).toBe(1700000000);
  });

  it('POST /sync/push applies incoming changes', async () => {
    const res = await request(app)
      .post('/sync/push?lastPulledAt=0')
      .send({
        changes: {
          rsvps: {
            created: [{ id: 'r1', eventId: 'e1', userId: 'u1', status: 'going' }],
          },
        },
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /sync/push returns 400 when changes missing', async () => {
    const res = await request(app).post('/sync/push?lastPulledAt=0').send({});
    expect(res.status).toBe(400);
  });
});
