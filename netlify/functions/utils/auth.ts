export function validateAuthHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new Error('Authorization header is required and must be Basic auth');
  }
  return authHeader;
}