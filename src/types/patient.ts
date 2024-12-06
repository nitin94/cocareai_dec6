export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  lastVisit?: Date;
  nextAppointment?: Date;
  status: 'active' | 'inactive' | 'archived';
  assignedStaffId?: string;  // Reference to ClinicStaff
  clinicId: string;         // Reference to Clinic
  createdAt: Date;
  updatedAt: Date;
}