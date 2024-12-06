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

export interface ClinikoAppointment {
  id: number;
  patient_id: number;
  practitioner_id: number;
  starts_at: string;
  ends_at: string;
  status: 'arrived' | 'did_not_arrive' | 'cancelled' | 'booked';
  created_at: string;
  updated_at: string;
}

export interface ClinikoResponse {
  patients?: ClinikoPatient[];
  appointments?: ClinikoAppointment[];
  total_entries: number;
  total_pages: number;
}

export interface ClinikoError extends Error {
  status: number;
}