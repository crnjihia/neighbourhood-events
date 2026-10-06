import { conflictResolver } from '../sync';

describe('Sync conflict resolution', () => {
  it('resolves RSVP conflicts using last-write-wins based on timestamp', () => {
    const localRSVP: any = { id: 'r1', status: 'going', updated_at: 2000 };
    const remoteRSVP: any = { id: 'r1', status: 'declined', updated_at: 1000 };
    const resolved = conflictResolver('rsvps' as any, localRSVP, remoteRSVP, remoteRSVP);
    expect(resolved.status).toBe('going');

    // Remote is newer
    const newerRemote: any = { id: 'r1', status: 'interested', updated_at: 3000 };
    const resolvedNewer = conflictResolver('rsvps' as any, localRSVP, newerRemote, newerRemote);
    expect(resolvedNewer.status).toBe('interested');
  });

  it('resolves event conflicts using server-wins strategy', () => {
    const localEvent: any = { id: 'e1', title: 'Local Edited Title' };
    const remoteEvent: any = { id: 'e1', title: 'Server Authoritative Title' };
    const resolved = conflictResolver('events' as any, localEvent, remoteEvent, remoteEvent);
    expect(resolved.title).toBe('Server Authoritative Title');
  });
});
