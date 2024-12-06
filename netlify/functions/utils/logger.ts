interface RequestHeaders {
  Authorization?: string;
  'User-Agent': string;
  Accept: string;
  [key: string]: string | undefined;
}

export function logRequest(context: string, url: string, headers: RequestHeaders) {
  const sanitizedHeaders = {
    ...headers,
    Authorization: headers.Authorization ? '[REDACTED]' : undefined
  };

  console.log(`[${context}] Request:`, {
    url,
    headers: sanitizedHeaders
  });
}

export function logResponse(context: string, status: number, body: string) {
  console.log(`[${context}] Response:`, {
    status,
    body: body.substring(0, 1000) // Limit log size
  });
}

export function logError(context: string, error: unknown) {
  console.error(`[${context}] Error:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
}