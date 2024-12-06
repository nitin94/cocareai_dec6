import { API_CONFIG } from '../../../src/config/api';

export class ClinikoApiClient {
  constructor(private readonly apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.cliniko.com/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        'User-Agent': 'Patient Retention Tracker',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.request('/practitioners?per_page=1');
      return true;
    } catch {
      return false;
    }
  }

  async getPatients(): Promise<any[]> {
    const response = await this.request('/patients');
    return response.patients || [];
  }
}