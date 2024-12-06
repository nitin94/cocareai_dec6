export const CLINIKO_ENDPOINTS = {
  practitioners: '/practitioners',
  patients: '/patients',
  appointments: '/appointments',
} as const;

export type ClinikoEndpoint = typeof CLINIKO_ENDPOINTS[keyof typeof CLINIKO_ENDPOINTS];