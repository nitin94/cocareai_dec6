import { CLINIKO_CONFIG } from '../../../src/config/cliniko/constants';

export function buildClinikoHeaders(apiKey: string): Record<string, string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Ensure API key ends with a colon before base64 encoding
  const authKey = apiKey.endsWith(':') ? apiKey : `${apiKey}:`;
  
  return {
    'Authorization': `Basic ${Buffer.from(authKey).toString('base64')}`,
    'User-Agent': CLINIKO_CONFIG.USER_AGENT,
    'Accept': CLINIKO_CONFIG.HEADERS.ACCEPT,
    'Content-Type': CLINIKO_CONFIG.HEADERS.CONTENT_TYPE,
  };
}

export function validateClinikoHeaders(headers: Record<string, string>): void {
  if (!headers['Authorization']?.startsWith('Basic ')) {
    throw new Error('Invalid Authorization header format. Must use Basic auth');
  }

  if (!headers['User-Agent']) {
    throw new Error('User-Agent header is required');
  }

  if (headers['Accept'] !== CLINIKO_CONFIG.HEADERS.ACCEPT) {
    throw new Error('Accept header must be application/json');
  }

  // Validate base64 format of Authorization header
  try {
    const base64Credentials = headers['Authorization'].replace('Basic ', '');
    const decoded = Buffer.from(base64Credentials, 'base64').toString();
    if (!decoded.includes(':')) {
      throw new Error('Invalid API key format in Authorization header');
    }
  } catch {
    throw new Error('Invalid base64 encoding in Authorization header');
  }
}