import { API_CONFIG, getApiUrl } from '../../../config/api';
import { ClinikoEndpoint } from './endpoints';
import { ClinikoApiError, handleApiError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { RateLimiter } from '../utils/rateLimiter';

const rateLimiter = new RateLimiter({
  maxRequests: 150,
  timeWindow: 60000 // 1 minute
});

export class ClinikoApiClient {
  constructor(private readonly apiKey: string) {
    if (!apiKey) {
      throw new ClinikoApiError('API key is required', 401);
    }
  }

  async request<T>(endpoint: ClinikoEndpoint, queryParams: Record<string, string> = {}): Promise<T> {
    // Wait for rate limit availability
    await rateLimiter.waitForAvailability();

    const url = new URL(getApiUrl(endpoint as keyof typeof API_CONFIG.ENDPOINTS));
    
    // Add query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    logger.debug('Making request to:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'X-Cliniko-API-Key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('API Error Response:', errorText);
        throw new ClinikoApiError(
          `HTTP error ${response.status}: ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      logger.debug('Response received:', data);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}