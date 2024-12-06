export interface ClinikoPatient {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
  next_appointment?: {
    appointment_start: string;
  };
  last_visit?: {
    appointment_end: string;
  };
}

export interface ClinikoResponse {
  patients?: ClinikoPatient[];
  total_entries: number;
  total_pages: number;
}

export interface ClinikoError extends Error {
  status: number;
}