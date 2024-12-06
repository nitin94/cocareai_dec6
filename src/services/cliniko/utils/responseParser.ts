import { ClinikoResponse } from '../api/types';

export function parseClinikoResponse<T>(response: Response): Promise<ClinikoResponse<T>> {
  return response.json().then(data => ({
    data,
    meta: {
      total_entries: data.total_entries || 0,
      total_pages: data.total_pages || 1,
      current_page: data.current_page || 1,
      per_page: data.per_page || 50
    }
  }));
}