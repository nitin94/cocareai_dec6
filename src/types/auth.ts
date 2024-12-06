export interface AuthError {
  code: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  clinicName?: string;
  isClinicVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}