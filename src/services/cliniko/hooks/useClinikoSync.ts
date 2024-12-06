import { useState } from 'react';
import { clinikoService } from '../service';

export function useClinikoSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const syncData = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      await clinikoService.syncPatients((progress) => {
        setProgress(progress);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    progress,
    error,
    syncData
  };
}