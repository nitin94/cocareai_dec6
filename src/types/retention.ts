export interface PatientVisit {
  id: string;
  patientId: string;
  visitDate: Date;
  visitType: 'initial' | 'follow_up' | 'treatment' | 'review';
  status: 'completed' | 'cancelled' | 'no_show';
  provider: string;
}

export interface RetentionStatus {
  lastVisitDate: Date;
  nextAppointmentDate?: Date;
  visitCount: number;
  retentionStage: 'new' | 'engaged' | 'at_risk' | 'churned';
  daysFromLastVisit: number;
}

export interface RetentionMetrics {
  totalPatients: number;
  activePatients: number;
  atRiskPatients: number;
  churnedPatients: number;
  retentionRate: number;
  averageVisitsPerPatient: number;
  averageDaysBetweenVisits: number;
}