import { CLINIKO_CONFIG, getShardedBaseUrl } from '../../../src/config/cliniko/constants';
import { getCachedShard } from './shard-manager';

export function buildClinikoUrl(path: string, queryParams?: Record<string, string>, apiKey?: string): string {
  const cleanPath = path.replace('/api/cliniko-proxy', '');
  const queryString = queryParams 
    ? '?' + new URLSearchParams(queryParams).toString() 
    : '';

  // Use sharded URL if we have a cached shard for this API key
  const shard = apiKey ? getCachedShard(apiKey) : null;
  const baseUrl = shard ? getShardedBaseUrl(shard) : CLINIKO_CONFIG.API_BASE_URL;
    
  return `${baseUrl}${cleanPath}${queryString}`;
}