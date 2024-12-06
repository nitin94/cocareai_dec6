import { auth } from './firebase';

export const CLINIKO_CONFIG = {
  API_BASE_URL: 'https://api.cliniko.com/v1',
  USER_AGENT: 'Patient Retention Tracker (support@patientretention.app)',
} as const;

export function getAuthorizationHeader(apiKey: string): string {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return `Basic ${btoa(apiKey + ':')}`;
}

export function getRequestHeaders(apiKey: string): HeadersInit {
  return {
    'Authorization': getAuthorizationHeader(apiKey),
    'User-Agent': CLINIKO_CONFIG.USER_AGENT,
    'Accept': 'application/json',
  };
}