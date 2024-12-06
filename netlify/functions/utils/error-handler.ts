import { getCorsHeaders } from './headers';

export async function handleError(response: Response) {
  const errorText = await response.text();
  console.error('Cliniko API Error:', errorText);
  
  return {
    statusCode: response.status,
    headers: {
      ...getCorsHeaders(),
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      error: 'Cliniko API error',
      details: errorText
    }),
  };
}