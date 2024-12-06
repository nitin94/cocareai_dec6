// API configuration
export const API_CONFIG = {
  // Use environment variable for API URL with fallback
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8888',
  ENDPOINTS: {
    VALIDATE: '/api/cliniko-proxy/validate',
    PATIENTS: '/api/cliniko-proxy/patients',
    PRACTITIONERS: '/api/cliniko-proxy/practitioners'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Helper to get full API URL
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};