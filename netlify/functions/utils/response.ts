import { corsConfig } from './cors-config';

export function createSuccessResponse(data: unknown) {
  return {
    statusCode: 200,
    headers: corsConfig.headers,
    body: JSON.stringify(data)
  };
}

export function createErrorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: corsConfig.headers,
    body: JSON.stringify({
      error: message
    })
  };
}