export interface ClinicStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'receptionist' | 'therapist' | 'admin';
  email: string;
  phone?: string;
  specialization?: string;
  status: 'active' | 'inactive';
}

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  staff: ClinicStaff[];
  createdAt: Date;
  updatedAt: Date;
}