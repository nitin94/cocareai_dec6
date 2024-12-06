import { auth } from '../firebase';
import { CLINIKO_CONFIG } from './constants';

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