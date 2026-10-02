import request from 'supertest';
import express from 'express';
import syncRouter from '../routes/sync';

const app = express();
app.use(express.json());
app.use('/sync', syncRouter);

describe('/sync/pull', () => {
  it('returns empty changes when no timestamp', async () => {
    const res = await request(app).get('/sync/pull');
    expect(res.status).toBe(200);
    expect(res.body.changes).toEqual([]);
  });
});
