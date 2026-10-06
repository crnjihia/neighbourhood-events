import { synchronize as wdbSynchronize, SyncConflictResolver } from '@nozbe/watermelondb/sync';
import { database } from './database';
import { getApiBaseUrl } from '../services/api';
import * as SecureStore from '../services/storage';

/**
 * Custom conflict resolver for WatermelonDB sync
 * Server-wins for events and user profiles; last-write-wins for RSVPs
 */
export const conflictResolver: SyncConflictResolver = (table, local, remote, resolved) => {
  if (table === 'rsvps') {
    const localTime = Number(local.created_at || local.updated_at || 0);
    const remoteTime = Number(remote.created_at || remote.updated_at || 0);
    return localTime >= remoteTime ? local : remote;
  }
  // Server wins for events and other records
  return remote;
};

/**
 * Synchronize local WatermelonDB database with backend using official WatermelonDB sync protocol.
 */
export async function synchronize(authToken?: string): Promise<void> {
  const token = authToken || (await SecureStore.getItemAsync('authToken').catch(() => null));
  const baseUrl = getApiBaseUrl();

  await wdbSynchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion }) => {
      const url = `${baseUrl}/sync/pull?lastPulledAt=${lastPulledAt ?? 0}&schemaVersion=${schemaVersion}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Sync pull failed with status ${response.status}`);
      }

      const { changes, timestamp } = await response.json();
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const url = `${baseUrl}/sync/push?lastPulledAt=${lastPulledAt ?? 0}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ changes }),
      });

      if (!response.ok) {
        throw new Error(`Sync push failed with status ${response.status}`);
      }
    },
    conflictResolver,
  });
}
