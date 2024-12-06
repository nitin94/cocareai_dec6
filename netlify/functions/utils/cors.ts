import { corsConfig } from './cors-config';

export function handleOptionsRequest() {
  return {
    statusCode: 204,
    headers: {
      ...corsConfig.headers,
      'Content-Length': '0'
    },
    body: ''
  };
}

export function addCorsHeaders(response: { statusCode: number; body: string; headers?: Record<string, string> }) {
  return {
    ...response,
    headers: {
      ...corsConfig.headers,
      ...(response.headers || {})
    }
  };
}