export interface ClinikoResponse<T = any> {
  data: T;
  meta: {
    total_entries: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface ClinikoError {
  status: number;
  message: string;
  code?: string;
}