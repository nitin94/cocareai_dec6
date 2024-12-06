export enum RetentionStage {
  PRE_FIRST_VISIT = 'PRE_FIRST_VISIT',
  AFTER_FIRST_VISIT = 'AFTER_FIRST_VISIT',
  DURING_TREATMENT = 'DURING_TREATMENT',
  POST_TREATMENT = 'POST_TREATMENT',
}

export interface Patient {
  id: string;
  name: string;
  stage: RetentionStage;
  status: 'active' | 'dropped' | 'completed';
  appointmentDate?: Date;
  firstVisitDate?: Date;
  lastVisit?: Date;
  nextVisit?: Date;
  provider: string;
  revenue: number;
  visitCount?: number;
}

export interface RetentionMetrics {
  overallRetentionRate: number;
  preFirstVisitRate: number;
  afterFirstVisitRate: number;
  duringTreatmentRate: number;
  monthlyRevenueLoss: number;
  dropOffsByStage: {
    [key in RetentionStage]: number;
  };
}

export interface ActionableInsight {
  id: string;
  priority: 'high' | 'medium' | 'low';
  stage: RetentionStage;
  description: string;
  impact: number;
  action: string;
}

export interface TimeFrameOption {
  label: string;
  value: number; // days
}