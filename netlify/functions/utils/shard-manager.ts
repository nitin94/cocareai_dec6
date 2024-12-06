import { CLINIKO_CONFIG } from '../../../src/config/cliniko/constants';

interface ShardCache {
  [apiKey: string]: {
    shard: string;
    timestamp: number;
  };
}

// In-memory cache for shards with 24-hour expiration
const shardCache: ShardCache = {};
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function getCachedShard(apiKey: string): string | null {
  const cached = shardCache[apiKey];
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_EXPIRATION) {
    delete shardCache[apiKey];
    return null;
  }

  return cached.shard;
}

export function setCachedShard(apiKey: string, shard: string): void {
  shardCache[apiKey] = {
    shard: shard,
    timestamp: Date.now(),
  };
}

export function extractShardFromResponse(headers: Headers): string {
  const shard = headers.get(CLINIKO_CONFIG.SHARD_HEADER);
  return shard || CLINIKO_CONFIG.DEFAULT_SHARD;
}