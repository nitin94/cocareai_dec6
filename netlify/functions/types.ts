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
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetentionMetrics {
  overallRetentionRate: number;
  preFirstVisitRate: number;
  afterFirstVisitRate: number;
  duringTreatmentRate: number;
  monthlyRevenueLoss: number;
  dropOffsByStage: {
    PRE_FIRST_VISIT: number;
    AFTER_FIRST_VISIT: number;
    DURING_TREATMENT: number;
    POST_TREATMENT: number;
  };
}

export interface ValidatedRequest {
  apiKey: string;
  path: string;
  queryParams: Record<string, string>;
}