import { useState, useEffect } from 'react';
import { clinikoService } from '../service';
import type { RetentionMetrics } from '../../../types/demo';

export function useRetentionMetrics(timeFrame: number) {
  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await clinikoService.getRetentionMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load retention metrics');
        console.error('Error loading metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [timeFrame]);

  return { metrics, isLoading, error };
}