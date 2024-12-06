import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClinikoApi } from '../../services/cliniko/api';
import { ClinikoApiError } from '../../services/cliniko/utils/errorHandler';

describe('ClinikoApi', () => {
  let api: ClinikoApi;
  const mockApiKey = 'test_api_key';

  beforeEach(() => {
    api = new ClinikoApi(mockApiKey);
    vi.clearAllMocks();
  });

  describe('validateApiKey', () => {
    it('should return true for valid API key', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ practitioners: [] })
      });

      const result = await api.validateApiKey();
      expect(result).toBe(true);
    });

    it('should return false for invalid API key', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized')
      });

      const result = await api.validateApiKey();
      expect(result).toBe(false);
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const result = await api.validateApiKey();
      expect(result).toBe(false);
    });
  });

  describe('getPatients', () => {
    it('should fetch and return patients', async () => {
      const mockPatients = [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          patients: mockPatients,
          total_entries: 2,
          total_pages: 1
        })
      });

      const patients = await api.getPatients();
      expect(patients).toEqual(mockPatients);
    });

    it('should handle pagination', async () => {
      const page1 = [{ id: 1, first_name: 'John' }];
      const page2 = [{ id: 2, first_name: 'Jane' }];

      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            patients: page1,
            total_entries: 2,
            total_pages: 2
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            patients: page2,
            total_entries: 2,
            total_pages: 2
          })
        });

      const patients = await api.getPatients();
      expect(patients).toEqual([...page1, ...page2]);
    });

    it('should handle rate limiting', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limit exceeded')
      });

      await expect(api.getPatients()).rejects.toThrow(ClinikoApiError);
    });
  });
});