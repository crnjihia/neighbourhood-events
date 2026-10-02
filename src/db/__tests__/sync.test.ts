import { database } from '../../db/database';
import { synchronize } from '../../db/sync';

describe('Sync conflict resolution', () => {
  it('should handle empty pull without error', async () => {
    // Mock fetch for pull
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ changes: [], timestamp: Date.now() }),
    } as any);
    await expect(synchronize()).resolves.not.toThrow();
  });
});
