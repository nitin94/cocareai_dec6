export const CLINIKO_CONFIG = {
  API_BASE_URL: 'https://api.cliniko.com/v1',
  USER_AGENT: 'Patient Retention Tracker (support@patientretention.app)',
  HEADERS: {
    ACCEPT: 'application/json',
    CONTENT_TYPE: 'application/json',
  },
  SHARD_HEADER: 'X-Cliniko-Account-Shard',
  DEFAULT_SHARD: 'au4',
} as const;

export const getShardedBaseUrl = (shard: string): string => {
  return `https://api-${shard}.cliniko.com/v1`;
};