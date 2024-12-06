import fetch from 'node-fetch';
import { CLINIKO_CONFIG } from '../../../src/config/cliniko/constants';
import { buildClinikoHeaders } from '../utils/cliniko-headers';
import { buildClinikoUrl } from '../utils/url-builder';
import { logRequest, logResponse, logError } from '../utils/logger';
import { getCachedShard, setCachedShard, extractShardFromResponse } from '../utils/shard-manager';

export async function validateClinikoApiKey(apiKey: string): Promise<boolean> {
  const url = buildClinikoUrl('/practitioners', { per_page: '1' }, apiKey);
  const headers = buildClinikoHeaders(apiKey);
  
  logRequest('Validating API key', url, headers);
  
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers 
    });
    
    const responseText = await response.text();
    logResponse('API Key Validation', response.status, responseText);

    // Extract and cache shard information if the request was successful
    if (response.ok) {
      const shard = extractShardFromResponse(response.headers);
      if (shard) {
        setCachedShard(apiKey, shard);
      }
      return true;
    }

    if (response.status === 401) {
      logError('API Key Validation', new Error('Invalid API key'));
      return false;
    }

    throw new Error(`Unexpected response: ${response.status}`);
  } catch (error) {
    logError('API Key Validation Failed', error);
    return false;
  }
}