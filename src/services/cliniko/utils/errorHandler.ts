import { ClinikoError } from '../types';

export class ClinikoApiError extends Error implements ClinikoError {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ClinikoApiError';
    this.status = status;
  }

  static fromError(error: unknown): ClinikoApiError {
    if (error instanceof ClinikoApiError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new ClinikoApiError(error.message);
    }
    
    return new ClinikoApiError('An unexpected error occurred');
  }
}

export function handleApiError(error: unknown): never {
  const apiError = ClinikoApiError.fromError(error);
  console.error(`Cliniko API Error (${apiError.status}):`, apiError.message);
  throw apiError;
}