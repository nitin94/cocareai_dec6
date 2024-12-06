import { ClinikoApiClient } from './api/client';
import { CLINIKO_ENDPOINTS } from './api/endpoints';
import type { ClinikoResponse } from './types';

export class ClinikoApi {
  private client: ClinikoApiClient;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.client = new ClinikoApiClient(apiKey);
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.request<ClinikoResponse>(CLINIKO_ENDPOINTS.practitioners, { per_page: '1' });
      return true;
    } catch (error) {
      console.error('API Key Validation Error:', error);
      return false;
    }
  }

  async getPatients(): Promise<any[]> {
    let allPatients: any[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const response = await this.client.request<ClinikoResponse>(
          CLINIKO_ENDPOINTS.patients,
          { page: page.toString(), per_page: '50' }
        );

        if (response.patients) {
          allPatients = [...allPatients, ...response.patients];
        }

        hasMorePages = page * 50 < (response.total_entries || 0);
        page++;
      } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
    }

    return allPatients;
  }
}