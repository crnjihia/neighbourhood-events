import { useState, useCallback, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { synchronize } from '../db/sync';

export function useSync() {
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);

  const sync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncError(null);
    try {
      await synchronize();
      setLastSyncedAt(new Date());
    } catch (err: any) {
      setSyncError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  // Automatically trigger sync when coming back online
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        sync().catch(() => {});
      }
    });
    return () => unsubscribe();
  }, [sync]);

  return {
    syncing,
    lastSyncedAt,
    syncError,
    sync,
  };
}
